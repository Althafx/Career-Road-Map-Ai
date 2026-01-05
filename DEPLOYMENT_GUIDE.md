# 🚀 Complete Deployment Guide - AI Career Map (Free Tier)

## 📝 Pre-Deployment Checklist
- [ ] MongoDB Atlas database created (free tier)
- [ ] Groq API key obtained
- [ ] GitHub repository ready
- [ ] Code pushed to GitHub

---

## Part 1: Set Up Free Redis (Upstash)

### Step 1.1: Create Upstash Account
1. Go to [console.upstash.com](https://console.upstash.com)
2. Sign up with GitHub (easiest option)

### Step 1.2: Create Redis Database
1. Click **"Create Database"**
2. **Name**: `career-map-redis`
3. **Type**: Regional
4. **Region**: Choose closest to your users
5. **Eviction**: Check "Enable Eviction" (optional)
6. Click **Create**

### Step 1.3: Get Connection String
1. Open your new database
2. Scroll to **"REST API" section**
3. Copy the **"UPSTASH_REDIS_REST_URL"** (starts with `https://`)
   - OR go to "Redis Info" tab and copy **Connection String** (starts with `redis://`)
   "https://current-trout-24056.upstash.io"
4. **Save this** - you'll need it for Render

---

## Part 2: Deploy Backend (Render)

### Step 2.1: Create Web Service
1. Go to [dashboard.render.com](https://dashboard.render.com)
2. Click **"New +"** > **"Web Service"**
3. Connect your GitHub account if not already connected
4. Select your repository: `Career-Road-Map-Ai`
5. Configure:
   - **Name**: `career-map-api` (or any name you want)
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Root Directory**: `server`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free

### Step 2.2: Add Environment Variables
Click **"Advanced"** > **"Add Environment Variable"**, then add each:

| Key | Value | Notes |
|-----|-------|-------|
| `NODE_ENV` | `production` | Tells app it's in production |
| `MONGO_URI` | Your MongoDB Atlas connection string | From Atlas dashboard |
| `JWT_SECRET` | Any random long string (e.g., `mySecretKey123!@#`) | For user auth tokens |
| `REDIS_URL` | Your Upstash URL from Step 1.3 | CRITICAL: Must start with `redis://` |
| `GROQ_API_KEY` | Your Groq API key | From console.groq.com |
| `ADMIN_USERNAME` | `althaf` (or your choice) | Admin login |
| `ADMIN_PASSWORD` | Your admin password | Keep it secure |
| `FRONTEND_URL` | `https://your-app.vercel.app` | **TEMP**: Use placeholder, update in Step 3.4 |

### Step 2.3: Deploy
1. Click **"Create Web Service"**
2. Wait 3-5 minutes for deployment
3. Check logs for:
   - ✅ `Server running on port XXXX`
   - ✅ `Background Worker started in main process`
   - ✅ `mongodb connected successfully`
4. Copy your Render URL (e.g., `https://career-map-api.onrender.com`)

---

## Part 3: Deploy Frontend (Vercel)

### Step 3.1: Import Project
1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **"Import Git Repository"**
3. Select your GitHub repo
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: (leave default) `npm run build`
   - **Output Directory**: (leave default) `dist`

### Step 3.2: Add Environment Variable
1. Click **"Environment Variables"**
2. Add:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://your-render-url.onrender.com/api`
   - Example: `https://career-map-api.onrender.com/api`

### Step 3.3: Deploy
1. Click **"Deploy"**
2. Wait 2-3 minutes
3. You'll get a URL like `https://career-map-xyz.vercel.app`

### Step 3.4: Update Backend CORS
1. Go back to Render dashboard
2. Find your Web Service > **Environment**
3. **Edit** `FRONTEND_URL` and set it to your Vercel URL from Step 3.3
4. Save - Render will auto-redeploy (takes ~2 minutes)

---

## Part 4: Verification

### Test 1: Backend Health
1. Visit: `https://your-render-url.onrender.com/api/test`
2. You should see: `{"message":"backend is working"}`

### Test 2: Full Flow
1. Go to your Vercel URL
2. Click **"Get Started"** or **"Register"**
3. Create a new account
4. Log in and fill out the assessment form
5. Click **"Generate Roadmap"**
6. Wait 30-60 seconds
7. ✅ Success: You should see a generated career roadmap!

### Test 3: Admin Panel
1. Go to `https://your-vercel-url/admin`
2. Login with your `ADMIN_USERNAME` and `ADMIN_PASSWORD`
3. You should see the user you just created

---

## 🐛 Troubleshooting

### Problem: "CORS Error" in browser console
**Solution**: Make sure `FRONTEND_URL` in Render matches your Vercel URL exactly (no trailing slash)

### Problem: Roadmap generation stuck at "Generating..."
**Solution**: 
1. Check Render logs for Redis connection errors
2. Verify `REDIS_URL` is correct and starts with `redis://`
3. Make sure Upstash database is active

### Problem: "Failed to sync embeddings" in Render logs
**Solution**: This is non-fatal. The app will still work. Check:
1. MongoDB connection is working
2. Resources exist in your database (run seed script locally first if needed)

### Problem: First request takes 30+ seconds
**Solution**: This is normal! Render free tier "sleeps" after 15 minutes. The first wake-up is slow.

---

## 🎯 For Your Interview

When discussing the architecture:

1. **Vector Search**: "I implemented semantic search using LanceDB with local embeddings (Xenova transformers) to match users with relevant learning resources. The system automatically rebuilds the index from MongoDB on deployment."

2. **Background Processing**: "I used BullMQ with Redis for async roadmap generation. This prevents API timeouts and allows the frontend to poll for job status, improving UX."

3. **Free Tier Optimization**: "I architected the system to run on 100% free infrastructure by merging the worker into the main process and using ephemeral storage with auto-sync strategies."

---

## 📊 Environment Summary

| Service | Provider | Cost | Purpose |
|---------|----------|------|---------|
| Frontend | Vercel | Free | React SPA hosting |
| Backend API | Render | Free | Express server + Worker |
| Database | MongoDB Atlas | Free | User data + Resources |
| Job Queue | Upstash Redis | Free | BullMQ task management |
| AI | Groq Cloud | Free | Roadmap generation |

**Total Monthly Cost: $0** 🎉
