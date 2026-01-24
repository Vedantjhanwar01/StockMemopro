# GitHub Push Commands for vedantjhanwar

## Step 1: Create Repository on GitHub
1. Go to: https://github.com/new
2. Repository name: `StockMemo`
3. Make it **Private** (recommended) or Public
4. **DO NOT** check any boxes (no README, no .gitignore, no license)
5. Click **"Create repository"**

## Step 2: Copy-Paste These Commands

Open PowerShell in your project folder and run:

```powershell
cd d:\Downloads\Projects\StockMemo

# Add your GitHub repo as remote
git remote add origin https://github.com/vedantjhanwar/StockMemo.git

# Push to GitHub
git push -u origin master
```

## Step 3: If You Get Authentication Error

If it asks for credentials, you'll need a Personal Access Token:

1. Go to: https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Give it a name: "StockMemo"
4. Check "repo" permission
5. Generate and **copy the token**
6. Use the token as your password when pushing

## Alternative: Use GitHub Desktop
- Download: https://desktop.github.com/
- Sign in with your GitHub account
- Add the `d:\Downloads\Projects\StockMemo` folder
- Publish to GitHub

---

**Once pushed, let me know and I'll continue fixing the FMP integration!**
