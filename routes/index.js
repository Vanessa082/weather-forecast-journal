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
      if (result.rowCount === 1) {
        res.json(result.rows[0]);
      } else {
        const err = new Error("Entries does not exist");
        err.status = 404;
        next(err);
      }
    })
    
  } catch (error) {
    next(error);
  }
})

// POST /entries: Create a new journal entry with automatic weather fetching.


// PUT /entries/:id: Update an existing entry.
// DELETE /entries/:id: Delete an entry.


export default router;
