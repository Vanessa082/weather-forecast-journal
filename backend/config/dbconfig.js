import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT
});

pool.connect()
  .then(() => {
    console.log('Connected to the database on port 5432');

    const checkTableQuery = `
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'journal_entries'
      );
    `;

    const createTableQuery = `
      CREATE TABLE journal_entries (
        entry_id SERIAL PRIMARY KEY,
        entry_date DATE,
        description VARCHAR(255),
        temperature NUMERIC,
        weather_conditions VARCHAR(255),
        latitude NUMERIC,
        longitude NUMERIC,
        location VARCHAR(255)
      );
    `;

    pool.query(checkTableQuery)
      .then(result => {
        if (!result.rows[0].exists) {
          return pool.query(createTableQuery);
        }
      })
      .then(() => {
        console.log('Table "journal_entries" checked/created successfully');
      })
      .catch(err => {
        console.error('Error executing query', err);
      })
      .finally(() => {
        pool.end();
      });
  })
  .catch((err) => {
    console.error('Failed to connect to the database', err);
    process.exit(-1); // Exit process with failure
  });

export default pool;
