import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Loader from '../common/Loader';
import ErrorMessage from '../common/ErrorMessage';
import './Dashboard.css';

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('/stats');
        setStats(response.data.stats);
        setLoading(false);
      } catch (err) {
        setError('Error al cargar las estadísticas: ' + err.message);
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;

  const prepareCorrelationData = () => {
    if (!stats) return [];
    const correlations = stats.correlations;
    const keys = Object.keys(correlations);
    return keys.map(key => ({
      name: key,
      ...correlations[key]
    }));
  };

  const correlationData = prepareCorrelationData();

  return (
    <div className="dashboard">
      <h1>Dashboard de Análisis Financiero</h1>
      <div className="stats-container">
        {/* Tabla de resumen */}
      </div>
      <div className="chart-container">
        <h2>Matriz de Correlación</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={correlationData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" />
            <YAxis domain={[-1, 1]} />
            <Tooltip />
            <Legend />
            {correlationData.length > 0 && 
              Object.keys(correlationData[0])
                .filter(key => key !== 'name')
                .map((key, index) => (
                  <Bar key={index} dataKey={key} fill={`#${Math.floor(Math.random()*16777215).toString(16)}`} />
                ))
            }
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Dashboard;