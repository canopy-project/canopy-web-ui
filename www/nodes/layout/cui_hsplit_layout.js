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
 *      .leftSize       - % or px from left
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
function CuiHSplitLayout(params) {
    cuiInitNode(this);

    this.onConstruct = function() {
        var leftStyle = [];
        var rightStyle = [];

        if (params.leftSize) {
            leftStyle.push(["width: " + params.leftSize]);
            rightStyle.push(["left: " + params.leftSize]);
        }

        leftStyle = "style='" + leftStyle.join(";") + "'";
        rightStyle = "style='" + rightStyle.join(";") + "'";

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
