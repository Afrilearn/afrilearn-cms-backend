import fs from 'fs';
import aws from 'aws-sdk';

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
        return new Promise(async function(resolve,reject){
          let params = {
            ACL: "public-read",
            Bucket: "afrilearn",
            Body: fs.createReadStream(file.path),
            Metadata: { fieldName: file.fieldname },
            Key: `${Date.now() + file.originalname}`,
          };
          s3.upload(params, (err, data) => {
            if (err) {
              console.log("An error occured");
            }
            fs.unlinkSync(file.path);
            resolve(data);
          });
        })        
    }
}