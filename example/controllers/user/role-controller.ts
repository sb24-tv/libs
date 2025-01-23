import { Body, Controller, Get, Post } from "@libs/core";
import { UserDto } from "../../dto/user-dto";

@Controller('/role')
export class RoleController {
    
    @Get()
    get() {
        return 'ddd'
    }
    
    @Post()
    create(@Body() body: UserDto) {
        return body;
    }
}


