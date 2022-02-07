
const Http = new XMLHttpRequest();


weather = { 4201: ["Heavy Rain", "rain_heavy"], 4000: ["Rain", "rain"], 4200: ["Light Rain", "rain_light"], 6201: ["Heavy Freezing Rain", "freezing_rain_heavy"], 6001: ["Freezing Rain", "freezing_rain"], 6200: ["Light Freezing Rain", "frezzing_rain_light"], 6000: ["Freezing Drizzle", "freezing_drizzle"], 4000: ["Drizzle", "drizzle"], 7101: ["Heavy Ice Pellets", "ice_pellets_heavy"], 7000: ["Ice Pellets", "ice_pellets"], 7102: ["Light Ice Pellets", "ice_pellets_light"], 5101: ["Heavy Snow", "snow_heavy"], 5000: ["Snow", "snow"], 5100: ["Light Snow", "snow_light"], 5001: ["Flurries", "flurries"], 8000: ["Thunderstorm", "tstorm"], 2100: ["Light Fog", "fog_light"], 2000: ["Fog", "fog"], 1001: ["Cloudy", "cloudy"], 1102: ["Mostly Cloudy", "mostly_cloudy"], 1101: ["Partly Cloudy", "partly_cloudy_day"], 1100: ["Mostly Clear", "mostly_clear_day"], 1000: ["Clear", "clear_day"] }


function Autolocate() {
    var checkbox = document.getElementsByClassName("cb");
    var street = document.getElementById('str');
    var city = document.getElementById('ct');
    var state = document.getElementById("ss");


    if (checkbox[0].checked) {
        state.value = ""
        street.value = "";
        city.value = "";
        city.disabled = true
        street.disabled = true
        state.disabled = true
        if (checkbox[0].checked == true) {
            const url = 'https://ipinfo.io/?token=9d3e16965e4377';
            Http.open("GET", url);
            Http.send();
            Http.onreadystatechange = (e) => {
                if (Http.readyState == 4) {
                    res = JSON.parse(Http.responseText)
                    console.log(res)
                    window.cord = res.loc
                    window.addr = `${res.city},${res.region} ${res.postal},${res.country}`
                    console.log(window.addr)
                }
            }
        }
    }
    else {
        city.disabled = false
        state.disabled = false
        street.disabled = false
    }

}

