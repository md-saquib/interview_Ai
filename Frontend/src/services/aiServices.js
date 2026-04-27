import axios from "axios";

const API_URL = "http://localhost:3000/api/interview";


export const generateInterviewReport = async (jobDescription, resume, selfDescription) => {

    try {
        // File bhejne ke liye FormData banana zaroori hai (JSON mein file nahi jaati)
        const formData = new FormData();
        formData.append('job_description', jobDescription);
        formData.append('resume', resume);           // PDF file
        formData.append('self_description', selfDescription);

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

