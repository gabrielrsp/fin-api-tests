
import { createConnection } from 'typeorm';

process.env.NODE_ENV === "test" ?

  createConnection(
    Object.assign({
      host: "localhost",
      database: "fin_api_test"
    })
  )

  :

  (async () => await createConnection(

  ))();
