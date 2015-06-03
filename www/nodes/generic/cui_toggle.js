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
 * A cui_toggle is an element that can be in one of two states, with different
 * CSS depending on the state.
 *
 * PARAMS:
 *      .cssClass
 *      .onChange
 *      .onClick -- return false to not toggle
 *      .content -- $div, node, or "html string".
 *      .dflt -- true/false.  The default defaults to false.
 *
 *  CSS:
 *      params.cssClass:
 *          ""                      - no style
 *          "cui_default"           - default style
 *          "MYCLASS"               - Your custom style
 *          "cui_default MYCLASS"   - Your custom style, based on the default
 *
 *      Customize by writing CSS for:
 *          .MYCLASS.cui_toggle
 *          .MYCLASS.cui_toggle.cui_on
 *          .MYCLASS.cui_toggle.cui_off
 */
function CuiToggle(params) {
    cuiInitNode(this);

    var self = this;
    var value = params.dflt;

    // Marks dirty, does not refresh
    this.toggle = function(newValue) {
        if (newValue === undefined) {
            newValue = !value;
        }
        if (value != newValue) {
            value = newValue;
            if (params.onChange) {
                params.onChange(newValue);
            }
            self.markDirty();
        }
        return self;
    }

    this.onConstruct = function() {
        this.markDirty();
        return [
            "<div class='cui_toggle " + params.cssClass + "'>",
                params.content,
            "</div>"
        ]
    }

    this.onRefresh = function($me, dirty, live) {
        if (dirty()) {
            if (value) {
                $me.removeClass(params.offClass);
                $me.removeClass("cui_off");
                $me.addClass(params.onClass);
                $me.addClass("cui_on");
            } else {
                $me.removeClass(params.onClass);
                $me.removeClass("cui_on");
                $me.addClass(params.offClass);
                $me.addClass("cui_off");
            }
        }
    }

    this.onSetupCallbacks = function($me) {
        $me.on('click', function() {
            if (!params.onClick || params.onClick()) {
                self.toggle().refresh();
            }
        });
    }

    this.onTeardownCallbacks = function($me) {
        $me.off('click');
    }
}

