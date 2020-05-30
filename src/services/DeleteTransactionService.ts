import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';
import TransactionRepository from '../repositories/TransactionsRepository';

interface Request {
  id: string;
}
class DeleteTransactionService {
  public async execute({ id }: Request): Promise<void> {
    const transactionRepository = getCustomRepository(TransactionRepository);

    const transactionExists = await transactionRepository.findOne({
      where: { id },
    });

    if (!transactionExists) {
      throw new AppError('Transaction does not exist.');
    }

    await transactionRepository.remove(transactionExists);
  }
}

export default DeleteTransactionService;
