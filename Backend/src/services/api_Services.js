const { GoogleGenerativeAI, SchemaType } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY)

// interview report schema
const interviewReportSchema = {
    type: SchemaType.OBJECT,
    properties: {
        matchScore: {
            type: SchemaType.NUMBER,
            description: "A score between 0 and 100 indicating how well the candidate's profile matches the job describe"
        },
        technicalQuestions: {
            type: SchemaType.ARRAY,
            description: "Technical questions that can be asked in the interview along with their intention and how to answer them",
            items: {
                type: SchemaType.OBJECT,
                properties: {
                    question: { type: SchemaType.STRING, description: "The technical question can be asked in the interview" },
                    intention: { type: SchemaType.STRING, description: "The intention of interviewer behind asking this question" },
                    answer: { type: SchemaType.STRING, description: "How to answer this question, what points to cover, what approach to take etc." }
                },
            }
        },
        behavioralQuestions: {
            type: SchemaType.ARRAY,
            description: "Behavioral questions that can be asked in the interview along with their intention and how to answer them",
            items: {
                type: SchemaType.OBJECT,
                properties: {
                    question: { type: SchemaType.STRING, description: "The technical question can be asked in the interview" },
                    intention: { type: SchemaType.STRING, description: "The intention of interviewer behind asking this question" },
                    answer: { type: SchemaType.STRING, description: "How to answer this question, what points to cover, what approach to take etc." }
                },
            }
        },
        skillGaps: {
            type: SchemaType.ARRAY,
            description: "List of skill gaps in the candidate's profile along with their severity",
            items: {
                type: SchemaType.OBJECT,
                properties: {
                    skill: { type: SchemaType.STRING, description: "The skill which the candidate is lacking" },
                    severity: { type: SchemaType.STRING, description: "The severity of this skill gap, i.e. low, medium, or high" }
                },
            }
        },
        preparationPlan: {
            type: SchemaType.ARRAY,
            description: "A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively",
            items: {
                type: SchemaType.OBJECT,
                properties: {
                    day: { type: SchemaType.NUMBER, description: "The day number in the preparation plan, starting from 1" },
                    focus: { type: SchemaType.STRING, description: "The main focus of this day in the preparation plan" },
                    tasks: {
                        type: SchemaType.ARRAY,
                        description: "List of tasks to be done on this day",
                        items: { type: SchemaType.STRING }
                    }
                },
            }
        },
        title: {
            type: SchemaType.STRING,
            description: "The title of the job for which the interview report is generated"
        }
    },
    // Specify required fields for Google GenAI structure formatting
    required: ["matchScore", "technicalQuestions", "behavioralQuestions", "skillGaps", "preparationPlan", "title"]
};


const interviewReport = async (job_description, resume, self_description) => {
    try {

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            generationConfig: {
                temperature: 0.1, 
                maxOutputTokens: 8192,
                responseMimeType: "application/json",
                responseSchema: interviewReportSchema,
            },
        });

        const prompt = `Generate an interview report for a candidate with the following details:
                        Job Description: ${job_description}
                        Resume: ${resume}
                        Self-Description: ${self_description}`;

        // contents MUST be array of {role, parts} — plain string se SDK error aata hai
        const result = await model.generateContent({
            contents: [
                {
                    role: 'user',
                    parts: [{ text: prompt }]
                }
            ],
        });

        return JSON.parse(result.response.text());
    } catch (err) {
        throw new Error(err.message);
    }
}

module.exports = { interviewReport }


