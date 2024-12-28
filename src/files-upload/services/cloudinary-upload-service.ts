import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';
import { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';

@Injectable()
export class CloudinaryUploadService {
    constructor(private readonly configService: ConfigService) {
        cloudinary.config({
            cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
            api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
            api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
        });
    }

    async uploadImage(file: Express.Multer.File): Promise<UploadApiResponse | UploadApiErrorResponse> {
        return new Promise((resolve, reject) => {
            interface UploadStreamResult extends UploadApiResponse {}
            interface UploadStreamError extends UploadApiErrorResponse {}

            cloudinary.uploader.upload_stream({ resource_type: 'image' }, (error: UploadStreamError, result: UploadStreamResult) => {
                if (error) return reject(error);
                resolve(result);
            }).end(file.buffer);
        });
    }

    async deleteImage(publicId: string): Promise<UploadApiResponse | UploadApiErrorResponse> {
        return new Promise((resolve, reject) => {
            interface UploadStreamResult extends UploadApiResponse {}
            interface UploadStreamError extends UploadApiErrorResponse { }
            
            cloudinary.uploader.destroy(publicId, (error: UploadStreamError, result: UploadStreamResult) => {
                if (error) return reject(error);
                resolve(result);
            });
        });
    }
}