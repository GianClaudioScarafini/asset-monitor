import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

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
    const [history, setHistory] = useState([]);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect(() => {
        if (!token) return;
        async function fetchData() {
            const res = await fetch(`${API_URL}/readings`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const data = await res.json()
            setReadings(data.slice(0, 1)); // latest reading only
        };

        fetchData();
        fetchHistory();
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);


    async function fetchReport() {
        setLoading(true)
        const response = await fetch(`${API_URL}/compliance/living-room`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const data = await response.json();
        setReport(data.report)
        setLoading(false)
    }

    async function fetchHistory() {
        const response = await fetch(`${API_URL}/readings`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const data = await response.json();
        setHistory(data.reverse());
    }

    function handlechange(e) {
        if (e.target.name === 'username') setUsername(e.target.value)
        if (e.target.name === 'password') setPassword(e.target.value)
    }

    async function handleSubmit(e) {
        e.preventDefault()
        const response = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username,
                password
            })
        });
        const data = await response.json()
        if (response.ok) {
            localStorage.setItem('token', data.token)
            setToken(data.token)
        } else {
            alert('Wrong username or password')
        }
    }

    function logout(){
        localStorage.removeItem('token');
        setToken(null)
    }
    if (!token) {
        return (
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                backgroundColor: '#1a1a2e',
                fontFamily: 'sans-serif'
            }}>
                <form onSubmit={handleSubmit} style={{
                    backgroundColor: '#16213e',
                    padding: '40px',
                    borderRadius: '12px',
                    width: '320px',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
                }}>
                    <h2 style={{ color: '#e0e0e0', marginTop: 0, marginBottom: '24px', textAlign: 'center' }}>
                        Asset Monitor
                    </h2>

                    <label style={{ color: '#888', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        Username
                    </label>
                    <input
                        name='username'
                        type='text'
                        value={username}
                        onChange={handlechange}
                        style={{
                            display: 'block', width: '100%', marginTop: '6px', marginBottom: '16px',
                            padding: '10px 12px', backgroundColor: '#0f3460', border: '1px solid #1a4a7a',
                            borderRadius: '6px', color: '#e0e0e0', fontSize: '14px', boxSizing: 'border-box'
                        }}
                    />
                    <label style={{ color: '#888', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        Password
                    </label>
                    <input
                        name='password'
                        type='password'
                        value={password}
                        onChange={handlechange}
                        style={{
                            display: 'block', width: '100%', marginTop: '6px', marginBottom: '24px',
                            padding: '10px 12px', backgroundColor: '#0f3460', border: '1px solid #1a4a7a',
                            borderRadius: '6px', color: '#e0e0e0', fontSize: '14px', boxSizing: 'border-box'
                        }}
                    />
                    <button type="submit" style={{
                        width: '100%', padding: '12px', backgroundColor: '#00c853',
                        border: 'none', borderRadius: '6px', color: '#000',
                        fontWeight: 'bold', fontSize: '14px', cursor: 'pointer'
                    }}>
                        Log In
                    </button>
                </form>
            </div>
        );
    }
    return (
        <div style={{
            padding: '20px',
            fontFamily: 'sans-serif',
            backgroundColor: '#1a1a2e',
            minHeight: '100vh',
            color: '#e0e0e0'
        }}>
            <h1>Asset Monitor</h1>
            <button onClick={logout}>
                logout
            </button>
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
                        <button onClick={fetchReport} disabled={loading}>
                            {loading ? 'Analysing...' : 'Get AI Report'}
                        </button>
                        {report && <p>{report}</p>}
                    </div>
                );
            })}
            <div style={{ marginTop: '30px' }}>
                <h2>Temperature</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={history}>
                        <XAxis dataKey="timestamp" hide={true} />
                        <YAxis domain={['dataMin - 2', 'dataMax + 2']} />
                        <Tooltip />
                        <Legend />
                        <ReferenceLine y={24} stroke="#ff7043" strokeDasharray="3 3" label="Max" />
                        <ReferenceLine y={18} stroke="#ff9800" strokeDasharray="3 3" label="Min" />
                        <Line type="monotone" dataKey="temperature" stroke="#ff7043" dot={false} />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <div style={{ marginTop: '30px' }}>
                <h2>Humidity</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={history}>
                        <XAxis dataKey="timestamp" hide={true} />
                        <YAxis domain={['dataMin - 2', 'dataMax + 2']} />
                        <Tooltip />
                        <Legend />
                        <ReferenceLine y={60} stroke="#42a5f5" strokeDasharray="3 3" label="Max" />
                        <ReferenceLine y={30} stroke="#64b5f6" strokeDasharray="3 3" label="Min" />
                        <Line type="monotone" dataKey="humidity" stroke="#42a5f5" dot={false} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    )


}

export default App;