#!/bin/bash

############################################################
# common
############################################################
sudo apt-get update -q
sudo apt-get install -q -y vim make htop python-software-properties
sudo apt-get install -q -y python python-dev python-pip


############################################################
# postgres
############################################################
if [ ! -e "/etc/apt/sources.list.d/postgres.list" ] ; then
    sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt/ precise-pgdg main" >> /etc/apt/sources.list.d/postgres.list'
    wget -q -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
    sudo apt-get update -q
fi

sudo apt-get install -q -y postgresql-9.3 postgresql-client-9.3 postgresql-contrib-9.3 libpq-dev

echo "postgres:postgres" | sudo chpasswd
sudo -u postgres -s psql -d template1 -c "ALTER USER postgres WITH PASSWORD 'postgres';"
sudo -su postgres createdb --template=template0 --encoding='UTF-8' --lc-collate='en_US.UTF-8' --lc-ctype='en_US.UTF-8' revision
sudo sh -c 'echo "host    all    all    0.0.0.0/0    md5" >> /etc/postgresql/9.3/main/pg_hba.conf'
sudo sed -i "s/^#listen_addresses = 'localhost'/listen_addresses = '*'/" /etc/postgresql/9.3/main/postgresql.conf
sudo service postgresql restart


############################################################
# redis
############################################################
if [ ! -e "/etc/apt/sources.list.d/redis.list" ] ; then
    sudo sh -c 'echo "deb http://ppa.launchpad.net/chris-lea/redis-server/ubuntu precise main\ndeb-src http://ppa.launchpad.net/chris-lea/redis-server/ubuntu precise main " >> /etc/apt/sources.list.d/redis.list'
    sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-keys C7917B12
    sudo apt-get update -q
fi

sudo apt-get install -q -y redis-server

sudo sed -i 's/^bind 127.0.0.1/#bind 127.0.0.1/g' /etc/redis/redis.conf
sudo service redis-server restart


############################################################
# rabbitmq
############################################################
# if [ ! -e "/etc/apt/sources.list.d/rabbitmq.list" ] ; then
#     sudo sh -c 'echo "deb http://www.rabbitmq.com/debian/ testing main" >> /etc/apt/sources.list.d/rabbitmq.list'
#     wget -q -O - http://www.rabbitmq.com/rabbitmq-signing-key-public.asc | sudo apt-key add -
#     sudo apt-get update -q
# fi

# sudo apt-get install -q -y rabbitmq-server

# sudo rabbitmqctl add_user rabbit rabbit
# sudo rabbitmqctl set_permissions -p / rabbit ".*" ".*" ".*"


############################################################
# Elasticsearch
############################################################
# if [ ! -e "/etc/apt/sources.list.d/elasticsearch.list" ] ; then
#     sudo sh -c 'echo "deb http://packages.elasticsearch.org/elasticsearch/1.1/debian stable main" >> /etc/apt/sources.list.d/elasticsearch.list'
#     wget -q -O - http://packages.elasticsearch.org/GPG-KEY-elasticsearch | sudo apt-key add -
#     sudo apt-get update -q
# fi

# sudo apt-get install -q -y openjdk-7-jre elasticsearch

# sudo update-rc.d elasticsearch defaults 95 10
# sudo service elasticsearch restart


############################################################
# neo4j
############################################################
# if [ ! -e "/etc/apt/sources.list.d/neo4j.list" ] ; then
#     sudo sh -c 'echo "deb http://debian.neo4j.org/repo stable/" >> /etc/apt/sources.list.d/neo4j.list'
#     wget -O - http://debian.neo4j.org/neotechnology.gpg.key| apt-key add -
#     sudo apt-get update -q
# fi

# sudo apt-get install -q -y neo4j
# sudo sed -i "s/^#org.neo4j.server.webserver.address=0.0.0.0/org.neo4j.server.webserver.address=0.0.0.0/" /etc/neo4j/neo4j-server.properties
# sudo service neo4j-service restart


exit
