import { MongoClient, ObjectId } from 'mongodb';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export default async function handler(req, res) {
  try {
    await client.connect();
    const database = client.db('yourDatabaseName');
    const courses = database.collection('courses');

    if (req.method === 'GET') {
      const course = await courses.findOne({ _id: new ObjectId(req.query.id) });

      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }

      res.status(200).json(course);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching course', error });
  } finally {
    await client.close();
  }
}
