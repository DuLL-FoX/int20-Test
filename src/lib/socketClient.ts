import {io, Socket} from 'socket.io-client';

let socket: Socket;

export const initSocketConnection = () => {
    if (!socket) {
        const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001';
        socket = io(backendUrl, {autoConnect: false});
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
    if (socket) {
        console.log('subscribing to bid updates');
        socket.on('bidUpdate', callback);
    }
};

export const unsubscribeFromBidUpdates = () => {
    if (socket) {
        console.log('unsubscribing from bid updates');
        socket.off('bidUpdate');
    }
};

export const subscribeToChatUpdates = (callback: (newMessage: any) => void) => {
    if (socket) {
        console.log('subscribing to chat updates');
        socket.on('newMessage', callback);
    }

}

export const unsubscribeFromChatUpdates = () => {
    if (socket) {
        console.log('unsubscribing from chat updates');
        socket.off('newMessage');
    }
};
