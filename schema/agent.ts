import { Pipeline } from "./pipeline";

/**
 * ToolDeclaration defines a tool or connector available to the agent.
 * @x-go-file tool_declaration.go
 */
export interface ToolDeclaration {
    /**
     * Type defines the tool type.
     */
    type?: "connector" | "mcp" | "builtin";

    /**
     * Oneof defines the connector type options.
     */
    oneof?: string[];

    /**
     * Read enables read access for the tool.
     */
    read?: boolean;

    /**
     * Write enables write access for the tool.
     */
    write?: boolean;

    /**
     * Config provides additional tool configuration.
     */
    config?: Record<string, any>;
}

/**
 * RuleSet defines behavioral rules for the agent.
 * @x-go-file rule_set.go
 */
export interface RuleSet {
    /**
     * Type defines the rule type.
     */
    type?: string;

    /**
     * All defines rules that must all be satisfied.
     */
    all?: string[];

    /**
     * Any defines rules where at least one must be satisfied.
     */
    any?: string[];
}

/**
 * Agent extends Pipeline with AI-specific configuration.
 * Agents are pipelines that execute in response to Harness platform events.
 * @x-go-file agent.go
 */
export interface Agent extends Pipeline {
    /**
     * Tools defines the tools and connectors available to the agent.
     */
    tools?: Record<string, ToolDeclaration>;

    /**
     * Rules defines behavioral rules for the agent.
     */
    rules?: RuleSet;
}
