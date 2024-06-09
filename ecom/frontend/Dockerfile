FROM node:12-alpine as build-deps
# COPY package.json package-lock.json /app
WORKDIR /app
COPY . .
RUN npm --verbose install
RUN npm run build
# EXPOSE 3000
# CMD ["npm", "start"]