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
 *  PARAMS:
 *      none
 *
 *  METHODS:
 *
 *      .setUser
 */
function CuiUserDropdown(params) {
    cuiInitNode(this);

    var self=this;
    var button;
    var $dialog;
    var $username;
    var expanded = false;
    var opening = false;

    var user;

    this.setUser = function(_user) {
        user = _user;
        this.markDirty("user");
        return this;
    }

    function expand() {
        opening = true;
        setTimeout(function() {opening = false}, 500);
        $dialog.show();
    }

    function collapse() {
        $dialog.hide();
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

        $username = $("<span>Not signed in</span>");
        button = new CuiToggle({
            onClass: "cui_menu_item_selected",
            offClass: "cui_menu_item",
            content: cuiCompose([
                "<div class=cui_menu_item_inner>",
                    $username,
                "</div>"
            ]),
            onChange: function(value) {
                if (value) {
                    expand();
                } else {
                    collapse();
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

    this.onRefresh = function($me, dirty, live) {
        if (dirty("user")) {
            $username.html(user.username());
        }
        cuiRefresh([button], live);
    }

    this.onSetupCallbacks = function($me) {
        $dialog.on('click', function(event) {
            user.remote().logout().onDone(function(result, responseData) {
                if (result != CANOPY_SUCCESS) {
                    alert("Problem logging out");
                    return;
                }
                window.location.replace("../../login.html");
            });
        });

        // determine when to close the window, a bit hacky
        $("html").click(function(e) {
            if (!opening) {
                button.toggle(false);
            }
        });
    }

    this.onTeardownCallbacks = function($me) {
        $dialog.off('click');
    }
}

