import { Controller, FileUpload, Post } from "../../../src";
import { Service } from "../../app";
import { Inject } from "../../../src";
import { S3Client } from '@aws-sdk/client-s3';
import dotenv from "dotenv"
import multerS3 from 'multer-s3';
// Configure AWS SDK
dotenv.config();

// const storage = multer.diskStorage({
//     destination: (_req, _file, cb) => {
//         cb(null, "uploads/"); // Directory where files will be stored
//     },
//     filename: (_req, file, cb) => {
//         cb(null, `${Date.now()}-${file.originalname}`); // Rename file to avoid conflicts
//     }
// });

const s3 = new S3Client([{
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    forcePathStyle: true
    // endpoint: 'http://localhost:3100'
}])

const storage = multerS3({
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: 'public-read-write',
    s3,
    bucket: process.env.AWS_S3_BUCKET as string,
    metadata: function (req, file, cb) {
        console.log(file)
        cb(null, {fieldName: file.fieldname});
    },
    key: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
})



@Controller('/upload')
export class UploadController {
    
    @Inject()
    private service: Service;
    
    @Post()
    upload(@FileUpload({
        keyField: [
            {
                name: 'file1',
                maxCount: 10
            },
            {
                name: 'file2',
                maxCount: 10
            }
        ],
        type: 'fields',
        limits: {
            fileSize: 1000000
        },
        fileFilter: (req, file, cb) => {
            if (!file.originalname.match(/\.(jpg|jpeg|gif|png)$/)) {
                // @ts-ignore
                return cb(new Error('Only image files are allowed!'), false);
            }
            cb(null, true);
        },
        storage
    }) files: any) {
        return files
    }
}