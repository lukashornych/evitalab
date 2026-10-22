import { List } from 'immutable'
import type { FormulaPlan } from '@/modules/database-driver/request-response/data/FormulaPlan'
import { VisualisedFormulaPlan } from '@/modules/console/result-visualiser/model/query-telemetry/VisualisedFormulaPlan'
import {
    VisualisedFormulaPlanNode
} from '@/modules/console/result-visualiser/model/query-telemetry/VisualisedFormulaPlanNode'

/**
 * Minimal number of consecutive identical childless siblings collapsed into one group node.
 */
export const minCollapsedRunLength: number = 3

/**
 * Prepares a formula plan for the Plan tab. Runs of at least {@link minCollapsedRunLength} consecutive childless
 * siblings with an equal description and no `refTo` (typically hundreds of `1 primary keys` leaves under one `OR`)
 * are collapsed into one group node carrying the member count and the summed numbers; back-references keep pointing
 * at the right node, the group included.
 */
export function visualiseFormulaPlan(stepId: string, executed: boolean, plan: FormulaPlan): VisualisedFormulaPlan {
    const runs: FormulaPlan[][] = []
    collectRuns(plan, runs)
    const groupKeyOfMember: Map<number, string> = new Map()
    runs.forEach(run => {
        const key: string = groupKey(run)
        run.forEach(member => groupKeyOfMember.set(member.id, key))
    })

    let formulaCount: number = 0
    let sharedCount: number = 0
    const count = (node: FormulaPlan): void => {
        formulaCount++
        if (node.refTo != undefined) {
            sharedCount++
        }
        node.children.forEach(count)
    }
    count(plan)

    return new VisualisedFormulaPlan(
        stepId,
        executed,
        visualiseNode(plan, groupKeyOfMember),
        formulaCount,
        sharedCount
    )
}

function isCollapsible(node: FormulaPlan): boolean {
    return node.children.isEmpty() && node.refTo == undefined
}

function groupKey(run: FormulaPlan[]): string {
    return `#${run[0]?.id}×${run.length}`
}

/**
 * Splits the children of every node into runs of collapsible siblings with equal descriptions.
 */
function forEachRun(node: FormulaPlan, onRun: (run: FormulaPlan[]) => void, onSingle: (child: FormulaPlan) => void): void {
    let run: FormulaPlan[] = []
    const flush = (): void => {
        if (run.length >= minCollapsedRunLength) {
            onRun(run)
        } else {
            run.forEach(onSingle)
        }
        run = []
    }
    node.children.forEach(child => {
        if (isCollapsible(child) && run.length > 0 && run[0]?.description === child.description) {
            run.push(child)
            return
        }
        flush()
        if (isCollapsible(child)) {
            run.push(child)
        } else {
            onSingle(child)
        }
    })
    flush()
}

function collectRuns(node: FormulaPlan, runs: FormulaPlan[][]): void {
    forEachRun(node, run => runs.push(run), child => collectRuns(child, runs))
}

function visualiseNode(node: FormulaPlan, groupKeyOfMember: ReadonlyMap<number, string>): VisualisedFormulaPlanNode {
    const children: VisualisedFormulaPlanNode[] = []
    forEachRun(
        node,
        run => children.push(visualiseGroup(run)),
        child => children.push(visualiseNode(child, groupKeyOfMember))
    )
    return new VisualisedFormulaPlanNode(
        `#${node.id}`,
        node.id,
        node.refTo,
        node.refTo == undefined ? undefined : (groupKeyOfMember.get(node.refTo) ?? `#${node.refTo}`),
        node.hash,
        node.description,
        toNumber(node.estimatedCost),
        toNumber(node.actualCost),
        node.resultCount,
        List(),
        List(children)
    )
}

function visualiseGroup(run: FormulaPlan[]): VisualisedFormulaPlanNode {
    const first: FormulaPlan | undefined = run[0]
    return new VisualisedFormulaPlanNode(
        groupKey(run),
        first?.id ?? 0,
        undefined,
        undefined,
        undefined,
        first?.description,
        sumOf(run.map(it => toNumber(it.estimatedCost))),
        sumOf(run.map(it => toNumber(it.actualCost))),
        sumOf(run.map(it => it.resultCount)),
        List(run),
        List()
    )
}

function toNumber(value: bigint | undefined): number | undefined {
    return value == undefined ? undefined : Number(value)
}

/**
 * Sum of the values, or `undefined` unless every one of them is known.
 */
function sumOf(values: (number | undefined)[]): number | undefined {
    let sum: number = 0
    for (const value of values) {
        if (value == undefined) {
            return undefined
        }
        sum += value
    }
    return sum
}
