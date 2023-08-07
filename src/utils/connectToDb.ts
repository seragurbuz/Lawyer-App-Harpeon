import { Pool } from 'pg';
import config from 'config';
import log from "./logger"

const dbConfig = config.get<object>("dbConfig");
const pool = new Pool(dbConfig);

async function connect() {
  try {

    await pool.connect();
    log.info("DB connected"); 

    //await pool.end();
    //log.info("DB connection closed");

  } catch (err) {
    log.error("Could not connect to db");
    process.exit(1);
  }
}

export {pool, connect};
