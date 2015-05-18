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
 *      params.onDisplay -- function(value) returning modified value
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
    var cachedDirection;
    var cachedValue;
    var cachedSecsAgo;
    var cachedName;

    var $name;
    var $timestamp;
    var $value;
    var editValue;

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

        editValue = new CuiEditableText({
            cssClass: "cui_default cui_cloudvar_value",
            value: "?",
            onChange: function(value, userEdited) {
                if (userEdited) {
                    // TODO: handle other cloudvar datatypes
                    cachedCloudVar.value(parseFloat(value));
                    cachedCloudVar.device().syncWithRemote().onDone(function() {
                        self.markDirty();
                        self.refresh();
                    });
                }
            }
        });

        return [
            "<div class=cui_cloudvar>",
                "<div class=cui_cloudvar_top>",
                    $value,
                    editValue,
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
                var displayValue = value;
                if (value !== "?" && params.onDisplay) {
                    displayValue = params.onDisplay(value);
                }
                $value.html(displayValue);
                editValue.setValue(value);
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
                if (params.overrideName) {
                    $name.html(params.overrideName);
                }
            }

            if (cachedDirection !== cloudVar.direction()) {
                cachedDirection = cloudVar.direction();
                if (cachedDirection == "in" || cachedDirection == "inout") {
                    editValue.get$().show();
                    $value.hide();
                    editValue.refresh(live);
                } else {
                    editValue.get$().hide();
                    $value.show();
                    editValue.dead();
                }
            }
        } else if (dirty() && !cloudVar) {
            editValue.get$().hide();
            $value.html("?");
            $name.html("?");
            $timestamp.html("?");
        }

        // Force callbacks to be re-setup.  TODO: Why is this necessary
        //cuiRefresh([editValue], false);
        cuiRefresh([editValue], live);
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


