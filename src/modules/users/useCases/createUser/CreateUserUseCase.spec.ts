import 'reflect-metadata';
import { InMemoryUsersRepository } from '../../../users/repositories/in-memory/InMemoryUsersRepository'
import { CreateUserUseCase } from './CreateUserUseCase'

let inMemoryUsersRepository: InMemoryUsersRepository
let createUserUseCase: CreateUserUseCase

describe("Create user", () => {

  beforeAll(async () => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
  })

  it("should be able to create a new user", async () => {

    const user = await createUserUseCase.execute({
      name: 'test',
      email: 'test@test.com',
      password: 'test'
    })

    expect(user).toHaveProperty('id')

  });


});





