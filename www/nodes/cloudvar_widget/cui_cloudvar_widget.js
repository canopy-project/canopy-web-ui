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
 * Little box that shows a cloud var's name, value and last update time.
 *
 * PARAMS:
 *
 *      params.cloudVar -- optional CanopyVariable object.
 *      params.onHover -- function(cloudVar)
 *      params.overrideName -- string
 *
 *
 * METHODS:
 *
 *      .setCloudVar -- takes CanopyVariable object.
 *      .setOverrideName -- string or null.
 *  
 */
function CuiCloudVarWidget(params) {
    cuiInitNode(this);
    var self=this;
    this.markDirty();


    var cloudVar = params.cloudVar;
    var overrideName = params.overrideName;

    var cachedCloudVar;
    var cachedValue;
    var cachedSecsAgo;
    var cachedName;

    var $name;
    var $timestamp;
    var $value;

    function timestampString(secsAgo) {
        if (secsAgo == null) {
            // Variable has never been set
            return "<span style='color:#50b0ff'>New Var</span>"
        }
        secsAgo = Math.floor(secsAgo);
        if (secsAgo < 60) {
            return "<span style='color:#80ff80'>Just now</span>";
        }
        else if (secsAgo < 60*60) {
            return "<span style='color:#d0f080'>" + Math.floor(secsAgo/60) + "m ago</span>";
        }
        else if (secsAgo < 24*60*60) {
            return "<span style='color:#ffc080'>" + Math.floor(secsAgo/(60*60)) + "h ago";
        }
        else {
            return "<span style='color:#ff4040'>" + Math.floor(secsAgo/(24*60*60)) + "d ago";
        }
    }

    this.setCloudVar = function(_cloudVar) {
        cloudVar = _cloudVar;
        return this.markDirty();
    }
 
    this.setOverrideName = function(_name) {
        overrideName = _name;
        return this.markDirty();
    }

    this.onConstruct = function() {
        $value = $("<div class='cui_cloudvar_value'></div>");
        $timestamp = $("<div class='cui_cloudvar_update_time'></div>");
        $name = $("<div class='cui_cloudvar_name'></div>");

        return [
            "<div class=cui_cloudvar>",
                "<div class=cui_cloudvar_top>",
                    $value,
                    $timestamp,
                "</div>",
                "<div class=cui_cloudvar_bottom>",
                    $name,
                "</div>",
            "</div>"
        ];
    }

    this.onRefresh = function($me, dirty, live) {
        if (dirty() && cloudVar) {
            if (cachedValue !== cloudVar.value()) {
                cachedValue = cloudVar.value();
                var value = " " + Math.round(cachedValue*1000)/1000;
                if (cachedValue === undefined || cachedValue == null) {
                    value = "?";
                }
                $value.html(value);
                if (cachedCloudVar && cachedCloudVar == cloudVar) {
                    $value.css("color", "#ffff00");
                    $value.animate({color: "#ffffff"}, 333);
                }
                cachedCloudVar = cloudVar;
            }
            if (cachedSecsAgo !== cloudVar.lastRemoteUpdateSecondsAgo()) {
                cachedSecsAgo = cloudVar.lastRemoteUpdateSecondsAgo();
                $timestamp.html(timestampString(cachedSecsAgo));
            }
            if (cachedName !== cloudVar.name()) {
                cachedName = cloudVar.name();
                $name.html(cachedName);
            }
        } else if (dirty() && !cloudVar) {
            $value.html("?");
            $name.html("?");
            $timestamp.html("?");
        }
    }

    this.onSetupCallbacks = function($me) {
        $me.on("mouseenter", function() {
            if (params.onHover)
                params.onHover(cloudVar);
        });
        $me.on("mouseleave", function() {
            if (params.onHoverOut)
                params.onHoverOut(cloudVar);
        });
    }

    this.onTeardownCallbacks = function($me) {
        $me.off("mouseenter");
        $me.off("mouseleave");
    }
}


