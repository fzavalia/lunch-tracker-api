FROM node:10-alpine

RUN npm config set unsafe-perm true && \ 
    npm install -g yarn

COPY src src
COPY package.json .
COPY tsconfig.json .
COPY yarn.lock .

RUN yarn && \
    yarn build

HEALTHCHECK --interval=5s --timeout=3s CMD curl --fail http://localhost:8000/health || exit 1

CMD node build/index.js