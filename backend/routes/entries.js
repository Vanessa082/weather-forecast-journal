import express from 'express';
import pool from "../config/dbconfig.js";
import validateIdParams from "../utils/validateIdParam.js";
import validateEntriesData from "../utils/validateEntriesData.js";
import fetch from 'node-fetch';

const router = express.Router();

// GET /entries: Retrieve all journal entries
router.get('/', (req, res, next) => {
  pool.query("SELECT * FROM journal_entries;", (err, result) => {
    if (err) return next(err);
    if (result.rows.length < 1) {
      res.json({ message: "There are no entries in the database" });
    } else {
      res.json(result.rows);
    }
  });
});

// GET /entries/:id: Retrieve a single entry by its ID
router.get("/:id", (req, res, next) => {
  const { id } = req.params;
  try {
    validateIdParams(+id);
    pool.query("SELECT * FROM journal_entries WHERE id=$1;", [id], (err, result) => {
      if (err) return next(err);
      if (result?.rowCount === 1) {
        res.json(result.rows[0]);
      } else {
        const notFoundError = new Error("Entry does not exist");
        notFoundError.status = 404;
        next(notFoundError);
      }
    });
  } catch (error) {
    next(error);
  }
});

// POST /entries: Create a new journal entry with automatic weather fetching
router.post("/", (req, res, next) => {
  const data = req.body;
  console.log({ data })
  console.log('Weather API Key:', process.env.WEATHER_API_KEY);

  try {
    validateEntriesData(req.body);
    const { entry_date, description, latitude, longitude } = req.body;

    const apiKey = process.env.WEATHER_API_KEY;
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

    console.log('Weather URL:', weatherUrl);

    fetch(weatherUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Weather API error: ${response.statusText}`);
        }
        return response.json();
      })
      .then(weatherData => {
        const weather_conditions = weatherData.weather[0].description;
        const temperature = weatherData.main.temp;
        const location = `${weatherData.name}, ${weatherData.sys.country}`;

        const query = `INSERT INTO journal_entries (entry_date, description, temperature, weather_conditions, location) VALUES ($1, $2, $3, $4, $5) RETURNING *`;
        const values = [entry_date, description, temperature, weather_conditions, location];

        pool.query(query, values, (err, result) => {
          if (err) return next(err);
          res.status(201).json(result.rows[0]);
        });
      })
      .catch(error => {
        next(error);
      });
  } catch (error) {
    next(error);
  }
});

// PUT /entries/:id: Update an existing entry
router.put("/:id", (req, res, next) => {
  const { id } = req.params;
  try {
    validateIdParams(+id);
    validateEntriesData(req.body);
    const { entry_date, description } = req.body;

    pool.query("SELECT * FROM journal_entries WHERE entry_id=$1", [id], (err, result) => {
      if (err) return next(err);
      if (result?.rowCount === 1) {
        const updateQuery = `UPDATE journal_entries SET entry_date=$1, description=$2 WHERE entry_id=$3 RETURNING *`;
        const values = [entry_date, description, id]; // Using 'id' instead of 'entry_id'
        pool.query(updateQuery, values, (err, result) => {
          if (err) return next(err);
          res.json(result.rows[0]);
        });
      } else {
        const error = new Error("Entry does not exist");
        error.status = 404;
        next(error);
      }
    });
  } catch (error) {
    next(error);
  }
});


// DELETE /entries/:id: Delete an entry
router.delete("/:id", (req, res, next) => {
  const { id } = req.params;
  try {
    validateIdParams(+id);
    pool.query("DELETE FROM journal_entries WHERE entry_id=$1 RETURNING *", [id], (err, result) => {
      // console.log(id)
      if (err) return next(err);
      if (result?.rowCount === 1) {
        res.json({ message: `Entry with ID ${id} deleted successfully.` });
      } else {
        const notFoundError = new Error("Entry does not exist");
        notFoundError.status = 404;
        next(notFoundError);
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;
