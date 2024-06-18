import pool from "../config/dbconfig.js"
import { Router } from 'express';

const router =  Router();

// GET /entries: Retrieve all journal entries.

router.get('/', function(req, res, next) {
  try {
    pool.query("SELECT * FROM journal_entries;", (err, result) => {
      if(err) throw err;
      if(result.rows.length < 1) {
        res.json({message: "No entries in the database"});
      } else {
        res,json(result.rows);
      }
    })
  } catch (error) {
    next(error);
  }
  res.render('index', { title: 'Express' });
});

// POST /entries: Create a new journal entry with automatic weather fetching.

// GET /entries/:id: Retrieve a single entry by its ID.
// PUT /entries/:id: Update an existing entry.
// DELETE /entries/:id: Delete an entry.


module.exports = router;
