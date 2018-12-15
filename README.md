# laranjo-api

API for Google Hangouts Chat Bot contenplating `@Laranjo` memes.

[![CircleCI](https://img.shields.io/circleci/project/github/romajs/laranjo-api.svg)](https://circleci.com/gh/romajs/laranjo-api)
[![Codecov](https://img.shields.io/codecov/c/github/romajs/laranjo-api.svg)](https://codecov.io/gh/romajs/laranjo-api)

[![dependencies](https://david-dm.org/romajs/laranjo-api.svg)](https://david-dm.org/romajs/laranjo-api)
[![devDependencies](https://david-dm.org/romajs/laranjo-api/dev-status.svg)](https://david-dm.org/romajs/laranjo-api?type=dev)

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com)

[![node](https://img.shields.io/badge/node-6.14.2-yellow.svg)](https://nodejs.org/en/blog/release/v6.14.2/)
[![npm](https://img.shields.io/badge/npm-3.10.10-yellow.svg)](https://github.com/npm/npm/releases/tag/v3.10.10)

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/65a494c6277d4e451080)

## Development

### Requirements

* Node v6
* Docker
* Docker-compose v2

### Stack

* Express
* MongoDB
* Cloudinary (Resurce/Image Upload)

### Test

This project is configurated with **pre-commit** npm module.  
Every commit will trigger the **npm scripts** configurated at ***pre-commit*** section in ***package.json***.  
To avoid this, you can use the `--no-verify` flag when creating a new commit.  

All tests are unitary api level, and done with **mocha** and **sinnon** npm modules.  

```sh
npm run test
```

### Coverage

Coverage is done with **istanbul** npm module.

```sh
npm run test:cover
```

### Lint

Lint is done with **eslint** and **eslint-watch** npm modules.

```sh
npm run lint
```

Can also be done in **watch** mode:


```sh
npm run lint:watch
```

### Configuration

All configuration is done with **convict** npm module.  
Everything can be specified through environment variables. 

### Build

Docker image build for development purpouse (hot reload).

```sh
npm install --dev
docker-compose build
```  

### Run

Bring all stack up and running.

```sh
docker-compose up
```  

Can also be done simply with `npm run start:dev`, but you will need to manage things on your own:
* MongoDB
* Cloudinary
* A lot of environment variables

### Access

```
http://localhost:8000
```

### Update dependencies

```sh
npm install -g npm-check-updates
ncu -u
npm i
```
