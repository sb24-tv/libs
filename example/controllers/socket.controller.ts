import {SocketController, SocketEvents, SocketEvent} from "../../src";
import {Socket} from "socket.io";

@SocketController('/chef')
export class UserSocketController implements SocketEvents {

    onConnect(socket: Socket): void {
        console.log('New client connected',socket.id);
    }

    onDisconnect(socket: Socket,reason:string): void {
        console.log('disconnected',socket.id,reason);
    }

    @SocketEvent('order')
    onOrder(data: string,socket: Socket): void {
        console.log('Order received',{data});
        socket.emit('completed',"completed");
    }

    @SocketEvent('completed')
    completed(data: string) {
        console.log(data);
    }

}