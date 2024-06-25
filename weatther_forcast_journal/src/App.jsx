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
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    const response = await fetch(`${API_BASE_URL}/entries`);
    const data = await response.json();

    setEntries(data?.length ? data : []);
  };

  const getGeoLocation = async () => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          resolve({
            longitude: position.coords.longitude,
            latitude: position.coords.latitude,
          });
        });
      } else {
        reject("Browser does not support Geolocation");
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { longitude, latitude } = await getGeoLocation();

      const journalEntry = {
        entry_date: date,
        description,
        latitude,
        longitude,
      };

      const response = await fetch(
        `${API_BASE_URL}/entries/${isEditing ? editId : ""}`,
        {
          method: isEditing ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(journalEntry),
        }
      );

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
    } catch (error) {
      alert(error?.message || error);
    }
  };

  const handleEdit = (entry) => {
    const formattedDate = entry.entry_date.split("T")[0]; // Extract the date part
    setDate(formattedDate);
    setDescription(entry.description);
    setWeatherCondition(entry.weather_condition);
    setTemperature(entry.temperature);
    setLocation(entry.location);
    setIsEditing(true);
    setEditId(entry.id);
  };

  const handleDelete = async (id) => {
    console.log("Deleting entry with id:", id);
    if (!id || isNaN(id)) {
      console.error("Invalid id:", id);
      return;
    }

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
        {/* <button onClick={getGeoLocation}>Get Location</button> */}
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
          <button type="submit">
            {isEditing ? "Update Entry" : "Add Entry"}
          </button>
        </form>
      </div>
      <h1>Weather Forecast Journal</h1>
      <div>
        {entries?.map((entry) => (
          <div key={entry.entry_id} className="entry-btn">
            <div className="overlay"></div>
            <div className="entry">
              <p>Date: {entry.entry_date.split("T")[0]}</p>
              <p>Description: {entry.description}</p>
              <p>Weather Condition: {entry.weather_condition}</p>
              <p>Temperature: {entry.temperature}°C</p>
              <p>Location: {entry.location}</p>
            </div>
            <button onClick={() => handleEdit(entry)}>Edit</button>
            <button onClick={() => handleDelete(entry.entry_id)}>Delete</button>
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
