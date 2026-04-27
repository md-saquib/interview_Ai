
import { createContext, useState } from "react";

export const interviewContext = createContext();

export const InterviewProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);
    const [interviewReport, setInterviewReport] = useState(null);
    const [tittles, setTittles] = useState(null); 
    const [userData, setUserData] = useState(null);

    // Call this on logout to wipe all user-specific data from context
    const clearSession = () => {
        setTittles(null);
        setUserData(null);
        setInterviewReport(null);
    };

    return (
        <interviewContext.Provider value={{ loading, setLoading, interviewReport, setInterviewReport, tittles, setTittles, userData, setUserData, clearSession }}>
            {children}
        </interviewContext.Provider>
    )
}

