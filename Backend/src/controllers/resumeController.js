const puppeteer = require('puppeteer');
const { generateResume } = require('../services/resumeGeneratorService');
const pdfParse = require('pdf-parse');
const interviewReportModel = require('../models/interviewReport.model');

// ─────────────────────────────────────────────
// POST /api/interview/generate-resume
// Body: multipart/form-data — resume (PDF), job_description, self_description
// ─────────────────────────────────────────────
const generateResumeController = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "Resume PDF is required" });
        }

        const pdfData = await pdfParse(req.file.buffer);
        const resumeText = pdfData.text;

        const { job_description, self_description } = req.body;

        if (!job_description || !self_description) {
            return res.status(400).json({ success: false, message: "job_description and self_description are required" });
        }

        const resumeData = await generateResume(resumeText, job_description, self_description);

        return res.status(200).json({
            success: true,
            message: "Resume generated successfully",
            resume: resumeData
        });

    } catch (err) {
        console.error('Error in generateResumeController:', err.message);
        return res.status(500).json({ success: false, message: err.message || "Internal server error" });
    }
};

// ─────────────────────────────────────────────
// POST /api/interview/download-resume
// Body: JSON — the resume object from generateResumeController
// Returns: PDF stream (ATS-approved design)
// ─────────────────────────────────────────────
const downloadResumeController = async (req, res) => {
    try {
        const resumeData = req.body;

        if (!resumeData || !resumeData.name) {
            return res.status(400).json({ success: false, message: "Resume data is required" });
        }

        const html = buildResumeHtml(resumeData);

        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });

        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: 'networkidle0' });

        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: { top: '0.5in', bottom: '0.5in', left: '0.6in', right: '0.6in' },
        });

        await browser.close();

        const safeName = (resumeData.name || 'resume').replace(/[^a-zA-Z0-9 ]/g, '').replace(/\s+/g, '_');

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${safeName}_ATS_Resume.pdf"`);
        res.setHeader('Content-Length', pdfBuffer.length);
        return res.end(pdfBuffer);

    } catch (err) {
        console.error('Error in downloadResumeController:', err.message);
        return res.status(500).json({ success: false, message: err.message || "Internal server error" });
    }
};


// ─────────────────────────────────────────────
// ATS-APPROVED HTML RESUME TEMPLATE
// Clean single-column layout: black text on white, standard fonts
// Zero graphics/tables/columns — maximum ATS parse accuracy
// ─────────────────────────────────────────────
function buildResumeHtml(r) {
    const esc = (str) => (str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    const contactParts = [r.email, r.phone, r.location, r.linkedin, r.github].filter(Boolean);

    const experienceHtml = (r.experience || []).map(exp => `
        <div class="entry">
            <div class="entry-header">
                <span class="entry-title">${esc(exp.role)}</span>
                <span class="entry-right">${esc(exp.duration)}</span>
            </div>
            <div class="entry-subtitle">${esc(exp.company)}</div>
            <ul>
                ${(exp.bullets || []).map(b => `<li>${esc(b)}</li>`).join('')}
            </ul>
        </div>
    `).join('');

    const educationHtml = (r.education || []).map(ed => `
        <div class="entry">
            <div class="entry-header">
                <span class="entry-title">${esc(ed.degree)}</span>
                <span class="entry-right">${esc(ed.year)}</span>
            </div>
            <div class="entry-subtitle">${esc(ed.institution)}</div>
        </div>
    `).join('');

    const projectsHtml = (r.projects || []).map(p => `
        <div class="entry">
            <div class="entry-header">
                <span class="entry-title">${esc(p.name)}</span>
                ${p.link ? `<span class="entry-right">${esc(p.link)}</span>` : ''}
            </div>
            <p class="project-desc">${esc(p.description)}</p>
        </div>
    `).join('');

    const skillsHtml = (r.skills || []).map(s => `<span class="skill-tag">${esc(s)}</span>`).join('');

    const certsHtml = (r.certifications || []).length > 0
        ? `<ul>${(r.certifications).map(c => `<li>${esc(c)}</li>`).join('')}</ul>`
        : '';

    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>${esc(r.name)} - Resume</title>
<style>
  /* ATS-SAFE: no images, no colors on text, clean font stack */
  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    font-family: 'Arial', 'Helvetica Neue', Helvetica, sans-serif;
    font-size: 10.5pt;
    line-height: 1.45;
    color: #111;
    background: #fff;
  }

  /* ── HEADER ── */
  .header { text-align: center; padding-bottom: 10px; border-bottom: 2px solid #111; }
  .header h1 { font-size: 22pt; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; }
  .contact-line { margin-top: 5px; font-size: 9pt; color: #222; }
  .contact-line span { margin: 0 5px; }
  .contact-line span:not(:last-child)::after { content: " | "; color: #666; }

  /* ── SECTIONS ── */
  .section { margin-top: 14px; }
  .section-title {
    font-size: 11pt;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    border-bottom: 1.5px solid #111;
    padding-bottom: 2px;
    margin-bottom: 8px;
  }

  /* ── ENTRIES ── */
  .entry { margin-bottom: 9px; }
  .entry-header { display: flex; justify-content: space-between; align-items: baseline; }
  .entry-title { font-weight: 700; font-size: 10.5pt; }
  .entry-right { font-size: 9.5pt; color: #333; white-space: nowrap; }
  .entry-subtitle { font-style: italic; font-size: 9.5pt; color: #444; margin-bottom: 3px; }

  ul { padding-left: 18px; margin-top: 3px; }
  ul li { margin-bottom: 2px; font-size: 10pt; }

  /* ── SUMMARY ── */
  .summary-text { font-size: 10pt; line-height: 1.5; }

  /* ── SKILLS ── */
  .skills-container { display: flex; flex-wrap: wrap; gap: 5px; }
  .skill-tag {
    border: 1px solid #999;
    border-radius: 2px;
    padding: 1px 7px;
    font-size: 9pt;
    background: #fff;
  }

  /* ── PROJECTS ── */
  .project-desc { font-size: 9.5pt; color: #333; margin-top: 2px; }

</style>
</head>
<body>

  <!-- HEADER -->
  <div class="header">
    <h1>${esc(r.name)}</h1>
    <div class="contact-line">
      ${contactParts.map(c => `<span>${esc(c)}</span>`).join('')}
    </div>
  </div>

  <!-- PROFESSIONAL SUMMARY -->
  ${r.summary ? `
  <div class="section">
    <div class="section-title">Professional Summary</div>
    <p class="summary-text">${esc(r.summary)}</p>
  </div>` : ''}

  <!-- SKILLS -->
  ${(r.skills || []).length > 0 ? `
  <div class="section">
    <div class="section-title">Skills</div>
    <div class="skills-container">${skillsHtml}</div>
  </div>` : ''}

  <!-- EXPERIENCE -->
  ${(r.experience || []).length > 0 ? `
  <div class="section">
    <div class="section-title">Work Experience</div>
    ${experienceHtml}
  </div>` : ''}

  <!-- PROJECTS -->
  ${(r.projects || []).length > 0 ? `
  <div class="section">
    <div class="section-title">Projects</div>
    ${projectsHtml}
  </div>` : ''}

  <!-- EDUCATION -->
  ${(r.education || []).length > 0 ? `
  <div class="section">
    <div class="section-title">Education</div>
    ${educationHtml}
  </div>` : ''}

  <!-- CERTIFICATIONS -->
  ${certsHtml ? `
  <div class="section">
    <div class="section-title">Certifications</div>
    ${certsHtml}
  </div>` : ''}

</body>
</html>`;
}

module.exports = { generateResumeController, downloadResumeController };
