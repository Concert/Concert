#!/bin/bash

url_base="http://localhost:8000";
api_url="/api/1/audiosegment/";

session_id="3506d482e10efb275777e2aae4f92fd4";
json_data='{"collection":"/api/1/collection/1/","name":"newest_audio_segment","creator":"/api/1/user/1/","beginning":"1","end":"2","audioFile":"/api/1/audiofile/1/"}';


curl "$url_base$api_url" -H "Content-Type:application/json" -X 'POST' --data-binary $json_data -b "sessionid=$session_id" > adams_temp.html;

#
chromium-browser adams_temp.html;