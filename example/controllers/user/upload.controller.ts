import {Controller, FileUpload, Post } from "../../../src";

import { Service } from "../../app";
import { Inject } from "../../../src";

@Controller('/upload')
export class UploadController {
    
    @Inject()
    private service: Service;
    
    @Post()
    upload(@FileUpload({
        limits: { fileSize: 1000000 },
        fileFilter: (req, file, cb) => {
            if (!file.originalname.match(/\.(jpg|jpeg|gif)$/)) {
                // @ts-ignore
                return cb(new Error('Only image files are allowed!'), false);
            }
            cb(null, true);
        }
    }) files: any) {
        return this.service.create();
    }
}


