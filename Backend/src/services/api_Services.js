const { GoogleGenerativeAI, SchemaType } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY)
const puppeteer = require('puppeteer')

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


const interviewReport = async (job_description, resume, self_description, selectedModel) => {
    try {

        const model = genAI.getGenerativeModel({
            model: selectedModel,
            generationConfig: {
                temperature: 0.1,
                maxOutputTokens: 8192,
                responseMimeType: "application/json",
                responseSchema: interviewReportSchema,
            },
        });

        const prompt = `Generate a concise interview report for a candidate with the following details:
                        Job Description: ${job_description}
                        Resume: ${resume}
                        Self-Description: ${self_description}
                        
                        IMPORTANT INSTRUCTIONS:
                        1. Limit technical questions to exactly 5 items.
                        2. Limit behavioral questions to exactly 3 items.
                        3. Limit skill gaps to a maximum of 4 items.
                        4. Keep the daily preparation plan tasks extremely brief (1-2 sentences max per task).
                        5. The output must be complete and well-formed.`;

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


async function generatePdfFromHtml(htmlContent) {
    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    })
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" })

    const pdfBuffer = await page.pdf({
        format: "A4", margin: {
            top: "20mm",
            bottom: "20mm",
            left: "15mm",
            right: "15mm"
        }
    })

    await browser.close()

    return pdfBuffer
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {

    const resumePdfSchema = {
        type: SchemaType.OBJECT,
        properties: {
            html: {
                type: SchemaType.STRING,
                description: "The HTML content of the resume which can be converted to PDF using any library like puppeteer"
            }
        }
    }

    const prompt = `Generate resume for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}

                        the response should be a JSON object with a single field "html" which contains the HTML content of the resume which can be converted to PDF using any library like puppeteer.
                        The resume should be tailored for the given job description and should highlight the candidate's strengths and relevant experience. The HTML content should be well-formatted and structured, making it easy to read and visually appealing.
                        The content of resume should be not sound like it's generated by AI and should be as close as possible to a real human-written resume.
                        you can highlight the content using some colors or different font styles but the overall design should be simple and professional.
                        The content should be ATS friendly, i.e. it should be easily parsable by ATS systems without losing important information.
                        The resume should not be so lengthy, it should ideally be 1-2 pages long when converted to PDF. Focus on quality rather than quantity and make sure to include all the relevant information that can increase the candidate's chances of getting an interview call for the given job description.
                        
                    `

    const model = genAI.getGenerativeModel({
        model: "gemini-3-flash-preview",
        generationConfig: {
            responseMimeType: "application/json",
            responseSchema: resumePdfSchema,
        }
    });

    const result = await model.generateContent(prompt);
    const jsonContent = JSON.parse(result.response.text());

    const pdfBuffer = await generatePdfFromHtml(jsonContent.html)

    return pdfBuffer

}


module.exports = { interviewReport, generateResumePdf }


