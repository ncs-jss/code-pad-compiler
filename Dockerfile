FROM node:8

RUN apt-get update -y
RUN echo "deb http://ppa.launchpad.net/webupd8team/java/ubuntu xenial main" | \
   tee /etc/apt/sources.list.d/webupd8team-java.list
RUN echo "deb-src http://ppa.launchpad.net/webupd8team/java/ubuntu xenial main" | \
   tee -a /etc/apt/sources.list.d/webupd8team-java.list
RUN echo oracle-java8-installer shared/accepted-oracle-license-v1-1 select true | debconf-set-selections
RUN  apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys EEA14886
RUN  apt-get update
RUN  apt-get install oracle-java8-installer -y

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json /usr/src/app/

RUN npm install
RUN npm install pm2 -g
# If you are building your code for production
# RUN npm install --only=production

# Bundle app source
COPY . /usr/src/app

EXPOSE 8000
#CMD [ "npm", "start"]
CMD ["pm2-runtime", "--json", "server/pm2.config.js"]
