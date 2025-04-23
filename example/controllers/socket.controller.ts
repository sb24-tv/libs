import {
	SocketController,
	SocketEventAdapter,
	SocketEvent,
	SocketBody,
	SocketResponse,
	SocketCallBack,
	SocketInstance, Inject, SocketData
} from "../../src";
import { Socket } from "socket.io";
import { UserDto } from "./user/dto/user-dto";
import { Service } from "../app";

@SocketController('/waiter')
export class UserSocketController implements SocketEventAdapter {
	
	constructor(private service: Service) {}
	
	@Inject()
	private serviceV2: Service;
	
    @SocketEvent('confirm')
    handleConfirm(
		@SocketBody() data: any,
		@SocketInstance() socket: Socket,
		@SocketResponse() res: SocketCallBack
    ): void {
        console.log('Order received',{data});
	    res({
		    status: 200,
		    data,
	    })
    }

    @SocketEvent('pick')
    handlePickOder(
		@SocketData() data:any,
		@SocketResponse() res: SocketCallBack
    ) {
	    res({
			status: 200,
		    data,
	    })
    }

    onConnect(socket: Socket): void {
        // console.log('dd',this.service.create());
        // console.log('gg',this.serviceV2.create());
    }

    onDisconnect(socket: Socket,reason:string): void {
        console.log('disconnected',socket.id,reason);
    }
   
}
