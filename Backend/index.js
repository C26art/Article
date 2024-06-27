const express = require('express');
let cors = require('cors');
const connection = require('./connection');
const appuserRoute = require('./Routes/appuser');
const categoryRoute = require('./Routes/category');
const articleRoute = require('./Routes/article');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/refreshToken', async (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.sendStatus(401);
    }

    try {
        const decoded = await verifyToken(token);
        const newToken = generateToken({ email: decoded.email, isDeletable: decoded.isDeletable });
        res.status(200).json({ token: newToken });
    } catch (err) {
        res.sendStatus(403);
    }
});

// Rotas principais
app.use('/appuser', appuserRoute);
app.use('/category', categoryRoute);
app.use('/article', articleRoute);


module.exports = app;