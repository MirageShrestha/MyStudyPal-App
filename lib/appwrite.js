import { Account, Client, Databases, Query } from 'appwrite';

// Initialize Appwrite client
export const client = new Client();
client
  .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID);

// Initialize services
export const account = new Account(client);
export const databases = new Databases(client);

// Define your database and collection IDs
const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID;
const SUBJECTS_COLLECTION_ID = 'subjectscollection';
const TASKS_COLLECTION_ID = 'tasks';
const EXAMS_COLLECTION_ID = 'exams';

// Authentication helper functions
export const createAnonymousSession = async () => {
  try {
    return await account.createAnonymousSession();
  } catch (error) {
    console.error('Error creating anonymous session:', error);
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    return await account.get();
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

export const deleteCurrentSession = async () => {
  try {
    return await account.deleteSession('current');
  } catch (error) {
    console.error('Error deleting current session:', error);
    throw error;
  }
};

// CRUD functions for Subjects
export const createSubject = async (userId, name, description) => {
  try {
    return await databases.createDocument(DATABASE_ID, SUBJECTS_COLLECTION_ID, 'unique()', {
      userId,
      Name: name,
      Description: description,
    });
  } catch (error) {
    console.error('Error creating subject:', error);
    throw error;
  }
};

export const getSubjects = async (userId) => {
  try {
    return await databases.listDocuments(DATABASE_ID, SUBJECTS_COLLECTION_ID, [
      Query.equal('userId', userId),
    ]);
  } catch (error) {
    console.error('Error getting subjects:', error);
    throw error;
  }
};

export const updateSubject = async (subjectId, name, description) => {
  try {
    return await databases.updateDocument(DATABASE_ID, SUBJECTS_COLLECTION_ID, subjectId, {
      Name: name,
      Description: description,
    });
  } catch (error) {
    console.error('Error updating subject:', error);
    throw error;
  }
};

export const deleteSubject = async (subjectId) => {
  try {
    return await databases.deleteDocument(DATABASE_ID, SUBJECTS_COLLECTION_ID, subjectId);
  } catch (error) {
    console.error('Error deleting subject:', error);
    throw error;
  }
};

// CRUD functions for Tasks
export const createTask = async (userId, title, subjectId, dueDate) => {
  try {
    return await databases.createDocument(DATABASE_ID, TASKS_COLLECTION_ID, 'unique()', {
      userId,
      Title: title,
      subjectID: subjectId,
      dueDate,
    });
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
};

export const getTasks = async (userId) => {
  try {
    return await databases.listDocuments(DATABASE_ID, TASKS_COLLECTION_ID, [
      Query.equal('userId', userId),
    ]);
  } catch (error) {
    console.error('Error getting tasks:', error);
    throw error;
  }
};

export const updateTask = async (taskId, title, subjectId, dueDate) => {
  try {
    return await databases.updateDocument(DATABASE_ID, TASKS_COLLECTION_ID, taskId, {
      Title: title,
      subjectID: subjectId,
      dueDate,
    });
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
};

export const updateTaskStatus = async (taskId) => {
  // No-op since status is not in the schema
  return null;
};

export const deleteTask = async (taskId) => {
  try {
    return await databases.deleteDocument(DATABASE_ID, TASKS_COLLECTION_ID, taskId);
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
};

// CRUD functions for Exams
export const createExam = async (userId, title, date) => {
  try {
    return await databases.createDocument(DATABASE_ID, EXAMS_COLLECTION_ID, 'unique()', {
      userId,
      title,
      date,
    });
  } catch (error) {
    console.error('Error creating exam:', error);
    throw error;
  }
};

export const getExams = async (userId) => {
  try {
    return await databases.listDocuments(DATABASE_ID, EXAMS_COLLECTION_ID, [
      Query.equal('userId', userId),
    ]);
  } catch (error) {
    console.error('Error getting exams:', error);
    throw error;
  }
};

export const updateExam = async (examId, title, date) => {
  try {
    return await databases.updateDocument(DATABASE_ID, EXAMS_COLLECTION_ID, examId, {
      title,
      date,
    });
  } catch (error) {
    console.error('Error updating exam:', error);
    throw error;
  }
};

export const deleteExam = async (examId) => {
  try {
    return await databases.deleteDocument(DATABASE_ID, EXAMS_COLLECTION_ID, examId);
  } catch (error) {
    console.error('Error deleting exam:', error);
    throw error;
  }
};