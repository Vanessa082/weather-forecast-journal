import pool from "../config/dbconfig.js"
import { Router } from 'express';
import validateIdParams from "../utils/validateIdParam.js"

const router = Router();

// GET /entries: Retrieve all journal entries.

router.get('/', function (req, res, next) {
  try {
    pool.query("SELECT * FROM journal_entries;", (err, result) => {
      if (err) next(err);

      if (result.rows.length < 1) {
        res.json({ message: "No entries in the database" });
      } else {
        res.json(result.rows);
      }
    })
  } catch (error) {
    next(error);
  }
});

// GET /entries/:id: Retrieve a single entry by its ID.

router.get("/:id", function (req, res, next) {
  const { id } = req.params;
  try {
    validateIdParams(+id);
    pool.query(`SELECT * FROM journal_entries WHERE id=$1;`, [id], (err, result) => {
      if (err) next(err);
      if (result?.rowCount === 1) {
        res.json(result.rows[0]);
      } else {
        // If no entry is found, create a 404 error
        const notFoundError = new Error("Entry does not exist");
        notFoundError.status = 404;
        console.warn(`Entry with ID ${id} does not exist`); // Log the not found error for debugging
        next(notFoundError);
      }
    });
  } catch (error) {
    console.error('Validation or other error:', error.message); // Log validation or other errors
    next(error); // Pass any caught errors to the error handling middleware
  }
});

// POST /entries: Create a new journal entry with automatic weather fetching.
router.post("/", function (req, res, next) {
  try {
    
  } catch (error) {
    
  }
});

// PUT /entries/:id: Update an existing entry.
// DELETE /entries/:id: Delete an entry.


export default router;
