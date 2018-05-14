FROM node:6.14.2-alpine

WORKDIR /app

ENV CLOUDINARY_UPLOAD_PREFIX="https://cloudinary:9443"
ENV CLOUDINARY_URL="cloudinary://api_key:api_secret@laranjo-api"
ENV BASE_ROUTE="/"
ENV HOST="0.0.0.0"
ENV MONGODB_URI="mongodb://mongodb:27017/laranjo-api"
ENV NODE_TLS_REJECT_UNAUTHORIZED="0"
ENV PORT="8000"
ENV WINSTON_LOGGER_LEVEL="silly"

EXPOSE 8000

CMD ["npm", "run", "start-dev"]