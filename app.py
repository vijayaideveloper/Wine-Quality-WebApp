from flask import Flask, render_template, request, jsonify
import joblib # For Loading Ml Model
import numpy as np # For Reshaping Data into 2D 


app = Flask(__name__)

#Load model
model = joblib.load('model/model.pkl')

Features = [
    'fixed acidity', 'volatile acidity', 'citric acid', 'residual sugar',
       'chlorides', 'free sulfur dioxide', 'total sulfur dioxide', 'density',
       'pH', 'sulphates', 'alcohol'
]

fea_meta = {
    'fixed acidity':       (4.6,  15.9,  0.1,  7.9,   'g/L',  'Tartaric acid — gives wine its tart taste'),
    'volatile acidity':    (0.12, 1.58,  0.01, 0.52,  'g/L',  'Acetic acid — too much = vinegar taste'),
    'citric acid':         (0.0,  1.0,   0.01, 0.27,  'g/L',  'Adds freshness and citrus flavor'),
    'residual sugar':      (0.9,  15.5,  0.1,  2.5,   'g/L',  'Sugar left after fermentation'),
    'chlorides':           (0.01, 0.61,  0.001,0.087, 'g/L',  'Salt content in wine'),
    'free sulfur dioxide': (1.0,  68.0,  1.0,  15.0,  'mg/L', 'Prevents microbial growth'),
    'total sulfur dioxide':(6.0,  289.0, 1.0,  46.0,  'mg/L', 'Total SO2 — free + bound'),
    'density':             (0.990,1.004, 0.0001,0.997,'g/mL', 'Density of wine vs water'),
    'pH':                  (2.74, 4.01,  0.01, 3.31,  '',     'Acidity level (lower = more acidic)'),
    'sulphates':           (0.33, 2.0,   0.01, 0.66,  'g/L',  'Antimicrobial additive'),
    'alcohol':             (8.4,  14.9,  0.1,  10.4,  '%',    'Alcohol by volume'),
}

@app.route('/')
def index():
    return render_template('index.html',
                           features=Features,
                           meta=fea_meta)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        values = [float(data[feat]) for feat in Features]
        arr = np.array(values).reshape(1,-1)

        predict = model.predict(arr)[0]
        proba = model.predict_proba(arr)[0]

        importance = model.feature_importances_
        top_features = sorted(zip(
            Features, importance,values
        ),
        key=lambda x: x[1], reverse=True)[:3]

        return jsonify({
            'prediction':int(predict),
            'label':'Good Quality' if predict == 1 else 'Bad Quality',
            'confidence':round(float(max(proba)) * 100),
            'prob_bad':round(float(proba[0])* 100, 1),
            'prob_good':round(float(proba[1])* 100, 1),

            'top_features':[
                {'name':f,'importance':round(float(i) * 100, 1), 'value': round(v,3)}
                for f,i,v in top_features
            ]
        })
    except Exception as e:
        return jsonify({'error':str(e)}), 400
    
@app.route('/rest', methods=['GET'])

def reset():
    defaults = {feat: fea_meta[feat][3] for feat in Features}
    return jsonify(defaults)

if __name__ == '__main__':
    app.run(debug=True, port=5000)