import { useState, useEffect } from 'react';

function App() {
  const [readings, setReadings] = useState([]);

  useEffect(() => {
    fetch('http://localhost:4000/readings')
      .then(res => res.json())
      .then(data => setReadings(data));
  }, []);
  // console.log(readings);

  return (
    <div>
      <h1>Asset Monitor</h1>
      {readings.map(r => (
        <div key={r.id}>
          <p>{r.sensor_id} — {r.temperature}°C — {r.humidity}% — AQ: {r.air_quality}</p>
        </div>
      ))}
    </div>
  );
}

export default App;