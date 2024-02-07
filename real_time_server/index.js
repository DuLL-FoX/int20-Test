const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const { createClient } = require('redis');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
    }
});

const redisClient = createClient({ url: 'redis://130.162.253.235:6379' });
const redisSubscriber = redisClient.duplicate();

redisClient.on('connect', () => console.log('Redis client connected'));
redisClient.on('error', (err) => console.log('Redis client error', err));
redisSubscriber.on('error', (err) => console.log('Redis subscriber error', err));

async function setupRedis() {
    try {
        await redisClient.connect();
        await redisSubscriber.connect();

        await redisSubscriber.subscribe('newBidChannel', (message) => {
            const bid = JSON.parse(message);
            io.emit('bidUpdate', bid);
        });
    } catch (error) {
        console.error(`Failed to setup Redis: ${error}`);
    }
}

setupRedis().catch(console.error);

io.on('connection', (socket) => {
    console.log('a user connected');
});

server.listen(3001, () => {
    console.log('Socket.IO server running at http://localhost:3001');
});