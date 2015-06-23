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
 * Organization dropdown part of submenu.
 *
 *  PARAMS:
 *      params.title
 *      params.user
 *      params.cssClass - defaults to ""
 *      params.onSelect(viewerName)
 *
 */
function CuiOrgDropdown(params) {
    cuiInitNode(this);
    
    var dropdown;
    var option;

    this.onConstruct = function() {
        option = new CuiOption({
            cssClass: "cui_org_dropdown",
            onSelect: function(idx, value) {
                if (params.onSelect) {
                    params.onSelect(value);
                }
            },
            items: [{
                content: "Loading...",
                value: "loading",
            }]
        });

        dropdown = new CuiDropdown({
            cssClass: "cui_org_dropdown",
            buttonContent: params.title,
            popupContent: option,
        });

        return [
            "<div class='cui_org_dropdown " + params.cssClass + "'>",
                dropdown,
            "</div>"
        ];
    }

    this.onRefresh = function($me, dirty, live) {
        console.log(params.user.username());
        if (params.user) {
            params.user.organizations().onDone(function(result, data) {
                if (result != CANOPY_SUCCESS) {
                    option.setItems(
                        [{
                            content: "Error",
                            value: "error",
                        }]
                    );
                }

                var items = [{
                    content: params.user.username(),
                    value: params.user.username(),
                }];
                for (var i = 0; i < data.orgs.length; i++) {
                    var org = data.orgs[i];
                    items.push({
                        content: org.name(),
                        value: org.name()
                    });
                }
                option.setItems(items).refresh();
            });
        }
        cuiRefresh([dropdown, option], live);
    }
}


