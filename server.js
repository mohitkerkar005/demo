const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');

const app = express();
const port = 5000;

// Middleware
app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // Parse JSON bodies

// MongoDB connection URL and Database
const url = 'mongodb://localhost:27017'; // Your MongoDB URL
const dbName = 'VenueVista'; // Your database name
let db;

// Connect to MongoDB
MongoClient.connect(url, { useUnifiedTopology: true })
  .then((client) => {
    db = client.db(dbName);
    console.log(`Connected to database: ${dbName}`);
  })
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// API Route to get documents from a collection
app.get('/api/documents', async (req, res) => {
  try {
    const collection = db.collection('venue'); // Your collection name
    
    // Limit fields and documents
    const documents = await collection.find({})
      .limit(10) // Limit to 10 documents
      .project({
        space_url: 1,
        venue_url: 1,
        venue_name: 1,
        space_name: 1,
        latitude: 1,
        longitude: 1,
        address: 1,
        nearest_tube_station: 1,
        max_seated: 1,
        max_standing: 1
        // Add or remove fields as needed
      })
      .toArray();
    
    res.json(documents);
  } catch (err) {
    res.status(500).send('Error fetching documents');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
