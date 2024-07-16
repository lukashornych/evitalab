# Guidelines

Basic rules
Each module should respect the vertical slice architecture.
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

Complex components that access data should adhere to the [Model-View-ViewModel architecture](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93viewmodel),
preferably in conjunction with the [mediator pattern](https://en.wikipedia.org/wiki/Mediator_pattern) in form of 
custom service for the component to abstract access to generic services.

![Component-service hierarchy](assets/component-service-hierarchy.svg)

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