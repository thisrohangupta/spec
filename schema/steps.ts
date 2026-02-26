import {Container} from "./container";
import {CloneRef} from "./clone";
import {FailureStrategy} from "./failure";
import {ReportList} from "./report";
import {Status} from "./status";
import {Strategy} from "./strategy";

export type Step = string | StepLong;

export interface StepLong {
    /**
     * Id defines the step id.
     */
    id?: string;

    /**
     * Name defines the step name.
     */
    name?: string;

    /**
     * If defines conditional execution logic.
     */
    if?: string;

    /**
     * Disabled disables the step.
     */
    disabled?: boolean;
    
    //
    // Step Types
    //

    /**
     * Run defines a run step.
     */
    run?: string | StepRun;

    /**
     * Test defines a run test step
     */
    "run-test"?: StepTest;

    /**
     * Action defines an action step.
     */
    action?: StepAction;

    /**
     * Approval defines an approval step.
     */
    approval?: StepApproval;

    /**
     * Background defines a background step.
     */
    background?: StepRun;

    /**
     * Barrier defines a step barrier.
     */
    barrier?: StepBarrier;

    /**
     * Clone clones a git repository.
     */
    clone?: StepClone;

    /**
     * Group defines a step group.
     */
    group?: StepGroup;

    /**
     * Parallel defines a parallel step group.
     */
    parallel?: StepGroup;

    /**
     * Queue defines a queue step.
     */
    queue?: StepQueue;

    /**
     * Template defines a step template.
     */
    template?: StepTemplate;

    /**
     * Agent defines an agent step.
     */
    agent?: StepAgent;

    //
    // Step Types : End
    //

    /**
     * Timeout defines the step timeout duration.
     * @format duration
     */
    timeout?: string;

    /**
     * Needs defines steps that must be completed before this
     * step can run.
     */
    needs?: string | string[];

    /**
     * Strategy defines the matrix or looping strategy.
     */
    strategy?: Strategy;

    /**
     * Status overrides the default status settings.
     */
    status?: Status;

    /**
     * FailureStrategy defines error handling.
     */
    "on-failure"?: FailureStrategy;

    /**
     * This property is available solely for the purpose of
     * backward compatibility with Harness Currrent Gen.
     */
    delegate?: Delegate;

    //
    // GitHub-Specific : Start
    //

    /**
     * Env defines the environment of the step.
     * 
     * This property is available solely for the purpose of
     * backward compatibility with GitHub Actions.
     * 
     * @github
     */
    env?: Record<string, string>;

    /**
     * Uses defines the github action.
     * 
     * This property is available solely for the purpose of
     * backward compatibility with GitHub Actions.
     * 
     * @github
     */
    uses?: string;

    /**
     * With defines the github action configuration parameters.
     * 
     * This property is available solely for the purpose of
     * backward compatibility with GitHub Actions.
     * 
     * @github
     */
    with?: Record<string, any>;

    //
    // GitHub-Specific : End
    //
}

//
// Step Types
//

/**
 * @x-go-file step_action.go
 */
export interface StepAction {
    /**
     * Uses defines the action.
     */
    uses?: string;

    /**
     * With defines the action configuration parameters.
     */
    with?: Record<string, any>;

    /**
     * Env defines the environment of the step.
     */
    env?: Record<string, string>;

    /**
     * Report uploads reports at the the provided path(s)
     */
    report?: ReportList;

    // /**
    //  * Output defines the output variables.
    //  * @deprecated
    //  */
    // output?: Output | Output[];
}

/**
 * @x-go-file step_approval.go
 */
export interface StepApproval {
    uses?: string;
    with?: Record<string, any>;
    env?: Record<string, string>;
}

/**
 * @x-go-file step_barrier.go
 */
export interface StepBarrier {
    name: string;
}

export interface StepClone {
    /**
     * Repo provides the repository name.
     */
    repo?: string;

    /**
     * Connector provides the repository connector.
     */
    connector?: string;

    /**
     * Clean enables running git clean and git reset before fetching.
     */
    clean?: boolean;

    /**
     * Depth defines the clone depth.
     */
    depth?: number;

    /**
     * Disabled disables the default clone step.
     */
    disabled?: boolean;

    /**
     * Filter configures partial cloning against the given filter.
     * This overrides sparse checkout if set.
     */
    filter?: string;

    /**
     * Insecure enables cloning without ssl verification.
     */
    insecure?: boolean;

    /**
     * Lfs enables cloning lfs files.
     */
    lfs?: boolean;

    /**
     * Path provides the relative path in the workspace where the
     * repository is cloned.
     */
    path?: string;

    /**
     * SetSafeDirectory adds the repository path as safe.directory for
     * the global git configuration.
     */
    'set-safe-directory'?: boolean;

