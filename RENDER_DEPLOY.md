# 🎯 CEAN - RENDER.COM DEPLOYMENT GUIDE

## Why Render.com?
Vercel mono-repo bug gives "Cannot read properties of undefined (reading 'fsPath')" error.
Render.com is FREE, simple, and 100% reliable for Node.js backends.

## STEP 1: Render Account
1. Open: https://render.com
2. Click "Get Started for Free"
3. Sign up with GitHub

## STEP 2: Deploy Backend
1. Dashboard → "New +" → "Web Service"
2. "Connect a repository" → select: `imadahamd81-collab/Community-Emergency-Alert-Network`
3. Configure:
   - **Name:** `cean-backend`
   - **Region:** Oregon (or Singapore)
   - **Branch:** `main`
   - **Root Directory:** `backend`
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `node src/server.js`
   - **Plan:** Free

## STEP 3: Environment Variables
Add these 5 variables:

| Key | Value |
|-----|-------|
| `MONGODB_URI` | `mongodb+srv://db_username:YHFCTRBgS6Hvhoyf@cluster0.scr4vf7.mongodb.net/cean?retryWrites=true&w=majority&appName=Cluster0` |
| `JWT_SECRET` | `cean_prod_8x3kP9mN2qR7vY4wL5jT6sB` |
| `CLIENT_URL` | `*` |
| `NODE_ENV` | `production` |
| `PORT` | `5000` |

## STEP 4: Deploy
1. Click "Create Web Service"
2. Wait 2-3 minutes for build + deploy
3. URL will be: `https://cean-backend.onrender.com`

## STEP 5: Test
Open in browser: `https://cean-backend.onrender.com/api/health`

Should see:
```json
{"success":true,"message":"Community Emergency Alert Network API is running"}
```

## STEP 6: Connect Frontend (after backend URL ready)
Tell me the Render URL, and I'll:
- Update `frontend/.env.production`
- Update Vercel env var `VITE_API_URL`
- Push to GitHub
- Vercel auto-redeploys

## STEP 7: Test Full Flow
- Open: `https://cean-frontend.vercel.app` (your existing frontend)
- Register a new user
- Login
- Create emergency
- All should work!