// Code generated by scripts/generate.js; DO NOT EDIT.

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

import "encoding/json"

type Step struct {
	Action     *StepAction            `json:"action,omitempty"`
	Approval   *StepApproval          `json:"approval,omitempty"`
	Background *StepRun               `json:"background,omitempty"`
	Barrier    *StepBarrier           `json:"barrier,omitempty"`
	Delegate   *Delegate              `json:"delegate,omitempty"`
	Env        map[string]string      `json:"env,omitempty"`
	Group      *StepGroup             `json:"group,omitempty"`
	Id         string                 `json:"id,omitempty"`
	If         string                 `json:"if,omitempty"`
	Name       string                 `json:"name,omitempty"`
	Needs      Stringorslice          `json:"needs,omitempty"`
	OnFailure  *FailureStrategy       `json:"on-failure,omitempty"`
	Parallel   *StepGroup             `json:"parallel,omitempty"`
	Queue      *StepQueue             `json:"queue,omitempty"`
	Run        *StepRun               `json:"run,omitempty"`
	RunTest    *StepTest              `json:"run-test,omitempty"`
	Status     *Status                `json:"status,omitempty"`
	Strategy   *Strategy              `json:"strategy,omitempty"`
	Template   *StepTemplate          `json:"template,omitempty"`
	Timeout    StringorInt            `json:"timeout,omitempty"`
	Uses       string                 `json:"uses,omitempty"`
	With       map[string]interface{} `json:"with,omitempty"`

	// Context temporarily stores information from the
	// matrix and template expansion. Context is not part of
	// the yaml schema.
	Context *Context `json:"context,omitempty"`
}

type Context struct {
	Matrix map[string]string `json:"matrix,omitempty"`
	Inputs map[string]any    `json:"inputs,omitempty"`
}

// UnmarshalJSON implement the json.Unmarshaler interface.
func (v *Step) UnmarshalJSON(data []byte) error {
	var out1 Stringorslice
	var out2 = struct {
		Action     *StepAction            `json:"action,omitempty"`
		Approval   *StepApproval          `json:"approval,omitempty"`
		Background *StepRun               `json:"background,omitempty"`
		Barrier    *StepBarrier           `json:"barrier,omitempty"`
		Delegate   *Delegate              `json:"delegate,omitempty"`
		Env        map[string]string      `json:"env,omitempty"`
		Group      *StepGroup             `json:"group,omitempty"`
		Id         string                 `json:"id,omitempty"`
		If         string                 `json:"if,omitempty"`
		Name       string                 `json:"name,omitempty"`
		Needs      Stringorslice          `json:"needs,omitempty"`
		OnFailure  *FailureStrategy       `json:"on-failure,omitempty"`
		Parallel   *StepGroup             `json:"parallel,omitempty"`
		Queue      *StepQueue             `json:"queue,omitempty"`
		Run        *StepRun               `json:"run,omitempty"`
		RunTest    *StepTest              `json:"run-test,omitempty"`
		Status     *Status                `json:"status,omitempty"`
		Strategy   *Strategy              `json:"strategy,omitempty"`
		Template   *StepTemplate          `json:"template,omitempty"`
		Timeout    StringorInt            `json:"timeout,omitempty"`
		Uses       string                 `json:"uses,omitempty"`
		With       map[string]interface{} `json:"with,omitempty"`
		Context    *Context               `json:"context,omitempty"`
	}{}

	if err := json.Unmarshal(data, &out1); err == nil {
		v.Run = new(StepRun)
		v.Run.Script = out1
		return nil
	}

	if err := json.Unmarshal(data, &out2); err == nil {
		*v = out2
		return nil
	} else {
		return err
	}
}
