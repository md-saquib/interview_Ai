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
            description: "Technical questions that can be asked in the interview along with their intention and how to answer them ",
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
            description: "Behavioral questions that can be asked in the interview along with their intention and how to answer them ",
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
                        description: "List of tasks to be done on this day minimum 8 to 10 task required",
                        items: { type: SchemaType.STRING, description: "The task to be done on this day in short and concise manner, no full sentences" }
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
                        1. Limit technical questions to exactly 10 items.
                        2. Limit behavioral questions to exactly 5 items.
                        3. Limit skill gaps to a maximum of 6 items.
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
        format: 'a4', margin: {
            top: "20mm",
            bottom: "15mm",
            left: "5mm",
            right: "5mm"
        },
        fonts: 'Arial, Helvetica, sans-serif'
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

    const prompt = `Act as a Senior Technical Recruiter and an expert Frontend Developer. Your task is to generate a professional, ATS-optimized resume in HTML format based on the following candidate data:

                    - Resume Data: ${resume}
                    - Candidate Self-Description: ${selfDescription}
                    - Target Job Description: ${jobDescription}

                    ### DESIGN SPECIFICATIONS (Matching provided image)
                    1. Layout: Single-column, clean white background, black text (#333 for body, #000 for headers).
                    2. Typography: Use "Arial" or "Helvetica" (system fonts) to ensure PDF conversion and ATS readability. Use 10pt-11pt for body text.
                    3. Sections: Include the following sections in order: HEADER, PROFESSIONAL SUMMARY, PROFESSIONAL EXPERIENCE, [Optional: PROJECTS or CONSULTANCY], EDUCATION, and EXPERT-LEVEL SKILLS.
                    4. Styling: 
                    - All section headers (e.g., PROFESSIONAL EXPERIENCE) must be in ALL CAPS, bold, and followed by a thin horizontal rule (<hr>).
                    - Use a Flexbox layout for Job Titles and Dates so that the Title/Company is on the left and the Date/Location is on the right, exactly like the reference image.
                    - Use bullet points (<ul> and <li>) for experience descriptions.

                    ### CONTENT GUIDELINES
                    1. Tone: Write in a natural, human, and high-achieving tone. Avoid AI-typical clichés like "Passionate professional with a proven track record." Instead, use strong action verbs and metrics (e.g., "Scaled," "Architected," "Reduced latency by 30%").
                    2. ATS Optimization: Silently weave relevant technical keywords from the Job Description into the professional experience and skills sections. Ensure the text is 100% selectable and not contained in images or complex tables.
                    3. Personalization: Use the 'Self Description' to flavor the Professional Summary, ensuring it highlights the candidate's unique value proposition for this specific role.

                    ### OUTPUT FORMAT
                    The response must be a valid JSON object with a single field "html". The HTML should include internal CSS within a <style> tag. Ensure the CSS is compatible with Puppeteer for PDF generation (use @page { margin: 0.5in; }).

                    Example JSON Structure:
                    {
                    "html": "<!DOCTYPE html><html><head><style>...</style></head><body>...</body></html>"
                    }
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


