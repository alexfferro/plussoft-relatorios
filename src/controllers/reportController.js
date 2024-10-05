const multer = require('multer');
const path = require('path');
const db = require('../db/db')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../../public/files'));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

function getAllReports(req, res) {
    const sql = 'SELECT * FROM reports';
    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
}

function createReport(req, res) {
    const { title, description, query } = req.body;
    const pdfFile = req.files['pdfFile'] ? req.files['pdfFile'][0].filename : null;
    const reportFile = req.files['reportFile'] ? req.files['reportFile'][0].filename : null;
    if (!title || !description || !query || !pdfFile || !reportFile) {
        return res.status(400).send('Todos os campos são obrigatórios.');
    }

    const sql = `
        INSERT INTO reports (title, description, query, url_pdf, url_file)
        VALUES (?, ?, ?, ?, ?)`;
    const params = [title, description, query, pdfFile, reportFile];

    db.run(sql, params, function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'Relatório criado com sucesso', id: this.lastID });
    });
}

function searchReports(req, res) {
    const { searchQuery } = req.query;
    let sql = 'SELECT DISTINCT * FROM reports';
    let params = [];
    if (searchQuery) {
        sql += ' WHERE title LIKE ? OR description LIKE ?';
        params.push(`%${searchQuery}%`, `%${searchQuery}%`);
    }
    db.all(sql, params, (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
}

module.exports = {
    getAllReports,
    createReport,
    upload,
    searchReports
};
