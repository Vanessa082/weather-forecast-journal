import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [weatherCondition, setWeatherCondition] = useState("");
  const [temperature, setTemperature] = useState("");
  const [location, setLocation] = useState("");
  const [longitude, setLongitude] = useState(null);
  const [latitude, setLatitude] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLongitude(position.coords.longitude);
        setLatitude(position.coords.latitude);
      });
    } else {
      alert("Browser does not support Geolocation");
    }
  }, []);

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
      const newEntry = await response.json();
      setWeatherCondition(newEntry.weather_condition);
      setTemperature(newEntry.temperature);
      setLocation(newEntry.location);
      console.log("Entry added successfully");
    } else {
      console.error("Error adding entry");
    }
  };

  return (
    <>
      <div>
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
        {weatherCondition && (
          <div>
            <p>Weather Condition: {weatherCondition}</p>
            <p>Temperature: {temperature}°C</p>
            <p>Location: {location}</p>
          </div>
        )}
      </div>
      <h1>Weather Forecast Journal</h1>
    </>
  );
}

export default App;
