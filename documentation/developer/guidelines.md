# Guidelines

Each module should respect the vertical slice architecture in conjunction with the Model-View-ViewModel for UI components.
We are also big fans of immutability (where it makes sense) in Domain-Driver-Design, so we try to build the codebase using
these practices.

## Code architecture

### Dependency injection

Each service that should be injectable should export an injection key:

```ts
export const serviceInjectionKey: InjectionKey<Service> = Symbol('service')
```

and helper method for injecting the service into a component:

```ts
export function useService(): Service {
    return mandatoryInject(serviceInjectionKey)
}
```

For component tree dependency injection a `dependecies.ts` file should be created where the components for a feature are 
places with proper injection keys and `provideX` and `injectX` methods so that the keys are not spread across components.

### UI components

Complex components that access data should be backed by custom services that abstract access to other generic services.
A complex component representing some bigger domain should only access its own service, not the generic ones. This
is to minimize imports to the generic services as well to abstract mapping and transforming generic results.

![Component-service hierarchy](assets/component-service-hierarchy.svg)

This should reflect the [Model-View-ViewModel](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93viewmodel) architectural pattern.

## Git

### Branches

We use 3 types of branches:

- `master`
- `dev`
- feature branches

The `master` branch is for the released versions of the evitaLab only. The `dev` branch is where the current unreleased
code is at, and to where the feature branches are merged into. Finally, feature branches are created for each issues
to fix a bug or create new feature. These are then merged into the `dev` branch for eventual release.

When fixing a bug or creating new feature, **always** create new feature branch from the `dev` branch. Or for hotfixes, 
create new bug fixing branch from the `master`, but such branch cannot do more than fix a bug in non-breaking way.

### Commits

We use [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/) for Git commit messages and pull requests 
for 2 reasons: 

- the commits are more transparent
- we have GitHub CI/CD hooked onto it, to automatically build and version the evitaLab