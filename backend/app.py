from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
import json
import os

app = Flask(__name__)
CORS(app)  # Habilitar CORS para permitir peticiones desde el frontend

# Datos de ejemplo para mostrar funcionamiento incluso sin datos reales
def generate_sample_data(n_samples=100):
    np.random.seed(42)
    data = {
        'edad': np.random.randint(18, 65, n_samples),
        'ingresos': np.random.normal(45000, 15000, n_samples),
        'gastos': np.random.normal(30000, 10000, n_samples),
        'puntuacion_credito': np.random.normal(700, 100, n_samples)
    }
    df = pd.DataFrame(data)
    # Asegurar que los datos sean razonables
    df['puntuacion_credito'] = df['puntuacion_credito'].clip(300, 850)
    df['gastos'] = df['gastos'].clip(10000, None)
    return df

# Cargar datos
@app.route('/api/data', methods=['GET'])
def get_data():
    try:
        # En un caso real, cargarías datos desde una base de datos
        # Para este ejemplo, generamos datos de muestra
        df = generate_sample_data()
        return jsonify({
            'success': True,
            'data': df.to_dict(orient='records'),
            'columns': df.columns.tolist()
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

# Obtener estadísticas básicas
@app.route('/api/stats', methods=['GET'])
def get_stats():
    try:
        df = generate_sample_data()
        stats = {
            'summary': df.describe().to_dict(),
            'correlations': df.corr().to_dict()
        }
        return jsonify({
            'success': True,
            'stats': stats
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

# Realizar clustering
@app.route('/api/clustering', methods=['POST'])
def perform_clustering():
    try:
        n_clusters = request.json.get('n_clusters', 3)
        df = generate_sample_data()
        
        # Preprocesamiento
        features = df.columns.tolist()
        X = df[features].values
        scaler = StandardScaler()
        X_scaled = scaler.fit_transform(X)
        
        # Clustering
        kmeans = KMeans(n_clusters=n_clusters, random_state=42)
        df['cluster'] = kmeans.fit_predict(X_scaled)
        
        # Calcular estadísticas por cluster
        cluster_stats = []
        for i in range(n_clusters):
            cluster_df = df[df['cluster'] == i]
            stats = {
                'cluster_id': i,
                'size': len(cluster_df),
                'centroid': kmeans.cluster_centers_[i].tolist(),
                'mean': cluster_df.mean().to_dict()
            }
            cluster_stats.append(stats)
        
        return jsonify({
            'success': True,
            'clustered_data': df.to_dict(orient='records'),
            'cluster_stats': cluster_stats
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

# Endpoint para predecir
@app.route('/api/predict', methods=['POST'])
def predict():
    try:
        # Obtener datos de la petición
        input_data = request.json.get('data', {})
        
        # En un caso real, usarías un modelo entrenado
        # Para este ejemplo, simulamos una predicción simple
        prediction = {
            'risk_score': np.random.normal(50, 10),
            'probability': np.random.random(),
            'category': np.random.choice(['Alto', 'Medio', 'Bajo'])
        }
        
        return jsonify({
            'success': True,
            'prediction': prediction,
            'input_data': input_data
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)