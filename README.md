# ![NestJS](project-logo.png)

> ### NestJS + MikroORM codebase containing real world examples (CRUD, auth, advanced patterns, etc) that translate the [RealWorld](https://github.com/gothinkster/realworld-example-apps) API spec to GraphQL.

> Rewrite of https://github.com/mikro-orm/nestjs-realworld-example-app to GraphQL.

---

# Getting started

## Installation

Install dependencies

    npm i

Copy config file and set JsonWebToken secret key

    cp src/config.ts.example src/config.ts

---

## Database

The example codebase uses [MikroORM](https://mikro-orm.io/) with a PostgreSQL database.

Copy MikroORM config example file for database settings and adjust the connection settings.

    cp src/mikro-orm.config.ts.example src/mikro-orm.config.ts

Start local PostgreSQL server and create a new database called `nestjsrealworld` (or the name you specified in the config file).

    docker run --name nestjsrealworld \
      -e POSTGRES_PASSWORD=postgres \
      -e POSTGRES_DB=nestjsrealworld \
      -p 5432:5432 \
      postgres:12-alpine

Create database schema:

    npx mikro-orm schema:create --run

Now you can start the application with `npm start:dev`

---

## NPM scripts

- `npm start` - Start application
- `npm run start:watch` - Start application in watch mode
- `npm test` - run Jest test runner
- `npm run start:prod` - Build application

---

## API Specification

This application adheres to the api specifications set by the [Thinkster](https://github.com/gothinkster) team. This helps mix and match any backend with any other frontend without conflicts.

> [Full API Spec](https://github.com/gothinkster/realworld/tree/master/api)

More information regarding the project can be found here https://github.com/gothinkster/realworld

---

## Start application

- `npm start:dev`
- Test api in the GraphQL Playground by browsing to `http://localhost:8000/graphql`. Example query:

  ```
  query root {
    root
  }
  ```

- View automatically generated GraphQL schema in the `./schema.gql` file or the API docs in the GraphQL Playground at `http://localhost:8000/graphql`
- [TODO] Run e2e tests from the `gothinkster/realworld` repository with `yarn test:e2e`

---

# Authentication

This applications uses JSON Web Token (JWT) to handle authentication. The token is passed with each request using the `Authorization` header with `Token` scheme. The JWT authentication middleware handles the validation and authentication of the token.

The applications follows an approach based on [this article](https://hasura.io/blog/best-practices-of-using-jwt-with-graphql/). This mechanism uses a short-lived `access token` that a front-end client can use to make request and a longer-lived `refresh token` to refresh the access token. The refresh token is sent to the client in a http-only cookie, meaning the client has no way to access it from JavaScript.

All authentication is provided on the `/auth` route, outside of GraphQL. This allows the server to limit the cookie path to just the `/auth` route, which will mean it will not be sent with every `/graphql` request, keeping those as light as possible.

A POST request to `/auth` with `email` and `password` properties in a JSON body will provide an access token (as a JWT) and will also set the refresh token in the secure http-only, same-site=strict cookie. The client should store the access token __in memory__ and include it in every future GraphQL request, until it expires.

To refresh the access token the client can sent a POST request to `/auth/refresh` - no body is required, since there will already be a refresh token included in the request (in a cookie).

Signing out can be achieved by sending a POST request to `/auth/sign-out` which will clear the refresh token cookie.

Manually forcing a sign-out on all devices for a specific user can be handled through `/auth/force-sign-out`. Note that this will only invalidate previously generatated __refresh tokens__ for this user. Currently valid access tokens will remain valid for their (relatively short) lifetime.

This approach does not require a stateful mechanism to (in)validate tokens without loosing a means to ban users after their short-lived access token expires. If immediate bans are a requirement, token based auth is probably not be the right tool for that job.

## Example queries and mutations

Example queries are provided as an [Insomnia Git Sync](https://support.insomnia.rest/article/193-git-sync) here: https://github.com/briandiephuis/nestjs-realworld-example-app-insomnia

⚠️ Don't forget to set the environment to `Localhost`

Authentication is handled through [chaining of request](https://support.insomnia.rest/article/175-chaining-requests) using the `Sign In` call, parsed as a `Response => Body Attribute`. See the `Bearer` tab of the `Me` query for an example.
