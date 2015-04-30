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
 * CuiEditableText is text that can be clicked on to edit.
 *
 *  PARAMS:
 *      .cssClass - defaults to "cui_default"
 *      .onChange(value, userEdited)
 *      .value
 *
 *  METHODS:
 *      setValue(value)
 *      value()
 *
 *  CSS:
 *      params.cssClass:
 *          ""                      - no style
 *          "cui_default"           - default style
 *          "MYCLASS"               - Your custom style
 *          "cui_default MYCLASS"   - Your custom style, based on the default
 *
 *      Customize by writing CSS for:
 *          .MYCLASS.cui_editable_text
 *          .MYCLASS.cui_editable_text input
 *          .MYCLASS.cui_editable_text .cui_value
 */
function CuiEditableText(params) {
    cuiInitNode(this);

    var self = this;
    var $text;
    var $input;
    var value = (params.value !== undefined) ? params.value : "";

    this.onConstruct = function() {
        $text = $("<div class='cui_editable_text cui_value'>" + value + "</div>");

        $input = $("<input class='cui_editable_text cui_input' value=></input>");
        $input.hide();

        return [
            "<div class='cui_editable_text " + params.cssClass + "'>",
                $text,
                $input,
            "</div>"
        ];
    }

    this.setValue = function(_value, userEdited) {
        if (!userEdited) {
            userEdited = false;
        }
        if (value !== _value) {
            value = _value;
            this.refresh();
            if (params.onChange) {
                params.onChange(_value, userEdited);
            }
        }
    }

    this.value = function() {
        return value;
    }
    
    this.onRefresh = function($me, dirty, live) {
        $text.html(value + "&nbsp;");
        $input.val(value);
    }

    this.onSetupCallbacks = function($me) {
        $text.on('click', function() {
            $input.show();
            $input.select();
            $text.hide();
        });
        $input.on('change',  function() {
            $input.hide();
            $text.show();
            self.setValue($input.val(), true);
        });
        $input.on('blur',  function() {
            $input.hide();
            $text.show();
            self.setValue($input.val(), true);
        });
    }

    this.onTeardownCallbacks = function($me) {
        $text.off('click');
        $input.off('change');
        $input.off('blur');
    }
}

