import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';
import TransactionRepository from '../repositories/TransactionsRepository';

interface Request {
  id: string;
}
class DeleteTransactionService {
  public async execute({ id }: Request): Promise<Transaction> {
    const transactionRepository = getCustomRepository(TransactionRepository);

    const transactionExists = await transactionRepository.findOne({
      where: { id },
    });

    if (!transactionExists) {
      throw new AppError('Transaction does not exist.');
    }

    const deletedObj = await transactionRepository.remove(transactionExists);

    return deletedObj;
  }
}

export default DeleteTransactionService;
