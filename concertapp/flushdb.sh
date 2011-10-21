#! /usr/bin/env bash

echo "Deleting current database..."

cd /opt/concert/db/

rm database.db
touch database.db
sudo chmod 777 database.db
sudo chown daemon database.db

cd -

./manage.py syncdb

./manage.py migrate