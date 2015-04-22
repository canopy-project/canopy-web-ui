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

    var cloudVar = params.cloudVar;
    var overrideName = params.overrideName;

    function timestampString(cloudVar) {
        var secsAgo = cloudVar.lastRemoteUpdateSecondsAgo();
        if (cloudVar.lastRemoteUpdateSecondsAgo() == null) {
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
        this.markDirty();
        return $("<div class=cui_cloudvar></div>");
    }

    this.onRefresh = function($me, dirty, live) {
        if (cloudVar) {
            var name = (overrideName ? overrideName : cloudVar.name());
            var content = cuiCompose([
                "<div class=cui_cloudvar_top>",
                    "<div class=cui_cloudvar_value>",
                        "" + cloudVar.value(),
                    "</div>",
                    "<div class=cui_cloudvar_update_time>",
                        timestampString(cloudVar),
                    "</div>",
                "</div>",
                "<div class=cui_cloudvar_bottom>",
                    "<div class=cui_cloudvar_name>",
                        name,
                    "</div>",
                "</div>",
            ]);
        } else {
            content = "<b style='color:#000000'>Loading...</b>";
        }
        $me.html(content);
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


