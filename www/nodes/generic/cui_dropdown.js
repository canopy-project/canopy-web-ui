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
 * CuiDropdown is a toggle button that opens a popup nearby.
 *
 * PARAMS:
 *      params.cssClass: defaults to ""
 *      params.buttonContent: cuiComposable content
 *      params.popupContent: cuiCompose content
 *      params.uniformWidth: if (true), the size of the popup will match
 *          the size of the button.  Default: false
 *
 * CSS:
 *      params.cssClass:
 *          ""                      - no style
 *          "cui_default"           - default canopy popup
 *          "MYCLASS"               - Your custom style
 *          "cui_default MYCLASS"   - Your custom style, based on the default
 *
 *      Customize by writing CSS for:
 *          .MYCLASS.cui_dropdown
 *          .MYCLASS.cui_dropdown .cui_dropdown.cui_popup
 *          .MYCLASS.cui_dropdown .cui_dropdown.cui_popup .cui_inner
 *          .MYCLASS.cui_dropdown .cui_dropdown..cui_toggle
 *          .MYCLASS.cui_dropdown .cui_dropdown..cui_toggle.cui_off
 *          .MYCLASS.cui_dropdown .cui_dropdown..cui_toggle.cui_on
 */
function CuiDropdown(params) {
    cuiInitNode(this);

    var toggle;
    var popup;
    var self = this;

    this.onConstruct = function() {
        toggle = new CuiToggle({
            cssClass: "cui_dropdown",
            onChange: function(value) {
                if (params.uniformWidth && self.isLive()) {
                    popup.get$().css('width', toggle.get$().width() + "px");
                }
                popup.toggle(value);
            },
            content: params.buttonContent,
        });
        popup = new CuiPopup({
            cssClass: "cui_dropdown",
            content: params.popupContent,
        });
        return [
            "<div class='cui_dropdown " + params.cssClass + "'>",
                toggle,
                popup,
            "</div>",
        ];
    }

    this.onRefresh = function($me, dirty, live) {
        cuiRefresh([toggle, popup], live);
    }
}

