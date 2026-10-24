import app from "./app"
import { env } from "./config/env"
import { pool } from "./infrastructure/postgres"
import { redisClient } from "./infrastructure/redis"

let server;
let shuttingDown = false;

async function start() {
  // Establish dependency connections before accepting traffic.
  await pool.query('SELECT 1');
  await redisClient.connect();
  await redisClient.ping();

  server = app.listen(env.port, '0.0.0.0', () => {
    console.log(
      `API Testing Engine listening on port ${env.port}`
    );
  });

  server.on('error', (error) => {
    console.error('HTTP server error:', error.message);
    process.exitCode = 1;
  });
}

async function shutdown(signal) {
  if (shuttingDown) return;
  shuttingDown = true;

  console.log(`Received ${signal}; shutting down gracefully`);

  try {
    if (server) {
      await new Promise((resolve, reject) => {
        server.close((error) => {
          if (error) reject(error);
          else resolve();
        });
      });
    }

    if (redisClient.isOpen) {
      await redisClient.quit();
    }

    await pool.end();

    console.log('Shutdown complete');
  } catch (error) {
    console.error('Shutdown error:', error.message);
    process.exitCode = 1;
  }
}

process.on('SIGTERM', () => void shutdown('SIGTERM'));
process.on('SIGINT', () => void shutdown('SIGINT'));

start().catch(async (error) => {
  console.error('Startup failed:', error.message);
  process.exitCode = 1;

  try {
    if (redisClient.isOpen) {
      await redisClient.quit();
    }

    await pool.end();
  } catch (cleanupError) {
    console.error('Startup cleanup failed:', cleanupError.message);
  }
});