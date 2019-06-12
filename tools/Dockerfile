ARG NODE_BASEIMAGE=docker.dbc.dk/node10:latest
# ---- Base Node ----
FROM $NODE_BASEIMAGE AS build

# set working directory
WORKDIR /home/node/app

# copy project file
COPY . ./tools

# install node packages
RUN npm set progress=false && npm config set depth 0 && \
    cd tools && \
    npm install && \
    cd .. && \
    touch /home/node/app/current.env && \
    mkdir -p ./src/data
