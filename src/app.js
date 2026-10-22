import express from "express"
import healthRoutes from "./routes/health.routes.js"

const app = express()
 app.disable("x-powred-by")
 app.use(express.json({limit:"1mb"}))

 app.use("/health",healthRoutes)


 app.use((_req, res) => {
  res.status(404).json({
    error: 'NOT_FOUND',
    message: 'The requested resource does not exist'
  });
});

app.use((error, _req, res, _next) => {
  console.error('Unhandled request error:', error.message);

  res.status(error.status === 400 ? 400 : 500).json({
    error: 'INTERNAL_SERVER_ERROR',
    message: 'An unexpected error occurred'
  });
});

export default app;