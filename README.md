# ![NestJS](project-logo.png)

> ### NestJS + MikroORM codebase containing real world examples (CRUD, auth, advanced patterns, etc) that adheres to the [RealWorld](https://github.com/gothinkster/realworld-example-apps) API spec.

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
- Test api in the GraphQL Playground by browsing to `http://localhost:3000/graphql`. Example query:

  ```
  query root {
    root
  }
  ```

- View automatically generated GraphQL schema in the `./schema.gql` file or the API docs in the GraphQL Playground at `http://localhost:3000/graphql`
- Run e2e tests from the `gothinkster/realworld` repository with `yarn test:e2e`

---

# Authentication

This applications uses JSON Web Token (JWT) to handle authentication. The token is passed with each request using the `Authorization` header with `Token` scheme. The JWT authentication middleware handles the validation and authentication of the token.
