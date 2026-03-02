import { Pipeline } from "./pipeline";

//
// Built-in Tools Configuration
//

/**
 * Tools configures built-in tools available to the agent.
 * @x-go-file tools.go
 */
export interface Tools {
    /**
     * Read enables file read capability.
     */
    read?: boolean;

    /**
     * Write enables file write capability.
     */
    write?: boolean;

    /**
     * Grep enables grep/search capability.
     */
    grep?: boolean;

    /**
     * Bash configures shell command execution.
     * - true: enables default safe commands
     * - false: disables bash
     * - string[]: list of allowed commands (e.g., ["echo", "ls", "git:*"])
     */
    bash?: boolean | string[];
}

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
     * Container specifies a Docker image for container-based MCP servers.
     * The container is run with stdin/stdout communication.
     */
    container?: string;

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
 * Agent extends Pipeline with AI agent-specific configuration. Agents are pipelines that can leverage AI capabilities including built-in tools, MCP servers, rules, and skills. This is a top-level alias for Pipeline with agent-specific fields. Use this when the entire pipeline is an AI agent workflow.
 * @x-go-file agent.go
 */
export interface Agent extends Pipeline {
    /**
     * Tools configures built-in tools available to all agent steps.
     * Step-level tools configuration will be merged with this.
     */
    tools?: Tools;

    /**
     * McpServers defines Model Context Protocol servers available to all agent steps.
     * Step-level mcp_servers configuration will be merged with this.
     */
    mcp_servers?: Record<string, McpServer>;

    /**
     * Rules defines behavioral constraints for the agent.
     * Can be file paths (e.g., "./agents.md") or inline rule text.
     * Validation engine determines if value is a path or inline content.
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
