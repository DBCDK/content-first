ARG NODE_BASEIMAGE=docker.dbc.dk/node10:latest
# ---- Base Node ----
FROM  $NODE_BASEIMAGE AS build
# set working directory
WORKDIR /home/node/app
# copy project file
COPY . .

# install node packages
RUN npm set progress=false && npm config set depth 0 && \
    npm install --only=production && \
    npm run postinstall && \
    mkdir prod_build && \
    cp -R --preserve=links node_modules prod_build/node_modules && \
    npm install

# build statics
RUN npm run build && \
    cp -R build prod_build/build && \
    cp -R --preserve=links src prod_build/src && \
    cp -R tools prod_build/tools && \
    cp -R package.json prod_build/package.json

#
# ---- Release ----
FROM $NODE_BASEIMAGE AS release
WORKDIR /home/node/app
COPY --from=build /home/node/app/prod_build ./
RUN chown -R node:node ./
EXPOSE 3000
USER node
CMD node src/server/main.js