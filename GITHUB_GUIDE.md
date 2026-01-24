# Complete Step-by-Step Guide: Push StockMemo to GitHub

## Step 1: Open PowerShell
1. Press `Windows Key + X`
2. Click **"Windows PowerShell"** or **"Terminal"**
3. A black/blue window will open

## Step 2: Navigate to Your Project
Copy this command and paste it:
```powershell
cd d:\Downloads\Projects\StockMemo
```
Press **Enter**

You should see: `PS d:\Downloads\Projects\StockMemo>`

## Step 3: Add GitHub Repository
Copy and paste this:
```powershell
git remote add origin https://github.com/vedantjhanwar/StockMemopro.git
```
Press **Enter**

**Expected:** No output (that's good!)

## Step 4: Rename Branch to 'main'
Copy and paste this:
```powershell
git branch -M main
```
Press **Enter**

**Expected:** No output (that's good!)

## Step 5: Push to GitHub
Copy and paste this:
```powershell
git push -u origin main
```
Press **Enter**

### If It Asks for Login

**Option A: GitHub Desktop (EASIEST)**
1. Download: https://desktop.github.com/
2. Install and sign in with your GitHub account
3. Click "Add" → "Add Existing Repository"
4. Browse to `d:\Downloads\Projects\StockMemo`
5. Click "Publish repository"
6. **DONE!**

**Option B: Personal Access Token**
1. Go to: https://github.com/settings/tokens
2. Click **"Generate new token (classic)"**
3. Name: `StockMemo`
4. Check the **"repo"** box
5. Click **"Generate token"**
6. **COPY THE TOKEN** (you can't see it again!)
7. In PowerShell:
   - Username: `vedantjhanwar`
   - Password: **PASTE THE TOKEN** (not your GitHub password!)

## Step 6: Verify It Worked
1. Go to: https://github.com/vedantjhanwar/StockMemopro
2. Refresh the page
3. You should see all your files!

---

## What Should I Do?

**EASIEST:** Download GitHub Desktop and use that (no commands needed!)

**OR**

Run the 3 commands above and use a Personal Access Token if it asks for login

---

**Tell me when you're done or if you get stuck!**
