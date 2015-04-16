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
 * User dropdown part of top bar.
 *
 * params:
 *  {
 *      user : CanopyUser object, or null
 *  }
 *
 */
function CuiUserDropdown(params) {
    cuiInitNode(this);

    var self=this;
    var button;
    var $dialog;
    var expanded = false;
    var opening = false;

    this.expand = function() {
        opening = true;
        setTimeout(function() {opening = false}, 500);
        $dialog.show();
        expand = true;
    }

    this.collapse = function() {
        $dialog.hide();
        expand = false;
        opening = false;
    }

    this.onConstruct = function() {
        $dialog = cuiCompose([
            "<div class=cui_popup>",
                "<div class=cui_inner>",
                    "Logout",
                "</div>",
            "</div>"
        ]).hide();

        button = new CuiToggle({
            onClass: "cui_menu_item_selected",
            offClass: "cui_menu_item",
            content: "<div class=cui_menu_item_inner>Leela</div>",
            onChange: function(value) {
                if (value) {
                    self.expand();
                } else {
                    self.collapse();
                }
            }
        });
        return cuiCompose([
            "<div class=cui_user_dropdown>",
                button,
                $dialog,
            "</div>"
        ]);
    }

    function nthParent(e, n) {
        if (n == 0)
            return e;
        if (e.parentElement)
            return nthParent(e.parentElement, n - 1);
        return null;
    }

    this.onLive = function($me) {
        cuiLive([button]);
        $dialog.off('click').on('click', function(event) {
            window.location.replace("../../login.html");
            event.preventDefault();
            return false;
        });

        // determine when to close the window, a bit hacky
        $("html").click(function(e) {
            if (!opening) {
                button.toggle(false);
            }
        });
    }

    this.onRefresh = function($me) {
    }
}

