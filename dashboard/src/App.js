import { useState, useEffect } from 'react';

const spec = {
    temperature: { min: 18, max: 24 },
    humidity: { min: 30, max: 60 },
    air_quality: { max: 100 }
};

// check if it is compliant with the spec
function isCompliant(reading) {
    if (reading.temperature < spec.temperature.min || reading.temperature > spec.temperature.max) return false;
    if (reading.humidity < spec.humidity.min || reading.humidity > spec.humidity.max) return false;
    if (reading.air_quality && reading.air_quality > spec.air_quality.max) return false;
    return true;
}

function App() {
    const [readings, setReadings] = useState([]);
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
    async function fetchData(){
        const res = await fetch('http://localhost:4000/readings');
        const data = await res.json()
        setReadings(data.slice(0, 1)); // latest reading only
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
    }, []);


    async function fetchReport() {
        setLoading(true)
        const response = await fetch('http://localhost:4000/compliance/living-room');
        const data = await response.json();
        setReport(data.report)
        setLoading(false)
    }
    // const fetchReport = () => {
    //     fetch('http://localhost:4000/compliance/living-room')
    //         .then(res => res.json())
    //         .then(data => setReport(data.report));
    // };


    return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' ,        padding: '20px', 
        fontFamily: 'sans-serif',
        backgroundColor: '#1a1a2e',
        minHeight: '100vh',
        color: '#e0e0e0'}}>
        <h1>Asset Monitor</h1>
        {readings.map(r => {
        const compliant = isCompliant(r);
        return (
                <div key={r.id} style={{
                padding: '20px',
                marginBottom: '10px',
                borderRadius: '8px',
                backgroundColor: compliant ? '#1a3a2a' : '#3a1a1a',
                borderLeft: `6px solid ${compliant ? '#00c853' : '#ff1744'}`
                }}>
                <h2>{r.sensor_id} — {compliant ? '✅ COMPLIANT' : '❌ NON-COMPLIANT'}</h2>
                <p>🌡️ Temperature: {r.temperature}°C</p>
                <p>💧 Humidity: {r.humidity}%</p>
                <p>💨 Air Quality: {r.air_quality ?? 'N/A'}</p>
                <p style={{ color: '#888', fontSize: '12px' }}>{r.timestamp}</p>
                <button onClick={fetchReport}  disabled={loading}>
                    {loading ? 'Analysing...' : 'Get AI Report'}
                </button>
                {report && <p>{report}</p>}
            </div>
        );
        })}
    </div>
    );
}

export default App;