import { useEffect, useState } from "react";
import "./App.css";
import { API_BASE_URL } from "./constants/constants";

function App() {
  const [entries, setEntries] = useState([]);
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [weatherCondition, setWeatherCondition] = useState("");
  const [temperature, setTemperature] = useState("");
  const [location, setLocation] = useState("");
  const [longitude, setLongitude] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchEntries();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLongitude(position.coords.longitude);
        setLatitude(position.coords.latitude);
      });
    } else {
      alert("Browser does not support Geolocation");
    }
  }, []);

  const fetchEntries = async () => {
    const response = await fetch(`${API_BASE_URL}/entries`);
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

    const response = await fetch(`${API_BASE_URL}/entries`, {
      method: isEditing ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(journalEntry),
    });

    if (response.ok) {
      await fetchEntries();
      setDate("");
      setDescription("");
      setWeatherCondition("");
      setTemperature("");
      setLocation("");
      setIsEditing(false);
      setEditId(null);
      console.log("Entry added/updated successfully");
    } else {
      console.error("Error adding/updating entry");
    }
  };

  const handleEdit = (entry) => {
    setDate(entry.entry_date);
    setDescription(entry.description);
    setWeatherCondition(entry.weather_condition);
    setTemperature(entry.temperature);
    setLocation(entry.location);
    setIsEditing(true);
    setEditId(entry.id);
  };

  const handleDelete = async (id) => {
    const response = await fetch(`${API_BASE_URL}/entries/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      await fetchEntries();
      console.log("Entry deleted successfully");
    } else {
      console.error("Error deleting entry");
    }
  };

  return (
    <>
      <div>
        <form onSubmit={handleSubmit}>
          <input
            type="date"
            className="date"
            placeholder="YYYY-MM-DD"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <input
            type="text"
            className="describe"
            placeholder="Describe the day"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button type="submit">{isEditing ? "Update Entry" : "Add Entry"}</button>
        </form>
      </div>
      <h1>Weather Forecast Journal</h1>
      <div>
        {entries.map((entry) => (
          <div key={entry.id} className="entry">
            <p>Date: {entry.entry_date}</p>
            <p>Description: {entry.description}</p>
            <p>Weather Condition: {entry.weather_conditions}</p>
            <p>Temperature: {entry.temperature}°C</p>
            <p>Location: {entry.location}</p>
            <button onClick={() => handleEdit(entry)}>Edit</button>
            <button onClick={() => handleDelete(entry.id)}>Delete</button>
          </div>
        ))}
      </div>
    </>
  );
}

export default App;