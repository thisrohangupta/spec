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

// Matrix defines a matrix execution strategy.
type Matrix struct {
	Axis    map[string][]string
	Exclude []map[string]string `json:"exclude,omitempty"`
	Include []map[string]string `json:"include,omitempty"`
}

// UnmarshalJSON implements the unmarshal interface.
func (s *Matrix) UnmarshalJSON(data []byte) error {
	tmp := map[string]interface{}{}

	// unmarshal into a temporary map
	if err := json.Unmarshal(data, &tmp); err != nil {
		return err
	}

	// extract and coerce exclude
	if m, ok := tmp["exclude"]; ok {
		delete(tmp, "exclude")
		// temporarily marshal and then unmarshal
		// into the exclude struct
		raw, _ := json.Marshal(m)
		if err := json.Unmarshal(raw, &s.Exclude); err != nil {
			return err
		}
	}

	// extract and coerce include
	if m, ok := tmp["include"]; ok {
		delete(tmp, "include")
		// temporarily marshal and then unmarshal
		// into the include struct
		raw, _ := json.Marshal(m)
		if err := json.Unmarshal(raw, &s.Include); err != nil {
			return err
		}
	}

	// marshal and unmarshal remaining
	// key values intot he matrix
	raw, _ := json.Marshal(tmp)
	return json.Unmarshal(raw, &s.Axis)
}

// MarshalJSON implement the json.Marshaler interface.
func (v *Matrix) MarshalJSON() ([]byte, error) {
	tmp := map[string]interface{}{}
	// add all axis to the map
	for k, v := range v.Axis {
		tmp[k] = v
	}
	// add include to the temporary map
	if len(v.Include) > 0 {
		tmp["include"] = v.Include
	}
	// add exclude to the temporary map
	if len(v.Exclude) > 0 {
		tmp["exclude"] = v.Exclude
	}
	return json.Marshal(tmp)
}