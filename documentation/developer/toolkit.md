# Developer toolkit

As mentioned in the [architecture section](architecture.md), there are several generic modules that provide base UI
components, generic services and so on.

## UI components

You should primarily use components from the [Vuetify](https://vuetifyjs.com/) framework. On top of that, there are several
components in the `modules/base/component` module that extend the standard component set from the Vuetify framework.

The most important are: `VMarkdown` for rendering Markdown markup, `VPropertiesTable` for rendering table of properties
(usually for listing features of model or set data), `VTabToolbar` for building toolbar for tabs, preconfigured components
for CodeMirror editor, some paging helper components and so on.

## Workspace support

The workspace module is responsible for constructing the entire UI of evitaLab. All the side panels and tabs are provided
by this module.

Most of the support is provided using the `WorkspaceService` that can be injected using `useWorkspaceService()`.

### Tabs support

The most important API the workspace module provides is API for instantiating new tabs and managing history. 
To instanciate a new tab, you need implementation of `TabDefinition` interface and ideally some factory class
TODO LHO

## Storage support

TODO LHO

## Config support

TODO LHO

## Connection support

TODO LHO

## Keymap support

TODO LHO

