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
 *      params.relativeTo : container node or jqDOM element.
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
        return [
            "<div class='cui_canvas'>", 
                params.contents, 
            "</div>"
        ];
    }

    this.onRefresh = function($me, dirty, live) {
        var $prev;
        if (params.preceededBy.get$) {
            $prev = params.preceededBy.get$();
        } else {
            $prev = params.preceededBy;
        }

        var startY = $prev.offset().top + $prev.outerHeight();

        if (params.relativeTo) {
            var $container;
            if (params.relativeTo.get$) {
                $container = params.relativeTo.get$();
            } else {
                $container = params.relativeTo;
            }
            startY -= $container.offset().top;
        }
        $me.css("top", startY + "px");
        cuiRefresh([params.contents], live);
    }

    this.onSetupCallbacks = function($me) {
        cuiRegisterResizeListener(this, function() {
            if (autoRefresh) {
                self.refresh();
            }
        });
        setTimeout(function() {
            self.refresh();
        }, 1);
    }

    this.onTeardownCallbacks = function($me) {
        cuiRemoveResizeListener(this);
    }
}
