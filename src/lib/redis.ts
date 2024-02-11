import {createClient, RedisClientType} from 'redis';

let redisClient: RedisClientType | null = null;

async function getRedisClient(): Promise<RedisClientType> {
    if (!redisClient) {
        redisClient = createClient({ url: process.env.REDIS_URL || 'redis://130.162.253.235:6379'});
        await redisClient.connect().catch((error) => {
            console.error("Failed to connect to Redis:", error);
            throw error;
        });
    }
    return redisClient;
}

async function publishEvent(channel: string, message: any): Promise<void> {
    try {
        const client = await getRedisClient();
        await client.publish(channel, JSON.stringify(message));
        console.log(`Published event to channel ${channel}`);
    } catch (error) {
        console.error(`Failed to publish event: ${error}`);
    }
}

export {publishEvent};
