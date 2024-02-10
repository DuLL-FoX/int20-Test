import {io, Socket} from 'socket.io-client';

let socket: Socket;

export const initSocketConnection = () => {
    if (!socket) {
        socket = io('http://localhost:3001', {autoConnect: false});
        socket.on('connect', () => console.log('Connected to the server'));
        socket.on('disconnect', () => console.log('Disconnected from the server'));
    }
};

export const connectSocket = () => {
    if (!socket.connected) {
        socket.connect();
    }
};

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
    }
};

export const subscribeToBidUpdates = (callback: (newBid: any) => void) => {
    socket.on('bidUpdate', callback);
};

export const unsubscribeFromBidUpdates = () => {
    socket.off('bidUpdate');
};

export const subscribeToChatUpdates = (callback: (newMessage: any) => void) => {
    socket.on('newMessage', callback);
}

export const unsubscribeFromChatUpdates = () => {
    socket.off('newMessage');
}