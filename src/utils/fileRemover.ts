import fs from 'fs';
import path from 'path';

/**
 * Removes a single file or multiple files from the server.
 * @param filePaths - A string or an array of strings representing file paths to remove.
 */
const fileRemover = async (filePaths: string | string[]): Promise<void> => {
  const filesToRemove = Array.isArray(filePaths) ? filePaths : [filePaths];

  for (const filePath of filesToRemove) {
    const absolutePath = path.resolve(filePath); // Resolve to absolute path
    try {
      if (fs.existsSync(absolutePath)) {
        await fs.promises.unlink(absolutePath);
        // console.log(`File removed: ${absolutePath}`);
      } else {
        console.warn(`File not found: ${absolutePath}`);
      }
    } catch (error) {
      console.error(`Error removing file: ${absolutePath}`, error);
    }
  }
};

export default fileRemover;



// ..............................delete image from aws s3...............................
// import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';

// interface S3Config {
//   s3: {
//     region: string;
//     accessKeyId: string;
//     secretAccessKey: string;
//     bucket: string;
//   };
// }

// const config: S3Config = {
//   s3: {
//     region: process.env.REGION || '',
//     accessKeyId: process.env.ACCESS_KEY_ID || '',
//     secretAccessKey: process.env.SECRET_ACCESS_KEY || '',
//     bucket: process.env.BUCKET || '',
//   },
// };

// const s3 = new S3Client({
//   region: config.s3.region,
//   credentials: {
//     accessKeyId: config.s3.accessKeyId,
//     secretAccessKey: config.s3.secretAccessKey,
//   },
// });

// /**
//  * Removes a single file or multiple files from the S3 bucket.
//  * @param fileUrls - A string or array of S3 file URLs to remove.
//  */
// const fileRemover = async (fileUrls: string | string[]): Promise<void> => {
//   const urlsToRemove = Array.isArray(fileUrls) ? fileUrls : [fileUrls];

//   for (const url of urlsToRemove) {
//     try {
//       const fileKey = extractS3KeyFromUrl(url);
//       const deleteParams = {
//         Bucket: config.s3.bucket,
//         Key: fileKey,
//       };
//       const command = new DeleteObjectCommand(deleteParams);
//       await s3.send(command);
//       // console.log(`Deleted from S3: ${fileKey}`);
//     } catch (error) {
//       console.error(`Failed to delete S3 file: ${url}`, error);
//     }
//   }
// };

// /**
//  * Extracts the object key from a full S3 URL.
//  * @param url - Full URL of the S3 object
//  */
// function extractS3KeyFromUrl(url: string): string {
//   const baseUrl = `https://${config.s3.bucket}.s3.${config.s3.region}.amazonaws.com/`;
//   return url.replace(baseUrl, '');
// }

// export default fileRemover;
