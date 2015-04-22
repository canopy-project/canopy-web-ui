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
var CUI_LIVE_STATUS_DEAD = 0;
var CUI_LIVE_STATUS_TRANSITION_TO_LIVE = 1;
var CUI_LIVE_STATUS_LIVE = 2;
var CUI_LIVE_STATUS_TRANSITION_TO_DEAD = 3;

function CuiNodeBase(name) {
    var debug = cuiNavState.get("cui_debug") == "1";
    var $me = null;
    var liveState = false;

    function DirtyTracker() {
        var dirty = {};

        this.clearDirty = function() {
            if (arguments.length == 0) {
                dirty = {};
            } else {
                for (var i = 0; i < arguments.length; i++) {
                    dirty[arguments[i]] = undefined;
                }
            }
        }

        this.isDirty = function(key) {
            return dirty[(key ? key : "__base")];
        }

        // Mark this node as "dirty".  This information is passed along to
        // onRefresh().
        //
        // Optionally specify one or more keys for fine-grained dirty flags.
        //
        // For example:
        //      this.markDirty("title", "content");
        this.markDirty = function() {
            dirty["__base"] = true;
            for (var i = 0; i < arguments.length; i++) {
                dirty[arguments[i]] = true;
            }
        }
    }

    var dirtyTracker = new DirtyTracker();
    this.clearDirty = function() {
        dirtyTracker.clearDirty.apply(dirtyTracker, arguments);
        return this;
    }
    this.markDirty = function() {
        dirtyTracker.markDirty.apply(dirtyTracker, arguments);
        return this;
    }

    this.construct = function() {
        if (debug) {
            cui_debug_recursive_depth++;
            var colors = [
                "#ff0080",
                "#00c080",
                "#b000ff",
                "#c0c000",
                "#0080ff",
            ];
            var aligns = [
                "left: 0px",
                "right: 0px",
            ];
            var color = colors[cui_debug_recursive_depth % colors.length];
            var align = aligns[cui_debug_recursive_depth % aligns.length];
            console.log(new Array(cui_debug_recursive_depth*4).join(" ") + "| construct " + name);
            if (this.onConstruct) {
                $me = this.onConstruct();
                if ($.isArray($me)) {
                    $me = cuiCompose($me);
                }
            } else {
                $me = $("<div>");
            }
            $me.addClass("cui_debug");
            $me.css('box-shadow', "inset 0px 0px 0px 1px " + color);
            $me.css('border-top', "4px solid " + color);
            $me.prepend("<div style='position: relative; top:-0px;'><div style='position:absolute; " + align + "; padding-right:3px; display:inline-block; z-index: 10000; background: " + color + "; color: #ffffff; font-size:9px; font-weight:700; font-family: sans-serif;'>" + name + "</div></div>");
            cui_debug_recursive_depth--;
            return $me;
        }
        if (this.onConstruct) {
            $me = this.onConstruct();
            if ($.isArray($me)) {
                $me = cuiCompose($me);
            }
        } else {
            $me = $("<div>");
        }
        return $me;
    }

    this.dead = function() {
        return this.refresh(false);
    }

    this.get$ = function() {
        if ($me == null) {
            return this.construct();
        }
        return $me;
    }

    this.isConstructed = function() {
        return ($me !== null);
    }

    this.isLive = function() {
        return liveState;
    }

    this.live = function() {
        return this.refresh(true);
    }

    function getLiveStatus(prev, current) {
        if (prev == false && current == false) {
            return CUI_LIVE_STATUS_DEAD;
        } else if (prev == false && current == true) {
            return CUI_LIVE_STATUS_TRANSITION_TO_LIVE;
        } else if (prev == true && current == false) {
            return CUI_LIVE_STATUS_TRANSITION_TO_DEAD;
        } else if (prev == true && current == true) {
            return CUI_LIVE_STATUS_LIVE;
        }
        console.log("Bad live state: " + prev + " -> " + current);
        return CUI_LIVE_STATUS_DEAD;
    }

    function debugLiveStatusString(liveStatus) {
        if (liveStatus == CUI_LIVE_STATUS_DEAD) {
            return " D ";
        } else if (liveStatus == CUI_LIVE_STATUS_LIVE) {
            return " L ";
        } else if (liveStatus == CUI_LIVE_STATUS_TRANSITION_TO_LIVE) {
            return "->L";
        } else if (liveStatus == CUI_LIVE_STATUS_TRANSITION_TO_DEAD) {
            return "->D";
        }
        console.log("Bad live status: " + liveStatus);
        return "!!!"
    }

    this.refresh = function(isLive) {
        var result;

        if (isLive == undefined) {
            isLive = liveState;
        }
        var liveStatus = getLiveStatus(liveState, isLive);

        liveState = isLive;

        if (debug) {
            cui_debug_recursive_depth++;
            var pre;
            var msg = (dirtyTracker.isDirty() ? " refresh " : " (refresh) ");
            console.log(new Array(cui_debug_recursive_depth*4).join(" ")
                    + "| " + debugLiveStatusString(liveStatus) + msg + " " + name);
        }

        // Trigger the teardown callback when:
        //  - Transitioning from live to dead
        //  - When live and callbacks are dirty
        if (liveStatus == CUI_LIVE_STATUS_TRANSITION_TO_DEAD || 
                (dirtyTracker.isDirty("__callbacks") && this.isLive())) {
            this.teardownCallbacks();
        }

        if (this.onRefresh) {
            // Return undefined or true to clear all dirty flags.
            // Return false to manually clear dirty flags.
            result = this.onRefresh(this.get$(), dirtyTracker.isDirty, this.isLive());
        }

        // Trigger the setup callback when:
        //  - Transitioning from dead to live
        //  - When live and callbacks are dirty
        if (liveStatus == CUI_LIVE_STATUS_TRANSITION_TO_LIVE || 
                (dirtyTracker.isDirty("__callbacks") && this.isLive())) {
            this.setupCallbacks();
        }

        if (result !== false) {
            dirtyTracker.clearDirty();
        }

        if (debug) {
            cui_debug_recursive_depth--;
        }
        return this;
    }
    
    this.setupCallbacks = function() {
        if (debug) {
            cui_debug_recursive_depth++;
            var msg = (this.onSetupCallbacks ? "| setup callbacks " : "(setup callbacks) ");
            console.log(new Array(cui_debug_recursive_depth*4).join(" ") + msg + name);
        }
        if (this.onSetupCallbacks) {
            this.onSetupCallbacks(this.get$());
        }
        if (debug) {
            cui_debug_recursive_depth--;
        }
    }

    this.teardownCallbacks = function() {
        if (debug) {
            cui_debug_recursive_depth++;
            var msg = (this.onTeardownCallbacks ? "| teardown callbacks " : "(teardown callbacks) ");
            console.log(new Array(cui_debug_recursive_depth*4).join(" ") + msg + name);
        }
        if (this.onTeardownCallbacks) {
            this.onTeardownCallbacks(this.get$());
        }
        if (debug) {
            cui_debug_recursive_depth--;
        }
    }

}

function cuiInitNode(obj) {
    $.extend(obj, new CuiNodeBase(obj.constructor.name));
}

function cuiLive(children) {
    for (var i = 0; i < children.length; i++) {
        if (children[i].live) {
            children[i].live();
        }
    }
}

function cuiRefresh(children, live) {
    for (var i = 0; i < children.length; i++) {
        if (children[i].refresh) {
            children[i].refresh(live);
        }
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
                    $segment: segments[i].get$()
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

    //outString = "<span>" + out.join("") + "</span>";
    //outString = "<div>" + out.join("") + "</div>";
    outString =  out.join("");
    $out = $(outString);
    if ($out.length != 1) {
        $out = $("<span>" + outString + "</span>");
    }

    /* replace placeholders with actual content */
    for (i = 0; i < placeholderCnt; i++) {
        var id = placeholders[i].id;
        var $segment = placeholders[i].$segment;
        $out.find("#" + id).replaceWith($segment);
    }

    return $out;
}
