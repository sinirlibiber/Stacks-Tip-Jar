# 🚀 Stacks Tip Jar - Deployment Guide

This guide provides step-by-step instructions for deploying the Stacks Tip Jar application on **Stacks Mainnet** in a **production environment**.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Smart Contract Deployment](#smart-contract-deployment)
3. [Frontend Configuration](#frontend-configuration)
4. [Vercel Deployment](#vercel-deployment)
5. [Netlify Deployment](#netlify-deployment)
6. [GitHub Repository Setup](#github-repository-setup)
7. [Post-Deployment Testing](#post-deployment-testing)
8. [Troubleshooting](#troubleshooting)
9. [Production Checklist](#production-checklist)

---

## 🔧 Prerequisites

### 1. Required Software

- **Node.js**: v18 or higher ([Download](https://nodejs.org/))
- **pnpm**: `npm install -g pnpm`
- **Clarinet**: Stacks smart contract development tool
  ```bash
  # macOS/Linux
  brew install clarinet
  
  # Windows
  winget install clarinet
  
  # Or download binary:
  # https://github.com/hirosystems/clarinet/releases
  ```
- **Git**: For version control

### 2. Stacks Mainnet Wallet

- **Leather Wallet** ([Chrome Extension](https://leather.io/install-extension))
- **Xverse** ([Download](https://www.xverse.app/))
- **Hiro Wallet** ([Download](https://wallet.hiro.so/))

**Important:** Your wallet must have sufficient STX for smart contract deployment (~1-2 STX).

### 3. Accounts

- **GitHub Account**: For code repository
- **Vercel/Netlify Account**: For frontend hosting
- **Hiro Platform Account** (optional): For GUI-based contract deployment ([platform.hiro.so](https://platform.hiro.so/))

---

## 🔗 Smart Contract Deployment

### Method 1: Deploy with Clarinet CLI (Recommended)

#### Step 1: Create Clarinet Project

```bash
# Create a new directory
mkdir tip-jar-contract
cd tip-jar-contract

# Initialize Clarinet project
clarinet new tip-jar-project
cd tip-jar-project
```

#### Step 2: Copy Contract File

```bash
# Copy tip-jar.clar from your project
cp /path/to/your/project/contracts/tip-jar.clar contracts/tip-jar.clar
```

**Or manually:**
1. Create `contracts/tip-jar.clar` file
2. Copy contents from `contracts/tip-jar.clar` in your project

#### Step 3: Update Clarinet.toml

Open `Clarinet.toml` and add the contract:

```toml
[project]
name = "tip-jar-project"
authors = []
description = "Stacks Tip Jar Smart Contract"
telemetry = false

[contracts.tip-jar]
path = "contracts/tip-jar.clar"
clarity_version = 2
epoch = 2.5
```

#### Step 4: Local Testing (Optional but Recommended)

```bash
# Start Clarinet console
clarinet console

# Test in console:
# >> (contract-call? .tip-jar send-tip 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM u1000000 u"Test message")
```

#### Step 5: Mainnet Deployment Configuration

```bash
# Generate deployment configuration
clarinet deployments generate --mainnet
```

This command creates `deployments/default.mainnet-plan.yaml`.

#### Step 6: Set Wallet Private Key

**⚠️ SECURITY WARNING**: Never commit your private key to Git!

```bash
# Set as environment variable
export STACKS_PRIVATE_KEY="your-private-key-here"

# Or create .env file (ensure it's in .gitignore)
echo "STACKS_PRIVATE_KEY=your-private-key-here" > .env
```

**How to Get Private Key:**
1. Leather Wallet → Settings → View Secret Key
2. Copy private key (hex format)

#### Step 7: Deploy!

```bash
# Deploy to Mainnet
clarinet deployments apply --mainnet
```

After deployment completes, you'll receive:
```
✅ Contract deployed!
Contract ID: SP1234...XYZ.tip-jar
Transaction ID: 0xabc123...
```

**IMPORTANT:** Save this information! You'll need `CONTRACT_ADDRESS` and `CONTRACT_NAME` in your frontend.

---

### Method 2: Deploy with Hiro Platform (GUI)

An easier alternative:

1. Go to **[platform.hiro.so](https://platform.hiro.so/)**
2. Click "Deploy a Contract"
3. Login with Leather/Xverse
4. Paste `contracts/tip-jar.clar` contents
5. Contract name: `tip-jar`
6. Network: Select **Mainnet**
7. Click "Deploy Contract"
8. Confirm transaction in your wallet

Save the deployed contract ID (e.g., `SP1ABC...XYZ.tip-jar`).

---

## ⚙️ Frontend Configuration

### Step 1: Update Contract Address

Update the deployed contract information in your frontend:

**File:** `src/lib/stacks-config.ts`

```typescript
import { STACKS_MAINNET } from '@stacks/network';

export const STACKS_NETWORK = STACKS_MAINNET;

// ⚠️ UPDATE THIS WITH YOUR DEPLOYED ADDRESS!
export const CONTRACT_ADDRESS = 'SP1ABC123DEF456GHI789JKL'; // Your deployed address
export const CONTRACT_NAME = 'tip-jar';

export const STACKS_EXPLORER = 'https://explorer.hiro.so';
export const STACKS_API = 'https://api.mainnet.hiro.so';

// ... rest of file
```

### Step 2: Build Test

```bash
# Install dependencies
pnpm install

# Create production build
pnpm build

# Local test (optional)
pnpm start
```

Open `http://localhost:3000` in your browser and test.

---

## 🚀 Vercel Deployment

### Method 1: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

### Method 2: GitHub Integration (Recommended)

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "feat: add stacks tip jar"
   git push origin main
   ```

2. Go to **[vercel.com](https://vercel.com/)**

3. "New Project" → Select GitHub repository

4. **Build Settings**:
   - Framework Preset: `Next.js`
   - Build Command: `pnpm build`
   - Output Directory: `.next`
   - Install Command: `pnpm install`

5. **Environment Variables** (if needed):
   ```
   NEXT_PUBLIC_STACKS_NETWORK=mainnet
   ```

6. Click "Deploy"

7. After deployment completes, you'll receive a URL:
   ```
   https://tip-jar-stacks.vercel.app
   ```

### Vercel Domain Settings (Optional)

1. Vercel Dashboard → Project Settings → Domains
2. Add custom domain (e.g., `tipjar.example.com`)
3. Configure DNS settings (A record or CNAME)

---

## 🌐 Netlify Deployment

### Method 1: Netlify CLI

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy

# Production deploy
netlify deploy --prod
```

### Method 2: Netlify GUI

1. Go to **[netlify.com](https://netlify.com/)**

2. "Add new site" → "Import an existing project"

3. Select GitHub repository

4. **Build Settings**:
   - Build command: `pnpm build`
   - Publish directory: `.next`
   - Base directory: (leave empty)

5. **Environment Variables**:
   ```
   NEXT_PUBLIC_STACKS_NETWORK=mainnet
   ```

6. Click "Deploy site"

---

## 📦 GitHub Repository Setup

### Create New Repository

```bash
# Initialize git locally
git init

# Create .gitignore (skip if already exists)
cat > .gitignore << EOL
node_modules/
.next/
out/
.env
.env.local
.vercel
.netlify
*.log
.DS_Store
EOL

# Initial commit
git add .
git commit -m "Initial commit: Stacks Tip Jar dApp"

# Create new repo on GitHub (github.com/new)
# Then add remote:
git remote add origin https://github.com/username/tip-jar.git
git branch -M main
git push -u origin main
```

### README and Documentation

Your repository should include:
- ✅ `README.md` - Project description
- ✅ `DEPLOYMENT_GUIDE.md` - This file
- ✅ `LICENSE` - MIT or your preferred license
- ✅ `contracts/tip-jar.clar` - Smart contract code

### For Stacks Builder Challenge

**Important:** Make regular commits! Commit frequency matters for competition scoring.

```bash
# Separate commit for each feature
git commit -m "feat: add wallet connection"
git commit -m "feat: add tip page creation"
git commit -m "feat: add leaderboard"
git commit -m "style: improve mobile responsiveness"
git commit -m "docs: update README with deployment steps"
```

Try to commit daily (until December 30th).

---

## ✅ Post-Deployment Testing

After deployment, run these tests:

### 1. Wallet Connection
- [ ] Click "Connect Wallet" button
- [ ] Does Leather/Xverse popup open?
- [ ] Does address appear after confirming connection?

### 2. Tip Page Creation
- [ ] Enter username (3-20 characters)
- [ ] Does "Create Tip Page" button work?
- [ ] Does it redirect to `/tip/username`?

### 3. QR Code
- [ ] Is QR code visible?
- [ ] Does QR code contain correct URL? (Test by scanning with mobile)

### 4. X/Twitter Share
- [ ] Click "Share on X" button
- [ ] Does Twitter popup contain correct message?
- [ ] Is the link correct?

### 5. Send Tip (Real Test!)
- [ ] Connect with another wallet
- [ ] Send tip to a user
- [ ] Did you receive transaction ID?
- [ ] Is transaction visible on [Explorer](https://explorer.hiro.so)?
- [ ] Did recipient's balance increase?

### 6. Leaderboard
- [ ] Does `/leaderboard` page open?
- [ ] Are users listed?
- [ ] Are statistics correct?

### 7. Mobile Test
- [ ] Open on mobile device
- [ ] Is responsive view correct?
- [ ] Do touch interactions work?

---

## 🐛 Troubleshooting

### Problem 1: "Cannot connect wallet"

**Cause:** Stacks wallet extension not installed or on different network.

**Solution:**
1. Check if Leather/Xverse/Hiro wallet is installed
2. Switch wallet to **Mainnet** (Settings → Network → Mainnet)
3. Refresh page

---

### Problem 2: "Contract not found"

**Cause:** Wrong `CONTRACT_ADDRESS` or contract not yet deployed.

**Solution:**
1. Check `src/lib/stacks-config.ts` file
2. Is contract address correct? (Format: `SP...ABC.tip-jar`)
3. Search for contract on [Explorer](https://explorer.hiro.so/)
4. If deployed, wait 1-2 blocks

---

### Problem 3: "Transaction failed"

**Cause:** Insufficient STX balance or network error.

**Solution:**
1. Do you have enough STX? (At least tip amount + ~0.001 STX fee)
2. Are you on Mainnet? (Not Testnet)
3. Check Stacks network status: [status.hiro.so](https://status.hiro.so/)
4. Retry transaction

---

### Problem 4: "Build failed on Vercel"

**Cause:** Dependencies couldn't be installed or TypeScript error.

**Solution:**
1. Run `pnpm build` locally
2. Check for TypeScript errors
3. Any missing dependencies in `package.json`?
4. Is Node.js version 18+ on Vercel?
5. Review Vercel logs (Deployments → Details → Function Logs)

---

### Problem 5: "QR Code not generating"

**Cause:** URL is undefined or QR library not loaded.

**Solution:**
1. Is `react-qr-code` package installed? (`pnpm install react-qr-code`)
2. Is URL in correct format? (`https://yourdomain.com/tip/username`)
3. Any errors in browser console?

---

### Problem 6: "Contract call returns error u100/u101/u102"

**Cause:** Contract validation errors.

**Solution:**
- `ERR-INVALID-AMOUNT (u100)`: Tip amount must be greater than 0
- `ERR-TRANSFER-FAILED (u101)`: Insufficient balance or transfer error
- `ERR-INVALID-RECIPIENT (u102)`: Cannot tip yourself!

---

## 📋 Production Checklist

Check this list before deploying:

### Smart Contract
- [ ] Contract deployed to Mainnet
- [ ] Contract address updated in `stacks-config.ts`
- [ ] Contract visible on explorer
- [ ] Test transaction successful

### Frontend
- [ ] `pnpm build` runs without errors
- [ ] No TypeScript errors
- [ ] All environment variables set
- [ ] Contract address correct in production

### GitHub
- [ ] Repository is public
- [ ] README.md is up to date
- [ ] DEPLOYMENT_GUIDE.md added
- [ ] LICENSE file exists
- [ ] `.gitignore` is correct (no .env, private keys!)
- [ ] Commit history is clean and organized

### Hosting
- [ ] Deployed on Vercel/Netlify
- [ ] Production URL works
- [ ] Custom domain set (optional)
- [ ] SSL certificate active (https)

### Testing
- [ ] Wallet connection works
- [ ] Sending tips works
- [ ] QR code generates
- [ ] X share button works
- [ ] Leaderboard works
- [ ] Mobile responsive
- [ ] Cross-browser tested (Chrome, Firefox, Safari)

### Stacks Builder Challenge
- [ ] Public GitHub repository
- [ ] Project description in README
- [ ] Live demo link
- [ ] Using Mainnet
- [ ] Smart contract source code
- [ ] Regular commit history
- [ ] Complete documentation

### Marketing & Community
- [ ] Announced on X/Twitter
- [ ] Shared on Stacks Discord
- [ ] Posted on Reddit r/stacks (optional)
- [ ] Submitted to Product Hunt (optional)

---

## 🎯 Next Steps

After successful deployment:

1. **Community Engagement**:
   - Share in Stacks community
   - Tweet with #Stacks #Bitcoin hashtags
   - Reach out to influencers

2. **Add Analytics**:
   - Google Analytics
   - Plausible (privacy-focused)
   - PostHog

3. **Monitoring**:
   - Sentry (error tracking)
   - Vercel Analytics
   - Uptime monitoring (UptimeRobot)

4. **Improvements**:
   - User profiles
   - Notification system
   - Badge achievements
   - Fiat to STX integration
   - Multi-language support

5. **Stacks Builder Challenge**:
   - Make regular commits (daily)
   - Get community feedback
   - Make improvements
   - Share progress on Twitter
   - **Deadline: December 30, 2025**

---

## 🏆 Builder Challenge Tips

**To increase your leaderboard score:**

1. **High Transaction Volume**:
   - Each tip = 1 transaction
   - Encourage community to use it
   - Run giveaways (bonus STX for first 100 users)

2. **Regular Development**:
   - At least 1 commit per day
   - Meaningful commit messages
   - Use feature branches

3. **Community Engagement**:
   - Be active on Discord
   - Share updates on Twitter
   - Implement feedback quickly

4. **Code Quality**:
   - Write clean code
   - TypeScript strict mode
   - Add comments
   - Detailed README

5. **Innovation**:
   - Add unique features
   - Optimize UX
   - Mobile-first approach
   - Accessibility (a11y)

---

## 📞 Support and Contact

**Stacks Resources:**
- Docs: [docs.stacks.co](https://docs.stacks.co)
- Discord: [stacks.org/discord](https://stacks.org/discord)
- Forum: [forum.stacks.org](https://forum.stacks.org)
- Builder Challenge: [stacks.org/builder-challenge](https://stacks.org/builder-challenge)

**Technical Problems:**
- Open GitHub Issues
- Stacks Discord #dev-chat channel
- Stack Overflow [stacks] tag

---

## ✨ Final Notes

**Critical points for success:**

1. ⚠️ **Don't forget to update CONTRACT_ADDRESS!** This is the most common mistake.
2. 🔐 **Never commit private keys!** `.env` file must be in `.gitignore`.
3. 🌐 **Make sure you're using Mainnet!** Testnet is invalid for the competition.
4. ⏰ **Don't forget December 30th deadline!** Don't leave it to the last minute.
5. 📊 **Verify transactions on explorer!** Important for validation.

**Good luck and happy building! 🚀**

---

**⚡ Built with Stacks | Powered by Bitcoin L2**
