import { getCustomRepository, getRepository, In } from 'typeorm';
import csvParse from 'csv-parse';
import fs from 'fs';
import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';
import Category from '../models/Category';

interface TransactionArray {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class ImportTransactionsService {
  async execute(path: string): Promise<Transaction[]> {
    const categoriesRepository = getRepository(Category);
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const csvReadStream = fs.createReadStream(path);
    const parseStream = csvParse({
      trim: true,
      from_line: 2,
    });
    const parseCSV = csvReadStream.pipe(parseStream);

    const categories: string[] = [];
    const transactions: TransactionArray[] = [];

    parseCSV.on('data', async readLine => {
      const [title, type, value, category] = readLine;

      if (!title || !type || !value) return;

      categories.push(category);

      transactions.push({
        title,
        type,
        value,
        category,
      });
    });

    await new Promise(resolve => parseCSV.on('end', resolve));

    const nonDuplicatedCategories = Array.from(new Set(categories));

    const existentCategories: Category[] = await categoriesRepository.find({
      where: {
        title: In(nonDuplicatedCategories),
      },
    });

    const existentCategoriesTitles = existentCategories.map(
      category => category.title,
    );

    const categoriesToAdd = nonDuplicatedCategories.filter(
      category => !existentCategoriesTitles.includes(category),
    );

    const newCategories = categoriesRepository.create(
      categoriesToAdd.map(title => ({ title })),
    );

    await categoriesRepository.save(newCategories);

    const allCategories = [...existentCategories, ...newCategories];

    const createdTransactions = transactionsRepository.create(
      transactions.map(transaction => ({
        title: transaction.title,
        type: transaction.type,
        value: transaction.value,
        category: allCategories.find(
          category => category.title === transaction.category,
        ),
      })),
    );

    await transactionsRepository.save(createdTransactions);

    await fs.promises.unlink(path);

    return createdTransactions;
  }
}

export default ImportTransactionsService;
