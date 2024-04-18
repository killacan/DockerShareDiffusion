# # Use an official Node runtime as the parent image
# FROM node:21-alpine

# # Set the working directory in the container to /app
# WORKDIR /app

# # Copy package.json and package-lock.json to the working directory
# COPY package*.json ./

# # Install any needed packages specified in package.json
# RUN npm install


# # Make port 3000 available to the world outside this container
# EXPOSE 3000

# WORKDIR /app


# # Bundle app source inside the Docker image
# COPY . .
# CMD ["npm", "run", "start"]

FROM node:21-alpine as base
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm install

FROM deps AS builder
WORKDIR /app

COPY . .
RUN npm run build

FROM deps AS prod-deps
WORKDIR /app
RUN npm i --production

FROM base as runner
WORKDIR /app 

RUN addgroup --system --gid 1001 remix
RUN adduser --system --uid 1001 remix
USER remix

COPY --from=prod-deps --chown=remix:remix /app/package*.json ./
COPY --from=prod-deps --chown=remix:remix /app/node_modules ./node_modules
COPY --from=builder --chown=remix:remix /app/build ./build
COPY --from=builder --chown=remix:remix /app/public ./public

EXPOSE 3000

CMD ["npm", "run", "start"]