import {SocketController, SocketEventAdapter, SocketEvent} from "../../src";
import {Socket} from "socket.io";

// @SocketController('/waiter')
// export class UserSocketController implements SocketEventAdapter {
//     @SocketEvent('confirm')
//     handleConfirm(data: string,socket: Socket): void {
//         console.log('Order received',{data});
//         socket.emit('cook',data);
//     }
//
//     @SocketEvent('pick')
//     handlePickOder(data: string) {
//         console.log('pick food',data);
//     }
//
//     onConnect(socket: Socket): void {
//         console.log('Root client connected',socket.id);
//     }
//
//     onDisconnect(socket: Socket,reason:string): void {
//         console.log('disconnected',socket.id,reason);
//     }
//     setBusinessId(){
//         return new Promise<string>((resolve, reject) => {
//             // Database call to get business id
//             resolve('123');
//         })
//     }
// }

@SocketController('/chef')
export class ChetSocketController implements SocketEventAdapter {

    onConnect(socket: Socket): void {
        console.log('chef New client connected',socket.id);
    }

    onDisconnect(socket: Socket,reason: string): void {
        console.log('chef disconnected',socket.id,reason);
    }

    @SocketEvent('cook')
    handleCook(args: any,socket: Socket): void {
        const [data,res] = args;
        console.log('let',{data});
        res({ status: "OK", receivedData: data });
    }

    @SocketEvent('done')
    handleDone(data: string,socket: Socket): void {
        // socket.emit('pick',data)
    }
}