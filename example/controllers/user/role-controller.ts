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
        let dd = 0;
        for(let i = 0; i < 10; i++) {
            // do something
            dd += i;
        }
        console.log("a",dd);
        return dd
    }
    
    @Get('/dd')
    getName() {
        let resuly = 0;
        for(let i = 0; i < 10; i++) {
            // do something
            resuly += i;
        }
        console.log("d",resuly);
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


