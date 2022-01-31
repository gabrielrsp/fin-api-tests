import { InMemoryStatementsRepository } from '../../repositories/in-memory/InMemoryStatementsRepository'

import { AppError } from '../../../../shared/errors/AppError'

import { CreateStatementUseCase } from './CreateStatementUseCase'
import { CreateStatementError } from './CreateStatementError'
import { InMemoryUsersRepository } from '../../../users/repositories/in-memory/InMemoryUsersRepository'
import { OperationType } from '@modules/statements/entities/Statement'



let createStatementUseCase: CreateStatementUseCase
let inMemoryStatementsRepository: InMemoryStatementsRepository
let inMemoryUsersRepository: InMemoryUsersRepository
let user

describe("Create Statement", () => {

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
  })

  it("should be able to create a new statement of type deposit", async () => {
    const statement = await createStatementUseCase.execute({
      user_id: user.id,
      type: OperationType.DEPOSIT,
      amount: 10,
      description: 'deposit test 10 bucks'
    })

    expect(statement).toHaveProperty("id");
    expect(statement.type).toEqual("deposit")

  });

  it("should be able to create a new statement of type withdraw", async () => {
    await createStatementUseCase.execute({
      user_id: user.id,
      type: OperationType.DEPOSIT,
      amount: 10,
      description: 'deposit test 10 bucks'
    })

    const statement = await createStatementUseCase.execute({
      user_id: user.id,
      type: OperationType.WITHDRAW,
      amount: 10,
      description: 'withdraw test 10 bucks'
    })

    expect(statement).toHaveProperty("id");
    expect(statement.type).toEqual("withdraw")

  });


  it("should not be able to create a new statement of type withdraw if there is insufficient funds", async () => {
    expect(async () => {
      await createStatementUseCase.execute({
        user_id: user.id,
        type: OperationType.WITHDRAW,
        amount: 10,
        description: 'withdraw test 10 bucks'
      })

    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  });

});





