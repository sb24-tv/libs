import {Controller, FileUpload, Post } from "../../../src";

import { Service } from "../../app";
import { Inject } from "../../../src";

@Controller('/upload')
export class UploadController {
    
    @Inject()
    private service: Service;
    
    @Post()
    upload(@FileUpload() files: any) {
        return this.service.create();
    }
}


