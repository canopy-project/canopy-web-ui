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
 * Responsive top menu bar for Canopy web applications.
 *
 * PARAMS:
 *  {
 *      appName : string (shows up on left side)
 *      cssClass : css class
 *      items : [{
 *          content:
 *          value:
 *      }, ...],
 *      navState: used for query-string navigation
 *      navStateName: used for query-string navigation
 *
 *      user : CanopyUser object, or null
 *  }
 *
 *  CSS:
 *
 *     cssClass .cui_outer
 *     cssClass .cui_left_section
 *     cssClass .cui_middle_section
 *     cssClass .cui_right_section
 *     cssClass .cui_right_section
 *
 *  METHODS:
 *
 *      .setUser
 */
function CuiTopbar(params) {
    cuiInitNode(this);

    var optionNode;
    var userDropdown;

    var user;
    var userDirty = false;

    this.setUser = function(_user) {
        user = _user;
        userDirty = true;
        return this;
    }

    this.onConstruct = function() {
        var $appDropdown = $("<div class=cui_left_section>\
                <div class=cui_app_dropdown>" + params.appName + "</div>\
            </div>");

        userDropdown = new CuiUserDropdown({
            user: params.user
        });
        var $rightSection = cuiCompose([
            "<div class=cui_right_section>",
                userDropdown,
            "</div>"
        ]);


        var items = [];
        for (var i = 0; i < params.items.length; i++) {
            items.push({
                content: cuiCompose([
                    "<div class='cui_menu_item_inner'>",
                        params.items[i].content,
                    "</div>"]),
                value: params.items[i].value
            });
        }
        optionNode = new CuiOption({
            outerClass: "cui_middle_section",
            itemSelectedClass: "cui_menu_item_selected",
            itemNotSelectedClass: "cui_menu_item",
            items: items,
            onSelect: function(idx, value) {
                if (params.navState) {
                    var state = params.navState.get(params.navStateName);
                    if (state === undefined) {
                        params.navState.replace(params.navStateName, value);
                    } else {
                        params.navState.set(params.navStateName, value);
                    }
                }
                if (params.onSelect) {
                    params.onSelect(value);
                }
            },
            selectedIdx: 0
        });
        if (params.navState) {
            var state = params.navState.get(params.navStateName);
            if (state !== undefined) {
                optionNode.select(params.navState.get(params.navStateName));
            }
        }

        return cuiCompose([
            "<div class='cui_topbar'>",
                "<div class='" + params.cssClass + "'>",
                    $appDropdown, 
                    optionNode,
                    $rightSection, 
                "</div>",
            "</div>"
        ]);
    }

    this.onLive = function() {
        cuiLive([optionNode, userDropdown]);
    }

    this.onRefresh = function($me, force) {
        if (force || userDirty) {
            userDropdown.setUser(user).refresh();
            userDirty = false;
        }
        if (force) {
            optionNode.refresh();
        }
    }
}
