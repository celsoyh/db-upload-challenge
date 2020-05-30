import { getCustomRepository } from 'typeorm';
import csvParse from 'csv-parse';
import fs from 'fs';
import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

class ImportTransactionsService {
  async execute({ path }): Promise<any[]> {
    // const transactionRepository = getCustomRepository(TransactionsRepository);
    // const readCSVStream = fs.createReadStream(path);
    // const parseStream = csvParse({ from_line: 2 });
    // const parseCSV = readCSVStream.pipe(parseStream);
    // const storedTransactions = [];
    // parseCSV.on('data', async line => {
    //   const createdTransaction = transactionRepository.create({
    //     title: line[0],
    //     type: line[1],
    //     value: line[2],
    //     category_id: line[3],
    //   });
    //   storedTransactions.push(createdTransaction);
    // });
    // parseCSV.on('end', () => {
    //   return storedTransactions;
    // });
    // console.log(storedTransactions);
  }
}

export default ImportTransactionsService;