    /**
     * SparseCheckout enables sparse checkout on given patterns.
     * Each pattern should be separated with new lines.
     */
    'sparse-checkout'?: string;

    /**
     * SparseCheckoutCodeMode enables cone-mode when doing a sparse
     * checkout.
     */
    'sparse-checkout-cone-mode'?: string;

    /**
     * Strategy configures the clone strategy.
     */
    strategy?: "source-branch" | "merge";

    /**
     * Submodules enables cloning all submodules;
     */
    submodules?: boolean;

    /**
     * Tags enables cloning all tags;
     */
    tags?: boolean;

    /**
     * Trace enables trace logging.
     */
    trace?: boolean;

    /**
     * Reference defines the clone ref.
     */
    ref?: CloneRef;
}

/**
 * @x-go-file step_group.go
 */
export interface StepGroup {
    /**
     * Parallel defines the maximum number of steps that
     * can run in parallel. If unset or zero, the steps
     * run sequentially.
     * @deprecated
     */
    parallel?: number | boolean;

    /**
     * Steps defines a list of steps.
     */
    steps?: Step[];  
}

/**
 * @x-go-file step_run.go
 */
export interface StepRun {
    /**
     * Shell defines the shell of the step.
     */
    shell?: "sh" | "bash" | "powershell" | "pwsh" | "python";

    /**
     * Script runs command line scripts using the operating
     * system's shell. Each script represents a new process and
     * shell in the runner environment. Note that when you provide
     * multi-line commands, each line runs in the same shell.
     */
    script?: string | string[];

    /**
     * Container runs the step inside a container. If you do
     * not set a container, the step will run directly on the
     * host unless the target runtime in kubernetes, in which
     * case the container is required.
     */
    container?: Container;

    /**
     * Env defines the environment of the step.
     */
    env?: Record<string, string>;

    // /**
    //  * Output defines the step output variables.
    //  * @deprecated
    //  */
    // output?: Output | Output[];

    /**
     * Report uploads reports at the the provided path(s)
     */
    report?: ReportList;
}

/**
 * @x-go-file step_queue.go
 */
export interface StepQueue {
    key: string;
    scope?: "pipeline" | "stage";
}

/**
 * @x-go-file step_template.go
 */
export interface StepTemplate {
    /**
     * Uses defines the template.
     */
    uses?: string;

    /**
     * With defines the template configuration parameters.
     */
    with?: Record<string, any>;

    /**
     * Env defines the environment of the step.
     */
    env?: Record<string, string>;
}

/**
 * @x-go-file step_tester.go
 */
export interface StepTest {
    /**
     * Shell defines the shell of the step.
     */
    shell?: "sh" | "bash" | "powershell" | "pwsh" | "python";

    /**
     * Script runs command line scripts using the operating
     * system's shell. Each script represents a new process and
     * shell in the runner environment. Note that when you provide
     * multi-line commands, each line runs in the same shell.
     */
    script?: string | string[];

    /**
     * Match provides unit test matching logic in glob format.
     */
    match?: string | string[];

    /**
     * Container runs the step inside a container. If you do
     * not set a container, the step will run directly on the
     * host unless the target runtime in kubernetes, in which
     * case the container is required.
     */
    container?: Container;

    /**
     * Env defines the environment of the step.
     */
    env?: Record<string, string>;
    
    /**
     * Splitting configures the test splitting behavior.
     */
    splitting?: TestSplitting;

    /**
     * Intelligence configures the test intelligence
     * behavior.
     */
    intelligence?: TestIntelligence;

    /**
     * Report uploads reports at the the provided path(s)
     */
    report?: ReportList;

    // /**
    //  * Output defines the output variables.
    //  * @deprecated
    //  */
    // output?: Output | Output[];
}

//
// Testing
//

export interface TestSplitting {
    disabled?: boolean;
    concurrency?: number;
}

export interface TestIntelligence {
    disabled?: boolean;
} 

//
// Delegate
//

export type Delegate = "inherit-from-infrastrcuture" | string | string[];

/**
 * StepAgent defines an agent step.
 * @x-go-file step_agent.go
 */
export interface StepAgent {
    /**
     * Uses defines the agent image or marketplace reference.
     */
    uses: string;

    /**
     * With defines the agent configuration inputs.
     */
    with?: Record<string, any>;

    /**
     * Env defines environment variables passed to the agent container.
     */
    env?: Record<string, string>;

    /**
     * Tools defines the tools the agent can invoke at runtime.
     */
    tools?: string[];

    /**
     * McpAuth references a pipeline-level tools declaration for MCP auth.
     */
    mcp_auth?: string;

    /**
     * MaxTurns defines the maximum agentic turns before forced stop.
     */
    max_turns?: number;

    /**
     * Skills defines skill files to load into the agent.
     */
    skills?: string[];

    /**
     * Task defines the task prompt or path to task file.
     */
    task?: string;
}
