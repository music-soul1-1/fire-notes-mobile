import EncryptedStorage from "react-native-encrypted-storage";
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { Note, Todo } from "./types";


let uid : string | null;

/**
 * Updates uid value for API handler.
 */
export async function loadUid() {
  uid = await EncryptedStorage.getItem("uid");
  if (uid) {
    return true;
  }
  else {
    console.log("UID wasn't found in local storage.");
    return false;
  }
};

export async function setUid(uid: string) {
  await EncryptedStorage.setItem("uid", uid);
};

/**
 * Adds note for current user. Note id is auto-generated by Firestore
 * @param title Note title text
 * @param content Note content text
 */
export async function addNote(title: string, content: string) {
  const uid = await EncryptedStorage.getItem("uid") ?? ' ';

  if (uid) {
    const noteRef = await firestore()
      .collection("users")
      .doc(uid)
      .collection("notes")
      .add({
        title: title,
        content: content,
        createdAt: firestore.Timestamp.fromDate(new Date()),
        updatedAt: firestore.Timestamp.fromDate(new Date()),
        isPinned: false,
        tags: [''],
      });

    // Return the ID
    return noteRef.id;
  }
}

/**
 * Returns all notes for current user.
 * @returns array of notes
 */
export async function getAllNotes() {
  const uid = await EncryptedStorage.getItem("uid") ?? ' ';

  const notesRef = firestore()
    .collection("users")
    .doc(uid)
    .collection("notes");

  const notesQuery = notesRef.orderBy("updatedAt", "desc");
  const querySnapshot = await notesQuery.get();

  const notes = querySnapshot.docs.map((doc) => {
    const data = doc.data();

    const noteData = {
      id: doc.id,
      title: data.title,
      content: data.content,
      tags: data.tags ?? [],
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      isPinned: data.isPinned
    };
    return noteData;
  });

  return notes;
};

export async function getAllTodos() {
  if (!uid) {
    uid = '';
    await loadUid();
  }

  const todosRef = firestore()
    .collection("users")
    .doc(uid)
    .collection("todos");

  const notesQuery = todosRef.orderBy("updatedAt", "desc");
  const querySnapshot = await notesQuery.get();

  const todos = querySnapshot.docs.map((doc) => {
    const data = doc.data() as Todo;

    const todoData: Todo = {
      id: doc.id,
      title: data.title,
      subtask: data.subtask,
      tags: data.tags ?? [],
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      isPinned: data.isPinned,
    };
    return todoData;
  });

  return todos;
};

export async function addTodo(title: string, subtask: string) {
  if (!uid) {
    uid = await EncryptedStorage.getItem("uid") ?? ' ';
  }
  
  const todoRef = await firestore()
    .collection("users")
    .doc(uid)
    .collection("todos")
    .add({
      title: title,
      subtask: [{
        text: subtask,
        completed: false,
        completedAt: firestore.Timestamp.fromDate(new Date(1, 0, 1)),
        createdAt: firestore.Timestamp.fromDate(new Date()),
        updatedAt: firestore.Timestamp.fromDate(new Date()),
      }],
      tags: [''],
      createdAt: firestore.Timestamp.fromDate(new Date()),
      updatedAt: firestore.Timestamp.fromDate(new Date()),
      isPinned: false,
    } as Todo);

    return todoRef.id;
};

export async function deleteDocument(id: string, type: 'todo' | 'note') {
  const uid = await EncryptedStorage.getItem("uid") ?? ' ';
  
  const docRef  = firestore()
      .collection("users")
      .doc(uid)
      .collection(type === "note" ? "notes" : "todos")
      .doc(id);

  await docRef.delete();
};

export const subscribeToNotesChanges = (callback: (notes: Note[]) => void) => {
  const unsubscribe = firestore()
    .collection("users")
    .doc(uid ?? 'guest')
    .collection("notes")
    .onSnapshot((snapshot) => {
      const updatedNotes: Note[] = [];
      snapshot.forEach((doc) => {
        updatedNotes.push({ id: doc.id, ...doc.data() } as Note);
      });
      callback(updatedNotes);
    });

  return unsubscribe; // Return the unsubscribe function
};

export const subscribeToTodosChanges = (callback: (todos: Todo[]) => void) => {
  const unsubscribe = firestore()
    .collection("users")
    .doc(uid ?? 'guest')
    .collection("todos")
    .onSnapshot((snapshot) => {
      const updatedTodos: Todo[] = [];
      snapshot.forEach((doc) => {
        updatedTodos.push({ id: doc.id, ...doc.data() } as Todo);
      });
      callback(updatedTodos);
    });

  return unsubscribe; // Return the unsubscribe function
};

export async function logout() {
  try {
    await GoogleSignin.signOut();
    await EncryptedStorage.removeItem("uid");
    return true;
  }
  catch (error) {
    console.error(error);
    return false;
  }
};

export async function clearStorage() {
  const keys = Object.keys(EncryptedStorage);

  await Promise.all(keys.map(async (key) => {
    await EncryptedStorage.removeItem(key);
  }));
};

