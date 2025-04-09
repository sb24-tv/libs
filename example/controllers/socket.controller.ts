import {
	SocketController,
	SocketEventAdapter,
	SocketEvent,
	SocketData,
	SocketResponse,
	SocketCallBack,
	SocketInstance
} from "../../src";
import {Socket} from "socket.io";
import {UserDto} from "./user/dto/user-dto";

@SocketController('/waiter')
export class UserSocketController implements SocketEventAdapter {
    @SocketEvent('confirm')
    handleConfirm(@SocketData() data: UserDto,@SocketInstance() socket: Socket): void {
        console.log('Order received',{data});
        socket.emit('cook',data);
    }

    @SocketEvent('pick')
    handlePickOder(
		@SocketData() data: UserDto,
		@SocketResponse() res: SocketCallBack) {
        console.log('pick food',data);
	    res({
			status: 200,
		    data,
	    })
    }

    onConnect(socket: Socket): void {
        console.log('Root client connected',socket.id);
    }

    onDisconnect(socket: Socket,reason:string): void {
        console.log('disconnected',socket.id,reason);
    }
   
}
