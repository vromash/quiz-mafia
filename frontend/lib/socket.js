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

socket.on('playerJoined', (newUser) => {
    let players = JSON.parse(localStorage.getItem('players'));
    if (!players) players = [];
    players.push(newUser);
    localStorage.setItem('players', JSON.stringify(players));
    window.dispatchEvent(new Event('storage'));
});

export default socket;
