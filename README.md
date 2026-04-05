# Wine Quality Prediction Web Application

An end-to-end Machine Learning web application designed to predict wine quality (Good/Bad) based on 11 physicochemical properties. This project utilizes a **Random Forest** classifier to achieve high predictive accuracy.

## 🚀 Overview
This application provides a user-friendly interface where users can adjust chemical features via sliders to see real-time predictions.
* **Model Performance**: 81.2% Accuracy.

* **Key Insight**: High alcohol content and low volatile acidity are primary drivers of quality.

* **Tech Stack**: Python, Flask, Scikit-Learn, Pandas, JavaScript (ES6), and CSS3.

## 📁 Project Structure
Based on the project directory:
```
Wine-Quality-WebApp/
├── datasets/           # Raw data (WineQT.csv)
├── model/              # Serialized Random Forest model (model.pkl)
├── researchs/          # Jupyter notebooks for EDA and Model Training
├── static/             # Frontend assets (main.js, style.css)
├── templates/          # HTML templates (index.html)
├── venv/               # Virtual environment
├── app.py              # Flask backend & API routes
├── requirements.txt    # Project dependencies
└── README.md           # Project documentation
```

## 🛠️ Installation & Setup

1. Clone the repository
```
git clone https://github.com/vijayaideveloper/Wine-Quality-WebApp.git
cd Wine-Quality-WebApp
```
2. Create a Virtual Environment
Windows:
```
python -m venv venv
venv\Scripts\activate
```
Linux/Ubuntu:
```
python3 -m venv venv
source venv/bin/activate
```
3. Install Dependencies
```
pip install -r requirements.txt
```
4. Run the Application

```
python app.py or python3 app.py
```
Visit http://127.0.0.1:5000 in your browser.



## How It Works

### Backend (app.py)
- `GET /`       → renders the HTML form with all 11 sliders
- `POST /predict` → receives JSON, runs model.predict(), returns JSON result
- `GET /reset`  → returns default (average) values for all features

### Frontend (HTML + CSS + JS)
- Sliders are synced with number inputs in real time
- On submit: JS collects all values → sends POST fetch → displays result
- Result shows: label (Good/Bad), confidence %, probability bar, top features

### Model
- Algorithm:   Random Forest (200 trees)
- Input:       11 chemical features
- Output:      0 = Low Quality (score 3-5), 1 = High Quality (score 6-8)
- Accuracy:    81.2% on test set (229 samples)

## Key Features to Watch
| Feature           | Effect on Quality          |
|-------------------|----------------------------|
| Alcohol (high)    | Increases quality           |
| Volatile Acidity (low) | Better quality         |
| Sulphates (high)  | Slight quality increase     |
| Citric Acid       | Adds freshness              |

## Developed by

Vijayakumar — AI & Data Science Student