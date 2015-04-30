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
 * Self-refeshing plot of cloud var historic value.
 *
 * PARAMS:
 *
 *      params.cloudVar -- optional CanopyVariable object.
 *      params.autoRefreshInterval -- Number of milliseconds between autorefresh. default: 20000
 *      params.width
 *      params.height
 *
 * METHODS:
 *
 *      .setCloudVar -- takes CanopyVariable object.
 */
function CuiCloudVarPlot(params) {
    cuiInitNode(this);
    var self=this;

    var plot;
    var interval;
    var autoRefreshInterval = (params.autoRefreshInterval ? params.autoRefreshInterval : 20000);
    var cloudVar;
    var _cloudVar = params.cloudVar;
    var $loading;

    this.setCloudVar = function(__cloudVar) {
        _cloudVar = __cloudVar;
        return this;
    }

    this.onConstruct = function() {
        plot = new CuiPlot({
            appendUncertainValue: true,
            width: params.width,
            height: params.height,
            onDrawFinish: function() {
                $loading.hide();
            }
        });
        $loading = cuiCompose([
            "<div style='position:relative; background:#ff0000;'>",
                "<div style='z-index: 100000; position:absolute; text-align: center;top: 0px; height: " + params.height + "px; left: 0px; right: 0px;  background:rgba(255, 255, 255, 0.5); font-weight:400'>",
                    "<br>LOADING...",
                "</div>",
            "</div>",
        ]);
        return ["<div>",
            $loading,
            plot,
            "</div>"
        ];
    }

    this.onRefresh = function($me, dirty, live) {
        if (cloudVar != _cloudVar) {
            $loading.show();
            cloudVar = _cloudVar;
        }
        if (cloudVar) {
            cloudVar.historicData().onDone(function(result, resp) {
                // TODO: this sometimes causes problems!
                // It is because the history is being grabbed, but the device
                // object is not being refreshed.
                // This if is a WAR:
                if (resp.samples.length < 2) {
                    resp.samples.push({
                        "v" : cloudVar.lastRemoteValue(),
                        "t" : cloudVar.lastRemoteUpdateTime(),
                    });
                }
                plot.setTimeseriesData(resp.samples).refresh(live);
            });
        }
    }

    this.onSetupCallbacks = function($me) {
        if (!interval) {
            interval = setInterval(function() {
                self.refresh();
            }, autoRefreshInterval);
        }
    }
}


