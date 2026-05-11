import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { ClerkProvider, SignIn, SignedIn, SignedOut, UserButton, useAuth } from '@clerk/clerk-react';

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
    const { getToken, isLoaded, isSignedIn } = useAuth();



    useEffect(() => {
        if (!isLoaded || !isSignedIn) return;
        async function fetchData() {
            const token = await getToken();
            const res = await fetch(`${API_URL}/readings`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            setReadings(data.slice(0, 1));
        }
        fetchData();
        fetchHistory();
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, [isLoaded, isSignedIn]);


    async function fetchReport() {
        setLoading(true)
        const token = await getToken();
        const res = await fetch(`${API_URL}/compliance/living-room`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const data = await res.json();
        setReport(data.report)
        setLoading(false)
    }

    async function fetchHistory() {
        const token = await getToken();
        const res = await fetch(`${API_URL}/readings`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const data = await res.json();
        setHistory(data.reverse());
    }

    if (!isLoaded || !isSignedIn) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#1a1a2e', gap: '24px' }}>
                <div style={{ textAlign: 'center' }}>
                    <h1 style={{ color: '#e0e0e0', margin: 0, fontSize: '28px', fontFamily: 'sans-serif' }}>Asset Monitor</h1>
                    <p style={{ color: '#888', margin: '8px 0 0', fontFamily: 'sans-serif', fontSize: '14px' }}>IoT Compliance Dashboard</p>
                </div>
                <SignIn />
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
            <UserButton />
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


const clerkAppearance = {
    variables: {
        fontFamily: 'sans-serif',
        colorBackground: '#16213e',
        colorInputBackground: '#0f3460',
        colorInputText: '#e0e0e0',
        colorText: '#e0e0e0',
        colorTextSecondary: '#888',
        colorPrimary: '#00c853',
        borderRadius: '8px',
    },
    elements: {
        card: { boxShadow: '0 8px 32px rgba(0,0,0,0.4)', border: 'none' },
        headerTitle: { display: 'none' },
        headerSubtitle: { display: 'none' },
        formButtonPrimary: { backgroundColor: '#00c853', color: '#000', fontWeight: 'bold' },
        socialButtonsBlockButton: { backgroundColor: '#ffffff', color: '#000', border: '1px solid #ccc' },
        socialButtonsBlockButtonText: { color: '#000', fontWeight: '500' },
        footerActionLink: { color: '#00c853' },
    }
};

export default function Root() {
    return (
        <ClerkProvider publishableKey={process.env.REACT_APP_CLERK_PUBLISHABLE_KEY} appearance={clerkAppearance}>
            <App />
        </ClerkProvider>
    );
}