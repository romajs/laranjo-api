FROM node:6.14.2-alpine

WORKDIR /app

EXPOSE 8000

CMD ["npm", "run", "start-dev"]