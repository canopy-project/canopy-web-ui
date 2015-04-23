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
 *  CuiHSplit3Layout breaks the containing element into three vertical panes.
 *
 *      +----+------+---+
 *      |    |      |   |
 *      |    |      |   |
 *      +    |      |   |
 *      |    |      |   |
 *      |    |      |   |
 *      +----+------+---+
 *
 *  Params:
 *
 *      .cssClass       - defaults to ""
 *      .left           - cuiComposeable content
 *      .middle         - abid
 *      .right          - abid
 *
 *      .leftSize       - % or px from left
 *      .rightSize      - % or px from right
 *
 *  CSS:
 *      params.cssClass:
 *          ""                        - no style
 *          "cui_thinline"            - thin border between cells
 *          "MYCLASS"                 - Your custom style
 *          "cui_thinline MYCLASS"    - Your custom style, based on thinline
 *
 *      Customize by writing CSS for:
 *          .MYCLASS.cui_hsplit3_layout
 *          .MYCLASS.cui_hsplit3_layout .cui_hsplit3_layout.cui_cell
 *          .MYCLASS.cui_hsplit3_layout .cui_hsplit3_layout.cui_left
 *          .MYCLASS.cui_hsplit3_layout .cui_hsplit3_layout.cui_right
 *          .MYCLASS.cui_hsplit3_layout .cui_hsplit3_layout.cui_middle
 */
function CuiHSplit3Layout(params) {
    cuiInitNode(this);

    this.onConstruct = function() {
        var leftStyle = [];
        var middleStyle = [];
        var rightStyle = [];

        if (params.leftSize) {
            leftStyle.push(["width: " + params.leftSize]);
            middleStyle.push(["left: " + params.leftSize]);
        }

        if (params.rightSize) {
            middleStyle.push(["right: " + params.rightSize]);
            rightStyle.push(["width: " + params.rightSize]);
        }

        leftStyle = "style='" + leftStyle.join(";") + "'";
        middleStyle = "style='" + middleStyle.join(";") + "'";
        rightStyle = "style='" + rightStyle.join(";") + "'";

        return [
            "<div class='cui_hsplit3_layout " + params.cssClass + "'>",
                "<div class='cui_hsplit3_layout cui_cell cui_left' " + leftStyle + ">",
                    params.left,
                "</div>",
                "<div class='cui_hsplit3_layout cui_cell cui_middle' " + middleStyle + ">",
                    params.middle,
                "</div>",
                "<div class='cui_hsplit3_layout cui_cell cui_right' " + rightStyle + ">",
                    params.right,
                "</div>",
            "</div>"
        ];
    }

    this.onRefresh = function($me, dirty, live) {
        cuiRefresh([params.left, params.middle, params.right], live);
    }
}
