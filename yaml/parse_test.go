// Copyright 2022 Harness, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package yaml

import (
	"encoding/json"
	"os"
	"strings"
	"testing"

	"github.com/ghodss/yaml"
	"github.com/google/go-cmp/cmp"
)

func TestParse(t *testing.T) {
	out, err := diff("testdata/sample.yaml")
	if err != nil {
		t.Error(err)
		return
	}
	if out != "" {
		t.Log(out)
		t.Errorf("Parsed Yaml did not match expected Yaml")
	}
}

func TestParseWorkflowAliases(t *testing.T) {
	tests := []struct {
		name  string
		input string
		alias string
	}{
		{
			name: "workflow",
			input: `
workflow:
  steps:
    - run: echo hello
`,
			alias: AliasWorkflow,
		},
		{
			name: "pipeline",
			input: `
pipeline:
  steps:
    - run: echo hello
`,
			alias: AliasPipeline,
		},
		{
			name: "agent",
			input: `
agent:
  steps:
    - run: echo hello
`,
			alias: AliasAgent,
		},
	}

	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			out, err := ParseString(test.input)
			if err != nil {
				t.Fatal(err)
			}

			workflow, alias, err := out.CanonicalWorkflow()
			if err != nil {
				t.Fatal(err)
			}
			if alias != test.alias {
				t.Fatalf("got alias %q, want %q", alias, test.alias)
			}
			if workflow == nil {
				t.Fatal("expected canonical workflow")
			}
		})
	}
}

func TestParseWorkflowAliasConflict(t *testing.T) {
	_, err := ParseString(`
workflow:
  steps:
    - run: echo workflow
pipeline:
  steps:
    - run: echo pipeline
`)
	if err == nil {
		t.Fatal("expected alias conflict")
	}
	if !strings.Contains(err.Error(), "mutually exclusive") {
		t.Fatalf("unexpected error: %v", err)
	}
}

func TestParseConnectorInputAllowedScopes(t *testing.T) {
	out, err := ParseString(`
workflow:
  inputs:
    connector:
      type: connector
      required: true
      allowedScopes:
        - account
        - org
  steps:
    - run: echo hello
`)
	if err != nil {
		t.Fatal(err)
	}

	workflow, _, err := out.CanonicalWorkflow()
	if err != nil {
		t.Fatal(err)
	}
	if workflow == nil {
		t.Fatal("expected canonical workflow")
	}

	connector := workflow.Inputs["connector"]
	if connector == nil {
		t.Fatal("expected connector input")
	}
	if got, want := connector.Type, "connector"; got != want {
		t.Fatalf("got input type %q, want %q", got, want)
	}
	if got, want := connector.AllowedScopes, []string{"account", "org"}; !cmp.Equal(got, want) {
		t.Fatalf("got allowed scopes %v, want %v", got, want)
	}
}

func TestNormalizedWorkflowRootSteps(t *testing.T) {
	out, err := ParseString(`
workflow:
  steps:
    - run: echo preflight
  stages:
    - name: build
      steps:
        - run: echo build
`)
	if err != nil {
		t.Fatal(err)
	}

	workflow, alias, err := out.NormalizedWorkflow()
	if err != nil {
		t.Fatal(err)
	}
	if alias != AliasWorkflow {
		t.Fatalf("got alias %q, want %q", alias, AliasWorkflow)
	}
	if got, want := len(workflow.Stages), 2; got != want {
		t.Fatalf("got %d stages, want %d", got, want)
	}
	if got, want := workflow.Stages[0].Name, "default"; got != want {
		t.Fatalf("got stage name %q, want %q", got, want)
	}
	if got, want := len(workflow.Stages[0].Steps), 1; got != want {
		t.Fatalf("got %d default stage steps, want %d", got, want)
	}
	if got, want := workflow.Stages[1].Name, "build"; got != want {
		t.Fatalf("got second stage name %q, want %q", got, want)
	}
}

func diff(file string) (string, error) {
	// parse the yaml file and marshal to json
	parsed, err := ParseFile(file)
	if err != nil {
		return "", err
	}
	b1, err := json.Marshal(parsed)
	if err != nil {
		return "", err
	}
	// parse the golden yaml file and convert to json
	b2, err := os.ReadFile(
		strings.ReplaceAll(file, ".yaml", ".yaml.golden"),
	)
	if err != nil {
		return "", err
	}
	b2, err = yaml.YAMLToJSON(b2)
	if err != nil {
		return "", err
	}
	// unmarshal both json files into map structures
	m1 := map[string]interface{}{}
	m2 := map[string]interface{}{}
	if err := json.Unmarshal(b1, &m1); err != nil {
		return "", err
	}
	if err := json.Unmarshal(b2, &m2); err != nil {
		return "", err
	}
	// diff the map structures. if the diff is empty this
	// means they match.
	return cmp.Diff(m1, m2), nil
}
