import { Agent } from "./agent";
import { Concurrency } from "./concurrency";
import { Environment } from "./environment";
import { Permissions } from "./permissions";
import { On } from "./on";
import { Pipeline } from "./pipeline";
import { Stage } from "./stages";
import { Service } from "./service";
import { Template } from "./template";

/**
 * @x-go-file schema.go
 */
export interface Schema {
    /**
     * Version defines the schema version.
     */
    version?: string | number;

    /**
     * Pipeline defines the pipeline configuration.
     */
    pipeline?: Pipeline;

    /**
     * Agent defines the agent configuration.
     * Agents are pipelines that execute in response
     * to Harness platform events.
     */
    agent?: Agent;

    /**
     * Environment defines a deployment environment.
     */
    environment?: Environment

    /**
     * Service defines a service.
     * @todo
     */
    service?: Service

    /**
     * Infrastructure defines the service infrastructure.
     * 
     * @todo
     */
    infrastructure?: InfraSchema;

    /**
     * Template defines re-usable pipeline steps and
     * stages.
     */
    template?: Template;

    /**
     * Action defines re-usable pipeline steps and stages.
     * @deprecated use "template" instead
     */
    action?: Template;

    /**
     * Inputset defines re-usable inputs.
     * @todo
     */
    inputset?: Record<string, any>;

    /**
     * Name defines the pipeline name.
     * 
     * This property is available solely for the purpose of
     * backward compatibility with GitHub Actions.
     * 
     * @github
     */
    name?: string;

    /**
     * On defines the workflow triggers.
     * 
     * This property is available solely for the purpose of
     * backward compatibility with GitHub Actions.
     * 
     * @github
     */
    on?: On;

    /**
     * Jobs defines the parallel workflow jobs.
     * 
     * This property is available solely for the purpose of
     * backward compatibility with GitHub Actions.
     * 
     * @github
     */
    jobs?: Record<string, Stage>

    /**
     * Defaults provides default settings that apply
     * to all jobs in the workflow.
     * 
     * This property is available solely for the purpose of
     * backward compatibility with GitHub Actions.
     * 
     * @github
     */
    defaults?: Record<string, any>

    /**
     * Envs defines environment variables that are available
     * to all steps in the workflow.
     * 
     * This property is available solely for the purpose of
     * backward compatibility with GitHub Actions.
     * 
     * @github
     */
    env?: Record<string, string>

    /**
     * Concurrency groups provide a way to limit concurrency
     * execution of pipelines that share the same concurrency key.
     * 
     * @github
     */
    concurrency?: Concurrency;

    /**
     * Permissions defines the permission granted to the token
     * injected into the pipeline environment.
     * 
     * @github
     */
    permissions?: Permissions;
}







/**
 * @x-go-file schema_infra.go
 */
export interface InfraSchema {
    id?: string;
    name?: string;
    tags?: Record<string, string>;

    /**
     * @deprecated
     */
    org?: string;

    /**
     * @deprecated
     */
    project?: string;
}