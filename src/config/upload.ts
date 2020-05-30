import { diskStorage } from 'multer';
import crypto from 'crypto';
import path from 'path';

const storageFolder = path.resolve(__dirname, '..', '..', 'tmp');

const multerConfig = {
  fileStorage: storageFolder,
  storage: diskStorage({
    destination: storageFolder,
    filename: (request, file, callback) => {
      const fileHash = crypto.randomBytes(8).toString('hex');
      const fileName = `${fileHash}-${file.originalname}`;

      callback(null, fileName);
    },
  }),
};

export default multerConfig;
