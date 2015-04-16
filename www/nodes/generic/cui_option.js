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
 * params:
 *      .outerClass
 *      .itemSelectedClass
 *      .itemNotSelectedClass
 *      .onSelect
 *      .onClick -- return false to not select
 *      .items
 *          .content
 *          .value
 *      .selectedIdx
 */
function CuiOption(origParams) {
    cuiInitNode(this);

    var params = $.extend({}, {
        outerClass: "",
        itemSelectedClass: "",
        itemNotSelectedClass: "",
        onSelect: null,
        onClick: null,
        selectedIdx: -1,
        pendingSelectIdx: -1
    }, origParams);

    var self=this;
    var $items;
    var toggles;
    var selectedIdx = params.selectedIdx;
    var valueToIdx = {};
    for (var i = 0; i < params.items.length; i++) {
        valueToIdx[params.items[i].value] = i;
    }

    this.onLive = function($me) {
        cuiLive(toggles);
    }

    // Select by name or value.
    // Triggers callback.
    // Does not .refresh().
    this.select = function(_idx) {
        var idx = _idx;
        if (!params.items[idx]) {
            idx = valueToIdx[idx];
        }
        if (idx === undefined) {
            console.log("cui_option: bad idx: " + _idx);
            return this;
        }
        selectedIdx = idx;
        var value = params.items[idx].value;
        if (params.onSelect) {
            params.onSelect(idx, value);
        }
        return this;
    }

    this.onConstruct = function() {
        $items = [];
        toggles = [];
        for (var i = 0; i < params.items.length; i++) {
            $items.push(params.items[i]);
            foo = function(idx) {
                toggles.push(new CuiToggle({
                    onClass: params.itemSelectedClass,
                    offClass: params.itemNotSelectedClass,
                    content: params.items[idx].content,
                    onClick: function() {
                        var value = params.items[idx].value;
                        if (!params.onClick || params.onClick(idx, value)) {
                            self.select(idx).refresh();
                        }
                        return false; 
                    }
                }));
            }(i);
        }
        var $inner = cuiCompose(toggles);
        return $("<div class='" + params.outerClass + "'></div>").html($inner);
    }

    this.onRefresh = function($me) {
        for (var i = 0; i < toggles.length; i++) {
            toggles[i].toggle((selectedIdx === i));
        }
    }
}

