import pg from "pg"
import {env} from "../config/env"

const {Pool}  = pg

export const pool = new Pool({
    connectionString:env.databaseUrl,
    connectionTimeoutMillis:3000,
    idleTimeoutMillis:30000,
    max:10
}) 

pool.on('error',(error)=>{
   console.error('Unexpected PostgreSQL pool error:', error.message);
})

export async function checkPostgres() {
  await pool.query('SELECT 1');
}