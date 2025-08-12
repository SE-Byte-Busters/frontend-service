// utils/socket.ts
import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const connectSocket = (token: string | null): Socket => {
    if (!socket) {
        socket = io('http://localhost:3000', {
            auth: {
                token,
            },
        });
    }

    return socket;
};
