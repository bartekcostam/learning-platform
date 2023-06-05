FROM node:18.16.0
ENV NODE_ENV=production

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install

COPY . .

# Copy .env file into Docker container
COPY .env ./

EXPOSE 3000

CMD [ "npm", "start"]
