<div align="center">

# 👨‍💻 Suraj Dobale — Full Stack Java Developer

[![GitHub](https://img.shields.io/badge/GitHub-SURYaDob-6c63ff?style=for-the-badge&logo=github)](https://github.com/SURYaDob)
[![Portfolio](https://img.shields.io/badge/Portfolio-Live-00d4aa?style=for-the-badge&logo=react)](https://SURYaDob.github.io/resume-portfolio)
[![Resume](https://img.shields.io/badge/Resume-Download-ff6b6b?style=for-the-badge&logo=adobe)](SURAJ_DOBALE_RESUME.docx)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0a66c2?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/suraj-dobale-b713b91a6/)

**Java · Spring Boot · Hibernate · MySQL · HTML/CSS · JavaScript**

</div>

---

## 📸 Portfolio Preview

<div align="center">
  <a href="https://SURYaDob.github.io/resume-portfolio" target="_blank" rel="noopener noreferrer">
    <img src="screenshots/full-page.png" alt="Suraj Dobale Portfolio - Full Preview" width="95%" style="border-radius: 12px; border: 1px solid rgba(108, 99, 255, 0.2); box-shadow: 0 8px 32px rgba(0,0,0,0.3);" />
  </a>
  <br/>
  <sub>✨ Click the image to visit the live portfolio</sub>
</div>

<br/>

## 📋 About This Repository

This repository contains my professional portfolio website and ATS-optimized resume. It serves as a central hub for recruiters and hiring managers to evaluate my skills, experience, and projects as a **Full Stack Java Developer**.

### What's Inside

| File | Description |
|------|-------------|
| `index.html` | Interactive portfolio website (dark theme, particle effects, responsive) |
| `css/style.css` | Complete design system with animations and responsive layout |
| `js/main.js` | Interactive features (particles, typing effect, scroll animations, dark mode) |
| `SURAJ_DOBALE_RESUME.docx` | ATS-optimized resume PDF — ready to download |

---

## 🚀 Portfolio Features

- **🎨 Modern Dark Theme** — Eye-catching gradient design with purple/teal accents
- **✨ Particle Animation** — Interactive canvas particle background
- **⌨️ Typing Effect** — Dynamic role rotation (Full Stack Developer, Java Specialist, etc.)
- **📊 Animated Skill Bars** — Visual proficiency indicators with scroll-triggered animation
- **🃏 3D Project Cards** — Interactive tilt effects on project cards
- **🌓 Dark/Light Mode** — Theme toggle with localStorage persistence
- **📱 Fully Responsive** — Mobile-first design with hamburger navigation
- **♿ Accessibility** — `prefers-reduced-motion` support for users with motion sensitivities
- **⚡ Fast Loading** — Optimized CSS and deferred JavaScript

---

## 🛠️ Tech Stack Used for This Portfolio

| Technology | Purpose |
|------------|---------|
| HTML5 | Structure & SEO meta tags |
| CSS3 | Design system, animations, responsive layout |
| Vanilla JavaScript | Interactivity (no frameworks needed) |
| Google Fonts | Inter & Fira Code typography |
| GitHub Pages | Hosting & deployment |

---

## 📄 Resume

Download my resume in MS Word format:  
📄 [`SURAJ_DOBALE_RESUME.docx`](SURAJ_DOBALE_RESUME.docx)

---

## 🔗 Quick Links

- **Portfolio Website:** [SURYaDob.github.io/resume-porfolio](https://SURYaDob.github.io/resume-portfolio)
- **GitHub Profile:** [github.com/SURYaDob](https://github.com/SURYaDob)
- **Email:** [surajdobale29@gmail.com](mailto:surajdobale29@gmail.com)
- **Phone:** +91 9172567835

---

## 🚀 Deploy the Contact Form Backend

For the contact form to send messages automatically (instead of opening your email client), deploy the Spring Boot backend to Render.

### Step 1: Get a Gmail App Password
1. Go to [myaccount.google.com/security](https://myaccount.google.com/security) and enable **2-Step Verification**
2. Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
3. Select **Mail** → **Windows Computer** → **Generate**
4. Copy the 16-character password (e.g., `abcd efgh ijkl mnop`)

### Step 2: Deploy Backend to Render
1. Create a free account at [render.com](https://render.com) (GitHub login works)
2. Click **New +** → **Web Service**
3. Connect your GitHub repo: `SURYaDob/resume-portfolio`
4. Set these values:
   - **Name:** `suraj-portfolio-api`
   - **Root Directory:** `backend`
   - **Runtime:** `Java`
   - **Build Command:** `./mvnw clean package -DskipTests`
   - **Start Command:** `java -jar target/portfolio-backend-1.0.0.jar`
5. Add **Environment Variables**:
   - `SMTP_PASSWORD` → paste your 16-char Gmail App Password
   - `SMTP_USERNAME` → `surajdobale29@gmail.com`
6. Click **Create Web Service** → wait 3-5 minutes for the build
7. Copy your Render URL (e.g., `https://suraj-portfolio-api.onrender.com`)

### Step 3: Update the Frontend
1. Open `js/main.js`
2. Find this line:
   ```js
   this.PROD_BACKEND_URL = 'https://suraj-portfolio-api.onrender.com/api/contact';
   ```
3. Replace the URL with your actual Render URL
4. Commit and push the change to deploy to GitHub Pages

### Step 4: Verify
Fill in the contact form on your live site — messages will be saved to the database and emailed to you automatically!

### ⚡ One-Click Deploy
A [`render.yaml`](render.yaml) file is included for Blueprint deployments.

---

## 📬 Contact

I'm actively seeking **Full Stack Java Developer** opportunities. If you're a recruiter or hiring manager, please feel free to reach out!

- 📧 **Email:** [surajdobale29@gmail.com](mailto:surajdobale29@gmail.com)
- 💼 **LinkedIn:** [linkedin.com/in/suraj-dobale-b713b91a6](https://www.linkedin.com/in/suraj-dobale-b713b91a6/)
- 🐙 **GitHub:** [github.com/SURYaDob](https://github.com/SURYaDob)

---

<div align="center">
  
**Built with ☕ and passion by Suraj Dobale** © 2026

</div>
