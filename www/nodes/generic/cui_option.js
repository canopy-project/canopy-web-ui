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
 * Option is a sequence of DIVs, only one of which can be selected at a time.
 *
 *  PARAMS:
 *      .cssClass -- defaults to ""
 *      .onSelect
 *      .onClick -- return false to not select
 *      .items
 *          .content
 *          .value
 *      .selectedIdx
 *
 *  CSS:
 *      params.cssClass:
 *          ""                    - no style
 *          "cui_default"         - default Canopy option style
 *          "MYCLASS"             - Your custom style
 *          "cui_default MYCLASS" - Your custom style, based on the default
 *
 *      Customize by writing CSS for:
 *          .MYCLASS.cui_option
 *          .MYCLASS.cui_option .cui_option.cui_toggle
 *          .MYCLASS.cui_option .cui_option.cui_toggle.cui_on
 *          .MYCLASS.cui_option .cui_option.cui_toggle.cui_off
 *
 *  METHODS:
 *
 *      .hasChild
 *      .setItems
 *      .select
 */


function CuiOption(params) {
    cuiInitNode(this);
    var cachedItems;
    var items = params.items;
    var self=this;

    var cachedIdx;
    var idx = params.selectedIdx;

    var $content;
    var toggles = []

    function valueToIdx(value) {
        for (i = 0; i < items.length; i++) {
            if (items[i].value == value) {
                return i;
            }
        }

        return undefined;
    }

    this.hasChild = function(name) {
        return (valueToIdx(name) !== undefined);
    }

    // Select by name or value.
    // Triggers callback.
    // Requires refresh for display to update.
    this.select = function(_idx) {
        idx = _idx;
        if (typeof _idx != 'number') {
            idx = valueToIdx(_idx);
        }
        if (idx === undefined) {
            return this;
        }
        if (items[idx] !== undefined) {
            var value = items[idx].value;
            if (params.onSelect) {
                params.onSelect(idx, value);
            }
        }
        return this;
    }

    // Requires refresh
    this.setItems = function(_items) {
        items = _items;
        return this;
    }

    this.onConstruct = function() {
        $content = $("<div class='cui_option " + params.cssClass + "'></div>");
        return [
            $content
        ];
    }

    this.onRefresh = function($me, dirty, live) {
        // Did list of items change?
        if (!cachedItems || cuiListModified(cachedItems, items)) {
            // Cleanup old toggle buttons
            if (cachedItems !== undefined) {
                for (var i = 0; i < cachedItems.length; i++) {
                    toggles[i].dead();
                }
            }

            // Re-generate all toggle buttons
            toggles = [];
            var fn = function(idx) {
                toggles.push(new CuiToggle({
                    cssClass: "cui_option",
                    content: items[idx].content,
                    onClick: function() {
                        var value = items[idx].value;
                        if (!params.onClick || params.onClick(idx, value)) {
                            self.select(idx).refresh();
                        }
                        return false; 
                    }
                }));
            }
            for (var i = 0; i < items.length; i++) {
                fn(i);
            }
            $content.html("");
            for (var i = 0; i < toggles.length; i++) {
                $content.append(toggles[i].get$());
            }
            cachedItems = items;
        }

        // Update and refresh toggles
        for (var i = 0; i < toggles.length; i++) {
            toggles[i].toggle((idx === i)).refresh(live);
        }
        cachedIdx = idx;
    }
}
