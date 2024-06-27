const express = require('express');
const connection = require('../connection');
const router = express.Router();

let auth = require('../Service/authentication');

router.post('/addNewCategory', auth.authenticateToken, (req, res, next) => {
    let category = req.body;
    query = "insert into category (name) values(?)";
    connection.query(query, [category.name], (err, results) => {
        if (!err) {
            return res.status(200).json({ message: " Category Added Successfully." });
        } else {
            return res.status(500).json(err);
        }
    });
});

router.get('/getAllCategory', auth.authenticateToken, (req, res, next) => {
    let query = "SELECT * FROM category ORDER BY name";

    connection.query(query, (err, results) => {
        if (!err) {
            return res.status(200).json(results);
        } else {
            return res.status(500).json(err);
        }
    });
});

router.post('/updateCategory', auth.authenticateToken, (req, res, next) => {
    let category = req.body;
    let query = "update category set name=? where id=?";
    connection.query(query, [category.name, category.id], (err, results) => {
        if (!err) {
            if (results.affectedRows == 0) {
                return res.status(404).json({ message: "Category Id does not exist." });
            }
            return res.status(200).json({ message: "Category Updated Successfully." });
        } else {
            return res.status(500).json(err);
        }
    });
});


module.exports = router;

