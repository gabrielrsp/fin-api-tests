import 'reflect-metadata';
import { InMemoryStatementsRepository } from '../../repositories/in-memory/InMemoryStatementsRepository'

import { GetStatementOperationUseCase } from './GetStatementOperationUseCase'
import { CreateStatementUseCase } from '../createStatement/CreateStatementUseCase'
import { InMemoryUsersRepository } from '../../../users/repositories/in-memory/InMemoryUsersRepository'
import { OperationType } from '@modules/statements/entities/Statement'


let getStatementOperationUseCase: GetStatementOperationUseCase
let createStatementUseCase: CreateStatementUseCase
let inMemoryStatementsRepository: InMemoryStatementsRepository
let inMemoryUsersRepository: InMemoryUsersRepository
let user

describe("Get Statement", () => {

  beforeAll(async () => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    user = await inMemoryUsersRepository.create({
      name: 'test',
      email: 'test@test.com',
      password: 'test'
    })

  })

  beforeEach(async () => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository)
    getStatementOperationUseCase = new GetStatementOperationUseCase(inMemoryUsersRepository, inMemoryStatementsRepository)
  })

  it("should be able to get an specific statement", async () => {
    const newStatement = await createStatementUseCase.execute({
      user_id: user.id,
      type: OperationType.DEPOSIT,
      amount: 10,
      description: 'deposit test 10 bucks'
    })

    const result = await getStatementOperationUseCase.execute({
      user_id: user.id,
      statement_id: newStatement.id
    })

    expect(result).toHaveProperty("id");
    expect(result.type).toEqual("deposit")
    expect(result.amount).toEqual(10)

  });


});





