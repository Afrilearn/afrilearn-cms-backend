import fs from 'fs';
import aws from 'aws-sdk';
import Response from './response.utils';

/**
 * Defines helper functions for file upload
 */
export default class FileUpload {
  /**
       * Uploads images and videos
       * @param {*} file
       * @returns {string} uploded file data
       */
  static async uploadFile(file) {
    aws.config.setPromisesDependency();
    aws.config.update({
      secretAccessKey: process.env.S3_ACCESS_SECRET,
      accessKeyId: process.env.S3_ACCESS_KEY,
      region: 'us-east-1',
    });
    const s3 = new aws.S3();
    return new Promise(async (resolve, reject) => {
      const params = {
        ACL: 'public-read',
        Bucket: 'afrilearn',
        Body: fs.createReadStream(file.path),
        Metadata: { fieldName: file.fieldname },
        Key: `test/${Date.now() + file.originalname}`,
      };
      s3.upload(params, (err, data) => {
        if (err) {
          return Response.InternalServerError(res, 'Images could not be uploaded');
        }
        fs.unlinkSync(file.path);
        resolve(data);
      });
    });
  }
}
