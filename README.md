# Voting App

## Overview
This is a MERN stack voting application that allows users to vote for candidates. It includes authentication, candidate management, and an admin panel for managing candidates.

## Tech Stack
- **Frontend:** React, Vite, TailwindCSS
- **Backend:** Node.js, Express.js, MongoDB (Atlas)
- **Authentication:** JWT & bcrypt
- **Hosting:**
  - Frontend: Vercel
  - Backend: Render
  - Database: MongoDB Atlas

## Features
- User authentication (Signup/Login using Aadhar card number)
- Admin panel to manage candidates (Add, Update, Delete)
- Vote for candidates
- Secure API with CORS and authentication

## Installation

### Prerequisites
- Node.js installed
- MongoDB Atlas account
- Git installed

### Backend Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/voting-app.git
   cd voting-app/backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
     
3. Start the server:
   ```bash
   npm start
   ```

### Frontend Setup
1. Navigate to frontend:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file:
   ```env
   VITE_BACKEND_URL=https://voting-app-backend-vc9y.onrender.com
   ```
4. Start the frontend:
   ```bash
   npm run dev
   ```

## Deployment
### Backend Deployment (Render)
1. Push your backend code to GitHub
2. Deploy to [Render](https://render.com/) by linking your repository
3. Add environment variables in Render Dashboard:
   - `PORT=3000`
   - `MONGODB_URL=<your-mongodb-atlas-url>`
   - `JWT_SECRET=<your-secret-key>`
4. Deploy and get the backend URL

### Frontend Deployment (Vercel)
1. Push frontend code to GitHub
2. Deploy to [Vercel](https://vercel.com/) by linking your repository
3. Add environment variables in Vercel Dashboard:
   - `VITE_BACKEND_URL=https://your-backend-url`
4. Deploy and get the frontend URL

## API Endpoints
### User Routes
- `POST /user/signup` - Register a new user
- `POST /user/login` - Login user
- `GET /user/profile` - Get user details

### Candidate Routes
- `GET /candidate` - Get all candidates
- `POST /candidate/add` - Add a new candidate (Admin only)
- `PUT /candidate/update/:id` - Update candidate (Admin only)
- `DELETE /candidate/delete/:id` - Delete candidate (Admin only)

## Contributing
Feel free to fork this repo and submit pull requests!

## License
MIT License

