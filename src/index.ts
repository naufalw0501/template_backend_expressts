import express, { Request, Response } from 'express';
const app = express();
const port = 3000;
const usersRoute = require('./routes/users');
require('dotenv').config();

app.get('/', (req: Request, res: Response) => {
    res.send(`Environment: ${process.env.NODE_ENV}`);
});

app.listen(port, () => {
    if (process.env.NODE_ENV === 'development') {
        console.log(`Server Running On Development Port ${port}`);
    } else {
        console.log(`Server Running On Production Port ${port}. Be Careful !`);
    }
});

app.use('/users', usersRoute);