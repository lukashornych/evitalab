FROM node:18.16.1-slim

RUN mkdir -p /usr/src/evitalab
WORKDIR /usr/src/evitalab

COPY . /usr/src/evitalab/
RUN yarn install --freeze-lockfile
RUN yarn build

# todo lho in future i'd like to replace this with a nginx
ENTRYPOINT ["yarn", "preview"]