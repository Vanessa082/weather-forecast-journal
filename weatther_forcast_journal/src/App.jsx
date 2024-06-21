import { useEffect, useState } from "react";
import "./App.css";
import e from "express";

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
      alert("browser doesnot support");
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefaultt();
    const location = `${longitude},${latitude}`;

    const journalEntry = {
      entry_date,
      description,
      temperature,
      weatherCondition,
      location,
    };
  };

  const response = await fetch("http://localhost:3000/api/journal", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(journalEntry),
  });

  if (response.ok) {
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
            onChange={(e) => {
              setDate(e.target.value);
            }}
          />
          <input
            type="text"
            placeholder="Describe the day"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
            }}
          />
          <input
            type="text"
            placeholder="Weather condition"
            value={weatherCondition}
            onChange={(e) => {
              setWeatherCondition(e.target.value);
            }}
          />
          <input
            type="text"
            placeholder="Temperature"
            value={temperature}
            onChange={(e) => {
              setTemperature(e.target.value);
            }}
          />
          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => {
              setLocation(e.target.value);
            }}
          />
          <button type="submit">Add Entry</button>
        </form>
      </div>
      <h1>Weather Forcast Journal</h1>
    </>
  );
}

export default App;
