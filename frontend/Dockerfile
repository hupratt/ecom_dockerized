FROM node:12-alpine as build-stage
# COPY package.json package-lock.json /app
WORKDIR /app
COPY . .
RUN npm --verbose install
RUN npm run build
# EXPOSE 3000
# Stage 2
FROM nginx:1.17.0-alpine
COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build-stage /app/build /usr/share/nginx/html
EXPOSE 80

CMD nginx -g 'daemon off;'
# CMD serve -s build