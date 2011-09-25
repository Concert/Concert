mv initial_data.json initial_data.json.bak
./manage.py syncdb
./manage.py migrate concertapp 0001_initial
./manage.py migrate concertapp.audiofile 0001_initial
./manage.py migrate concertapp.audiosegment 0001_initial
./manage.py migrate concertapp.collection 0001_initial
./manage.py migrate concertapp.event 0001_initial
./manage.py migrate concertapp.tag 0001_initial
./manage.py migrate
mv initial_data.json.bak initial_data.json