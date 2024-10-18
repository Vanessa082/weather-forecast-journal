# Journal Entries API 📓🌦

Welcome to the Journal Entries API! This API allows you to manage journal entries, including the date, a brief description of the day, and weather information fetched from an external weather API🥰🌦

## Features

- **Add a new journal entry** with automatic weather fetching.
- **View all journal entries**.
- **View a single journal entry**.
- **Update a journal entry**.
- **Delete a journal entry**.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js installed on your machine.
- An account and API key from [OpenWeatherMap](https://openweathermap.org/) or another weather API.

## Getting Started

Follow these instructions to set up the project on your local machine.

### Installation

1. Clone the repository:

```bash
  $ git clone git@github.com:Vanessa082/weather-forecast-journal.git # to install all dependencies
  $ cd weather-forecast-journal #to enter main file
  $ cd backend # to enter api file
```

2. Install dependencies:

```bash
  $ npm install # to install all dependencies
  $ npm run dev # to start development server
```

3. Set up environment variables:

   Create a `.env` file in the root of your project and add your weather API key:

   ```env
   DB_USER
   DB_HOST
   DB_DATABASE
   DB_PASSWORD
   DB_PORT=5432
   WEATHER_API_KEY
   WEATHER_API_URL
   ```

### Running the Server

Start the development server:

```bash
npm run dev
```

The server will be running at `http://localhost:3000`.

## API Endpoints

### Add a New Journal Entry

```http
POST /entries
```

**Request Body:**

```json
{
  "date": "YYYY-MM-DD",
  "description": "A brief description of the day",
  "latitude": "user's latitude",
  "longitude": "user's longitude"
}
```

**Response:**

```json
{
  "id": 1,
  "date": "YYYY-MM-DD",
  "description": "A brief description of the day",
  "weather": "Weather description",
  "temperature": "Temperature in °C"
}
```

### View All Journal Entries

```http
GET /entries
```

**Response:**

```json
[
  {
    "id": 1,
    "date": "YYYY-MM-DD",
    "description": "A brief description of the day",
    "weather": "Weather description",
    "temperature": "Temperature in °C"
  },
  ...
]
```

### View a Single Journal Entry

```http
GET /entries/:id
```

**Response:**

```json
{
  "id": 1,
  "date": "YYYY-MM-DD",
  "description": "A brief description of the day",
  "weather": "Weather description",
  "temperature": "Temperature in °C"
}
```

### Update a Journal Entry

```http
PUT /entries/:id
```

**Request Body:**

```json
{
  "date": "YYYY-MM-DD",
  "description": "An updated description of the day"
}
```

**Response:**

```json
{
  "id": 1,
  "date": "YYYY-MM-DD",
  "description": "An updated description of the day",
  "weather": "Updated weather description",
  "temperature": "Updated temperature in °C"
}
```

### Delete a Journal Entry

```http
DELETE /entries/:id
```

**Response:**

```json
{
  "message": "Entry deleted successfully"
}
```

## External API

This project uses the [OpenWeatherMap API](https://openweathermap.org/api) to fetch weather information based on the user's location.

## Database Schema

Here's an idea of what the journal entries table might look like:

- `id` (integer, primary key, auto-increment)
- `date` (date)
- `description` (string)
- `weather` (string)
- `temperature` (float)

## Project Checks

To ensure the quality and maintainability of the project, the following checks have been implemented:

- **Proper Error Handling**: Ensuring all errors are caught and handled gracefully.
- **Proper Asynchronous Control Flow Handling**: Using Promises or async/await for asynchronous operations.
- **Proper Creation of the PR**: All features and fixes should be in a single PR.
- **Clean Code**: Following best practices for clean and maintainable code.

## Contributing

If you wish to contribute, please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-name`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add some feature'`).
5. Push to the branch (`git push origin feature-name`).
6. Create a Pull Request.

## License

This project is licensed under the MIT License.

---
