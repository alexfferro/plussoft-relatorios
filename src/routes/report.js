const express = require('express');
const router = express.Router();
const { getAllReports, createReport, upload, searchReports } = require('../controllers/reportController');

router.get('/', getAllReports);
router.post('/', upload.fields([{ name: 'pdfFile', maxCount: 1 }, { name: 'reportFile', maxCount: 1 }]), createReport);
router.get('/search', searchReports)

module.exports = router;
