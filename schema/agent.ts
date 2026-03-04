import { Pipeline } from "./pipeline";
import { Container } from "./container";

// Built-in tools (read, write, grep, bash) are all available to the agent
// by default. Containerization provides the security boundary, so per-tool
// restrictions are not supported at this time.

//
// MCP Server Configuration
//

/**
 * McpServer defines a Model Context Protocol server configuration.
 * Supports multiple transport types: stdio (command), container (docker),
 * HTTP (url), and registry-based servers.
 * @x-go-file mcp_server.go
 */
export interface McpServer {
    /**
     * Command specifies the command to run for stdio-based MCP servers.
     * Used with args for process-based servers (e.g., "npx", "uvx").
     */
    command?: string;

    /**
     * Args specifies command arguments for stdio-based MCP servers.
     */
    args?: string[];

    /**
     * Container specifies a container for running MCP servers.
     * Supports string shorthand (image name) or full Container configuration
     * with connector for auth, volumes, environment, etc.
     */
    container?: Container;

    /**
     * Url specifies the HTTP endpoint for remote MCP servers.
     * Must implement the MCP specification over HTTP.
     */
    url?: string;

    /**
     * Headers specifies HTTP headers for authentication with remote MCP servers.
     * Commonly used for Bearer tokens or API keys.
     */
    headers?: Record<string, string>;

    /**
     * Registry specifies a reference to an MCP server in a registry.
     * Used for discovery and version management.
     */
    registry?: string;

    /**
     * Env specifies environment variables passed to the MCP server.
     */
    env?: Record<string, string>;

    /**
     * Allowed specifies which tools from this MCP server are available.
     * Use ["*"] to allow all tools, or list specific tool names.
     */
    allowed?: string[];
}

//
// Agent Interface (Pipeline-Level)
//

/**
 * Agent extends Pipeline with AI agent-specific configuration. Agents are pipelines that can leverage AI capabilities including MCP servers, rules, and skills. All built-in tools (read, write, grep, bash) are available by default. This is a top-level alias for Pipeline with agent-specific fields. Use this when the entire pipeline is an AI agent workflow.
 * @x-go-file agent.go
 */
export interface Agent extends Pipeline {
    /**
     * Mcp defines Model Context Protocol servers available to all agent steps.
     * Step-level mcp configuration will be merged with this.
     */
    mcp?: Record<string, McpServer>;

    /**
     * Rules defines behavioral constraints for the agent.
     * Values can be:
     * - File paths (e.g., "./agents.md")
     * - Inline rule text (e.g., "Never modify files outside the repository root")
     * - Entity references (e.g., "account.golang", "org.security", "project.*")
     *   which read rules stored at the account, org, or project level.
     * Validation engine determines the type of each value.
     */
    rules?: string[];

    /**
     * Skills defines skill files (markdown instructions) for the agent.
     * Can be file paths or inline content.
     */
    skills?: string[];

    // TODO: Engine selection - needs abstraction for harness-coding-agent and claude-code
    // to support multiple AI models with similar interfaces.
    // 
    // engine?: "harness-coding-agent" | "claude-code";
}
