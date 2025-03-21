import React, { useState } from 'react';
import axios from 'axios';
import Loader from '../common/Loader';
import ErrorMessage from '../common/ErrorMessage';
// import './Prediction.css';

function Prediction() {
  const [inputData, setInputData] = useState({
    edad: 35,
    ingresos: 50000,
    gastos: 30000,
    puntuacion_credito: 720
  });
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputData(prev => ({
      ...prev,
      [name]: parseFloat(value)
    }));
  };

  const makePrediction = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/predict', { data: inputData });
      setPrediction(response.data.prediction);
      setLoading(false);
    } catch (err) {
      setError('Error al hacer predicción: ' + err.message);
      setLoading(false);
    }
  };

  return (
    <div className="prediction">
      <h1>Predicción de Riesgo Financiero</h1>
      <div className="input-form">
        <h2>Datos del Cliente</h2>
        {/* Formulario de entrada */}
      </div>
      {error && <ErrorMessage message={error} />}
      {prediction && (
        <div className="prediction-result">
          <h2>Resultado de la Predicción</h2>
          {/* Mostrar resultados */}
        </div>
      )}
    </div>
  );
}

export default Prediction;