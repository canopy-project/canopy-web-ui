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
 * A cui_button is a clickable button.
 *
 * PARAMS:
 *      .cssClass -- defaults to ""
 *      .onClick
 *      .content -- $div, node, or "html string".
 *
 * METHODS:
 *      .setContent
 *
 *  CSS:
 *      params.cssClass:
 *          ""                    - no style
 *          "cui_default"         - default Canopy button
 *          "MYCLASS"             - Your custom style
 *          "cui_default MYCLASS" - Your custom style, based on the default
 *
 *      Customize by writing CSS for:
 *          .MYCLASS.cui_button
 *          .MYCLASS.cui_button:hover
 */
function CuiButton(params) {
    cuiInitNode(this);

    var self = this;
    var inner;
    var content = params.content;

    this.setContent = function(_content) {
        var content = _content;
        return this.markDirty();
    }

    this.onConstruct = function() {
        inner = cuiCompose([content]);
        return [
            "<div class='cui_button " + params.cssClass + "'>",
                inner,
            "<div>",
        ];
    }

    this.onRefresh = function($me, dirty, live) {
        if (dirty()) {
            inner.html(cuiCompose([content]));
        }
    }

    this.onSetupCallbacks = function($me) {
        $me.on('click', function() {
            if (params.onClick) {
                params.onClick();
            }
        });
    }

    this.onTeardownCallbacks = function($me) {
        $me.off('click');
    }
}
