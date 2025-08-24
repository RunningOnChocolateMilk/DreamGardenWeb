# 🚀 DreamGarden Deployment Guide

## 📋 Pre-Deployment Checklist

### Environment Setup
- [ ] Set up production environment variables
- [ ] Configure API keys
- [ ] Set up domain and SSL certificates
- [ ] Configure CDN (optional)

### Security
- [ ] Review and update security headers
- [ ] Set up rate limiting
- [ ] Configure CORS policies
- [ ] Set up monitoring and logging

### Performance
- [ ] Optimize images and assets
- [ ] Configure caching strategies
- [ ] Set up CDN for static assets
- [ ] Enable compression

## 🎯 Deployment Options

### Option 1: Vercel (Recommended)

#### Prerequisites
- Vercel account
- GitHub repository
- Domain name (optional)

#### Steps
1. **Connect Repository**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Login to Vercel
   vercel login
   
   # Deploy
   vercel --prod
   ```

2. **Environment Variables**
   - Go to Vercel Dashboard
   - Navigate to your project
   - Add environment variables:
     ```
     NEXT_PUBLIC_OPENAI_API_KEY=your_key
     NEXT_PUBLIC_WEATHER_API_KEY=your_key
     NODE_ENV=production
     ```

3. **Custom Domain**
   - Add domain in Vercel Dashboard
   - Configure DNS records
   - Enable SSL

### Option 2: Netlify

#### Steps
1. **Connect Repository**
   - Connect GitHub repository to Netlify
   - Set build command: `npm run build`
   - Set publish directory: `out`

2. **Environment Variables**
   - Add in Netlify Dashboard
   - Same variables as Vercel

3. **Deploy**
   - Automatic deployment on push to main branch

### Option 3: Self-Hosted (Docker)

#### Dockerfile
```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

#### Docker Compose
```yaml
version: '3.8'
services:
  dreamgarden:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_OPENAI_API_KEY=${OPENAI_API_KEY}
      - NEXT_PUBLIC_WEATHER_API_KEY=${WEATHER_API_KEY}
    restart: unless-stopped
```

## 🔧 Production Configuration

### Environment Variables
Create `.env.production`:
```env
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NEXT_PUBLIC_OPENAI_API_KEY=your_production_key
NEXT_PUBLIC_WEATHER_API_KEY=your_production_key
NEXT_PUBLIC_GA_ID=your_ga_id
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn
```

### Build Optimization
```bash
# Production build
npm run build

# Start production server
npm start
```

### Performance Monitoring
1. **Google Analytics**
   - Add GA4 tracking code
   - Set up custom events

2. **Sentry**
   - Configure error tracking
   - Set up performance monitoring

3. **Vercel Analytics** (if using Vercel)
   - Enable in dashboard
   - Monitor Core Web Vitals

## 🔒 Security Checklist

### Headers
- [ ] X-Frame-Options: DENY
- [ ] X-Content-Type-Options: nosniff
- [ ] Referrer-Policy: origin-when-cross-origin
- [ ] X-XSS-Protection: 1; mode=block
- [ ] Strict-Transport-Security: max-age=31536000

### Content Security Policy
Add to `next.config.js`:
```javascript
{
  key: 'Content-Security-Policy',
  value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;"
}
```

### Rate Limiting
- Set up API rate limiting
- Configure request throttling
- Monitor for abuse

## 📊 Monitoring Setup

### Error Tracking
```javascript
// Add to _app.tsx or layout.tsx
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
})
```

### Performance Monitoring
```javascript
// Add to _app.tsx
import { Analytics } from '@vercel/analytics/react'

export default function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <Analytics />
    </>
  )
}
```

## 🚀 Post-Deployment

### Testing
- [ ] Test all pages and features
- [ ] Verify API integrations
- [ ] Check mobile responsiveness
- [ ] Test error handling
- [ ] Verify analytics tracking

### Monitoring
- [ ] Set up uptime monitoring
- [ ] Configure error alerts
- [ ] Monitor performance metrics
- [ ] Track user analytics

### Maintenance
- [ ] Set up automated backups
- [ ] Configure log rotation
- [ ] Plan regular updates
- [ ] Monitor security updates

## 📞 Support

For deployment issues:
1. Check Vercel/Netlify logs
2. Verify environment variables
3. Test locally with production build
4. Check browser console for errors

## 🔄 CI/CD Pipeline

### GitHub Actions
```yaml
name: Deploy to Production
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npm run test
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

This deployment guide covers the essential steps to get DreamGarden production-ready. Choose the deployment option that best fits your needs and follow the checklist to ensure a smooth launch.
