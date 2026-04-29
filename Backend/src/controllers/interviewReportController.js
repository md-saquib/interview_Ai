
const pdfParse = require('pdf-parse');
const interviewReportModel = require('../models/interviewReport.model');
const { interviewReport, generateResumePdf } = require('../services/api_Services');


const InterviewReportGenerator = async (req, res) => {
    try {

        // pdf-parse ek function hai, isko directly buffer pass karo
        // result.text mein PDF ka poora plain text string milta hai
        const pdfData = await pdfParse(req.file.buffer);
        const resumeContent = pdfData.text;

        const { job_description, self_description, model } = req.body;

        if (!job_description || !resumeContent || !self_description || !model) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        const response = await interviewReport(job_description, resumeContent, self_description, model);
       
        const report = await interviewReportModel.create({
            jobDescription: job_description,
            resume: resumeContent,
            selfDescription: self_description,
            ...response,
            user: req.user.id,
        })

        res.status(201).json({
            success: true,
            message: "Interview report generated successfully",
            report
        })

    } catch (err) {
        console.error('Error in InterviewReportGenerator:', err.message);
        return res.status(500).json({
            success: false,
            message: err.message || "Internal server error"
        });
    }
}


const interviewReportById = async (req, res) => {
    try {
        const { InterviewId } = req.params;

        const report = await interviewReportModel.findById(InterviewId);

        if (!report) {
            return res.status(404).json({
                success: false,
                message: "Report not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Interview report fetched successfully",
            report
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message || "Internal server error"
        });
    }
}

const getAllInterviewReports = async (req, res) => {
    try {
        const userId = req.user.id;
        const tittles = await interviewReportModel.find({ user: userId }).select('title createdAt').sort({ createdAt: -1 }).lean().populate('user', 'name email');
        
        if (!tittles) return res.status(404).json({ message: "No interview reports found" });

        return res.status(200).json({
            success: true,
            message: "Interview reports fetched successfully",
            tittles
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message || "Failed to fetch interview reports"
        });
    }
}


/**
 * @description Controller to generate resume PDF based on user self description, resume and job description.
 */
async function generateResumePdfController(req, res) {
    try {
        const { interviewReportId } = req.params;

        const report = await interviewReportModel.findById(interviewReportId);

        if (!report) {
            return res.status(404).json({ success: false, message: "Interview report not found." });
        }

        const { resume, jobDescription, selfDescription } = report;

        const pdfBuffer = await generateResumePdf({ resume, jobDescription, selfDescription });

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename=resume_${interviewReportId}.pdf`
        });

        return res.send(pdfBuffer);
    } catch (err) {
        console.error('Error in generateResumePdfController:', err.message);
        return res.status(500).json({ success: false, message: err.message || 'Internal server error' });
    }
}



module.exports = { InterviewReportGenerator, interviewReportById, getAllInterviewReports, generateResumePdfController }