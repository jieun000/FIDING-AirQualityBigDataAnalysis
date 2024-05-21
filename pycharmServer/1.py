from flask import Flask, jsonify, render_template,request
import tensorflow as tf
from tensorflow import keras

app = Flask(__name__)

# CORS 설정 - 실제 환경에서는 정확한 도메인을 설정해야 합니다.
from flask_cors import CORS
CORS(app)
m_list = [ 'PM10', 'PM2.5']
loaded_models = {}


def pearson_correlation_coefficient(y_true, y_pred):
    mx = tf.reduce_mean(y_true)
    my = tf.reduce_mean(y_pred)
    xm, ym = y_true - mx, y_pred - my
    r_num = tf.reduce_sum(xm * ym)
    r_den = tf.sqrt(tf.reduce_sum(tf.square(xm)) * tf.reduce_sum(tf.square(ym)))
    r = r_num / (r_den + tf.keras.backend.epsilon())
    return tf.reduce_mean(r)


def create_model():
    model = tf.keras.Sequential([
        keras.layers.Dense(20, activation='sigmoid', input_shape=(4,)),
        keras.layers.Dropout(0.5),
        keras.layers.Dense(40, activation='sigmoid'),
        keras.layers.Dense(1)  # Output layer for regression task
    ])
    optimizer = tf.keras.optimizers.Adam(learning_rate=0.001)
    model.compile(optimizer=optimizer,
                  loss=tf.keras.losses.MSE,
                  metrics=[pearson_correlation_coefficient])
    return model

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/data')
def get_data():
    data = request.json
    result={}
    m_list = ['아황산가스', '일산화탄소', '오존', '이산화질소', 'PM10', 'PM2.5']
    m_code_list=["a","c",'o','n','10','2.5']#바꿔도 됨 react에서 요청하는 자료 형태로

    for m,code in zip(m_list,m_code_list):
        model = create_model()
        model_path = f'C:/jieun/project3/backend/{m}_model_weights.h5'
        model.load_weights(model_path)
        result[code] = model.predict([[756, 31.47267, 0, 0.021]])#이부분 data로
        print(result[code])

    return jsonify(result)

result={}
m_code_list=["a","c",'o','n','10','2.5']#바꿔도 됨 react에서 요청하는 자료 형태로
for m, code in zip(m_list, m_code_list):
    model = create_model()
    model_path =f'C:/jieun/project3/backend/{m}_model_weights.h5'
    model.load_weights(model_path)
    result[code] = model.predict([[756, 31.47267, 0, 0.021]])  # 이부분 data로
    print(result[code])

if __name__ == '__main__':
    app.run(debug=True)