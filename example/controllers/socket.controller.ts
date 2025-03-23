import {SocketController, SocketEventsAdapter, SocketEvent} from "../../src";
import {Socket} from "socket.io";

@SocketController('/waiter')
export class UserSocketController implements SocketEventsAdapter {
    @SocketEvent('confirm')
    handleConfirm(data: string,socket: Socket): void {
        console.log('Order received',{data});
        socket.emit('cook',data);
    }
    
    @SocketEvent('pick')
    handlePickOder(data: string) {
        console.log('pick food',data);
    }
    
    onConnect(socket: Socket): void {
        console.log('Root client connected',socket.id);
    }

    onDisconnect(socket: Socket,reason:string): void {
        console.log('disconnected',socket.id,reason);
    }
}

@SocketController('/chef')
export class ChetSocketController implements SocketEventsAdapter {
    
    onConnect(socket: Socket): void {
        console.log('chef New client connected',socket.id);
    }
    
    onDisconnect(socket: Socket,reason: string): void {
        console.log('chef disconnected',socket.id,reason);
    }
    
    @SocketEvent('cook')
    handleCook(data: string,socket: Socket): void {
        console.log('let',{data});
    }
    
    @SocketEvent('done')
    handleDone(data: string,socket: Socket): void {
        socket.emit('pick',data)
    }
}