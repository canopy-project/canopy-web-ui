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
 *  CuiCanvas creates a container div that uses javascript for advanced
 *  positioning.
 *
 *  In particular, the CuiCanvas can be positioned between elements.  A typical
 *  example is to start at the end of the "topbar" and go to the bottom of the
 *  page.
 *
 *
 *  PARAMS
 *
 *      params.preceededBy : node or jqDOM element.
 *
 *      params.refreshOnWindowResize : Boolean - auto-refresh when the window
 *              resizes.  Defaults to true.
 *
 *      params.contents : node or jqDOM element or html
 */
function CuiCanvas(params) {
    cuiInitNode(this);
    var self = this;

    var autoRefresh = params.refreshOnWindowResize ?
        params.refreshOnWindowResize : true;

    this.onConstruct = function() {
        return ["<div class='cui_canvas'>", params.contents, "</div>"];
    }

    this.onLive = function() {
        if (params.contents.live) {
            params.contents.live();
        }

        if (autoRefresh) {
            $(window).off("resize").on("resize", function() {
                self.refresh();
            });
        }
    }

    this.onRefresh = function($me, force) {
        var $prev = params.preceededBy.get$();
        var startY = $prev.offset().top + $prev.height();
        $me.css("top", startY + "px");
        if (params.contents.refresh) {
            params.contents.refresh();
        }
    }
}
