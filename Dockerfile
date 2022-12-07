# I always forget these so here goes:
# docker build -t eu.gcr.io/zk-snarkyjs-oracles/zk-oracle .
# docker run -p 8080:8080 eu.gcr.io/zk-snarkyjs-oracles/zk-oracle
# docker push eu.gcr.io/zk-snarkyjs-oracles/zk-oracle
# gcloud run deploy --image eu.gcr.io/zk-snarkyjs-oracles/zk-oracle


# Build dependencies
FROM node:18.12.1-alpine as dependencies
WORKDIR /app
COPY package.json .
RUN npm i
COPY index.js .
COPY .env .

# Build production image
EXPOSE 8080
CMD npm run start
