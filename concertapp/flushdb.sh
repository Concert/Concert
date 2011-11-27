#! /usr/bin/env bash

echo "Deleting current database..."

cd /opt/concert/db/

sudo rm database.db
sudo touch database.db
sudo chmod 777 database.db
sudo chown daemon database.db

cd -

./manage.py syncdb

./manage.py migrate
