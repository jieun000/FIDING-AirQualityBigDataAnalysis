from flask import Flask, jsonify, request
from flask_cors import CORS ,cross_origin # CORS 추가
import tensorflow as tf
from tensorflow import keras
import cv2
import face_recognition
import pickle
import requests

result = {}
m_list = ['아황산가스', '일산화탄소', '오존', '이산화질소', 'PM10', 'PM2.5']
m_code_list = ["SO2", "CO", 'O3', 'NO2', 'PM10', 'PM25']  # 바꿔도 됨 react에서 요청하는 자료 형태로
def pearson_correlation_coefficient(y_true, y_pred):
    mx = tf.reduce_mean(y_true)
    my = tf.reduce_mean(y_pred)
    xm, ym = y_true - mx, y_pred - my
    r_num = tf.reduce_sum(xm * ym)
    r_den = tf.sqrt(tf.reduce_sum(tf.square(xm)) * tf.reduce_sum(tf.square(ym)))
    r = r_num / (r_den + tf.keras.backend.epsilon())
    return tf.reduce_mean(r)
def create_model(shape):
    model = tf.keras.Sequential([
        keras.layers.Dense(32, activation='sigmoid', input_shape=(shape,)),
        keras.layers.Dropout(0.5),
        keras.layers.Dense(64, activation='sigmoid'),
        keras.layers.Dense(1)  # Output layer for regression task
    ])
    optimizer = tf.keras.optimizers.Adam(learning_rate=0.001)
    model.compile(optimizer=optimizer,
                  loss=tf.keras.losses.MSE,
                  metrics=[pearson_correlation_coefficient])
    return model
for m, code in zip(m_list, m_code_list):
    if m in ['아황산가스', '일산화탄소', '오존', '이산화질소']:
        shape=7
    else: shape=4
    model = create_model(shape)
    model_path = f'C:/jieun/project3/backend/{m}_model_weights.h5'
    model.load_weights(model_path)
    if m in ['아황산가스', '일산화탄소', '오존', '이산화질소']:
        result[code] = model.predict([[1]*7])[0:0] # 이부분 data로
    else:result[code] = model.predict([[1]*4])[0][0]
print(result)