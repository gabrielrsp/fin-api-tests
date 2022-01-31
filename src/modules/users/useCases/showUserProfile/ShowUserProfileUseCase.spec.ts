import 'reflect-metadata';
import { InMemoryUsersRepository } from '../../../users/repositories/in-memory/InMemoryUsersRepository'
import { CreateUserUseCase } from '../createUser/CreateUserUseCase'
import { ShowUserProfileUseCase } from './ShowUserProfileUseCase'

let inMemoryUsersRepository: InMemoryUsersRepository
let createUserUseCase: CreateUserUseCase
let showUserProfileUseCase: ShowUserProfileUseCase

let user

describe("Show Profile", () => {

  beforeAll(async () => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository)

    user = await createUserUseCase.execute({
      name: 'test',
      email: 'test@test.com',
      password: 'test'
    })

  })

  it("should be able to show information from an existing profile", async () => {

    const result = await showUserProfileUseCase.execute(user.id)

    expect(result).toHaveProperty('id')
    expect(result.name).toEqual('test')
    expect(result.email).toEqual('test@test.com')

  });


});





