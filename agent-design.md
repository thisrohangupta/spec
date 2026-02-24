# Agent Triggers: Event-Driven Execution for Harness Agents

## Overview

This document defines trigger support for Harness Agent Templates. Triggers allow agents (and pipelines) to automatically execute in response to platform events — a pipeline fails, a PR is opened, costs spike, a vulnerability is found, or a user mentions an agent in a comment.

The design extends the existing [pipeline spec schema](https://github.com/bradrydzewski/spec/blob/master/schema/schema.ts) — agents reuse the Pipeline type, and Harness system events are added to the existing `on:` stanza that pipelines already support.

---

## Key Design Decisions

1. **Agent = Pipeline.** The top-level schema adds `agent?: Pipeline` as an alias. Agents use the exact same YAML structure as pipelines, keeping Studio compatibility.
2. **`on:` lives inside `pipeline.yaml`.** No separate trigger file. The `pipeline.on` field (already in the spec) is where events are declared.
3. **Shared event types.** Harness system events (CI failures, cost spikes, vulnerabilities) are added to the same `EventType` union that already contains GitHub events (`push`, `pull_request`, etc.). Both pipelines and agents can use any event.
4. **Progressive complexity.** Following the existing `On` type pattern: `EventType | Event[] | Event` — simple string, list, or structured with filters.

---

## Schema Changes

### Top-level: add `agent` as Pipeline alias

From [schema.ts](https://github.com/bradrydzewski/spec/blob/master/schema/schema.ts#L22):

```typescript
export interface Schema {
    version?: string | number;
    pipeline?: Pipeline;
+   agent?: Pipeline;       // Agent is an alias for Pipeline
    // ... existing fields
}
```

In YAML, an agent template can use either top-level key:

```yaml
# As a pipeline (existing)
version: 1
pipeline:
  on: pull_request
  stages: [...]

# As an agent (new — identical structure)
version: 1
agent:
  on: pull_request
  stages: [...]
```

### Pipeline.on: already exists

From [pipeline.ts](https://github.com/bradrydzewski/spec/blob/master/schema/pipeline.ts):

```typescript
export interface Pipeline {
    on?: On;       // Already in the spec
    stages?: Stage[];
    inputs?: Record<string, Input>;
    clone?: Clone;
    // ...
}
```

### EventType: extend with Harness system events

From [on.ts](https://github.com/bradrydzewski/spec/blob/master/schema/on.ts), the existing type:

```typescript
export type On = EventType | Event[] | Event;
export type Event = EventType | EventLong;

export type EventType =
    // ── Existing GitHub events ──
    | "push"
    | "pull_request"
    | "pull_request_review"
    | "pull_request_review_comment"
    | "pull_request_target"
    | "issue_comment"
    | "schedule"
    | "workflow_dispatch"
    | "repository_dispatch"
    // ... other GitHub events

    // ── NEW: Harness CI events ──
    | "pipeline_failed"
    | "build_failed"
    | "test_failed"

    // ── NEW: Harness CD events ──
    | "deploy"
    | "deploy_failed"
    | "canary"
    | "rollback"
    | "slo_breach"
    | "post_deploy"

    // ── NEW: Harness CCM events ──
    | "cost_spike"
    | "budget_exceeded"
    | "cost_anomaly"

    // ── NEW: Harness STO events ──
    | "vulnerability_found"
    | "scan_complete"
    | "severity_threshold"

    // ── NEW: Harness Platform events ──
    | "comment_mention"
    | "repo_created"
    | "flag_stale";
```

> **Naming convention:** Harness events use `snake_case` to be consistent with the existing GitHub event names (`pull_request`, `issue_comment`, `check_run`, etc.). No module prefix needed — the event names are unique and self-descriptive.

### EventLong: extend with Harness event filters

```typescript
export interface EventLong {
    // ── Existing GitHub events ──
    push?: PushFilter;
    pull_request?: PullRequestFilter;
    schedule?: ScheduleFilter;
    // ... existing fields

    // ── NEW: Harness CI events ──
    pipeline_failed?: PipelineFailedFilter;
    build_failed?: PipelineFailedFilter;
    test_failed?: PipelineFailedFilter;

    // ── NEW: Harness CD events ──
    deploy?: DeployFilter;
    deploy_failed?: DeployFilter;
    canary?: DeployFilter;
    rollback?: DeployFilter;
    slo_breach?: SloFilter;
    post_deploy?: DeployFilter;

    // ── NEW: Harness CCM events ──
    cost_spike?: CostFilter;
    budget_exceeded?: BudgetFilter;
    cost_anomaly?: CostFilter;

    // ── NEW: Harness STO events ──
    vulnerability_found?: VulnerabilityFilter;
    scan_complete?: ScanFilter;
    severity_threshold?: ScanFilter;

    // ── NEW: Harness Platform events ──
    comment_mention?: CommentMentionFilter;
    repo_created?: EventFilter;
    flag_stale?: EventFilter;
}
```

### New filter interfaces

```typescript
// CI filters
export interface PipelineFailedFilter {
    repos?: string | string[];
    branches?: string | string[];
    pipelines?: string | string[];
}

// CD filters
export interface DeployFilter {
    services?: string | string[];
    environments?: string | string[];
}

export interface SloFilter {
    services?: string | string[];
    slos?: string | string[];
}

// CCM filters
export interface CostFilter {
    resources?: string | string[];
    "threshold-percent"?: number;
}

export interface BudgetFilter {
    budgets?: string | string[];
}

// STO filters
export interface VulnerabilityFilter {
    repos?: string | string[];
    severity?: string | string[];    // critical, high, medium, low
    "scan-types"?: string | string[];
}

export interface ScanFilter {
    repos?: string | string[];
    "scan-types"?: string | string[];
}

// Platform filters
export interface CommentMentionFilter {
    agents?: string | string[];       // filter by mentioned agent name
    repos?: string | string[];
}
```

---

## Event Reference

### CI events

| Event | Description | Filter fields | Event payload |
|-------|-------------|---------------|---------------|
| `pipeline_failed` | A CI pipeline execution has failed | `repos`, `branches`, `pipelines` | `repo`, `branch`, `executionId` |
| `build_failed` | A build step has failed | `repos`, `branches`, `pipelines` | `repo`, `branch`, `executionId` |
| `test_failed` | Test execution has failed | `repos`, `branches`, `pipelines` | `repo`, `branch`, `executionId` |

### CD events

| Event | Description | Filter fields | Event payload |
|-------|-------------|---------------|---------------|
| `deploy` | A deployment has been initiated | `services`, `environments` | `service`, `environment`, `executionId` |
| `deploy_failed` | A deployment has failed | `services`, `environments` | `service`, `environment`, `executionId` |
| `canary` | A canary deployment phase has started | `services`, `environments` | `service`, `environment`, `canaryPercent` |
| `rollback` | A deployment rollback has been triggered | `services`, `environments` | `service`, `environment`, `executionId` |
| `slo_breach` | A service level objective has been breached | `services`, `slos` | `service`, `sloName`, `currentValue` |
| `post_deploy` | A deployment has completed successfully | `services`, `environments` | `service`, `environment`, `executionId` |

### CCM events (Cloud Cost Management)

| Event | Description | Filter fields | Event payload |
|-------|-------------|---------------|---------------|
| `cost_spike` | An unexpected cost increase detected | `resources`, `threshold-percent` | `resource`, `increasePercent`, `currentCost` |
| `budget_exceeded` | A budget threshold has been exceeded | `budgets` | `budgetName`, `budgetLimit`, `actualSpend` |
| `cost_anomaly` | A cost anomaly has been detected | `resources` | `resource`, `anomalyType`, `actualCost` |

### STO events (Security Testing Orchestration)

| Event | Description | Filter fields | Event payload |
|-------|-------------|---------------|---------------|
| `vulnerability_found` | A vulnerability found during a scan | `repos`, `severity`, `scan-types` | `repo`, `severity`, `component` |
| `scan_complete` | A security scan has completed | `repos`, `scan-types` | `repo`, `scanType`, `totalFindings` |
| `severity_threshold` | A severity threshold exceeded in scan results | `repos`, `scan-types` | `repo`, `threshold`, `count` |

### Platform events

| Event | Description | Filter fields | Event payload |
|-------|-------------|---------------|---------------|
| `comment_mention` | An agent was mentioned in a comment | `agents`, `repos` | `repo`, `pullReq`, `commentBody`, `mentionedAgent` |
| `repo_created` | A new repository has been created or imported | *(basic EventFilter)* | `repoName`, `repoNamespace` |
| `flag_stale` | A feature flag has been identified as stale | *(basic EventFilter)* | `featureFlag`, `repo`, `treatment` |
| `schedule` | Triggered on a cron schedule | *(existing ScheduleFilter)* | `scheduleName` |
| `workflow_dispatch` | Triggered manually by a user | *(existing, no filter)* | *(none)* |

> **Note:** `schedule` and `workflow_dispatch` already exist in the spec. No new platform events needed for those — just reuse them.

---

## Accessing Event Data in Pipelines

Event payload data is available in pipeline expressions using `<+trigger.*>`:

```yaml
# In pipeline.yaml, reference trigger/event data in inputs or env
pipeline:
  on: pull_request
  inputs:
    repo:
      type: string
      default: <+trigger.repo>
    pullReq:
      type: string
      default: <+trigger.pullReq>
```

Or directly in step environment variables:

```yaml
stages:
  - name: handle-failure
    steps:
      - name: diagnose
        run:
          container:
            image: my-agent:1.0.0
          env:
            FAILED_PIPELINE: <+trigger.executionId>
            REPO: <+trigger.repo>
            BRANCH: <+trigger.branch>
```

---

## Template Examples

### autofix — triggered by CI failures

```yaml
version: 1
pipeline:
  on:
    - pipeline_failed
    - build_failed
    - test_failed
  clone:
    depth: 1
    ref:
      name: <+trigger.branch>
      type: branch
    repo: <+trigger.repo>
  stages:
    - name: autofix
      steps:
        - name: remediation_agent
          run:
            container:
              image: anewdocker25/mydockerhub:remediation-agent
            with:
              harness_execution_id: <+trigger.executionId>
              working_directory: /harness
            env:
              ANTHROPIC_API_KEY: <+inputs.anthropicKey>
        - name: coding_agent
          run:
            container:
              image: anewdocker25/mydockerhub:coding-agent
            with:
              task_file_path: /harness/task.txt
              working_directory: /harness
            env:
              ANTHROPIC_API_KEY: <+inputs.anthropicKey>
      platform:
        os: linux
        arch: arm64
  inputs:
    anthropicKey:
      type: secret
      default: autofix_anthropic_api_key
    harnessKey:
      type: secret
      default: harness_api_key
    gitConnector:
      type: connector
```

**What changed:** Added `on:` stanza. Clone `ref` and `repo` now use `<+trigger.branch>` and `<+trigger.repo>` instead of `<+inputs.branch>` and `<+inputs.repo>`, so the pipeline auto-populates from the event. The `branch` and `repo` string inputs can be removed (or kept as overrides for manual runs).

### codereview — triggered by PR events

```yaml
version: 1
agents:
  on:
    - pull_request:
        types:
          - opened
          - synchronize
    - comment_mention:
        agents:
          - codereview
## option 1: 
  inputs:
    attlasianMCP: 
      type: connector
      oneof: [attlasian]

## option 2:
## We would need to know local and remote tools
  tools:
    attlasian:
      type: connector
      oneof: [attlasian]
      read: true
      write: true 
      
  clone:
    depth: 1000
    ref:
      type: pull-request
      number: <+trigger.pullReq>
    repo: <+trigger.repo>
  stages:
    - name: codereview
        steps:
        - agent:
          uses:  abhinavharness/drone-ai-review-agent:1.0.0
            with:
              output_file: /harness/task.txt
              review_output_file: /harness/review.json
              working_directory: /harness
              tools: 
                - grep
                - read
                - write
                - mcp 
              mcp_auth: ${{ tools.attlasian }} 

        - name: coding_agent
          run:
            container:
              image: anewdocker25/mydockerhub:coding-agent
            with:
              task_file_path: /harness/task.txt
              working_directory: /harness
            env:
              ANTHROPIC_API_KEY: <+inputs.anthropicKey>
        - name: post_comments
          run:
            container:
              image: abhinavharness/comment-plugin:1.0.0
            with:
              comments_file: /harness/review.json
              repo: <+trigger.repo>
              pr_number: <+trigger.pullReq>
            env:
              TOKEN: <+inputs.harnessKey>
      platform:
        os: linux
        arch: arm64
  inputs:
    anthropicKey:
      type: secret
      default: account.autofix_anthropic_api_key
    harnessKey:
      type: secret
      default: account.harness_api_key
```

**What changed:** Added `on:` with `pull_request` (reusing existing GitHub-style event with `types` filter) and `comment_mention` (new Harness event with `agents` filter). Clone ref uses `<+trigger.pullReq>` and `<+trigger.repo>`. The `repo` and `pullReq` string inputs can be removed.

### ffcleanup — triggered by stale flags or schedule

```yaml
version: 1
pipeline:
  on:
    - flag_stale
    - schedule:
        cron: "0 9 * * MON"
    - workflow_dispatch
  clone:
    depth: 1
    ref:
      name: <+inputs.branch>
      type: branch
    repo: <+trigger.repo>
  stages:
    - name: ffcleanup
      steps:
        - name: generate_task
          run:
            container:
              image: anewdocker25/mydockerhub:coding-agent
            env:
              FEATURE_FLAG: <+trigger.featureFlag>
              TREATMENT: <+trigger.treatment>
              ANTHROPIC_API_KEY: <+inputs.anthropicKey>
      platform:
        os: linux
        arch: arm64
  inputs:
    anthropicKey:
      type: secret
      default: ffcleanup_anthropic_apikey
    harnessApiKey:
      type: secret
      default: ffcleanup_harness_apikey
    branch:
      type: string
      default: main
```

**What changed:** Added `on:` with `flag_stale` (new Harness event), `schedule` (existing event with cron), and `workflow_dispatch` (existing event for manual triggers). Flag data accessed via `<+trigger.featureFlag>` and `<+trigger.treatment>`.

### onboarding — triggered when repos are created

```yaml
version: 1
pipeline:
  on:
    - repo_created
    - workflow_dispatch
  stages:
    - name: onboarding
      steps:
        - name: onboarding_agent
          run:
            container:
              image: colinharness/onboarding-agent:1.0.0
            env:
              ANTHROPIC_API_KEY: <+inputs.anthropicKey>
              HARNESS_API_KEY: <+inputs.harnessKey>
              HARNESS_BASE_URL: <+inputs.harnessBaseURL>
              REPO_NAME: <+trigger.repoName>
              REPO_NAMESPACE: <+trigger.repoNamespace>
              CONNECTOR_REF: <+inputs.connectorRef>
      platform:
        os: linux
        arch: amd64
  inputs:
    anthropicKey:
      type: secret
      required: true
    harnessKey:
      type: secret
      required: true
    harnessBaseURL:
      type: secret
      required: true
    connectorRef:
      type: string
```

**What changed:** Added `on:` with `repo_created` (new Harness event) and `workflow_dispatch` (manual). Repo data accessed via `<+trigger.repoName>` and `<+trigger.repoNamespace>`.

---

## Progressive Complexity

The `on:` stanza supports three levels, matching the existing spec's `On` type:

```yaml
# 1. Simple: single event string
pipeline:
  on: pull_request

# 2. List: multiple events
pipeline:
  on:
    - pull_request
    - pipeline_failed
    - cost_spike

# 3. Structured: events with filters
pipeline:
  on:
    - pull_request:
        branches:
          - main
          - "release/**"
        types:
          - opened
          - synchronize
    - pipeline_failed:
        repos:
          - my-service
        branches:
          - main
    - cost_spike:
        resources:
          - production-cluster
        threshold-percent: 20
    - comment_mention:
        agents:
          - codereview
    - schedule:
        cron: "0 9 * * MON"
    - vulnerability_found:
        severity:
          - critical
          - high
```

---

## Compatibility

### Existing GitHub events still work

All current events from the spec (`push`, `pull_request`, `schedule`, `workflow_dispatch`, etc.) continue to work exactly as before. Harness events are purely additive.

### Pipelines and agents share events

Since `agent` is just an alias for `pipeline`, the same events work for both:

```yaml
# A regular pipeline triggered by cost spikes
version: 1
pipeline:
  on: cost_spike
  stages:
    - name: alert
      steps:
        - name: notify
          run:
            shell: bash
            script: echo "Cost spike detected on $RESOURCE"
          env:
            RESOURCE: <+trigger.resource>

# An agent triggered by cost spikes — identical structure
version: 1
agent:
  on: cost_spike
  stages:
    - name: analyze
      steps:
        - name: cost_agent
          run:
            container:
              image: harness/cost-analyzer:1.0.0
            env:
              RESOURCE: <+trigger.resource>
```

### Studio compatibility

The YAML structure is unchanged — `on` is already a valid field on `Pipeline`. Studio can render and edit agent YAMLs with triggers without any changes to the editor.

### Manual override

When an agent is triggered manually (via `workflow_dispatch` or API), `<+trigger.*>` fields may be empty. Templates should either:
- Keep pipeline `inputs` as fallbacks: `<+trigger.repo>` falls back to `<+inputs.repo>` if unset
- Use the `if` conditional to skip trigger-dependent logic on manual runs

---

## Trigger Expression Reference

| Expression | Description | Example value |
|------------|-------------|---------------|
| `<+trigger.event>` | The event type that fired | `pipeline_failed` |
| `<+trigger.repo>` | Repository identifier | `my-service` |
| `<+trigger.branch>` | Branch name | `main` |
| `<+trigger.pullReq>` | Pull request number | `42` |
| `<+trigger.executionId>` | Pipeline execution ID | `abc123` |
| `<+trigger.service>` | Service identifier (CD) | `payment-service` |
| `<+trigger.environment>` | Deployment environment (CD) | `production` |
| `<+trigger.resource>` | Resource identifier (CCM) | `prod-cluster` |
| `<+trigger.severity>` | Vulnerability severity (STO) | `critical` |
| `<+trigger.featureFlag>` | Feature flag identifier | `new-checkout-flow` |
| `<+trigger.repoName>` | New repo name (platform) | `my-new-repo` |
| `<+trigger.repoNamespace>` | New repo namespace (platform) | `my-org` |
| `<+trigger.mentionedAgent>` | Agent mentioned in comment | `codereview` |
| `<+trigger.commentBody>` | Comment content | `@codereview please review` |

---

## Summary of All New Event Types

| Event | Module | Use case |
|-------|--------|----------|
| `pipeline_failed` | CI | Auto-remediate broken pipelines |
| `build_failed` | CI | Fix build failures |
| `test_failed` | CI | Diagnose test failures |
| `deploy` | CD | Pre/post deployment automation |
| `deploy_failed` | CD | Rollback or remediation on deploy failure |
| `canary` | CD | Verify canary deployments |
| `rollback` | CD | Post-rollback analysis |
| `slo_breach` | CD | Respond to SLO violations |
| `post_deploy` | CD | Post-deployment verification |
| `cost_spike` | CCM | Alert and analyze cost increases |
| `budget_exceeded` | CCM | Budget overage response |
| `cost_anomaly` | CCM | Investigate cost anomalies |
| `vulnerability_found` | STO | Triage security findings |
| `scan_complete` | STO | Process scan results |
| `severity_threshold` | STO | Escalate high-severity findings |
| `comment_mention` | Platform | Respond to @agent mentions |
| `repo_created` | Platform | Auto-onboard new repositories |
| `flag_stale` | Platform | Clean up stale feature flags |

> `schedule`, `workflow_dispatch`, `push`, `pull_request` already exist in the spec and are reused as-is.

---

## Future Considerations

- **Chained agents**: An agent completing could emit an event that triggers another (e.g., autofix completes → codereview runs on the fix PR)
- **Approval gates**: Add `approval: true` to gate trigger execution on human approval before the pipeline runs
- **Conditional execution**: Use `if: ${{ expr }}` alongside `on:` for expression-based gating
- **MCP tool setup**: Agents could declare tool/MCP dependencies as syntactic sugar in the `agent` stanza
- **Event payload expansion**: Start minimal, add fields to event payloads as real use cases demand them
