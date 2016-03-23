# Async Testing Example

This project shows how test async behavior. For this you need a thing, what will run callback. If you use ELK-stack, then you can use logstash for this.

## Requirements

1. [Docker](http://docker.io).
2. [Docker-compose](http://docs.docker.com/compose/install/).
3. Node.js

## Usage

1. Run `npm install`.
2. Run `docker-compose up` in `docker` folder for start environment.
3. Check .env file for correct variables.
4. Run `npm start` for start async system.
5. Run `npm test` for run integration test.

## System description

System check CMS what are used on specific URL. REST API used for add the URL to the queue. Worker listens the queue, checks the URL and write CMS a log.

## Links

* [docker-elk](https://github.com/deviantony/docker-elk)