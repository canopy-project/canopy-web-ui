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
 *      cssClass : defaults to ""
 *      items : [{
 *          content:
 *          value:
 *      }, ...],
 *      navState: used for query-string navigation
 *      navStateName: used for query-string navigation
 *      onSelect: function(value)
 *      showDropdown: null, "app", or "org"
 *      showUserDropdown: true/false
 *      user : CanopyUser object, or null
 *      viewerName : string (only used if showing ORG dropdown)
 *  }
 *
 *  CSS:
 *      params.cssClass:
 *          ""                               - no style
 *          "cui_default"                    - default Canopy topbar style
 *          "cui_default cui_topbar_submenu" - default Canopy submenu style
 *          "MYCLASS"                        - Your custom style
 *          "cui_default MYCLASS"            - Your custom style, based on dflt
 *
 *      Customize by writing CSS for:
 *          .MYCLASS.cui_topbar
 *          .MYCLASS.cui_topbar .cui_topbar.cui_app_name
 *          .MYCLASS.cui_topbar .cui_topbar.cui_app_dropdown
 *          .MYCLASS.cui_topbar .cui_topbar.cui_option
 *          .MYCLASS.cui_topbar .cui_topbar.cui_option .cui_option.cui_toggle
 *          .MYCLASS.cui_topbar .cui_topbar.cui_option .cui_option.cui_toggle.cui_on
 *          .MYCLASS.cui_topbar .cui_topbar.cui_option .cui_option.cui_toggle.cui_off
 *          .MYCLASS.cui_topbar .cui_topbar.cui_right_section
 *
 *  METHODS:
 *
 *      .setBreadcrumb
 *      .setUser
 *      .select(idxOrValue)
 */
function CuiTopbar(params) {
    cuiInitNode(this);
    this.markDirty("breadcrumb", "user");

    var appDropdown;
    var optionNode;
    var userDropdown;
    var dropdown;
    var orgDropdown;

    var user = params.user;
    var breadcrumb;
    var $breadcrumb;

    this.setBreadcrumb = function(_breadcrumb) {
        breadcrumb = _breadcrumb;
        this.markDirty("breadcrumb");
        return this;
    }

    this.setUser = function(_user) {
        user = _user;
        this.markDirty("user");
        return this;
    }

    this.select = function(idx) {
        optionNode.select(idx);
        return this;
    }

    this.onConstruct = function() {
        $breadcrumb = $("<div class='cui_topbar cui_breadcrumb'>Breadcrumb</div>").hide();
        appDropdown = new CuiAppDropdown({
            cssClass: "cui_default cui_topbar",
            items: [],
            title: params.appName
        });

        orgDropdown = new CuiOrgDropdown({
            cssClass: "cui_default cui_topbar",
            items: [],
            onSelect: function(viewerName) {
                cuiNavState.newTab("v", viewerName);
            },
            title: params.viewerName,
            user: user
        });

        userDropdown = new CuiUserDropdown({
            cssClass: "cui_default cui_topbar",
            user: user
        });
        var $rightSection = cuiCompose([
            "<div class='cui_topbar cui_right_section'>",
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
            cssClass: "cui_topbar cui_menu",
            items: items,
            onSelect: function(idx, value) {
                console.log("Told to select" + idx + " - " + value);
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
            if (state !== undefined && optionNode.hasChild(state)) {
                optionNode.select(state);
            }
        }

        dropdown = $("<div class='cui_topbar cui_app_name'>" + params.appName + "</div>");
        if (params.showDropdown == "app") {
            dropdown = appDropdown;
        } else if (params.showDropdown == "org") {
            dropdown = orgDropdown;
        }

        var out = cuiCompose([
            "<div class='cui_topbar " + params.cssClass + "'>",
                "<div class='cui_resp_left_side'>",
                    dropdown,
                "</div>",
                "<div class='cui_resp_middle'>",
                    $breadcrumb,
                    optionNode,
                "</div>",
                $rightSection, 
            "</div>"
        ]);
        if (!(params.showUserDropdown && user)) {
            userDropdown.get$().hide();
        }
        return out;
    }

    this.onRefresh = function($me, dirty, live) {
        if (dirty("user")) {
            if (params.showUserDropdown && user) {
                userDropdown.get$().show();
                userDropdown.setUser(user);
            } else {
                userDropdown.get$().hide();
                userDropdown.setUser(null);
            }
            this.clearDirty("user");
        }

        if (live && dirty("breadcrumb")) {
            if (breadcrumb) {
                $breadcrumb.html(breadcrumb.join(" &rarr; "));
                $breadcrumb.show();
                optionNode.get$().hide();
            } else {
                $breadcrumb.hide();
                optionNode.get$().show();
            }
            this.clearDirty("breadcrumb");
        }

        cuiRefresh([optionNode, dropdown, userDropdown], live);
        return false;
    }
}
