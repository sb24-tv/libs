import { Controller, FileUpload, Post } from "../../../src";
import { Service } from "../../app";
import { Inject } from "../../../src";
import multer from "multer";
const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, "uploads/"); // Directory where files will be stored
    },
    filename: (_req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Rename file to avoid conflicts
    }
});
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