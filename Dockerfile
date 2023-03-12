FROM node:14
WORKDIR /usr/src/app
COPY . .
RUN npm install
# RUN useradd -u 8877 laas
# USER laas
CMD ["npm", "run", "start"]