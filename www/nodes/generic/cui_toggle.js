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
 * params:
 *      .baseClass
 *      .onClass
 *      .offClass
 *      .onChange
 *      .onClick -- return false to not toggle
 *      .content -- $div, node, or "html string".
 *      .default -- true/false.  The default defaults to false.
 */
function CuiToggle(origParams) {
    cuiInitNode(this);

    var params = $.extend({}, {
        baseClass: "",
        onClass: "",
        offClass: "",
        onClick: null,
        default: false,
        content: ""
    }, origParams);

    var self = this;
    var value = params.default;

    this.toggle = function(newValue) {
        if (newValue === undefined) {
            newValue = !value;
        }
        if (value != newValue) {
            value = newValue;
            if (params.onChange) {
                params.onChange(newValue);
            }
        }
        this.refresh();
        return this;
    }

    this.onLive = function($me) {
        $me.off('click').on('click', function() {
            if (!params.onClick || params.onClick()) {
                self.toggle();
            }
        });
    }

    this.onConstruct = function() {
        return cuiCompose([
            "<div class='" + params.baseClass + "'>",
                params.content,
            "</div>"
        ]);
    }

    this.onRefresh = function($me) {
        if (value) {
            $me.removeClass(params.offClass);
            $me.addClass(params.onClass);
        } else {
            $me.removeClass(params.onClass);
            $me.addClass(params.offClass);
        }
        return $me;
    }
}

