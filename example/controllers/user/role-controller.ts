import { Body, Controller, Get, Post,Put } from "../../../src";
import { UserDto } from "../../dto/user-dto";
import { Service } from "../../app";
import { HttpError } from "../../../src/http-error-exception";


@Controller('/role')
export class RoleController {
    
    constructor(private service: Service) {
    }
    
    @Get()
    get() {
        return 'ddd'
    }
    
    @Post()
    create(@Body() body: UserDto) {
        return this.service.create();
    }
    
    @Put()
    update(@Body() body: UserDto) {
        throw new HttpError("Service update failed", 400);
        return this.service.update(body);
    }
}


