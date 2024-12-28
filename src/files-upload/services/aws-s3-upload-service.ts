import { Injectable, Logger } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AwsS3UploadService {
  private readonly logger = new Logger(AwsS3UploadService.name);
  private readonly s3: AWS.S3;

  constructor(private readonly configService: ConfigService) {
    this.s3 = new AWS.S3({
      accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY'),
      region: this.configService.get<string>('AWS_REGION'),
    });
  }

  async uploadFile(
    file: Express.Multer.File,
    bucket: string,
  ): Promise<AWS.S3.ManagedUpload.SendData> {
    const params = {
      Bucket: bucket,
      Key: `${Date.now()}-${file.originalname}`,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    try {
      const data = await this.s3.upload(params).promise();
      this.logger.log(`File uploaded successfully. ${data.Location}`);
      return data;
    } catch (error) {
      this.logger.error(`Failed to upload file. ${error.message}`);
      throw error;
    }
  }

  async deleteFile(bucket: string, key: string): Promise<void> {
    const params = {
      Bucket: bucket,
      Key: key,
    };

    try {
      await this.s3.deleteObject(params).promise();
      this.logger.log(`File deleted successfully. ${key}`);
    } catch (error) {
      this.logger.error(`Failed to delete file. ${error.message}`);
      throw error;
    }
  }

  async getFile(bucket: string, key: string): Promise<AWS.S3.GetObjectOutput> {
    const params = {
      Bucket: bucket,
      Key: key,
    };

    try {
      const data = await this.s3.getObject(params).promise();
      this.logger.log(`File retrieved successfully. ${key}`);
      return data;
    } catch (error) {
      this.logger.error(`Failed to retrieve file. ${error.message}`);
      throw error;
    }
  }
}
