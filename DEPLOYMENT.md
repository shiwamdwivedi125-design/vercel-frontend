# 🚀 Deployment Guide - Dharti Ka Swad

Follow these steps to put your project online (Production). We recommend using **Render.com** as it is free and easy to set up for MERN stack apps.

## 1. Prerequisites
- A [GitHub](https://github.com/) account.
- A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account (for your database).
- [Render](https://render.com/) account.

## 2. Prepare your Database (MongoDB Atlas)
1. Log in to MongoDB Atlas.
2. Create a new Cluster (the free shared one).
3. Under **Network Access**, add `0.0.0.0/0` (allows access from anywhere).
4. Under **Database Access**, create a user and save the password.
5. Click **Connect** > **Drivers** > **Node.js** to get your connection string.
   - It will look like: `mongodb+srv://<username>:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

## 3. Upload your code to GitHub
1. Go to GitHub and create a new **Private** repository named `dharti-ka-swad`.
2. Open your terminal in the project root and run:
   ```bash
   git init
   git add .
   git commit -m "Ready for deployment"
   git branch -M main
   git remote add origin https://github.com/YOUR_GITHUB_USERNAME/dharti-ka-swad.git
   git push -u origin main
   ```

## 4. Deploy on Render
1. Log in to Render.com and click **New** > **Web Service**.
2. Connect your GitHub repository.
3. Configure the settings:
   - **Name**: `dharti-ka-swad`
   - **Environment**: `Node`
   - **Root Directory**: Leave blank (root).
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
4. Click **Advanced** to add **Environment Variables**:
   - `MONGO_URI`: (Your MongoDB connection string from Step 2)
   - `JWT_SECRET`: (Any long random string, e.g., `DhartiSecret2026`)
   - `NODE_ENV`: `production`
   - `PORT`: `10000` (Render's default)
   - `RAZORPAY_KEY_ID`: (Your Razorpay Key)
   - `RAZORPAY_KEY_SECRET`: (Your Razorpay Secret)
   - `UPI_ID`: `shiwamdwivedi@naviaxis`

5. Click **Create Web Service**.

## 5. Final Step
- Render will build your frontend and start your backend. Once the status says **Live**, click the URL provided (e.g., `https://dharti-ka-swad.onrender.com`).
- Your website is now online! 🎉

---
> [!TIP]
> Make sure your `MONGO_URI` in the environment variables has the correct password replaced in the string.
