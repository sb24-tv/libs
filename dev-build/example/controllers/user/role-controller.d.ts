import { UserDto } from "../../dto/user-dto";
import { Service } from "../../app";
export declare class RoleController {
    private service;
    constructor(service: Service);
    get(): string;
    create(body: UserDto): string;
    update(body: UserDto): string;
}
