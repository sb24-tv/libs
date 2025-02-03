import { Controller, FileUpload, Post } from "../../../src";
import dotenv from "dotenv"
import {
    PutObjectCommand,
    S3Client
} from "@aws-sdk/client-s3";
import multer from "multer";
import path from "path";
import { randomUUID } from "crypto";

// Configure AWS SDK
dotenv.config();



@Controller('/upload')
export class UploadController {
    
    @Post() async upload(@FileUpload({
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
        fileFilter: (_req, file, cb) => {
            if (!file.originalname.match(/\.(jpg|jpeg|gif|png)$/)) {
                // @ts-ignore
                return cb(new Error('Only image files are allowed!'), false);
            }
            cb(null, true);
        },
        storage: multer.memoryStorage(),
    }) file: any) {
        
        const s3 = new S3Client({
            region: process.env.AWS_REGION!,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
            },
            endpoint: process.env.AWS_S3_ENDPOINT!
        });

        const fileExt = path.extname(file.originalname);
        const fileKey = `uploads/${randomUUID()}${fileExt}`;

        const command = new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME!,
            Key: fileKey,
            Body: file.buffer,
            ContentType: file.mimetype,
            ACL: "public-read",
        });

        await s3.send(command);
        s3.destroy()
        return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;
    }
}