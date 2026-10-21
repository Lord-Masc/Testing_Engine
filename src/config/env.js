import "dotenv/config"

function required(name){
    const value = process.env[name];
    
    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`);
    }
    
    return value
}

const port  = Number(process.env.PORT??3000)

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('PORT must be a valid TCP port');
}

export const env = Object.freeze({
    nodeEnv:process.env.NODE_ENV??"development",
    port :port,
    databaseUrl:required("DATABASE_URL"),
    redisUrl:required("REDIS_URL")

})
