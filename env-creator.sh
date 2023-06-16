#!/bin/bash

# Instalacja Node.js i npm
curl -sL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Resetowanie hasła roota MySQL
sudo service mysql stop
sudo mysqld_safe --skip-grant-tables &
sleep 5
mysql -u root -e "FLUSH PRIVILEGES; ALTER USER 'root'@'localhost' IDENTIFIED BY 'password';"
sudo service mysql restart

# Utwórz użytkownika i bazę danych
DB_USER="user"
DB_PASS="password"
DB_NAME="test_db"

mysql -u root -pnew_root_password -e "CREATE USER '${DB_USER}'@'localhost' IDENTIFIED BY '${DB_PASS}';"
mysql -u root -pnew_root_password -e "CREATE DATABASE ${DB_NAME};"
mysql -u root -pnew_root_password -e "GRANT ALL PRIVILEGES ON ${DB_NAME}.* TO '${DB_USER}'@'localhost';"
mysql -u root -pnew_root_password -e "FLUSH PRIVILEGES;"

# Zmień mechanizm uwierzytelniania dla użytkownika
mysql -u root -pnew_root_password -e "ALTER USER '${DB_USER}'@'localhost' IDENTIFIED WITH mysql_native_password BY '${DB_PASS}';"

# Wygeneruj plik .env
echo "DB_HOST=\"localhost\"" > .env
echo "DB_USER=\"${DB_USER}\"" >> .env
echo "DB_PASS=\"${DB_PASS}\"" >> .env
echo "DB_NAME=\"${DB_NAME}\"" >> .env
