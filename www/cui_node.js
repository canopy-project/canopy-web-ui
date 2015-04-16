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
 * A "CuiNode" is a web UI component.  Canopy's web-based UI is built as a
 * hierarchy of these CuiNodes.  A CuiNode can be a webpage, a section of
 * webpage, a single element of a webpage, or a generic layout helper.
 *
 * The CuiNodeBase class below is the base class for all UI components.
 *
 * Your UI components should inherit from it like so:
 *
 *      function CuiExampleNode() {
 *          cuiInitNode(this);
 *          ...
 *      }
 *
 * At a minimum, your CuiNode needs to implement this.onRefresh(), which returns
 * a JQuery DOM object.
 *
 *      function CuiHelloText() {
 *          cuiInitNode(this);
 *
 *          this.refresh = function() {
 *              return $("<div>Hello</div>");
 *          }
 *      }
 *
 * You can also create composite nodes:
 *
 */
function CuiNodeBase(name) {
    var debug = cuiNavState.get("cui_debug") == "1";
    var $outer = null;
    var $inner = null;

    this.live = function() {
        if (debug) {
            console.log("live " + name);
        }
        if (this.onLive) {
            this.onLive(this.getInner$());
        }
    }

    this.getInner$ = function() {
        if ($inner == null) {
            this.construct();
        }
        return $inner;
    }

    this.getOuter$ = function() {
        if ($outer == null) {
            return this.construct();
        }
        return $outer;
    }

    this.get$ = this.getOuter$;

    this.construct = function() {
        if (debug) {
            console.log("construct " + name);
            $outer = $("<div style='display: inline-block; border: 1px solid #ff00ff;'></div>");
            if (this.onConstruct) {
                $inner = this.onConstruct();
            } else {
                $inner = $("<div>");
            }
            //$outer.css('display', $inner.css('display'));
            $outer.append("<div style='position: relative;'><div style='position:absolute; display:inline-block; background: #a000d0; color: #ffffff; font-size:9px; font-family: sans-serif;'>" + name + "</div></div>");
            $outer.append($inner);
            this.refresh();
            return $outer;
        }
        if (this.onConstruct) {
            $outer = this.onConstruct();
        } else {
            $outer = $("<div>");
        }
        $inner = $outer;
        this.refresh();
        return $outer;
    }

    this.refresh = function() {
        if (debug) {
            console.log("refresh " + name);
        }
        if (this.onRefresh) {
            this.onRefresh(this.getInner$());
        }
    }
}

function cuiInitNode(obj, name) {
    $.extend(obj, new CuiNodeBase(obj.constructor.name));
}

function cuiLive(children) {
    for (var i = 0; i < children.length; i++) {
        children[i].live();
    }
}

function cuiCompose(segments) {
    var out = [];
    var $out;
    var placeholderCnt = 0;
    var placeholders = [];
    for (var i = 0; i < segments.length; i++) {
        if (typeof segments[i] === "string") {
            /* regular string, just append to output */
            out.push(segments[i]);
        }
        else if (typeof segments[i] === "object") {
            if (segments[i].construct) {
                /* CuiNode object probably.  Create placeholder */
                var placeholderId = "_tmpid_" + placeholderCnt;
                out.push("<div id=" + placeholderId + "/>");
                placeholders.push({
                    id: placeholderId,
                    $segment: segments[i].construct()
                });
                placeholderCnt++;
            }
            else if (segments[i] instanceof jQuery) {
                /* jquery object.  Create placeholder */
                var placeholderId = "_tmpid_" + placeholderCnt;
                out.push("<div id=" + placeholderId + "/>");
                placeholders.push({
                    id: placeholderId,
                    $segment: segments[i]
                });
                placeholderCnt++;
            }
        }
    }

    outString = "<dummy>" + out.join("") + "</dummy>";
    $out = $(outString);

    /* replace placeholders with actual content */
    for (i = 0; i < placeholderCnt; i++) {
        var id = placeholders[i].id;
        var $segment = placeholders[i].$segment;
        $out.find("#" + id).replaceWith($segment);
    }

    return $out;
}
