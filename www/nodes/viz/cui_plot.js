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
 * CuiMap shows a google map.
 *
 *  PARAMS:
 *
 *      params.height
 *      params.width
 *      params.onDrawFinish
 *      params.appendUncertainValue -- Set to true to add an uncertain sample
 *      at the current time.
 *
 *  CSS:
 *
 *  METHODS:
 *
 *      .setTimeseriesData(smaples)  samples=[{t: <RFC3339 TIME>, v: number}]
 */
function CuiPlot(params) {
    cuiInitNode(this);
    this.markDirty();
    var dataTable;
    var chart;
    var animating;

    this.setTimeseriesData = function(samples) {
        dataTable = new google.visualization.DataTable();
        dataTable.addColumn('datetime', 'Time');
        dataTable.addColumn('number', 'Value');
        dataTable.addColumn({type: 'boolean', role:'certainty'});
        dataTable.addColumn({type: 'string', role:'style'});

        for (i = 0; i < samples.length; i++) {
            var t0 = (i > 0 ? Date.parse(samples[i-1].t) : null);
            var t1 = Date.parse(samples[i].t);
            if (t0 !== null && (t1 - t0 > 3*60*1000)) // TODO: re-enable this?
            {
                dataTable.addRows([
                    [new Date(t0 + 1), samples[i-1].v, false, 'fill-opacity:0;'],
                    [new Date(t1 - 1), samples[i-1].v, true, 'stroke-opacity:0; stroke-width:5; fill-opacity:0;'],
                    [new Date(t1), samples[i].v, true, 'stroke-opacity:0; stroke-width:0; fill-color:#3060b0; stroke-color:#3060b0;']
                ]);
            } else {
                dataTable.addRows([[new Date(t1), samples[i].v, true, 'fill-color:#3060b0; stroke-color:#3060b0']]);
            }
        }
        if (samples.length > 0 && params.appendUncertainValue) {
            dataTable.addRows([
                [new Date(), samples[samples.length-1].v, false, 'fill-opacity:0;']
            ]);
        }
        this.markDirty();
        return this;
    }

    this.onConstruct = function() {
        return [
            $("<div class='cui_plot " + params.cssStyle + "'></div>")
        ];
    }

    this.onRefresh = function($me, dirty, live) {
        var redraw = false;
        if (this.liveStatus() == CUI_LIVE_STATUS_TRANSITION_TO_LIVE) {
            redraw = true;
        }
        if (live && dirty()) {
            redraw = true;
        }
        if (redraw) {
            if (chart) {
                animating = true;
            } else {
                if (params.onDrawFinish) {
                    params.onDrawFinish();
                }
            }
            var options = {
                title: params.title,
                legend: { position: 'none' },
                fontName : "Source Sans Pro",
                fontSize : 12,
                series: [{color:"#c0c0c0", areaOpacity: 0.3}],
                animation: {
                    duration: 250,
                    easing: 'out',
                },
                hAxis: {baselineColor: "#d8d8d8", textStyle:{color:"black"}, format: "h:mm a", gridlines: {color: '#d0d0d0'}},
                vAxis: {baselineColor: "#000000", textStyle:{color:"black"}, format: params.vAxisFormat, gridlines: {color: 'transparent'}},
                width: params.width,
                height: params.height,
                theme: "maximized",
                lineWidth: 2,
                backgroundColor: 'transparent',
                pointSize: 2,
            };

            if (!chart) {
                chart = new google.visualization.AreaChart($me[0]);
                google.visualization.events.addListener(chart, 'animationfinish', function() {
                    animating = false;
                    if (params.onDrawFinish) {
                        params.onDrawFinish();
                    }
                });
            }
            this.clearDirty();
            console.log("chart.draw");
            chart.draw(dataTable, options);
        }
        return false;
    }
}

google.load("visualization", "1", {packages:["corechart"]});
