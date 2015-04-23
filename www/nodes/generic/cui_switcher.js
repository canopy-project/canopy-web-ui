/*
 * Copyright 2015 Canopy Services, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*
 * CuiSwitcher is a generic element that displays one of several children.  The
 * child to display is selected by calling .select(name) followed by a
 * .refresh() to obtain the selected child's jqDOM object.
 *
 * params:
 *  .children : {
 *      name : node
 *  }
 *  .default : name (defaults to null)
 *  .onSelect 
 *  .navState : CuiNavState object (optional)
 *  .navStateName : If provided, this name will be added to the query string
 *      for saving/loading the navigation state.
 */
function CuiSwitcher(params) {
    cuiInitNode(this);
    var selected = null;
    var selectedName = null;
    var self=this;

    this.hasChild = function(name) {
        return params.children[name] !== undefined;
    }

    this.select = function(name) {
        if (selectedName == name) {
            // noop
            return this;
        }
        selected = params.children[name];
        selectedName = name;
        if (!selected) {
            console.log("Switcher Error: Child not found with name " + name);
        }
        if (params.onSelect) {
            params.onSelect(selectedName);
        }
        return this.markDirty();
    }

    this.onRefresh = function($me, dirty, live) {
        if (dirty()) {

            if (!selected) {
                console.log("Switcher Error: You must select a child first!");
                $me.html($("<div>SWITCHER ERROR</div>"));
                return;
            }
            if (params.navState) {
                var state = params.navState.get(params.navStateName);
                if (state === undefined) {
                    params.navState.replace(params.navStateName, selectedName);
                } else {
                    params.navState.set(params.navStateName, selectedName);
                }
            }
            $me.html(selected.get$());
            // Mark all children as "dead", including the selected one (since
            // its DOM objects got replaced).
            for (childName in params.children) {
                if (params.children.hasOwnProperty(childName)) {
                    if (params.children[childName].isConstructed()) {
                        params.children[childName].dead();
                    }
                }
            }
        }

        selected.refresh(live);
    }

    // initialize
    if (params.navState) {
        var state = params.navState.get(params.navStateName);
        if (state !== undefined) {
            self.select(state);
            return;
        }
    }
    if (params.default) {
        self.select(params.default);
    }
}

