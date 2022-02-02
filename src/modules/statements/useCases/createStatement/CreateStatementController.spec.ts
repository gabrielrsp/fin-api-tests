import request from "supertest";
import { app } from '../../../../app'
import { Connection } from "typeorm"
import createConnection from "../../../../database";
import { hash } from "bcryptjs";
import { v4 as uuid } from 'uuid'

let connection: Connection;
describe("Create Statement Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();

    await connection.runMigrations();

    const id = uuid()
    const password = await hash("admin", 8)

    await connection.query(
      `INSERT INTO USERS(
        id, name, email, password, created_at, updated_at )
        values('${id}', 'admin', 'admin@admin.com', '${password}', 'now()', 'now()')
        `
    )
  })

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  })

  it("should be able to create a new statement", async () => {

    const responseToken = await request(app).post("/api/v1/sessions")
      .send({
        email: "admin@admin.com",
        password: "admin"
      })

    const { token } = responseToken.body

    const response = await request(app).post("/api/v1/statements/deposit").send({
      amount: 10,
      description: "depositou 10 pila"
    }).set({
      Authorization: `Bearer ${token}`
    })

    expect(response.status).toBe(201)

  })


})
