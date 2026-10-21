/**
 * Kind of a view inside the query telemetry visualiser.
 */
export enum TelemetryTabKind {
    Overview = 'overview',
    Steps = 'steps',
    Plan = 'plan'
}

/**
 * One open tab of the query telemetry visualiser. Its identity is `(kind, stepId)`: opening the same identity again
 * activates the existing tab instead of adding a duplicate.
 */
export class TelemetryTab {
    readonly kind: TelemetryTabKind
    /**
     * Step the tab is rooted at (Steps) or whose plan it shows (Plan); `undefined` for the Overview.
     */
    readonly stepId: string | undefined

    constructor(kind: TelemetryTabKind, stepId: string | undefined) {
        this.kind = kind
        this.stepId = stepId
    }

    static overview(): TelemetryTab {
        return new TelemetryTab(TelemetryTabKind.Overview, undefined)
    }

    /**
     * String form of the identity, used as the `VTab` value.
     */
    get key(): string {
        return `${this.kind}:${this.stepId ?? ''}`
    }

    get closable(): boolean {
        return this.kind !== TelemetryTabKind.Overview
    }
}
