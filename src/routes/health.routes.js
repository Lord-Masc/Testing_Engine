import {Router} from "express"
import { checkPostgres } from "../infrastructure/postgres"
import { checkRedis } from "../infrastructure/redis"


const router = Router();

router.get('/live', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'api-testing-engine',
    check: 'liveness'
  });
});

router.get('/ready', async (_req, res) => {
  const checks = {
    postgres: 'unknown',
    redis: 'unknown'
  };

  const results = await Promise.allSettled([
    checkPostgres(),
    checkRedis()
  ]);

  results.forEach((result, index) => {
    const dependency = index === 0 ? 'postgres' : 'redis';
    checks[dependency] =
      result.status === 'fulfilled' ? 'ok' : 'error';
  });

  const ready = Object.values(checks).every(
    (status) => status === 'ok'
  );

  res.status(ready ? 200 : 503).json({
    status: ready ? 'ok' : 'not_ready',
    checks
  });
});

export default router;