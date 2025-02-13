import { Body, ConflictError, Controller, Get, Post, Put } from "../../../src";

import { Service } from "../../app";
import { Inject } from "../../../src";
import { UserDto } from "./dto/user-dto";

@Controller('/role')
export class RoleController {
    
    @Inject()
    private service: Service;
    
    @Get()
    get() {
        
        throw new ConflictError()
        let dd = 0;
        for(let i = 0; i < 10; i++) {
            // do something
            dd += i;
        }
      
        return dd
    }
    
    @Get('/dd')
    getName() {
        let resuly = 0;
        for(let i = 0; i < 10; i++) {
            // do something
            resuly += i;
        }
        return resuly
    }
    
    @Post()
    create(@Body() body: UserDto) {
        return this.service.create();
    }
    
    @Put()
    update(@Body() body: UserDto) {
        return this.service.update(body);
    }
}


