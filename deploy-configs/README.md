# 🚀 Deployment Guide for Portfolio Projects

This guide will help you deploy all 3 projects on free cloud platforms.
Live demo links will be added to your portfolio once deployed.

---

## 📋 Overview

| Project | Platform | DB | URL Pattern | Free Tier Details |
|---------|----------|:--:|-------------|-------------------|
| **Task Manager** | [Render](https://render.com) | H2 (in-memory) | `https://task-manager-hnk6.onrender.com` | 512MB RAM, sleeps after 15min |
| **Laundry System** | [Render](https://render.com) | H2 (in-memory) | `https://laundry-system-gzzc.onrender.com` | 512MB RAM, sleeps after 15min |
| **CDAC Enterprise** | [Render](https://render.com) | H2 (in-memory) | `https://cdac-enterprise.onrender.com` | 512MB RAM, sleeps after 15min |

---

## 1️⃣ Deploy Task Manager on Render

### Prerequisites
- A [Render](https://render.com) account (sign up with GitHub)
- The Dockerfile and render.yaml in your repo

### Steps

1. **Add deploy files to your repo:**
   ```bash
   # Copy files from deploy-configs/task-manager/ to your repo root
   cp deploy-configs/task-manager/Dockerfile /path/to/task-manager-springboot/
   cp deploy-configs/task-manager/render.yaml /path/to/task-manager-springboot/
   cp deploy-configs/task-manager/src/main/resources/application-prod.properties /path/to/task-manager-springboot/src/main/resources/
   
   cd /path/to/task-manager-springboot
   git add Dockerfile render.yaml src/main/resources/application-prod.properties
   git commit -m "Add Render deployment config with H2"
   git push origin master
   ```

2. **In Render Dashboard:**
   - Click **New +** → **Blueprint**
   - Connect your `SURYaDob/task-manager-springboot` repo
   - Render will detect `render.yaml` and auto-configure
   - Click **Apply**
   - Wait for the build (3-5 minutes)

3. **Verify:**
   - Visit `https://task-manager-hnk6.onrender.com`
   - The app will wake up after first request (takes ~30s cold start)
   - Register a test account to verify DB works

---

## 2️⃣ Deploy Laundry System on Render

### Prerequisites
- Your [Render](https://render.com) account (already set up from Task Manager)
- The Dockerfile pushed to your laundry-system repo

### Steps

1. **Add Dockerfile to your repo:**
   ```bash
   # Uses multi-stage build with maven:3.9-eclipse-temurin-17 (no mvnw needed)
   ```

2. **In Render Dashboard:**
   - Click **New +** → **Web Service**
   - Connect to `SURYaDob/laundry-system` (master branch)
   - **Name:** `laundry-system`
   - **Runtime:** Docker (auto-detected)
   - **Plan:** Free
   - **Environment variables:** `SPRING_PROFILES_ACTIVE` = `dev`
   - Click **Create Web Service**

3. **Verify:**
   - Visit `https://laundry-system-gzzc.onrender.com`
   - First load takes ~30s (cold start)
   - Uses H2 in-memory DB (data resets on restart)

---

## 3️⃣ Deploy CDAC Enterprise on Render

### Prerequisites
- Your [Render](https://render.com) account (already set up from Task Manager)
- The Dockerfile pushed to your enterprise repo (with H2 profile support)

### Steps

1. **Add deploy files to your repo:**
   H2 dependency was added to `pom.xml` and an `application-h2.properties` file was created for in-memory demo deployment.

2. **In Render Dashboard:**
   - Click **New +** → **Web Service**
   - Connect to `SURYaDob/enterprise` (master branch)
   - **Name:** `cdac-enterprise`
   - **Runtime:** Docker (auto-detected)
   - **Plan:** Free
   - **Environment variables:** `SPRING_PROFILES_ACTIVE` = `h2`
   - Click **Create Web Service**

3. **Verify:**
   - Visit `https://cdac-enterprise.onrender.com`
   - First load takes ~30s (cold start)
   - Uses H2 in-memory DB (data resets on restart)
   - Swagger UI: `https://cdac-enterprise.onrender.com/swagger-ui.html`

---

## 4️⃣ Update Portfolio Demo Links

After each service is deployed, update the URLs in `index.html`:

1. Find the 3 project cards in `index.html`
2. Replace the placeholder URLs with your actual deployment URLs:

```html
<!-- Change from: -->
<a href="#" class="btn-demo" onclick="alert('Demo coming soon!')">
  Live Demo
</a>

<!-- To: -->
<a href="https://task-manager-hnk6.onrender.com" target="_blank" rel="noopener noreferrer" class="btn-demo">
  Live Demo
</a>
```

---

## 🔄 Keeping Data (Optional)

Each service uses an in-memory H2 database which resets on restart.
To persist data, upgrade Render to the Starter plan ($7/month) or use a free MySQL service like [aiven.io](https://aiven.io).

---

## 🆘 Troubleshooting

| Issue | Fix |
|-------|-----|
| Render app stuck "Building" | Check build logs for Maven errors. Run `mvn clean package` locally first |
| Docker build fails | Check the repo has a Dockerfile at root. Ensure Maven build image is available |
| Fly.io app won't connect | Use Render instead — no CLI or external DB needed |
| Cold start too slow | This is normal on free tier. First request takes 15-45 seconds |
| App crashes on startup | Verify Java 17 compatibility. Check environment variables |
