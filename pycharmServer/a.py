
import numpy as np
import tensorflow as tf
from tensorflow import keras

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
    early_stopping = tf.keras.callbacks.EarlyStopping(monitor='val_loss', patience=10, restore_best_weights=True)
    return model, early_stopping
def predict():
    for m in m_list:
        model, early_stopping=create_model()
        model_path = f'C:/prj3/{m}_model_weights.h5'
        model.load_weights(model_path)
        pred=model.predict([[756,31.47267,0,0.021]])
        print(pred)
predict()