function GetResult() {
    console.log('Submitted')
    var checkbox = document.getElementsByClassName("cb");
    var street = document.getElementById('str');
    var city = document.getElementById('ct');
    var state = document.getElementById("ss");
    var stateS = state.value

    console.log(city.value, console.log)
    if (document.getElementById('weather_table')) { document.getElementById('weather_table').remove() }
    if (document.getElementById("Detailed_info")) { document.getElementById("Detailed_info").remove(); }
    if (document.getElementById('Result')) { document.getElementById('Result').remove() }

    // ADDRESS in card
    if (checkbox[0].checked == true) {
        data = window.cord
        SubmitData(data)
    }
    else {
        console.log(window.addr)
            let address = `${street.value},${city.value},${stateS}`
            window.addr = address
            const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=AIzaSyBdfiZJVG5ZPNtr4_61AesohqpmZyN-Lmc`;
        console.log(url)
        Http.open("GET", url);
        Http.send();
        Http.onreadystatechange = (e) => {
            if (Http.readyState == 4) {
                res = JSON.parse(Http.responseText)
                console.log(res)
                loc = res.results[0].geometry.location
                data = `${loc.lat},${loc.lng}`
                window.cord = data
                console.log('WC')
                console.log(window.cord)
                SubmitData(data)
            }
        }
    }
}

function clearScreen() {
    var street = document.getElementById('str');
    var city = document.getElementById('ct');
    var state = document.getElementById("ss");
    city.disabled = false
    state.disabled = false
    street.disabled = false
    if (document.getElementById('weather_table')) { document.getElementById('weather_table').remove() }
    if (document.getElementById('Result')) { document.getElementById('Result').remove() }
    if (document.getElementById("Detailed_info")) { document.getElementById("Detailed_info").remove(); }
    if (document.getElementById('main_charts')) { document.getElementById('main_charts').remove() }
    document.getElementById("loc").checked = false

}
function SubmitData(data) {
    const url = `/getForecast?data=${data}`;
    //  const url = `https://essential-city-326505.wl.r.appspot.com//getForecast?data=${data}`;
    Http.open("GET", url);
    console.log(url)
    console.log(data)
    Http.send(data);
    Http.onreadystatechange = (e) => {
        if (Http.readyState == 4) {
            resultss = JSON.parse(Http.responseText)
            console.log(resultss)
            res = resultss.data.timelines[1].intervals
            res2 = resultss.data.timelines[0].intervals
            l = []
            l2 = []
            d = []
            d2 = []
            for (i = 0; i < res.length; i++) {
                l.push([getFormatteddDateCharts(res[i].startTime), res[i].values.temperatureMin, res[i].values.temperatureMax])
                d.push([getFormatteddDateCharts(res[i].startTime)])
            }
            window.l1=l
            console.log(window.l1)
           
            // for (i = 0; i < res2.length; i++) {
            //     l2.push({
            //         time: res2[i].startTime, data: {
            //             temperature: res2[i].values.temperature,
            //             windSpeed: res2[i].values.windSpeed,
            //             windDirection: res2[i].values.windDirection,
            //             humidity: res2[i].values.humidity,
            //             pressureSeaLevel: res2[i].values.pressureSeaLevel,
            //             cloudCover: res2[i].values.cloudCover,
            //             precipitationProbability: res2[i].values.precipitationProbability
            //         }
            //     })
            // }
            console.log("l2")
            window.l2=l2
            console.log(window.l2)
            console.log(weather[res[0].values.weatherCode][1])
            var result = `  <div class="Result" id="Result">
                <div class="card">
                    <div class="first_half">
                        <p class="address">${window.addr}</p>
                        <img alt="Clear" src="static/Images/${weather[res[0].values.weatherCode][1]}.svg">
                            <p class="temperature">${res[0].values.temperature}°</p>
                        <p class="forecast">${weather[res[0].values.weatherCode][0]}</p>
                    </div>
                    <div class="second_half">
                        <p class="heading">Humidity&emsp;&emsp;Pressure&emsp;&emsp;Wind
                            Speed&emsp;&emsp;Visbility&emsp;&emsp;Cloud Cover&emsp;&emsp;UV Level</p>
                        <img class="details_img"
                            src="./static/Images/humidity.png">
                        <img class="details_img"
                            src="./static/Images/Pressure.png">
                        <img class="details_img"
                            src="./static/Images/Wind_Speed.png">
                        <img class="details_img"
                            src="./static/Images/Visibility.png">
                        <img class="details_img"
                            src="./static/Images/Cloud_Cover.png">
                        <img class="details_img"
                            src="./static/Images/UV_Level.png">
                        <p class="val"><span>${res[0].values.humidity}%&ensp;   </span><span>${res[0].values.pressureSeaLevel}inHg&emsp;</span><span>${res[0].values.windSpeed}mph&emsp;</span><span> ${res[0].values.visibility}mi&emsp;&emsp;
                            </span><span>${res[0].values.cloudCover}%&emsp;&emsp;&emsp;</span><span>${res[0].values.uvIndex}</span></p>
                    </div>
                </div>
                </div>`

            //     </div>
            //     <div class="weather_table">
            //         <table>
            //             <tr>
            //                 <th>Date</th>
            //                 <th>Status</th>
            //                 <th>Temp High</th>
            //                 <th>Temp Low</th>
            //                 <th>Wind Speed</th>
            //             </tr>
            //             <tr>
            //                 <td>Sunday 5 Sept 2021</td>
            //                 <td><img src="static/Images/cloudy.svg"><span>Cloudy</span></td>
            //                 <td>36.2</td>
            //                 <td>17.92</td>
            //                 <td>4.19</td>
            //             </tr>
            //             <tr>
            //                 <td>Sunday 5 Sept 2021</td>
            //                 <td><img src="static/Images/cloudy.svg"><span>Cloudy</span></td>
            //                 <td>36.2</td>
            //                 <td>17.92</td>
            //                 <td>4.19</td>
            //             </tr>
            //             <tr>
            //                 <td>Sunday 5 Sept 2021</td>
            //                 <td><img src="static/Images/cloudy.svg"><span>Cloudy</span></td>
            //                 <td>36.2</td>
            //                 <td>17.92</td>
            //                 <td>4.19</td>
            //             </tr>
            //             <tr>
            //                 <td>Sunday 5 Sept 2021</td>
            //                 <td><img src="static/Images/cloudy.svg"><span>Cloudy</span></td>
            //                 <td>36.2</td>
            //                 <td>17.92</td>
            //                 <td>4.19</td>
            //             </tr>

            //         </table>
            //     </div>
            // </div>`
            var table = document.createElement("table");
            table.setAttribute("class", "weather_table");
            table.setAttribute('id', 'weather_table')
            var tr = document.createElement("tr");
            var td = document.createElement("th");
            td.appendChild(document.createTextNode('Date'))
            tr.appendChild(td)
            var td = document.createElement("th");
            td.appendChild(document.createTextNode('Status'))
            tr.appendChild(td)
            var td = document.createElement("th");
            td.appendChild(document.createTextNode('Temp High'))
            tr.appendChild(td)
            var td = document.createElement("th");
            td.appendChild(document.createTextNode('Temp Low'))
            tr.appendChild(td)
            var td = document.createElement("th");
            td.appendChild(document.createTextNode('WindSpeed'))
            tr.appendChild(td)
            table.appendChild(tr)
            for (i = 0; i < res.length; i++) {
               
                date = getFormatteddDate(res[i].startTime)
                td.appendChild(document.createTextNode(date))
                tr.appendChild(td)

                var td = document.createElement("td");
                var img = document.createElement('img');
                img.src = `static/Images/${weather[res[i].values.weatherCode][1]}.svg`;
                td.appendChild(img);
                var text = document.createElement('span')
                text.appendChild(document.createTextNode(`${weather[res[i].values.weatherCode][0]}`))
                text.setAttribute('class', 'status_text')
                td.appendChild(text)
                tr.appendChild(td)

                var td = document.createElement("td");
                td.appendChild(document.createTextNode(res[i].values.temperatureMax))
                tr.appendChild(td)

                var td = document.createElement("td");
                td.appendChild(document.createTextNode(res[i].values.temperatureMin))
                tr.appendChild(td)

                var td = document.createElement("td");
                td.appendChild(document.createTextNode(res[i].values.windSpeed))
                tr.appendChild(td)
                pass = res[i]
                console.log(pass)
                tr.setAttribute('id', i)
                tr.setAttribute('onclick', 'Detailed_card(this.id,res)')
                table.appendChild(tr)

            }
            document.getElementById('main').insertAdjacentHTML('afterend', result)
            document.getElementById('main').appendChild(table)

        }
    }
}

function getFormatteddDate(input_date) {
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
    var date = new Date(input_date)
    var new_date = date.toLocaleDateString('en-us', options)
    return new_date

}
function getFormatteddDateCharts(input_date) {
    var options = { day: 'numeric', month: 'short' }
    var date = new Date(input_date)
    var new_date = date.toLocaleDateString('en-us', options)
    return new_date

}
function Detailed_card(ind, details) {

    console.log(details[ind])
    precipitation = { 0: 'NA', 1: "Rain", 2: "Snow", 3: "Freezing Rain", 4: "Ice Pellets" }
    console.log(weather[details[ind].values.weatherCode][0], weather[details[ind].values.weatherCode][1])
    date = getFormatteddDate(details[ind].startTime)
    sunrise = `${new Date(details[ind].values.sunriseTime).getHours()}AM`
    sunset = `${new Date(details[ind].values.sunsetTime).getHours() % 12}PM`
    console.log(precipitation[2])
    document.getElementById('weather_table').remove()
    document.getElementById('Result').remove()
    content = `<div id='Detailed_info' class="Detailed_info">
    <p class="card_head">Daily Weather Details</p>
    <div class="card_detailed">
        <div class="upper_part">
         <img src="./static/Images/${weather[details[ind].values.weatherCode][1]}.svg">
         <p>${date} </p>
         <p>${weather[details[ind].values.weatherCode][0]}</p>
         <p class="temp_range">${details[ind].values.temperatureMax}°/${details[ind].values.temperatureMin}°</p>
     </div>    
     <div class="lower_part">
         <p>Precipitation: ${precipitation[details[ind].values.precipitationType]}</p>
         <p> Chance of Rain: ${details[ind].values.precipitationProbability}%</p>
         <p>Wind Speed: ${details[ind].values.windSpeed}mph</p>
         <p>Humidity : ${details[ind].values.humidity}%</p>
         <p>Visibility: ${details[ind].values.visibility}mi</p>
         <p>Sunrise/Sunsets: ${sunrise}/${sunset}</p>
     </div>
    </div>
    <div class="charts_head">
                <p class="weather_charts_text">Weather Charts</p>
                <center><img class="dwn_arr" id="dwn_arr" src="./static/Images/point-down-512.png" onclick="chartsDisplay()">
                </center>
                <figure class="highcharts-figure">
                    <div id="charts"></div>

                </figure>
            </div>

 </div>`

    document.getElementById('main').insertAdjacentHTML('afterend', content)
}

function chartsDisplay() {
    var chart_html = `
                <div id='main_charts'>
                <figure class="highcharts-figure">

                    <div id="charts"></div>
                    <br>
                    <div id="charts2"></div>

                </figure>
                </div>
           `
    var up_arrow = ` <center><img class="up_arr" id="up_arr" src="./static/Images/point-up-512.png" onclick="RemoveCharts()">
    </center>`
    document.getElementById('dwn_arr').outerHTML = up_arrow
    document.getElementById('main').insertAdjacentHTML('afterend', chart_html)
    console.log('Chart')
    console.log(window.cord)
    // const url = `http://localhost:8080///getForecast?data=${window.cord}`;
    // //  const url = `https://essential-city-326505.wl.r.appspot.com//getForecast?data=${data}`;
    // Http.open("GET", url);
    // console.log(url)
    // Http.send(window.cord);
    // Http.onreadystatechange = (e) => {
    //     if (Http.readyState == 4) {
    //         resultss = JSON.parse(Http.responseText)
    //         console.log(resultss)
    //         res = resultss.data.timelines[1].intervals
    //         // res2 = resultss.data.timelines[0].intervals
    // l = []
    // l2=[]
    // d=[]
    // d2=[]
    // for (i = 0; i < res.length; i++) {
    //     l.push([getFormatteddDateCharts(res[i].startTime), res[i].values.temperatureMin, res[i].values.temperatureMax])
    //     d.push([getFormatteddDateCharts(res[i].startTime)])
    // }
    // console.log(l)
    // const url = `http://localhost:8080///getdailyChart?data=${JSON.stringify(l)}`;
    // //  const url = `https://essential-city-326505.wl.r.appspot.com//getForecast?data=${data}`;
    // Http.open("GET", url);
    // console.log(url)
    // Http.send();
    // Http.onreadystatechange = (e) => {
    //     if (Http.readyState == 4) {
    //         resultss = JSON.parse(Http.responseText)
    //         console.log('RD')
    //         console.log(resultss)
    //     }
    // }
    // for (i = 0; i < res2.length; i++) {
    //     l2.push({
    //         time: res2[i].startTime, data: {
    //             temperature: res2[i].values.temperature,
    //             windSpeed: res2[i].values.windSpeed,
    //             windDirection: res2[i].values.windDirection,
    //             humidity: res2[i].values.humidity,
    //             pressureSeaLevel: res2[i].values.pressureSeaLevel,
    //             cloudCover: res2[i].values.cloudCover,
    //             precipitationProbability: res2[i].values.precipitationProbability
    //         }
    //     })
    // }
    // console.log("l2")
    // console.log(l2)
    DailyCharts()
    HourlyCharts()
}


function RemoveCharts() {
    if (document.getElementById('up_arr')) {
        var dwn_arrow = ` <center><img class="dwn_arr" id="dwn_arr" src="./static/Images/point-down-512.png" onclick="chartsDisplay()">
        </center>`
        console.log(dwn_arrow)
        document.getElementById('up_arr').outerHTML = dwn_arrow
    }
    if (document.getElementById('main_charts')) {
        document.getElementById('main_charts').remove()
    }
}

function DailyCharts(){
    Highcharts.getJSON(
        `/getdailyChart?data=${JSON.stringify(window.l1)}`,
        function (data) {
            Highcharts.chart('charts', {

                chart: {
                    type: 'arearange',
                    zoomType: 'x',
                    scrollablePlotArea: {
                        minWidth: 720,
                        scrollPositionX: 1
                    }
                },

                title: {
                    text: 'Temperature Ranges(Min Max)'
                },

                xAxis: {
                    type: 'datetime',
                    categories: d
                },
                
                  
                yAxis: {
                    title: {
                        text: null
                    }
                },

                tooltip: {
                    crosshairs: true,
                    shared: true,
                    valueSuffix: '°F',
                    xDateFormat: '%A, %b %e'
                },

                legend: {
                    enabled: false
                },

                series: [{
                    name: 'Temperatures',
                    data: data,
                    fillColor: {
                        linearGradient: [0, 0, 0, 300],
                        stops: [
                          [0, ['#fda611']],
                          [1, Highcharts.color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                        ]
                      },
                }]

            });
        }
    );
}
function HourlyCharts(data){
    /**
 * This is a complex demo of how to set up a Highcharts chart, coupled to a
 * dynamic source and extended by drawing image sprites, wind arrow paths
 * and a second grid on top of the chart. The purpose of the demo is to inpire
 * developers to go beyond the basic chart types and show how the library can
 * be extended programmatically. This is what the demo does:
 *
 * - Loads weather forecast from www.yr.no in form of a JSON service.
 * - When the data arrives async, a Meteogram instance is created. We have
 *   created the Meteogram prototype to provide an organized structure of the
 *   different methods and subroutines associated with the demo.
 * - The parseYrData method parses the data from www.yr.no into several parallel
 *   arrays. These arrays are used directly as the data option for temperature,
 *   precipitation and air pressure.
 * - After this, the options structure is built, and the chart generated with
 *   the parsed data.
 * - On chart load, weather icons and the frames for the wind arrows are
 *   rendered using custom logic.
 */

function Meteogram(json, container) {
    // Parallel arrays for the chart data, these are populated as the JSON file
    // is loaded
    this.humidity = [];
    this.precipitationsError = []; // Only for some data sets
    this.winds = [];
    this.temperatures = [];
    this.pressures = [];

    // Initialize
    this.json = json;
    this.container = container;

    // Run
    this.parseYrData();
}

/**
 * Mapping of the symbol code in yr.no's API to the icons in their public
 * GitHub repo, as well as the text used in the tooltip.
 *
 * https://api.met.no/weatherapi/weathericon/2.0/documentation
 */


/**
 * Draw the weather symbols on top of the temperature series. The symbols are
 * fetched from yr.no's MIT licensed weather symbol collection.
 * https://github.com/YR/weather-symbols
 */


/**
 * Draw blocks around wind arrows, below the plot area
 */
Meteogram.prototype.drawBlocksForWindArrows = function (chart) {
    const xAxis = chart.xAxis[0];

    for (
        let pos = xAxis.min, max = xAxis.max, i = 0;
        pos <= max + 36e5; pos += 36e5,
        i += 1
    ) {

        // Get the X position
        const isLast = pos === max + 36e5,
            x = Math.round(xAxis.toPixels(pos)) + (isLast ? 0.5 : -0.5);

        // Draw the vertical dividers and ticks
        const isLong = this.resolution > 36e5 ?
            pos % this.resolution === 0 :
            i % 2 === 0;

        chart.renderer
            .path([
                'M', x, chart.plotTop + chart.plotHeight + (isLong ? 0 : 28),
                'L', x, chart.plotTop + chart.plotHeight + 32,
                'Z'
            ])
            .attr({
                stroke: chart.options.chart.plotBorderColor,
                'stroke-width': 1
            })
            .add();
    }

    // Center items in block
    chart.get('windbarbs').markerGroup.attr({
        translateX: chart.get('windbarbs').markerGroup.translateX + 8
    });

};

/**
 * Build and return the Highcharts options structure
 */
Meteogram.prototype.getChartOptions = function () {
    return {
        chart: {
            renderTo: this.container,
            marginBottom: 70,
            marginRight: 40,
            marginTop: 50,
            plotBorderWidth: 1,
            height: 310,
            alignTicks: false,
            scrollablePlotArea: {
                minWidth: 720
            }
        },

        defs: {
            patterns: [{
                id: 'precipitation-error',
                path: {
                    d: [
                        'M', 3.3, 0, 'L', -6.7, 10,
                        'M', 6.7, 0, 'L', -3.3, 10,
                        'M', 10, 0, 'L', 0, 10,
                        'M', 13.3, 0, 'L', 3.3, 10,
                        'M', 16.7, 0, 'L', 6.7, 10
                    ].join(' '),
                    stroke: '#68CFE8',
                    strokeWidth: 1
                }
            }]
        },

        title: {
            text: 'Hourly Weather(For Next 5 Days)',
            align: 'center',
            style: {
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis'
            }
        },

        credits: {
            text: 'Forecast from <a href="https://yr.no">yr.no</a>',
            href: 'https://yr.no',
            position: {
                x: -40
            }
        },

        tooltip: {
            shared: true,
            useHTML: true,
            headerFormat:
                '<small>{point.x:%A, %b %e, %H:%M} - {point.point.to:%H:%M}</small><br>' +
                '<b>{point.point.symbolName}</b><br>'

        },

        xAxis: [{ // Bottom X axis
            type: 'datetime',
            tickInterval: 2 * 36e5, // two hours
            minorTickInterval: 36e5, // one hour
            tickLength: 0,
            gridLineWidth: 1,
            gridLineColor: 'rgba(128, 128, 128, 0.1)',
            startOnTick: false,
            endOnTick: false,
            minPadding: 0,
            maxPadding: 0,
            offset: 30,
            showLastLabel: true,
            labels: {
                format: '{value:%H}'
            },
            crosshair: true
        }, { // Top X axis
            linkedTo: 0,
            type: 'datetime',
            tickInterval: 24 * 3600 * 1000,
            labels: {
                format: '{value:<span style="font-size: 12px; font-weight: bold">%a</span> %b %e}',
                align: 'left',
                x: 3,
                y: -5
            },
            opposite: true,
            tickLength: 20,
            gridLineWidth: 1
        }],

        yAxis: [{ // temperature axis
            title: {
                text: null
            },
            labels: {
                format: '{value}°',
                style: {
                    fontSize: '10px'
                },
                x: -3
            },
            plotLines: [{ // zero plane
                value: 0,
                color: '#BBBBBB',
                width: 1,
                zIndex: 2
            }],
            maxPadding: 0.3,
            minRange: 8,
            tickInterval: 1,
            gridLineColor: 'rgba(128, 128, 128, 0.1)'

        }, { // precipitation axis
            title: {
                text: null
            },
            labels: {
                enabled: false
            },
            gridLineWidth: 0,
            tickLength: 0,
            minRange: 10,
            min: 0

        }, { // Air pressure
            allowDecimals: false,
            title: { // Title on top of axis
                text: 'hPa',
                offset: 0,
                align: 'high',
                rotation: 0,
                style: {
                    fontSize: '10px',
                    color: Highcharts.getOptions().colors[2]
                },
                textAlign: 'left',
                x: 3
            },
            labels: {
                style: {
                    fontSize: '8px',
                    color: Highcharts.getOptions().colors[2]
                },
                y: 2,
                x: 3
            },
            gridLineWidth: 0,
            opposite: true,
            showLastLabel: false
        }],

        legend: {
            enabled: false
        },

        plotOptions: {
            series: {
                pointPlacement: 'between'
            }
        },


        series: [{
            name: 'Temperature',
            data: this.temperatures,
            type: 'spline',
            marker: {
                enabled: false,
                states: {
                    hover: {
                        enabled: true
                    }
                }
            },
            tooltip: {
                pointFormat: '<span style="color:{point.color}">\u25CF</span> ' +
                    '{series.name}: <b>{point.y}°F</b><br/>'
            },
            zIndex: 1,
            color: '#FF3333',
            negativeColor: '#48AFE8'
        }, {
            name: 'Precipitation',
            data: this.precipitationsError,
            type: 'column',
            color: 'url(#precipitation-error)',
            yAxis: 1,
            groupPadding: 0,
            pointPadding: 0,
            tooltip: {
                valueSuffix: ' mm',
                pointFormat: '<span style="color:{point.color}">\u25CF</span> ' +
                    '{series.name}: <b>{point.minvalue} mm - {point.maxvalue} mm</b><br/>'
            },
            grouping: false,
            dataLabels: {
                enabled: this.hasPrecipitationError,
                filter: {
                    operator: '>',
                    property: 'maxValue',
                    value: 0
                },
                style: {
                    fontSize: '8px',
                    color: 'gray'
                }
            }
        }, {
            name: 'Humidity',
            data: this.humidity,
            type: 'column',
            color: '#68CFE8',
            yAxis: 1,
            groupPadding: 0,
            pointPadding: 0,
            grouping: false,
            dataLabels: {
                enabled: !this.hasPrecipitationError,
                filter: {
                    operator: '>',
                    property: 'y',
                    value: 0
                },
                style: {
                    fontSize: '8px',
                    color: 'gray'
                }
            },
            tooltip: {
                valueSuffix: ' mm'
            }
        }, {
            name: 'Air pressure',
            color: Highcharts.getOptions().colors[2],
            data: this.pressures,
            marker: {
                enabled: false
            },
            shadow: false,
            tooltip: {
                valueSuffix: ' hPa'
            },
            dashStyle: 'shortdot',
            yAxis: 2
        }, {
            name: 'Wind',
            type: 'windbarb',
            id: 'windbarbs',
            color: Highcharts.getOptions().colors[1],
            lineWidth: 1.5,
            data: this.winds,
            vectorLength: 18,
            yOffset: -15,
            tooltip: {
                valueSuffix: ' m/s'
            }
        }]
    };
};

/**
 * Post-process the chart from the callback function, the second argument
 * Highcharts.Chart.
 */
Meteogram.prototype.onChartLoad = function (chart) {

    this.drawBlocksForWindArrows(chart);

};

/**
 * Create the chart. This function is called async when the data file is loaded
 * and parsed.
 */
Meteogram.prototype.createChart = function () {
    this.chart = new Highcharts.Chart(this.getChartOptions(), chart => {
        this.onChartLoad(chart);
    });
};



/**
 * Handle the data. This part of the code is not Highcharts specific, but deals
 * with yr.no's specific data format
 */
Meteogram.prototype.parseYrData = function () {

    let pointStart;

    if (!this.json) {
        return this.error();
    }

    // Loop over hourly (or 6-hourly) forecasts
    this.json.forEach((node, i) => {
        console.log(node)
        const x = Date.parse(node.time),
            nextHours = node.next_1_hours || node.next_6_hours,
            to = node.next_1_hours ? x + 36e5 : x + 6 * 36e5;

        if (to > pointStart + 24 *5 * 36e5) {
            return;
        }

        // Populate the parallel arrays

        this.temperatures.push({
            x,
            y: node.temperature,
            // custom options used in the tooltip formatter
            to,
                  });

        this.humidity.push({
            x,
            y: node.humidity
        });

        if (i % 2 === 0) {
            this.winds.push({
                x,
                value: node.windSpeed,
                direction: node.windDirection
            });
        }

        this.pressures.push({
            x,
            y: node.pressureSeaLevel
        });

        if (i === 0) {
            pointStart = (x + to) / 2;
        }
    });

    // Create the chart when the data is loaded
    this.createChart();
};
// End of the Meteogram protype


// On DOM ready...

// Set the hash to the yr.no URL we want to parse
    location.hash = `/getChart?data=${data}`;


const url = location.hash.substr(1);
Highcharts.ajax({
    url,
    dataType: 'json',
    success: json => {
        window.meteogram = new Meteogram(json, 'charts2');
    },
    error: Meteogram.prototype.error,
    headers: {
        // Override the Content-Type to avoid preflight problems with CORS
        // in the Highcharts demos
        'Content-Type': 'text/plain'
    }
});

}
