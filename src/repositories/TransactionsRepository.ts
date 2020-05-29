import { EntityRepository, Repository, getRepository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface Response {
  Transaction: Transaction[];
  Balance: Balance;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Response> {
    const transactions = getRepository(Transaction);

    const allTransactions = await transactions.find();

    const balance = allTransactions.reduce(
      ({ income, outcome }, transaction) => {
        switch (transaction.type) {
          case 'income':
            income += transaction.value;
            break;

          case 'outcome':
            outcome += transaction.value;
            break;
          default:
            break;
        }

        const total = income - outcome;

        return { income, outcome, total };
      },
      {
        income: 0,
        outcome: 0,
        total: 0,
      },
    );

    return { allTransactions, balance };
  }
}

export default TransactionsRepository;
