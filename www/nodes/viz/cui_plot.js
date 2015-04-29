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
 *  CSS:
 *
 *  METHODS:
 *
 *      .setTimeseriesData(smaples)  samples=[{t: <RFC3339 TIME>, v: number}]
 */
function CuiPlot(params) {
    cuiInitNode(this);
    var dataTable;

    this.setTimeseriesData = function(samples) {
        dataTable = new google.visualization.DataTable();
        dataTable.addColumn('datetime', 'Time');
        dataTable.addColumn('number', 'Value');
        dataTable.addColumn({type: 'boolean', role:'certainty'});
        dataTable.addColumn({type: 'string', role:'style'});

        for (i = 0; i < samples.length; i++) {
            var t0 = (i > 0 ? Date.parse(samples[i-1].t) : null);
            var t1 = Date.parse(samples[i].t);
            if (t0 !== null && (t1 - t0 > 2*60*1000)) // TODO: re-enable this?
            {
                dataTable.addRows([
                    [new Date(t0 + 1), samples[i-1].v, false, 'fill-opacity:0; stroke-color:#b0b0b0;'],
                    [new Date(t1 - 1), samples[i-1].v, true, 'fill-opacity:0; stroke-color:#b0b0b0;'],
                    [new Date(t1), samples[i].v, true, '']
                ]);
            } else {
                dataTable.addRows([[new Date(t1), samples[i].v, true, '']]);
            }
        }
    }

    this.onConstruct = function() {
        return [
            $("<div class='cui_plot " + params.cssStyle + "'></div>")
        ];
    }

    this.onRefresh = function($me, dirty, live) {
        if (live) {

            var options = {
                title: params.title,
                legend: { position: 'none' },
                fontName : "Source Sans Pro",
                fontSize : 12,
                hAxis: {baselineColor: "#d8d8d8", textStyle:{color:"black"}, format: "h:mm a", gridlines: {color: 'transparent'}},
                vAxis: {baselineColor: "#000000", textStyle:{color:"black"}, format: params.vAxisFormat, gridlines: {color: 'transparent'}},
                chartArea:{left:50,top:10,width:params.width-40,height:params.height-40},
                lineWidth: 1,
                height: params.height,
                width: params.width,
                backgroundColor: 'transparent',
                pointSize: 4,
            };

            var chart = new google.visualization.AreaChart($me[0]);
            chart.draw(dataTable, options);
        }
    }
}

google.load("visualization", "1", {packages:["corechart"]});
