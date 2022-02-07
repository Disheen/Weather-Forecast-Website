# Copyright 2018 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

# [START gae_python38_app]
# [START gae_python3_app]
from flask import Flask
from flask import render_template
from flask import request
import requests
import json

# If `entrypoint` is not defined in app.yaml, App Engine will look for an app
# called `app` in `main.py`.
app = Flask(__name__, template_folder='template')
app.static_folder = 'static'


@app.route('/')
def index():
    """Return a friendly HTTP greeting."""
    # return 'Hello'
    print('hello')
    return render_template('weather.html')


@app.route('/getForecast',methods=['GET'])
def getForecast():
    print('Submit')
    data=request.args.get('data')
   
    url = "https://api.tomorrow.io/v4/timelines"
    querystring = {"location":data , "fields": ["temperature","temperatureApparent","temperatureMin","temperatureMax","windSpeed","windDirection","humidity","pressureSeaLevel","uvIndex","weatherCode","precipitationProbability","precipitationType","sunriseTime","sunsetTime","visibility","moonPhase","cloudCover"],
               "timesteps": ["1h","1d"], "units": "imperial", "apikey": "JdMdsrhutuHLnWOaoZnX6j73JAdxst0t"}
    response = requests.request("GET", url,params=querystring)
    return response.text

@app.route('/getdailyChart',methods=['GET'])
def getdailyChart():
    print('chartsss')
    data=request.args.get('data')
    print(data)
    return data

@app.route('/getdailyChart2',methods=['GET'])
def getdailyChart2():
    print('chartsss')
    data=request.args.get('data')
    url = "https://api.tomorrow.io/v4/timelines"
    querystring = {"location":data , "fields": ["temperature","temperatureApparent","temperatureMin","temperatureMax","windSpeed","windDirection","humidity","pressureSeaLevel","uvIndex","weatherCode","precipitationProbability","precipitationType","sunriseTime","sunsetTime","visibility","moonPhase","cloudCover"],
               "timesteps": ["1h","1d"], "units": "imperial", "apikey": "JdMdsrhutuHLnWOaoZnX6j73JAdxst0t"}
    response = requests.request("GET", url,params=querystring)
    response = json.loads(response.text)
    print(response)
    res2 = response["data"]["timelines"][0]["intervals"]
    res=[]
    print(response)
    for  i in range(len(res2)):
                    res.append({
                        "time": res2[i]['startTime'], 
                        "temperature": res2[i]['values']['temperature'],
                        "windSpeed": res2[i]['values']['windSpeed'],
                        "windDirection": res2[i]['values']['windDirection'],
                        "humidity": res2[i]['values']['humidity'],
                        "pressureSeaLevel": res2[i]['values']['pressureSeaLevel'],
                        "cloudCover": res2[i]['values']['cloudCover'],
                        "precipitationProbability": res2[i]['values']['precipitationProbability']
                    
                    })
    res_data=json.dumps(res)
    print('res_data')
    print(res_data)

    return res_data

if __name__ == '__main__':
    # This is used when running locally only. When deploying to Google App
    # Engine, a webserver process such as Gunicorn will serve the app. This
    # can be configured by adding an `entrypoint` to app.yaml.
    app.run(host='127.0.0.1', port=8080, debug=True)
# [END gae_python3_app]
# [END gae_python38_app]
