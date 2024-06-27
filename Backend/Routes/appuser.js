const express = require('express');
const connection = require('../connection');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { authenticateToken, verifyToken, generateToken } = require('../Service/authentication');

const router = express.Router();

router.post('/addNewAppUser', authenticateToken, (req, res) => {
    const user = req.body;
    let query = "select email, password, status from appuser where email=?";
    connection.query(query, [user.email], (err, results) => {
        if (!err) {
            if (results.length <= 0) {
                query = "insert into appuser(name, email, password, status, isDeletable) values(?, ?, ?, 'false', 'true')";
                connection.query(query, [user.name, user.email, user.password], (err, results) => {
                    if (!err) {
                        return res.status(200).json({ message: "Successfully Registered" });
                    } else {
                        return res.status(500).json(err);
                    }
                });
            } else {
                return res.status(400).json({ message: "Email already exist" });
            }
        } else {
            return res.status(500).json(err);
        }
    });
});

router.post('/login', (req, res) => {
    const user = req.body;

    if (!user.email || !user.password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    let query = "SELECT email, password, status, isDeletable FROM appuser WHERE email=?";
    connection.query(query, [user.email], (err, results) => {
        if (!err) {
            if (results.length <= 0 || results[0].password !== user.password) {
                return res.status(401).json({ message: "Incorrect email or Password." });
            } else if (results[0].status === 'false') {
                return res.status(401).json({ message: "Wait for admin approval." });
            } else if (results[0].password === user.password) {
                const response = { email: results[0].email, isDeletable: results[0].isDeletable };
                const accessToken = jwt.sign(response, process.env.ACCESS_TOKEN, { expiresIn: '8h' });
                return res.status(200).json({ token: accessToken });
            } else {
                return res.status(400).json({ message: "Something went wrong. Please try again later." });
            }
        } else {
            return res.status(500).json(err);
        }
    });
});

router.get('/getAllAppUser', authenticateToken, (req, res) => {
    const tokenPayload = res.locals.user;
    let query;
    if (tokenPayload.isDeletable === 'false') {
        query = "SELECT id, name, email, status FROM appuser WHERE isDeletable='true'";
    } else {
        query = "SELECT id, name, email, status FROM appuser WHERE isDeletable='true' AND email !=?";
    }
    connection.query(query, [tokenPayload.email], (err, results) => {
        if (!err) {
            return res.status(200).json(results);
        } else {
            return res.status(500).json(err);
        }
    });
});

router.post('/updateUserStatus', authenticateToken, (req, res) => {
    let user = req.body;
    let query = "update appuser set status=? where id=? and isDeletable='true'";
    connection.query(query, [user.status, user.id], (err, results) => {
        if (!err) {
            if (results.affectedRows == 0) {
                return res.status(404).json({ message: "User Id does not exist." });
            }
            return res.status(200).json({ message: "User Updated Successfully." });
        } else {
            return res.status(500).json(err);
        }
    });
});

router.post('/updateUser', authenticateToken, (req, res) => {
    let user = req.body;
    let query = "update appuser set name=?, email=? where id=?";
    connection.query(query, [user.name, user.email, user.id], (err, results) => {
        if (!err) {
            if (results.affectedRows == 0) {
                return res.status(404).json({ message: "User Id does not exist." });
            }
            return res.status(200).json({ message: "User Updated Successfully." });
        } else {
            return res.status(500).json(err);
        }
    });
});

router.get('/checkToken', authenticateToken, (req, res) => {
    return res.status(200).json({ message: "true" });
});

// Endpoint to refresh token
router.post('/refreshToken', async (req, res) => {
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

module.exports = router;
