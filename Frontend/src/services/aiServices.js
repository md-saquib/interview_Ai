import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/interview`;


export const generateInterviewReport = async (jobDescription, resume, selfDescription, selectedModel) => {

    try {
        // File bhejne ke liye FormData banana zaroori hai (JSON mein file nahi jaati)
        const formData = new FormData();
        formData.append('job_description', jobDescription);
        formData.append('resume', resume);           // PDF file
        formData.append('self_description', selfDescription);
        formData.append('model', selectedModel);

        const response = await axios.post(`${API_URL}/generate-report`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            withCredentials: true,
        });

        return response.data.report;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to generate interview report");
    }
}

export const getInterviewReportById = async (InterviewId) => {
    try {
        const response = await axios.get(`${API_URL}/get-report/${InterviewId}`, {
            withCredentials: true,
        });
        return response.data.report;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to fetch interview report");
    }
}

export const getAllInterviewReports = async () => {
    try {
        const response = await axios.get(`${API_URL}/get-all-reports`, {
            withCredentials: true,
        });
        return response.data.tittles;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to fetch interview reports");
    }
}

// ── Resume Builder ──────────────────────────────────────────────

/**
 * GET /api/interview/generate-resume/pdf/:interviewReportId
 * Backend fetches stored report → AI generates resume HTML → Puppeteer renders PDF → streamed back.
 * This function receives the PDF blob and triggers a browser file download.
 */
export const downloadResumePdf = async (interviewReportId) => {
    try {
        const response = await axios.get(
            `${API_URL}/generate-resume/pdf/${interviewReportId}`,
            {
                withCredentials: true,
                responseType: 'blob', // PDF is binary
            }
        );

        const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `resume_${interviewReportId}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to download resume PDF');
    }
};
