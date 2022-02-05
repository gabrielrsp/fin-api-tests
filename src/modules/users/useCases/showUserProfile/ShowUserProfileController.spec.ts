import request from "supertest";
import { app } from '../../../../app'
import { Connection } from "typeorm"
import createConnection from "../../../../database";
import { hash } from "bcryptjs";
import { v4 as uuid } from 'uuid'

let connection: Connection;
let token
describe("Show user profile", () => {
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

  beforeEach(async () => {
    const responseToken = await request(app).post("/api/v1/sessions")
      .send({
        email: "admin@admin.com",
        password: "admin"
      })
    token = responseToken.body.token

  })

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  })

  it("should be able to show an user profile", async () => {
    const response = await request(app).get("/api/v1/profile").set({
      Authorization: `Bearer ${token}`
    })
    expect(response.body).toHaveProperty('id')
    expect(response.status).toBe(200)
  })
})
