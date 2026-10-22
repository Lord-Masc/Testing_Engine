import { createClient } from "redis";
import { env } from "../config/env";

export const redisClient = createClient({
    url:env.redisUrl,
    socket:{
        connectTimeout:3000,
        reconnectStrategy:(retries)=>
             Math.min(retries * 200, 3000)
    }
}) 

redisClient.on('error',(error)=>{
    console.log('Redis client error:', error.message); 
})

 export async function chekRedis() {
    if(!redisClient.isReady()){
        throw new Error('Redis client is not ready');
    }
    await redisClient.ping();
}
