━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  SMA BUILDERS & REAL ESTATES
  Complete Deployment Guide
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

YOUR FILES:
  📄 index.html     ← Your website
  📄 vercel.json    ← Vercel config (don't edit)
  📄 README.txt     ← This guide

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 1 — DEPLOY ON VERCEL (FREE)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Go to https://vercel.com
2. Click "Sign Up" → "Continue with Google"
3. Click "Add New Project" → "Upload"
4. Drag and drop this entire folder (sma-project)
5. Click "Deploy"
6. ✅ Your site is LIVE! You get a link like:
   https://sma-project.vercel.app

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 2 — CONNECT YOUR GODADDY DOMAIN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

In Vercel:
1. Go to your Project → Settings → Domains
2. Type: smaproperties.com → Add
3. Also add: www.smaproperties.com → Add

In GoDaddy (https://dcc.godaddy.com):
1. My Products → DNS → Manage
2. Delete any existing A record for "@"
3. Add these DNS records:

   Type    Name    Value                    TTL
   ─────────────────────────────────────────────
   A       @       76.76.21.21              600
   CNAME   www     cname.vercel-dns.com     600

4. Save → Wait 10 min to 24 hours
5. ✅ smaproperties.com now opens your website!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 3 — SET UP FIREBASE (FREE)
         (So properties save online for all devices)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Go to https://console.firebase.google.com
2. Click "Add project" → Name: sma-builders → Continue
3. Disable Google Analytics (optional) → Create project
4. Click </> (Web icon) → App nickname: SMA Website → Register App
5. You will see a config like this — COPY IT:

   const firebaseConfig = {
     apiKey: "AIzaSy...",
     authDomain: "sma-builders.firebaseapp.com",
     databaseURL: "https://sma-builders-default-rtdb.firebaseio.com",
     projectId: "sma-builders",
     storageBucket: "sma-builders.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abc123"
   };

6. Build → Realtime Database → Create database
   → Choose location: asia-southeast1 → Next
   → Start in TEST MODE → Enable

7. Open index.html in Notepad
8. Find the section that says:
   // ↓↓↓ PASTE YOUR FIREBASE CONFIG HERE ↓↓↓
9. Replace all PASTE_YOUR_..._HERE values
   with your actual Firebase config values
10. Save the file
11. Go to Vercel → Re-upload the updated index.html
12. ✅ Firebase is connected! Properties now save
    online for ALL devices!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 4 — GOOGLE ANALYTICS (FREE)
         (See ALL visitors from all devices)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Go to https://analytics.google.com
2. Sign in → Admin → Create Property
3. Property name: SMA Builders Website
4. Select India, INR, your timezone
5. Create → Web → Enter: smaproperties.com
6. You get a Measurement ID like: G-XXXXXXXXXX
7. Open index.html in Notepad
8. Find the Google Analytics comment block (near top)
9. Remove the <!-- and --> comment tags
10. Replace G-XXXXXXXXXX with your real ID (both places)
11. Re-upload to Vercel
12. ✅ Now analytics.google.com shows ALL visitors!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ADMIN PANEL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Password: sma2025
(To change: open index.html → find ADM_PW='sma2025' → change)

Admin panel shows:
✅ Firebase connection status
✅ Vercel deployment guide
✅ GoDaddy DNS setup guide
✅ Visitor statistics (local + Firebase)
✅ Add/Edit/Delete properties

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NEED HELP?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
All steps are also shown inside the Admin Panel
of your website. Just open the site → click Admin.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
