FROM node:6.14.2-alpine

WORKDIR /app

ENV BASE_ROUTE="/"
ENV CLOUDINARY_UPLOAD_PREFIX="https://cloudinary:9443"
ENV CLOUDINARY_URL="cloudinary://api_key:api_secret@laranjo-api"
ENV HOST="0.0.0.0"
ENV LOGGER_LEVEL="silly"
ENV MONGODB_URI="mongodb://mongodb:27017/laranjo-api"
ENV NODE_TLS_REJECT_UNAUTHORIZED="0"
ENV PORT="8000"

EXPOSE 8000

CMD ["npm", "run", "start-dev"]