import { useContext, useEffect } from 'react'
import { interviewContext } from './interviewContext'
import { useParams, useNavigate } from 'react-router-dom';
import { currentUser } from '../services/authServices';
import { getInterviewReportById, getAllInterviewReports } from '../services/aiServices';

export const useInterview = () => {
    const { InterviewId } = useParams();
    const navigate = useNavigate();
    const context = useContext(interviewContext);

    if (!context) {
        throw new Error("useInterview must be used within an interviewProvider");
    }

    const { setInterviewReport, interviewReport, loading, setLoading, tittles, setTittles, userData, setUserData, clearSession } = context;

    // 3. Simple helper to handle errors and redirect
    const handleAuthError = (error) => {
        if (error.message.includes("jwt expired")) {
            navigate('/login');
        }
    };

    const getReportById = async () => {
        try {
            setLoading(true);
            const report = await getInterviewReportById(InterviewId);
            setInterviewReport(report);
        } catch (error) {
            handleAuthError(error);
        } finally {
            setLoading(false);
        }
    }

    const getAllReports = async () => {
        try {
            setLoading(true);
            const data = await getAllInterviewReports();

            setTittles(data);
        } catch (error) {
            handleAuthError(error);
        } finally {
            setLoading(false);
        }
    }

    const getCurrentUser = async () => {
        try {
            setLoading(true);
            const user = await currentUser();
            setUserData(user);
        } catch (error) {
            handleAuthError(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (InterviewId) {
            getReportById();
            getCurrentUser();

        } else {
            getAllReports();
            getCurrentUser();
        }
    }, [InterviewId]);

    return { setInterviewReport, interviewReport, loading, setLoading, tittles, setTittles, userData, setUserData, clearSession, getReportById, getAllReports };
};