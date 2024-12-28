import { lookup } from 'mime-types';
import { FileType } from '../types/file.types';

export const createFileTypeRegex = (filesType: FileType[]) => {
  const mediaTypes = filesType.map(lookup).filter(Boolean);
  return new RegExp(mediaTypes.join('|'));
};
