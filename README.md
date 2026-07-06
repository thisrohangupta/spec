Install dependencies:

```
npm install
```

Generate the schema at `dist/schema.json`

```
npm run schema
```

Generate the parser code at `dist/go`

```
npm run golang
```

## Workflow aliases

The `workflow`, `pipeline`, and `agent` root keys are interchangeable aliases
for the same underlying schema and execution concept. `workflow` is the
canonical name for new examples, while `pipeline` is preserved for backward
compatibility and `agent` is available for AI-driven workflows.

```yaml
workflow:
  steps:
    - run: echo hello world
```

```yaml
pipeline:
  steps:
    - run: echo hello world
```

```yaml
agent:
  steps:
    - run: echo hello world
```

A document should define only one of these root keys.

## Connector inputs

Connector inputs model runtime resource binding without making workflow scope
part of the workflow schema. `allowedScopes` limits the connector scopes the
caller may bind at runtime.

```yaml
workflow:
  inputs:
    connector:
      type: connector
      required: true
      allowedScopes:
        - account
        - org
  steps:
    - run: echo using ${{ inputs.connector }}
```

## Root steps

Stages are optional. If `steps` is defined directly under the workflow, those
steps run in an implicit default stage. If both root `steps` and explicit
`stages` are defined, the root steps run first.
