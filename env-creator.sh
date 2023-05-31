#!/bin/bash


echo  DB_HOST='"'"$1"'"'>> .env
echo  DB_USER='"'"$2"'"'>> .env
echo  DB_PASS='"'"$3"'"'>>  .env
echo  DB_NAME='"'"$4"'"'>>  .env

cat .env


