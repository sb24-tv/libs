import { Body, Controller, Get, Post,Put } from "../../../src";

import { Service } from "../../app";
import { Inject } from "../../../src";
import { UserDto } from "./dto/user-dto";

@Controller('/role')
export class RoleController {
    
    @Inject()
    private service: Service;
    
    @Get()
    get() {
        return 'ddd'
    }
    
    @Post()
     create(@Body() body: UserDto) {
        return  this.service.create();
    }
    
    @Put()
    update(@Body() body: UserDto) {
        return this.service.update(body);
    }
}


