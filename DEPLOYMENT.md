# 🚀 Deployment Guide - AI Career Map

Follow these steps to deploy your application to production.

## 1. Backend Deployment (Render / Railway)

### Required Environment Variables
| Variable | Description | Example |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB Atlas Connection String | `mongodb+srv://...` |
| `JWT_SECRET` | Secret for user and admin tokens | `your_random_secret` |
| `REDIS_URL` | Redis connection for BullMQ | `redis://...` |
| `FRONTEND_URL` | URL of your deployed frontend | `https://myapp.vercel.app` |
| `ADMIN_USERNAME` | Admin login username | `althaf` |
| `ADMIN_PASSWORD` | Admin login password | `althaf@0487` |
| `GROQ_API_KEY` | API Key for AI Generation | `gsk_...` |

### Infrastructure Notes
- **Persistence**: Ensure you mount a persistent disk to `/server/data/lancedb` to keep your vector search index across restarts.
- **Worker**: Run an additional background worker with the command `npm run worker` (in the `server` directory).

## 2. Frontend Deployment (Vercel)

1. Connect your GitHub repository to Vercel.
2. Set the **Root Directory** to `client`.
3. Configure the following **Environment Variable**:
    - `VITE_API_URL`: `https://your-api-url.onrender.com/api`

## 3. Post-Deployment
- Update the `FRONTEND_URL` on the backend once Vercel gives you the production URL.
- Verify connectivity by logging in as an admin or generating a roadmap.
