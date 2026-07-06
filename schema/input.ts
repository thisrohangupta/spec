/**
 * @x-go-file input.go
 */
export interface Input {

    /**
     * Type defines the input type.
     */
    type: 
        "string" 
      | "number" 
      | "boolean" 
      | "array" 
      | "duration"
      | "choice"      // GitHub compatibility
      | "environment" // GitHub compatibility
      | "connector"
      | "secret"
      | "step"
      | "object"

    /**
     * AllowedScopes constrains the scopes from which a runtime
     * resource binding can select a connector.
     */
    allowedScopes?: ("system" | "account" | "org" | "project")[];

    /**
     * Description defines the input description.
     */
    description?: string

    /**
     * @go-type: interface{}
     */
    default?: any

    /**
     * Required indicates the input is required.
     */
    required?: boolean;

    /**
     * Items defines an array type.
     */
    items?: any[]

    /**
     * Enum defines a list of accepted input values.
     */
    enum?: any[]

    /**
     * Pattern defines a regular expression input constraint.
     */
    pattern?: string;

    /**
     * Component defines the form element that should be used to
     * render the input.
     */
    component?: "dropdown" | "text" | "number" | "date" | "datetime" | string;

    /**
     * Autofocus configures the form element autofocus attribute.
     */
    autofocus?: boolean;

    /**
     * Placeholder configures the form element placeholder attribute.
     */
    placeholder?: string;

    /**
     * Tooltip configures the form element alt attribute.
     */
    tooltip?: string;

    /**
     * Options defines a list of accepted input values.
     * This is an alias for enum.
     * @github
     */
    options?: any[]

    /**
     * Mask indicates the input should be masked.
     * @deprecated
     */
    mask?: boolean
}
