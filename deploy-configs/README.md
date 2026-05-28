# 🚀 Deployment Guide for Portfolio Projects

This guide will help you deploy all 3 projects on free cloud platforms.
Live demo links will be added to your portfolio once deployed.

---

## 📋 Overview

| Project | Platform | DB | URL Pattern | Free Tier Details |
|---------|----------|:--:|-------------|-------------------|
| **Task Manager** | [Render](https://render.com) | H2 (in-memory) | `https://task-manager-hnk6.onrender.com` | 512MB RAM, sleeps after 15min |
| **Laundry System** | [Koyeb](https://koyeb.com) | H2 (in-memory) | `https://laundry-system-gzzc.onrender.com` | 512MB RAM, always-on! |
| **CDAC Enterprise** | [Fly.io](https://fly.io) | MySQL/PostgreSQL | `https://cdac-enterprise.fly.dev` | 256MB RAM, 3GB storage |

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

## 2️⃣ Deploy Laundry System on Koyeb

### Prerequisites
- A [Koyeb](https://koyeb.com) account (sign up with GitHub)
- The Dockerfile in your repo

### Steps

1. **Add deploy files to your repo:**
   ```bash
   cp deploy-configs/laundry-system/Dockerfile /path/to/laundry-system/
   
   cd /path/to/laundry-system
   git add Dockerfile
   git commit -m "Add Dockerfile for Koyeb deployment"
   git push origin master
   ```

2. **In Koyeb Dashboard:**
   - Go to [app.koyeb.com](https://app.koyeb.com)
   - Click **Create App**
   - Choose **GitHub** → Authorize → Select `SURYaDob/laundry-system`
   - **Builder:** Docker
   - **Dockerfile path:** `./Dockerfile`
   - **Port:** `8080`
   - **Environment variables:**
     - `SPRING_PROFILES_ACTIVE` = `dev`
   - **App name:** `laundry-system`
   - Click **Deploy**

3. **Verify:**
   - Visit `https://laundry-system-gzzc.onrender.com`
   - Koyeb stays always-on (no cold starts!)
   - Login with default credentials if the app has seeded data

---

## 3️⃣ Deploy CDAC Enterprise on Fly.io

### Prerequisites
- A [Fly.io](https://fly.io) account (requires credit card for verification, free tier usage)
- [Fly CLI](https://fly.io/docs/hands-on/install-flyctl/) installed locally

### Steps

1. **Add deploy files to your repo:**
   ```bash
   cp deploy-configs/cdac-enterprise/fly.toml /path/to/enterprise/
   
   cd /path/to/enterprise
   git add fly.toml
   git commit -m "Add Fly.io deployment configuration"
   git push origin master
   ```

2. **Deploy via Fly CLI:**
   ```bash
   # Install Fly CLI (Windows/Mac/Linux)
   # Windows: winget install flyctl
   # Mac: brew install flyctl
   # Linux: curl -L https://fly.io/install.sh | sh
   
   flyctl auth login
   cd /path/to/enterprise
   flyctl launch
   # → Name: cdac-enterprise
   # → Region: bom (Mumbai - closest to Nagpur)
   # → Leave Dockerfile as-is
   
   # Set required secrets
   flyctl secrets set SPRING_PROFILES_ACTIVE=prod
   flyctl secrets set DB_URL=jdbc:mysql://host:port/dbname
   flyctl secrets set DB_USERNAME=your_db_user
   flyctl secrets set DB_PASSWORD=your_db_pass
   flyctl secrets set JWT_SECRET=$(openssl rand -base64 32)
   flyctl secrets set CORS_ALLOWED_ORIGINS=https://SURYaDob.github.io
   
   # Note: For the database, you can use:
   # Option A: Fly.io PostgreSQL (Recommended)
   #   flyctl postgres create --name cdac-db
   #   flyctl postgres attach cdac-db
   # Option B: Free MySQL from aiven.io
   
   flyctl deploy
   ```

3. **Verify:**
   - Visit `https://cdac-enterprise.fly.dev`
   - Check health: `https://cdac-enterprise.fly.dev/actuator/health`
   - Swagger UI: `https://cdac-enterprise.fly.dev/swagger-ui.html`
   - Add a test record via the Swagger UI

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
| Koyeb deployment fails | Ensure Dockerfile is at repo root. Check Docker build logs |
| Fly.io app won't connect | Check `flyctl logs`. Ensure DB connection string is correct |
| Cold start too slow | This is normal on free tier. First request takes 15-45 seconds |
| App crashes on startup | Verify Java 17 compatibility. Check environment variables |
