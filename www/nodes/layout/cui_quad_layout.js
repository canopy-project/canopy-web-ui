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
 *  CuiQuadLayout breaks the containg element into four quads.
 *
 *      +-------+-------+
 *      |       |       |
 *      |       |       |
 *      +-------+-------|
 *      |       |       |
 *      |       |       |
 *      +-------+-------+
 *
 *  Params:
 *
 *      .topLeft        - cuiComposeable content
 *      .topRight       - abid
 *      .bottomLeft     - abid
 *      .bottomRight    - abid
 *
 *      .leftRightAmt   - % or px
 *      .bottomTopAmt   - % or px
 *
 */
function CuiQuadLayout(params) {
    cuiInitNode(this);

    this.onConstruct = function() {
        var topLeftStyle = []
        var topRightStyle = []
        var bottomLeftStyle = []
        var bottomRightStyle = []
        var topStyle = []
        var bottomStyle = []
        if (params.leftRightAmt) {
            topLeftStyle.push(["width: " + params.leftRightAmt]);
            bottomLeftStyle.push(["width: " + params.leftRightAmt]);
            topRightStyle.push(["left: " + params.leftRightAmt]);
            bottomRightStyle.push(["left: " + params.leftRightAmt]);
        }
        if (params.topBottomAmt) {
            topStyle.push(["height: " + params.topBottomAmt]);
            bottomStyle.push(["top: " + params.topBottomAmt]);
        }
        topLeftStyle = "style='" + topLeftStyle.join(";") + "'";
        topRightStyle = "style='" + topRightStyle.join(";") + "'";
        bottomLeftStyle = "style='" + bottomLeftStyle.join(";") + "'";
        bottomRightStyle = "style='" + bottomRightStyle.join(";") + "'";
        topStyle = "style='" + topStyle.join(";") + "'";
        bottomStyle = "style='" + bottomStyle.join(";") + "'";
        return [
            "<div class='cui_quad_layout'>",
                "<div class='cui_quad_layout_top'" + topStyle + ">",
                    "<div class='cui_layout_cell cui_quad_layout_topleft' " + topLeftStyle + ">",
                        params.topLeft,
                    "</div>",
                    "<div class='cui_layout_cell cui_quad_layout_topright' " + topRightStyle + ">",
                        params.topRight,
                    "</div>",
                "</div>",
                "<div class='cui_quad_layout_bottom'" + bottomStyle + ">",
                    "<div class='cui_layout_cell cui_quad_layout_bottomleft' " + bottomLeftStyle + ">",
                        params.bottomLeft,
                    "</div>",
                    "<div class='cui_layout_cell cui_quad_layout_bottomright' " + bottomRightStyle + ">",
                        params.bottomRight,
                    "</div>",
                "</div>",
            "</div>"
        ];
    }
    this.onRefresh = function() {
    }
}