export async function getUserPicUrl() {
  if (uid) {
    const userDocument = await firestore().collection("users").doc(uid).get();
    const data = userDocument.data();

    return data?.userPicUrl || '';
  }
};

export function convertTimestampToString(timestamp : FirebaseFirestoreTypes.Timestamp) {
  const date = timestamp.toDate();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const formattedDate = `${hours}:${minutes}, ${date.toLocaleDateString([], { day: 'numeric', month: 'numeric' })}`;
  return formattedDate;
};


export async function updateNote(note: Note) {
  if (!uid) {
    uid = await EncryptedStorage.getItem("uid") ?? ' ';
  }

  try {
    const docRef = firestore()
    .collection("users")
    .doc(uid)
    .collection("notes")
    .doc(note.id);

    await docRef.update({
      title: note.title,
      content: note.content,
      tags: note.tags ?? [''],
      isPinned: note.isPinned,
      //updatedAt: firestore.Timestamp.fromDate(new Date()) //TODO: change this
    });
    
  }
  catch (error) {
    console.log("Note update error");
    console.error(error);
  }
};

export async function updateTodo(todo: Todo) {
  if (!uid) {
    uid = await EncryptedStorage.getItem("uid") ?? ' ';
  }

  try {
    const docRef = firestore()
    .collection("users")
    .doc(uid)
    .collection("todos")
    .doc(todo.id);

    await docRef.update({
      title: todo.title,
      subtask: todo.subtask,
      tags: todo.tags ?? [''],
      isPinned: todo.isPinned,
      //updatedAt: firestore.Timestamp.fromDate(new Date()) //TODO: change this
    });
    
    return todo;
  }
  catch (error) {
    console.error(error);

    return todo;
  }
};

export async function updateDate(item: Note | Todo) {
  if (!uid) {
    uid = await EncryptedStorage.getItem("uid") ?? ' ';
  }

  try {
    const docRef = firestore()
    .collection("users")
    .doc(uid)
    .collection('content' in item ? "notes" : "todos")
    .doc(item.id);

    await docRef.update({
      updatedAt: firestore.Timestamp.fromDate(new Date())
    });
  }
  catch (error) {
    console.error(error);
  }
};

export async function updateNoteDate(noteId: string | number) {
  if (!uid) {
    uid = await EncryptedStorage.getItem("uid") ?? ' ';
  }

  try {
    const docRef = firestore()
    .collection("users")
    .doc(uid)
    .collection("notes")
    .doc(noteId.toString());

    await docRef.update({
      updatedAt: firestore.Timestamp.fromDate(new Date())
    });
  }
  catch (error) {
    console.error(error);
  }
};

export async function updateCompletedDate(todo: Todo, index: number) {
  if (!uid) {
    uid = await EncryptedStorage.getItem("uid") ?? ' ';
  }

  try {
    const docRef = firestore()
    .collection("users")
    .doc(uid)
    .collection("todos")
    .doc(todo.id);

    todo.subtask[index].completedAt = firestore.Timestamp.fromDate(new Date());

    await docRef.update({
      subtask: todo.subtask
    });

    await updateDate(todo);
  }
  catch (error) {
    console.error(error);
  }
};

export async function updateSubtaskDate(todo: Todo, index: number) {
  if (!uid) {
    uid = await EncryptedStorage.getItem("uid") ?? ' ';
  }

  try {
    const docRef = firestore()
    .collection("users")
    .doc(uid)
    .collection("todos")
    .doc(todo.id);

    if (todo.subtask[index]) {
      todo.subtask[index].updatedAt = firestore.Timestamp.fromDate(new Date());
    }

    await docRef.update({
      subtask: todo.subtask
    });

    await updateDate(todo);

    return todo;
  }
  catch (error) {
    console.log("Subtask date update error");
    console.error(error);

    return todo;
  }
};


export async function getNoteById(id: string | number) {
  if (!uid) {
    uid = await EncryptedStorage.getItem("uid") ?? ' ';
  }

  try {
    const docRef = firestore()
    .collection("users")
    .doc(uid)
    .collection("notes")
    .doc(id.toString());

    const doc = await docRef.get();
    
    if (doc.exists) {
      // Note document exists, return its data
      const noteData = { id: id.toString(), ...doc.data() } as Note;
      return noteData;
    }
    else {
      // Note document does not exist, handle this case
      console.error("Note not found");
      return null;
    }
  }
  catch (error) {
    console.error("Error fetching note by ID:", error);
    throw error; // Rethrow the error so that it can be handled upstream
  }
};

export async function getTodoById(id: string | number) {
  if (!uid) {
    uid = await EncryptedStorage.getItem("uid") ?? ' ';
  }

  try {
    const docRef = firestore()
    .collection("users")
    .doc(uid)
    .collection("todos")
    .doc(id.toString());

    const doc = await docRef.get();
    
    if (doc.exists) {
      // Todo document exists, return its data
      const todoData = { id: id.toString(), ...doc.data() } as Todo;
      return todoData;
    }
    else {
      // Todo document does not exist, handle this case
      console.error("Todo not found");
      return null;
    }
  }
  catch (error) {
    console.error("Error fetching todo by ID:", error);
    throw error; // Rethrow the error so that it can be handled upstream
  }
};