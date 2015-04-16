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
 */
function CuiTopbar(params) {
    cuiInitNode(this);

    var optionNode;

    this.onLive = function() {
        cuiLive([optionNode]);
    }
    this.onConstruct = function() {
        var $appDropdown = $("<div class=cui_topbar_left>\
                <div class=cui_topbar_app_dropdown>Device Manager</div>\
            </div>");
        var $acctDropdown = $("<div class=cui_topbar_right>\
                <div class=cui_topbar_acct_dropdown>Leela</div>\
            </div>");
        optionNode = new CuiOption({
            outerClass: "cui_topbar_middle",
            itemSelectedClass: "cui_topbar_menu_item_selected",
            itemNotSelectedClass: "cui_topbar_menu_item",
            items: [{
                content: $("<div class='cui_topbar_menu_item_inner'>Devices</div>"),
                value: "Devices"
            },{
                content: $("<div class='cui_topbar_menu_item_inner'>Visualization</div>"),
                value: "Cow"
            },{
                content: $("<div class='cui_topbar_menu_item_inner'>Apps</div>"),
                value: "Apps"
            },{
                content: $("<div class='cui_topbar_menu_item_inner'>Account</div>"),
                value: "Account"
            }],
            selectedIdx: 0
        });

        return cuiCompose([
            "<div class='cui_topbar'>",
                $appDropdown, 
                optionNode,
                $acctDropdown, 
            "</div>"
        ]);
    }
}
