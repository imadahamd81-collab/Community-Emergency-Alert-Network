# Vercel Configuration
# Project structure: monorepo with frontend (React) + backend (Express) + api/ (Vercel serverless)

# Vercel auto-detects this layout when:
# - frontend/ has package.json with "build" script
# - api/ folder contains serverless functions
# - vercel.json is NOT present (uses defaults)

# Build settings in Vercel dashboard (Project Settings → General):
#   Framework Preset: Vite
#   Root Directory: .  (root, not frontend)
#   Build Command: cd frontend && npm install && npm run build && cd .. && mkdir -p api/public && cp -r frontend/dist/. api/public/
#   Output Directory: api/public

# Environment Variables (Project Settings → Environment Variables):
MONGODB_URI=mongodb+srv://db_username:YHFCTRBgS6Hvhoyf@cluster0.scr4vf7.mongodb.net/cean?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=cean_prod_8x3kP9mN2qR7vY4wL5jT6sB
CLIENT_URL=*
NODE_ENV=production
VITE_API_URL=/api
VITE_SOCKET_URL=