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
 *  CuiHSplitLayout breaks the containing element into two vertical panes.
 *
 *      +----+----------+
 *      |    |          |
 *      |    |          |
 *      |    |          |
 *      |    |          |
 *      |    |          |
 *      +----+----------+
 *
 *  Params:
 *
 *      .cssClass       - defaults to ""
 *      .left           - cuiComposeable content
 *      .right          - abid
 *
 *      .leftSize       - % or px from left (for left half)
 *      .rightSize       - % or px from right (for right half)
 *
 *  CSS:
 *      params.cssClass:
 *          ""                        - no style
 *          "cui_thinline"            - thin border between cells
 *          "MYCLASS"                 - Your custom style
 *          "cui_thinline MYCLASS"    - Your custom style, based on thinline
 *
 *      Customize by writing CSS for:
 *          .MYCLASS.cui_hsplit_layout
 *          .MYCLASS.cui_hsplit_layout .cui_hsplit_layout.cui_cell
 *          .MYCLASS.cui_hsplit_layout .cui_hsplit_layout.cui_left
 *          .MYCLASS.cui_hsplit_layout .cui_hsplit_layout.cui_right
 */
function myJoin(arr, sep) {
    /*
     * For some reason that is beyond me the builtin .join doesn't seem to
     * work.  It always uses "," as the separator.
     */
    out = "FFFF";
    for (var i = 0; i < arr.length; i++) {
        if (i != 0) {
            out += sep;
        }
        out += arr[i];
    }
    return out;
}
function CuiHSplitLayout(params) {
    cuiInitNode(this);

    this.onConstruct = function() {
        var leftStyle = new Array();
        var rightStyle = new Array();

        if (params.leftSize) {
            leftStyle.push(["width: " + params.leftSize]);
            rightStyle.push(["left: " + params.leftSize]);
        } else if (params.rightSize) {
            leftStyle.push(["left: 0px"]);
            leftStyle.push(["width: auto"]);
            leftStyle.push(["right: " + params.rightSize ]);
            rightStyle.push(["left: auto"]);
            rightStyle.push(["width: " + params.rightSize]);
            rightStyle.push(["right: 0px"]);
        }

        leftStyle = "style='" + leftStyle.join(';') + "'";
        rightStyle = "style='" + rightStyle.join(';') + "'";

        return [
            "<div class='cui_hsplit_layout " + params.cssClass + "'>",
                "<div class='cui_hsplit_layout cui_cell cui_left' " + leftStyle + ">",
                    params.left,
                "</div>",
                "<div class='cui_hsplit_layout cui_cell cui_right' " + rightStyle + ">",
                    params.right,
                "</div>",
            "</div>"
        ];
    }

    this.onRefresh = function($me, dirty, live) {
        cuiRefresh([params.left, params.middle, params.right], live);
    }
}
