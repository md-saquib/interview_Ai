const express = require('express');
const router = express.Router();
const upload = require('../middlewares/file.middleware');

const { isLogin } = require('../middlewares/isLogin');
const { InterviewReportGenerator, interviewReportById, getAllInterviewReports } = require('../controllers/interviewReportController');



try {
    router.post('/generate-report', isLogin, upload.single('resume'), InterviewReportGenerator);
    router.get('/get-report/:InterviewId', isLogin, interviewReportById);
    router.get('/get-all-reports', isLogin, getAllInterviewReports);
} catch (error) {
    throw new Error("Error in interview ai routes", error.message);
}

module.exports = router;