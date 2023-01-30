## Development

To bring the application up for development, simply run `docker-compose up` and everything should be running.

You can override the default environment variables by declaring them in a `.env` file at the root of the project.

## Production

Run `docker-compose -f docker-compose.production.yml up`

In a production environment we are assuming that you already have a database, as well as a minio / s3 bucket running somewhere, so the compose file only provides the client and the server.

No default environment variables are provided to avoid unnecessary mistakes in a live deployment. All environment variables need to be explicitly declared in the `.env` file.

## Testing a production build locally

First run `docker-compose -f docker-compose.production-local.yml up`. This will bring up the db and minio server that the production compose file takes for granted. Wait until the bucket has been successfully created, and then you can follow the instructions from the "Production" section.

## Deploying without docker / docker compose

You can simply use our server and client `Dockerfile-production` files in combination with the `docker-compose.production.yml` file as an instruction manual for how to bring the app up.

For the client specifically, we use the `serve` library to bring the app up, but there's no reason why you shouldn't use your favourite server (eg. nginx) to serve the static build.
