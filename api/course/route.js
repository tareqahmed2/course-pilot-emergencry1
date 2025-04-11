import { MongoClient } from 'mongodb';

// Ensure the MongoDB URI is provided in .env.local
const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error('Please add your MongoDB URI to .env.local');
}

const client = new MongoClient(uri);
const database = client.db('Course-Pilot');
const courses = database.collection('courses');

// The handler function
export default async function handler(req, res) {
  try {
    // Ensure the client is connected before using it
    if (!client.isConnected()) {
      await client.connect();
    }

    if (req.method === 'GET') {
      const allCourses = await courses.find().toArray();
      res.status(200).json(allCourses);
    } else {
      res.status(405).json({ message: 'Method Not Allowed' }); // Handle other methods
    }
  } catch (error) {
    console.error('Error fetching courses:', error);
    res
      .status(500)
      .json({ message: 'Failed to fetch courses', error: error.message });
  } finally {
    // Close the connection only if it's not a development environment
    if (process.env.NODE_ENV !== 'development') {
      await client.close();
    }
  }
}
