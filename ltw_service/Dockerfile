# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/go/dockerfile-reference/

# Want to help us make this template better? Share your feedback here: https://forms.gle/ybq9Krt8jtBL3iCk7

ARG NODE_VERSION=22.7.0

################################################################################
# Use node image for base image for all stages.
FROM node:${NODE_VERSION}-alpine as base

# Set working directory for all build stages.
WORKDIR /usr/src/app

# Deps to support multiple architectures (x86_64/arm64)
RUN apk add --no-cache python3 make g++

################################################################################
# Create a stage for building the SDK
FROM base as sdk-build

# Copy and build SDK
COPY sdk ./sdk
WORKDIR /usr/src/app/sdk
RUN npm ci && npm run build

################################################################################

# Create a stage for installing production dependecies.
FROM base as deps

# Copy built SDK from sdk-build stage
COPY --from=sdk-build /usr/src/app/sdk ../sdk

# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /root/.npm to speed up subsequent builds.
# Leverage bind mounts to package.json and package-lock.json to avoid having to copy them
# into this layer.
RUN --mount=type=bind,source=ltw_service/package.json,target=package.json \
  --mount=type=bind,source=ltw_service/package-lock.json,target=package-lock.json \
  --mount=type=cache,target=/root/.npm \
  npm ci --omit=dev

################################################################################
# Create a stage for building the application.
FROM deps as build

# Copy built SDK from sdk-build stage
COPY --from=sdk-build /usr/src/app/sdk ../sdk

# Download additional development dependencies before building, as some projects require
# "devDependencies" to be installed to build. If you don't need this, remove this step.
RUN --mount=type=bind,source=ltw_service/package.json,target=package.json \
  --mount=type=bind,source=ltw_service/package-lock.json,target=package-lock.json \
  --mount=type=cache,target=/root/.npm \
  npm ci

# Copy the rest of the source files into the image.
COPY ltw_service .
# Run the build script.
RUN pwd
RUN npm run build

################################################################################
# Create a new stage to run the application with minimal runtime dependencies
# where the necessary files are copied from the build stage.
FROM base as final

# Use production node environment by default.
ENV NODE_ENV production

# Run the application as a non-root user.
USER node

# Copy package.json so that package manager commands can be used.
COPY ltw_service/package.json .

# Copy the production dependencies from the deps stage and also
# the built application from the build stage into the image.
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist

# Copy built SDK for runtime
COPY --from=sdk-build --chown=node:node /usr/src/app/sdk ../sdk

# Expose the port that the application listens on.
EXPOSE 3000

# Run the application.
CMD npm start
