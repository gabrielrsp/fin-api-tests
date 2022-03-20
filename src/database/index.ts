import { Connection, createConnection, getConnectionOptions } from "typeorm";

export default async (host = "database"): Promise<Connection> => {
  const defaultOptions = await getConnectionOptions();

  return createConnection(
    Object.assign(defaultOptions, {
      host: process.env.NODE_ENV === "test" ? "localhost" : host,
      database:
        process.env.NODE_ENV === "test"
          ? "fin_api_test"
          : defaultOptions.database,
      driver: "postgres"
    })
  );
};


if (process.env.NODE_ENV !== "test") {
  (async () => await createConnection())();
}


/**
 * Your DATABASE_URL refers to 127.0.0.1, which is the loopback adapter (more here). This means "connect to myself".

When running both applications (without using Docker) on the same host, they are both addressable on the same adapter (also known as localhost).

When running both applications in containers they are not both on localhost as before.
Instead you need to point the web container to the db container's IP address on the docker0 adapter - which docker-compose sets for you.

Change:

127.0.0.1 to CONTAINER_NAME (e.g. db)

 */
