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
 *  CuiULayout breaks the containing element into three sections.
 *
 *      +-------+-------+
 *      |       |       |
 *      |       |       |
 *      +---------------|
 *      |               |
 *      |               |
 *      +---------------+
 *
 *  Params:
 *
 *      .topLeft        - cuiComposeable content
 *      .topRight       - abid
 *      .bottom         - abid
 *
 *      .leftRightAmt   - % or px
 *      .topBottomAmt   - % or px
 *
 */
function CuiULayout(params) {
    cuiInitNode(this);

    this.onConstruct = function() {
        var topLeftStyle = []
        var topRightStyle = []
        var topStyle = []
        var bottomStyle = []
        if (params.leftRightAmt) {
            topLeftStyle.push(["width: " + params.leftRightAmt]);
            topRightStyle.push(["left: " + params.leftRightAmt]);
        }
        if (params.topBottomAmt) {
            topStyle.push(["height: " + params.topBottomAmt]);
            bottomStyle.push(["top: " + params.topBottomAmt]);
        }
        topLeftStyle = "style='" + topLeftStyle.join(";") + "'";
        topRightStyle = "style='" + topRightStyle.join(";") + "'";
        topStyle = "style='" + topStyle.join(";") + "'";
        bottomStyle = "style='" + bottomStyle.join(";") + "'";
        return [
            "<div class='cui_u_layout'>",
                "<div class='cui_u_layout_top'" + topStyle + ">",
                    "<div class='cui_layout_cell cui_u_layout_topleft' " + topLeftStyle + ">",
                        params.topLeft,
                    "</div>",
                    "<div class='cui_layout_cell cui_u_layout_topright' " + topRightStyle + ">",
                        params.topRight,
                    "</div>",
                "</div>",
                "<div class='cui_layout_cell cui_u_layout_bottom'" + bottomStyle + ">",
                        params.bottom,
                    "</div>",
                "</div>",
            "</div>"
        ];
    }

    this.onRefresh = function($me, dirty, live) {
        cuiRefresh([params.topLeft, params.topRight, params.bottom], live);
    }
}
