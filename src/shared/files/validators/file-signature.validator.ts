import { FileValidator } from '@nestjs/common/pipes/file/file-validator.interface';
import magicBytes from 'magic-bytes.js';

export class FileSignatureValidator extends FileValidator {
  constructor(private readonly allowedSignatures: string[]) {
    super({});
  }

  isValid(file: Express.Multer.File): boolean {
    const fileSignatures = magicBytes(file.buffer).map((file) => file.mime);
    if (!fileSignatures.length) return false;

    return this.allowedSignatures.some(signature => fileSignatures.includes(signature));
  }

  buildErrorMessage(): string {
    return `File signature is not allowed. Allowed signatures: ${this.allowedSignatures.join(', ')}`;
  }
}
