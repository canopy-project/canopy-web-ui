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
var cui_debug_recursive_depth=-1;
function CuiNodeBase(name) {
    var debug = cuiNavState.get("cui_debug") == "1";
    var $me = null;

    this.live = function() {
        if (debug) {
            console.log("live " + name);
        }
        if (this.onLive) {
            this.onLive(this.get$());
        }
        return this;
    }

    this.get$ = function() {
        if ($me == null) {
            return this.construct();
        }
        return $me;
    }

    this.construct = function() {
        if (debug) {
            cui_debug_recursive_depth++;
            var colors = [
                "#ff0080",
                "#b000ff",
                "#0080ff",
                "#00ff80",
            ];
            var aligns = [
                "left: 0px",
                "right: 0px",
            ];
            var color = colors[cui_debug_recursive_depth % colors.length];
            var align = aligns[cui_debug_recursive_depth % aligns.length];
            console.log(cui_debug_recursive_depth);
            console.log(color);
            console.log("construct " + name);
            if (this.onConstruct) {
                $me = this.onConstruct();
            } else {
                $me = $("<div>");
            }
            $me.addClass("cui_debug");
            $me.css('box-shadow', "inset 0px -1px 0px 1px " + color);
            $me.css('border-top', "4px solid " + color);
            $me.prepend("<div style='position: relative; top:-4px;'><div style='position:absolute; " + align + "; padding-right:3px; display:inline-block; background: " + color + "; color: #ffffff; font-size:9px; font-family: sans-serif;'>" + name + "</div></div>");
            this.refresh();
            cui_debug_recursive_depth--;
            return $me;
        }
        if (this.onConstruct) {
            $me = this.onConstruct();
        } else {
            $me = $("<div>");
        }
        this.refresh();
        return $me;
    }

    this.refresh = function() {
        if (debug) {
            console.log("refresh " + name);
        }
        if (this.onRefresh) {
            this.onRefresh(this.get$());
        }
        return this;
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

    outString = "<div>" + out.join("") + "</div>";
    $out = $(outString);

    /* replace placeholders with actual content */
    for (i = 0; i < placeholderCnt; i++) {
        var id = placeholders[i].id;
        var $segment = placeholders[i].$segment;
        $out.find("#" + id).replaceWith($segment);
    }

    return $out;
}
