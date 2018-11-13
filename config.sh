#!/bin/bash
SUBNET="192.168."

# Outside Portconfiguration
OUTSIDE_PORT_RUN_WEBSERVER=8000
OUTSIDE_PORT_RUN_CLIENT=3001

#Internal IP-configuration
INTERNAL_MYSQL_IP="$SUBNET"12.2
INTERNAL_BUILD_CLIENT_IP="$SUBNET"12.6
INTERNAL_WEBSERVER_IP="$SUBNET"12.5
INTERNAL_RUN_CLIENT_IP="$SUBNET"12.7
INTERNAL_MEMCACHE_IP="$SUBNET"12.3
INTERNAL_SYNC_IP="$SUBNET"12.4

#Internal Portconfiguration (should only be changed when code was changed suitable)
INTERNAL_PORT_RUN_CLIENT=3001
INTERNAL_PORT_WEBSERVER=8000

# Change TimeZone
TZ=Europe/Zurich

NODE_ENV=production

SERVER_PROTOCOL=https
SERVER_ADDRESS=""
SERVER_PORT=${OUTSIDE_PORT_WEBSERVER}

DATABASE_PATH="/opt/cas-mysql-db"
DATABASE_USERNAME=theca-user
DATABASE_PASSWORD=6rNhNAPY7yXf
MYSQL_DATABASE=theca
DATABASE_URL="mysql://${INTERNAL_MYSQL_IP}:3306/${MYSQL_DATABASE}?useUnicode=true&useJDBCCompliantTimezoneShift=true&useLegacyDatetimeCode=false&serverTimezone=UTC&verifyServerCertificate=false&useSSL=true"
MYSQL_ROOT_PASSWORD="8drRNG8RWw9FjzeJuavbY6f9"
