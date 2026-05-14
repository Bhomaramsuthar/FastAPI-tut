# FastAPI & React Premium Predictor

A full-stack application featuring a Machine Learning-powered Insurance Premium Predictor and a Patient Management API. 

The backend is built with **FastAPI** to serve the ML model predictions and patient data, while the frontend is a modern, responsive **React (Vite)** interface styled with **Tailwind CSS**.

## 🚀 Features

- **Premium Predictor**: A beautiful React form that collects user details (age, weight, height, city, smoking status, income, occupation) and calls the ML model to predict the insurance premium category.
- **Patient Management API**: A RESTful FastAPI CRUD service (`main.py`) to manage patient records.
- **Modern UI**: Built with React, Tailwind CSS v4, Lucide Icons, and smooth micro-animations.

## 🛠️ Tech Stack

- **Backend**: Python, FastAPI, Pandas, Uvicorn, Scikit-learn (Pickle model)
- **Frontend**: React.js, Vite, Tailwind CSS v4, Lucide React

## 📦 Prerequisites

- Python 3.8+
- Node.js 18+ & npm

## ⚙️ Running Locally

### 1. Start the Backend (FastAPI)

Open a terminal in the root directory:

```bash
# Create and activate a virtual environment (optional but recommended)
python -m venv .venv
source .venv/Scripts/activate  # On Windows

# Install Python dependencies
pip install -r requirements.txt

# Start the FastAPI server
uvicorn app:app --reload
```
The API will run at `http://localhost:8000`. 
*Note: `app.py` runs the prediction model. You can run `uvicorn main:app --reload` to test the Patient API.*

### 2. Start the Frontend (React)

Open a new terminal and navigate to the `frontend` directory:

```bash
cd frontend

# Install Node dependencies
npm install

# Start the Vite development server
npm run dev
```
The React app will be available at `http://localhost:5173`.