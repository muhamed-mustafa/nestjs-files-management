import {
  FileTypeValidator,
  FileValidator,
  HttpStatus,
  MaxFileSizeValidator,
  ParseFilePipe,
  UnsupportedMediaTypeException,
} from '@nestjs/common';
import { FileSignatureValidator } from './validators/file-signature.validator';
import { FileSizeType, FileType } from './types/file.types';
import { createFileTypeRegex } from './utils/file.util';
import * as bytes from 'bytes';

const createFileValidator = (
  maxSize: FileSizeType,
  fileType: FileType[],
): FileValidator[] => {
  const fileTypeRegex = createFileTypeRegex(fileType);

  return [
    new MaxFileSizeValidator({
      maxSize: bytes(maxSize),
      message: (maxSize: number) =>
        `File size must be smaller than ${maxSize} bytes`,
    }),

    new FileTypeValidator({
      fileType: fileTypeRegex,
    }),

    new FileSignatureValidator(['image/png', 'image/jpeg', 'image/jpg']),
  ];
};

export const createParseFilePipe = (
  maxSize: FileSizeType,
  fileType: FileType[],
): ParseFilePipe => {
  return new ParseFilePipe({
    validators: createFileValidator(maxSize, fileType),

    errorHttpStatusCode: HttpStatus.UNSUPPORTED_MEDIA_TYPE,
    exceptionFactory: (error: string) => {
      console.log('Error: ', error);
      throw new UnsupportedMediaTypeException(error);
    },

    fileIsRequired: true,
  });
};
