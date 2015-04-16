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
 * params:
 *  {
 *      appName : string (shows up on left side)
 *      cssClass : css class
 *      items : [{
 *          content:
 *          value:
 *      }, ...]
 *      user : CanopyUser object, or null
 *  }
 *
 *  css:
 *
 *     cssClass .cui_outer
 *     cssClass .cui_left_section
 *     cssClass .cui_middle_section
 *     cssClass .cui_right_section
 *     cssClass .cui_right_section
 */
function CuiTopbar(params) {
    cuiInitNode(this);

    var optionNode;

    this.onLive = function() {
        cuiLive([optionNode]);
    }
    this.onConstruct = function() {
        var $appDropdown = $("<div class=cui_left_section>\
                <div class=cui_app_dropdown>" + params.appName + "</div>\
            </div>");
        var $acctDropdown = $("<div class=cui_right_section>\
                <div class=cui_acct_dropdown>Leela</div>\
            </div>");
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
                if (params.onSelect) {
                    params.onSelect(value);
                }
            },
            selectedIdx: 0
        });

        return cuiCompose([
            "<div class='cui_topbar'>",
                "<div class='" + params.cssClass + "'>",
                    $appDropdown, 
                    optionNode,
                    $acctDropdown, 
                "</div>",
            "</div>"
        ]);
    }
}
