import { Question } from '@/types/question';
import { MongoClient, Db, Collection } from 'mongodb';

let client: MongoClient | null = null;
let db: Db | null = null;

const COLLECTION_NAME = 'questions';

/**
 * Get MongoDB connection
 */
async function getDb(): Promise<Db> {
  if (db) {
    return db;
  }

  const authUser = process.env.DB_USERNAME;
  const authPass = process.env.DB_PASSWORD;
  const cluster = process.env.DB_CLUSTER;
  const dbName = process.env.DB_NAME;

  // If MongoDB credentials are not set, throw error
  if (!authUser || !authPass || !cluster || !dbName) {
    throw new Error(
      'MongoDB credentials not configured. Please set DB_USERNAME, DB_PASSWORD, DB_CLUSTER, and DB_NAME environment variables.'
    );
  }

  // Encode username and password for URL
  const encodedUser = encodeURIComponent(authUser);
  const encodedPass = encodeURIComponent(authPass);

  const uri = `mongodb+srv://${encodedUser}:${encodedPass}@${cluster}.s7w4ras.mongodb.net/${dbName}?retryWrites=true&w=majority&appName=${cluster}`;

  try {
    client = new MongoClient(uri);
    await client.connect();
    db = client.db(dbName);
    return db;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}

/**
 * Get questions collection
 */
async function getCollection(): Promise<Collection<Question>> {
  const database = await getDb();
  return database.collection<Question>(COLLECTION_NAME);
}

/**
 * Get all questions
 */
export async function getQuestions(): Promise<Question[]> {
  try {
    const collection = await getCollection();
    const questions = await collection.find({}).toArray();
    return questions;
  } catch (error) {
    console.error('Error fetching questions:', error);
    return [];
  }
}

/**
 * Get question by ID
 */
export async function getQuestionById(id: string): Promise<Question | undefined> {
  try {
    const collection = await getCollection();
    const question = await collection.findOne({ id });
    return question || undefined;
  } catch (error) {
    console.error('Error fetching question by ID:', error);
    return undefined;
  }
}

/**
 * Add a new question
 */
export async function addQuestion(question: Question): Promise<Question> {
  try {
    const collection = await getCollection();
    await collection.insertOne(question);
    return question;
  } catch (error) {
    console.error('Error adding question:', error);
    throw error;
  }
}

/**
 * Update a question
 */
export async function updateQuestion(
  id: string,
  question: Partial<Question>
): Promise<Question | null> {
  try {
    const collection = await getCollection();
    const result = await collection.findOneAndUpdate(
      { id },
      { $set: question },
      { returnDocument: 'after' }
    );
    return result || null;
  } catch (error) {
    console.error('Error updating question:', error);
    return null;
  }
}

/**
 * Delete a question
 */
export async function deleteQuestion(id: string): Promise<boolean> {
  try {
    const collection = await getCollection();
    const result = await collection.deleteOne({ id });
    return result.deletedCount > 0;
  } catch (error) {
    console.error('Error deleting question:', error);
    return false;
  }
}

/**
 * Close MongoDB connection (useful for cleanup)
 */
export async function closeConnection(): Promise<void> {
  if (client) {
    await client.close();
    client = null;
    db = null;
  }
}
