import { io } from 'socket.io-client';

const socket = io('localhost:3001', { autoConnect: false });

socket.onAny((event, ...args) => {
    console.log(event, args);
});

socket.on('connect_error', (err) => {
    setTimeout(() => {
        socket.connect();
    }, 1000);
});

export default socket;
