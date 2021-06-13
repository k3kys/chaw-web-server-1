import { Request } from 'express';
import aws from 'aws-sdk'
import multer from 'multer'
import multerS3 from 'multer-s3'

aws.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const s3 = new aws.S3();

const storageS3 = multerS3({
    s3,
    bucket: "chaw",
    acl: "public-read",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key(req: Request, file: any, cb: any) {
        cb(null, file.originalname);
    },
});

export const uploadS3 = multer({
    storage: storageS3,
});

