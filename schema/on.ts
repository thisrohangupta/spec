export type On = EventType | Event[] | Event;

export type Event = EventType | EventLong;

export type EventType = "branch_protection_rule"
    | "check_run"
    | "check_suite"
    | "create"
    | "delete"
    | "deployment"
    | "deployment_status"
    | "discussion"
    | "discussion_comment"
    | "fork"
    | "issue_comment"
    | "issues"
    | "label"
    | "member"
    | "merge_group"
    | "milestone"
    | "page_build"
    | "project"
    | "project_card"
    | "project_column"
    | "public"
    | "pull_request"
    | "pull_request_review"
    | "pull_request_review_comment"
    | "pull_request_target"
    | "push"
    | "registry_package"
    | "repository_dispatch"
    | "release"
    | "schedule"
    | "status"
    | "watch"
    | "workflow_call"
    | "workflow_dispatch"
    | "workflow_run"

    // Harness CI Events
    | "pipeline_failed"
    | "build_failed"
    | "test_failed"

    // Harness CD Events
    | "deploy"
    | "deploy_failed"
    | "canary"
    | "rollback"
    | "slo_breach"
    | "post_deploy"

    // Harness CCM Events
    | "cost_spike"
    | "budget_exceeded"
    | "cost_anomaly"

    // Harness STO Events
    | "vulnerability_found"
    | "scan_complete"
    | "severity_threshold"

    // Harness Platform Events
    | "comment_mention"
    | "repo_created"
    | "flag_stale"
;

export interface EventLong {
    branch_protection_rule?: EventFilter;
    check_run?: EventFilter;
    check_suite?: EventFilter;
    create?: any;
    delete?: any;
    deployment?: any;
    deployment_status?: any;
    discussion?: EventFilter;
    discussion_comment?: EventFilter;
    fork?: any;
    issue_comment?: EventFilter;
    issues?: EventFilter;
    label?: EventFilter;
    member?: EventFilter;
    merge_group?: EventFilter;
    milestone?: EventFilter;
    page_build?: any;
    project?: EventFilter;
    project_card?: EventFilter;
    project_column?: EventFilter;
    public?: any;
    pull_request?: PullRequestFilter;
    pull_request_review?: Event;
    pull_request_review_comment?: Event;
    pull_request_target?: PullRequestFilter;
    push?: PushFilter;
    registry_package?: EventFilter;
    repository_dispatch?: EventFilter;
    release?: EventFilter;
    schedule?:any;
    status?: any;
    watch?: EventFilter;
    workflow_call?:any;
    workflow_dispatch?:any;
    workflow_run?:any;

    // Harness CI Events
    pipeline_failed?: PipelineFailedFilter;
    build_failed?: PipelineFailedFilter;
    test_failed?: PipelineFailedFilter;

    // Harness CD Events
    deploy?: DeployFilter;
    deploy_failed?: DeployFilter;
    canary?: DeployFilter;
    rollback?: DeployFilter;
    slo_breach?: SloFilter;
    post_deploy?: DeployFilter;

    // Harness CCM Events
    cost_spike?: CostFilter;
    budget_exceeded?: BudgetFilter;
    cost_anomaly?: CostFilter;

    // Harness STO Events
    vulnerability_found?: VulnerabilityFilter;
    scan_complete?: ScanFilter;
    severity_threshold?: ScanFilter;

    // Harness Platform Events
    comment_mention?: CommentMentionFilter;
    repo_created?: EventFilter;
    flag_stale?: EventFilter;
}

export interface EventFilter {
    types?: string | string[];
}

export interface PushFilter {
    "branches"?: string | string[];
    "branches-ignore"?: string | string[];
    "paths"?: string | string[];
    "paths-ignore"?: string | string[];
    "tags"?: string | string[];
    "tags-ignore"?: string | string[];
}

export interface PullRequestFilter {
    "branches"?: string | string[];
    "branches-ignore"?: string | string[];
    "paths"?: string | string[];
    "paths-ignore"?: string | string[];
    "tags"?: string | string[];
    "tags-ignore"?: string | string[];
    "types"?: string | string[];
    "review-approved"?: boolean;
    "review-dismissed"?: boolean;
}

//
// Harness CI Event Filters
//

export interface PipelineFailedFilter {
    repos?: string | string[];
    branches?: string | string[];
    pipelines?: string | string[];
}

//
// Harness CD Event Filters
//

export interface DeployFilter {
    services?: string | string[];
    environments?: string | string[];
}

export interface SloFilter {
    services?: string | string[];
    slos?: string | string[];
}

//
// Harness CCM Event Filters
//

export interface CostFilter {
    resources?: string | string[];
    "threshold-percent"?: number;
}

export interface BudgetFilter {
    budgets?: string | string[];
}

//
// Harness STO Event Filters
//

export interface VulnerabilityFilter {
    repos?: string | string[];
    severity?: string | string[];
    "scan-types"?: string | string[];
}

export interface ScanFilter {
    repos?: string | string[];
    "scan-types"?: string | string[];
}

//
// Harness Platform Event Filters
//

export interface CommentMentionFilter {
    agents?: string | string[];
    repos?: string | string[];
}
