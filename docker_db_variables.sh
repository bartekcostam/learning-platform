#!/bin/bash

# Variables
DB_USER="username"
DB_PASS="password"

# Create .env file
echo "DB_USER=$DB_USER" > .env
echo "DB_PASS=$DB_PASS" >> .env
