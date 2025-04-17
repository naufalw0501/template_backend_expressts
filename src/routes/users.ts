import express, { Request, Response } from 'express'; 
const router = express.Router();
const { dbPool } = require('../../config/initdbMysql');

// GET /users
router.get('/', async (req: Request, res: Response) => {
  try {
    const [rows] = await dbPool.query('SELECT * FROM users');
    res.json(rows);
  } catch (err) {
    console.error('Error When Get Users:', err);
    res.status(500).json({ message: 'Error When Get Users', error: err });
  }
});

module.exports = router;
