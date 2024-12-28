import {
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { MaxFileCount } from 'src/shared/files/constants/file-count.constants';
import { createParseFilePipe } from 'src/shared/files/files-validation-factory';

type File = Express.Multer.File;

@Controller('files-upload')
export class FilesUploadController {
  constructor() {}

  @Post('/single')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @UploadedFile(createParseFilePipe('2MB', ['jpeg', 'png', 'jpg', 'gpg']))
    file: File,
  ) {
    return file;
  }

  @Post('/multiple')
  @UseInterceptors(FilesInterceptor('files', MaxFileCount.PRODUCTS_IMAGES))
  uploadMultipleFiles(
    @UploadedFiles(createParseFilePipe('2KB', ['jpeg']))
    files: File[],
  ) {
    return files;
  }
}
