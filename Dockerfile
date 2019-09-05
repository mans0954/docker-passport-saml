FROM node

COPY app.js app.js

COPY package.json package.json

RUN npm install -q

EXPOSE 3000/tcp

CMD node app.js

