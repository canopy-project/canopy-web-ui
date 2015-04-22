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
 * Popup is a generic popup dialog that can be shown/hidden and floats over the
 * main content.
 *
 * PARAMS:
 *      params.cssClass -- defaults to ""
 *      params.content -- cuiComposable content
 *
 * METHODS:
 *
 *      .show() -- Display the popup.
 *      .hide() -- Hide the popup.
 *
 * CSS:
 *
 *      params.cssClass:
 *
 *          ""                      - no style
 *          "cui_default"           - default canopy popup
 *          "MYCLASS"               - Your custom style
 *          "cui_default MYCLASS"   - Your custom style, based on the default
 *
 *      Customize by writing CSS for:
 *          .MYCLASS.cui_popup .cui_inner
 */
function CuiPopup(params) {
    cuiInitNode(this);

    var $popup;
    var revealed = false;

    this.show = function() {
        $popup.show();
        revealed = true;
    }

    this.hide = function() {
        $popup.hide();
        revealed = false;
    }

    this.toggle = function(value) {
        if (value === undefined) {
            value = !revealed;
        }

        if (value) {
            this.show();
        } else {
            this.hide();
        }
    }
    
    this.onConstruct = function() {
        $popup = cuiCompose([
            "<div class='cui_popup " + params.cssClass + "'>",
                "<div class=cui_inner>",
                    params.content,
                "</div>",
            "</div>",
        ]);
        $popup.hide();
        return $popup;
    }

    this.onRefresh = function($me, dirty, live) {
        if (revealed) {
            cuiRefresh([params.content], live);
        }
    }
}

