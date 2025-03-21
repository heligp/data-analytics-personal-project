import React, { useState } from 'react';
import axios from 'axios';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Loader from '../common/Loader';
import ErrorMessage from '../common/ErrorMessage';
// import './Clustering.css';

function Clustering() {
  const [clusters, setClusters] = useState(3);
  const [clusterData, setClusterData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const performClustering = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/clustering', { n_clusters: clusters });
      setClusterData(response.data);
      setLoading(false);
    } catch (err) {
      setError('Error al realizar clustering: ' + err.message);
      setLoading(false);
    }
  };

  const prepareClusterScatter = () => {
    if (!clusterData) return [];
    return clusterData.clustered_data.map(item => ({
      x: item.ingresos,
      y: item.gastos,
      cluster: `Cluster ${item.cluster}`
    }));
  };

  const scatterData = prepareClusterScatter();
  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#a4de6c'];

  return (
    <div className="clustering">
      <h1>Análisis de Clustering</h1>
      <div className="controls">
        <label>
          Número de Clusters:
          <input
            type="number"
            min="2"
            max="5"
            value={clusters}
            onChange={(e) => setClusters(Number(e.target.value))}
          />
        </label>
        <button onClick={performClustering} disabled={loading}>
          {loading ? 'Procesando...' : 'Analizar Clusters'}
        </button>
      </div>
      {error && <ErrorMessage message={error} />}
      {clusterData && (
        <>
          <div className="chart-container">
            <h2>Visualización de Clusters (Ingresos vs Gastos)</h2>
            <ResponsiveContainer width="100%" height={400}>
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid />
                <XAxis type="number" dataKey="x" name="Ingresos" />
                <YAxis type="number" dataKey="y" name="Gastos" />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Legend />
                {[...Array(clusters).keys()].map(i => (
                  <Scatter
                    key={i}
                    name={`Cluster ${i}`}
                    data={scatterData.filter(item => item.cluster === `Cluster ${i}`)}
                    fill={colors[i % colors.length]}
                  />
                ))}
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <div className="cluster-stats">
            <h2>Estadísticas por Cluster</h2>
            <div className="stats-cards">
              {clusterData.cluster_stats.map(stat => (
                <div key={stat.cluster_id} className="cluster-card">
                  <h3>Cluster {stat.cluster_id}</h3>
                  <p>Tamaño: {stat.size} registros</p>
                  <div className="cluster-means">
                    <p><strong>Promedios:</strong></p>
                    <ul>
                      {Object.entries(stat.mean).map(([key, value]) => (
                        key !== 'cluster' && (
                          <li key={key}>{key}: {parseFloat(value).toFixed(2)}</li>
                        )
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Clustering;