import 'reflect-metadata';
import { InMemoryStatementsRepository } from '../../repositories/in-memory/InMemoryStatementsRepository'

import { GetBalanceUseCase } from './GetBalanceUseCase'
import { GetBalanceError } from './GetBalanceError'
import { CreateStatementUseCase } from '../createStatement/CreateStatementUseCase'
import { InMemoryUsersRepository } from '../../../users/repositories/in-memory/InMemoryUsersRepository'
import { OperationType } from '@modules/statements/entities/Statement'


let getBalanceUseCase: GetBalanceUseCase
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
    getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementsRepository, inMemoryUsersRepository)
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository)
  })


  it("should be able to show the total balance from all the statements", async () => {
    await createStatementUseCase.execute({
      user_id: user.id,
      type: OperationType.DEPOSIT,
      amount: 20,
      description: 'deposit test 10 bucks'
    })

    await createStatementUseCase.execute({
      user_id: user.id,
      type: OperationType.WITHDRAW,
      amount: 5,
      description: 'withdraw test 10 bucks'
    })


    const result = await getBalanceUseCase.execute({
      user_id: user.id
    })

    expect(result).toHaveProperty("statement")
    expect(result).toHaveProperty("balance")
    expect(result.balance).toEqual(15)


    // expect(statement).toHaveProperty("id");
    // expect(statement.type).toEqual("withdraw")

  });


});





