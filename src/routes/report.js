const express = require('express');
const router = express.Router();
const { getAllReports, createReport, upload } = require('../controllers/reportController');

router.get('/', getAllReports);

router.post('/', upload.fields([{ name: 'pdfFile', maxCount: 1 }, { name: 'reportFile', maxCount: 1 }]), createReport);

module.exports = router;
