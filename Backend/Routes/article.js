// backend: article.js

const express = require('express');
const connection = require('../connection');
const router = express.Router();
let auth = require('../Service/authentication');

router.post('/addNewArticle', auth.authenticateToken, (req, res) => {
    let article = req.body;
    let query = "insert into article (title, content, publication_date, categoryId, status) values(?, ?, ?, ?, ?)";
    connection.query(query, [article.title, article.content, new Date(), article.categoryId, article.status], (err, results) => {
        if (!err) {
            return res.status(200).json({ message: "Article Added Successfully." });
        } else {
            return res.status(500).json(err);
        }
    });
});

router.get('/getAllArticle', auth.authenticateToken, (req, res) => {
    let query = "SELECT a.id, a.title, a.content, a.status, a.publication_date, c.id as categoryId, c.name as categoryName FROM article a INNER JOIN category c ON a.categoryId = c.id";
    connection.query(query, (err, results) => {
        if (!err) {
            return res.status(200).json(results);
        } else {
            return res.status(500).json(err);
        }
    });
});

router.get('/getAllPublishedArticle', (req, res) => {
    let query = "SELECT a.id, a.title, a.content, a.status, a.publication_date, c.id as categoryId, c.name as categoryName FROM article a INNER JOIN category c ON a.categoryId = c.id and a.status='published'";
    connection.query(query, (err, results) => {
        if (!err) {
            return res.status(200).json(results);
        } else {
            return res.status(500).json(err);
        }
    });
});

router.post('/updateArticle', auth.authenticateToken, (req, res) => {
    let article = req.body;
    let query = "UPDATE article SET title=?, content=?, categoryId=?, publication_date=?, status=? WHERE id=?";
    connection.query(query, [article.title, article.content, article.categoryId, new Date(), article.status, article.id], (err, results) => {
        if (!err) {
            if (results.affectedRows == 0) {
                return res.status(404).json({ message: "Article ID does not exist." });
            }
            return res.status(200).json({ message: "Article Updated Successfully." });
        } else {
            return res.status(500).json(err);
        }
    });
});

router.post('/deleteArticle/:id', auth.authenticateToken, (req, res) => {
    const id = req.params.id;
    let query = "DELETE FROM article WHERE id=?";
    connection.query(query, [id], (err, results) => {
        if (!err) {
            if (results.affectedRows == 0) {
                return res.status(404).json({ message: "Article ID does not exist." });
            }
            return res.status(200).json({ message: "Article Deleted Successfully." });
        } else {
            return res.status(500).json(err);
        }
    });
});

module.exports = router;
