# 🚀 Step-by-Step Deployment Guide

Follow this guide to get your AI Career Map application live on the web using **Vercel** (Frontend) and **Render** (Backend).

---

## Prerequisites
1.  A **GitHub** account with your code pushed to a repository.
2.  A **MongoDB Atlas** account (Free tier is fine).
3.  A **Groq Cloud** account (for your AI API Key).
4.  (Optional but recommended) An **Upstash** account for Redis, or use Render's built-in Redis.

---

## Step 1: Backend Deployment (Render)

1.  **Login to Render**: Go to [dashboard.render.com](https://dashboard.render.com).
2.  **Create a Redis Instance**:
    - Click **New** > **Redis**.
    - Name it `career-map-redis`.
    - Note down the **Internal Redis URL** (e.g., `redis://red-xxxx:6379`).
3.  **Create the API Web Service**:
    - Click **New** > **Web Service**.
    - Connect your GitHub repository.
    - **Name**: `career-map-api`.
    - **Root Directory**: `server`.
    - **Build Command**: `npm install`.
    - **Start Command**: `node index.js`.
4.  **Configure Environment Variables**:
    - Go to the **Environment** tab and add:
        - `MONGO_URI`: Your MongoDB Atlas string.
        - `JWT_SECRET`: A long random string.
        - `GROQ_API_KEY`: Your key from Groq.
        - `REDIS_URL`: Use the Redis URL from step 2.
        - `ADMIN_USERNAME`: `althaf`
        - `ADMIN_PASSWORD`: Your chosen password.
        - `FRONTEND_URL`: Leave blank for now; you'll update this after the next step.
5.  **Add Persistent Storage** (Critical for Search):
    - Go to the **Disk** tab.
    - Click **Add Disk**.
    - **Name**: `lancedb-disk`.
    - **Mount Path**: `/opt/render/project/src/server/data/lancedb`.
    - **Size**: 1GB.
6.  **Create the Background Worker**:
    - Click **New** > **Worker**.
    - Connect the same repository.
    - **Root Directory**: `server`.
    - **Build Command**: `npm install`.
    - **Start Command**: `node startWorker.js`.
    - **Environment**: Add the same `MONGO_URI`, `REDIS_URL`, and `GROQ_API_KEY` as above.

---

## Step 2: Frontend Deployment (Vercel)

1.  **Login to Vercel**: Go to [vercel.com](https://vercel.com).
2.  **Import Project**:
    - Click **Add New** > **Project**.
    - Import your GitHub repository.
3.  **Configure Project**:
    - **Framework Preset**: Vite.
    - **Root Directory**: `client`.
4.  **Add Environment Variables**:
    - `VITE_API_URL`: Use your Render Web Service URL + `/api` (e.g., `https://career-map-api.onrender.com/api`).
5.  **Deploy**: Click **Deploy**. Vercel will give you a URL (e.g., `https://career-map.vercel.app`).

---

## Step 3: Link the two

1.  Go back to your **Render Web Service** (`career-map-api`).
2.  Go to **Environment**.
3.  Update `FRONTEND_URL` with your new Vercel URL.
4.  Render will redeploy, and your app is now fully connected!

---

## Step 4: Final Verification
1.  Go to your Vercel URL.
2.  Register a new user.
3.  Fill out an assessment and generate a roadmap.
4.  Verify you can see the career roadmaps and resources!
