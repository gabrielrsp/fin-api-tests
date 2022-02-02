import 'reflect-metadata';
import { InMemoryUsersRepository } from '../../../users/repositories/in-memory/InMemoryUsersRepository'
import { CreateUserUseCase } from '../createUser/CreateUserUseCase'
import { AuthenticateUserUseCase } from './AuthenticateUserUseCase'

let inMemoryUsersRepository: InMemoryUsersRepository
let createUserUseCase: CreateUserUseCase
let authenticateUserUseCase: AuthenticateUserUseCase

let user

describe("Authenticate user", () => {

  beforeAll(async () => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository)

    user = await createUserUseCase.execute({
      name: 'test',
      email: 'test@test.com',
      password: 'test'
    })

  })

  it("should be able to create a session from user by getting an authentication token", async () => {
    const result = await authenticateUserUseCase.execute({ email: user.email, password: 'test' })
    expect(result).toHaveProperty('token')

  });

});





