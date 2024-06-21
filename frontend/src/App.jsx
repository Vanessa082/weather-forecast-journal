import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [entries, setEntries] = useState([]);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLongitude(position.coords.longitude);
        setLatitude(position.coords.latitude);
      });
    } else {
      alert("Browser does not support Geolocation API");
    }
  }, []);

  const fetchEntries = async () => {
    const response = await fetch("http://localhost:3000/entries");
    const data = await response.json();
    setEntries(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const journalEntry = {
      entry_date: date,
      description,
      latitude,
      longitude,
    };

    const response = await fetch("http://localhost:3000/entries", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(journalEntry),
    });

    if (response.ok) {
      console.log("Entry added successfully");
      fetchEntries(); // Refresh the entries list
    } else {
      console.error("Error adding entry");
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  return (
    <div>
      <h1>Weather Forecast Journal</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="date"
          placeholder="YYYY-MM-DD"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <input
          type="text"
          placeholder="Describe the day"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button type="submit">Add Entry</button>
      </form>
      <div>
        <h2>Journal Entries</h2>
        <ul>
          {entries.map((entry) => (
            <li key={entry.id}>
              <p>{entry.entry_date}</p>
              <p>{entry.description}</p>
              <p>{entry.weather_condition}</p>
              <p>{entry.temperature} °C</p>
              <p>{entry.location}</p>
              <button onClick={() => deleteEntry(entry.id)}>Delete</button>
              <button onClick={() => updateEntry(entry.id)}>Update</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
