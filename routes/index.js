import pool from "../config/dbconfig.js"
import { Router } from 'express';

const router =  Router();
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// POST /entries: Create a new journal entry with automatic weather fetching.
// GET /entries: Retrieve all journal entries.
// GET /entries/:id: Retrieve a single entry by its ID.
// PUT /entries/:id: Update an existing entry.
// DELETE /entries/:id: Delete an entry.


module.exports = router;
