import { FirebaseAuthTypes } from "@react-native-firebase/auth";
import React, { useState, useEffect } from "react";
import { View, Text, ScrollView } from "react-native";
import { Button, ActivityIndicator } from "react-native-paper";
import { 
  addNote, addTodo, getAllNotes, getAllTodos, 
  subscribeToNotesChanges, subscribeToTodosChanges, 
  getNoteById, getTodoById
} from "../modules/FirebaseHandler";
import styles from "../modules/style";
import NoteWidget from "../modules/NoteWidget";
import TodoWidget from "../modules/TodoWidget";
import { Note, Todo } from "../modules/types";
import { useNavigation } from "@react-navigation/native";
import { theme } from "../modules/theme";


export default function NoteScreen({ user, setNote, setTodo }: { user: FirebaseAuthTypes.UserCredential, setNote: any, setTodo: any }) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const navigation = useNavigation<any>();

  async function fetchData() {
    const fetchedNotes = await getAllNotes();
    const fetchedTodos = await getAllTodos();
    setNotes(fetchedNotes);
    setTodos(fetchedTodos);
  };
  

  useEffect(() => {
    fetchData();

    const unsubscribeFromNotes = subscribeToNotesChanges((updatedNotes) => {
      setNotes(updatedNotes);
    });
    const unsubscribeFromTodos = subscribeToTodosChanges((updatedTodos) => {
      setTodos(updatedTodos);
    });
  }, []);

  // Combine notes and todos into a single array
  const combinedArray: (Note | Todo)[] = [...notes, ...todos];

  // Sort the combined array by the updatedAt date in descending order
  combinedArray.sort((a, b) => {
    return b.updatedAt.toMillis() - a.updatedAt.toMillis();
  });
  
  async function handleAddNote() {
    setLoading(true);
    const noteId = await addNote('', '');
    const note = await getNoteById(noteId ?? '');
    if (note) {
      setNote(note);
      navigation.navigate('NoteEditScreen', { note: note });
    }
    else {
      console.error('Note not found');
    }
    setLoading(false);
  };

  async function handleAddTodo() {
    setLoading(true);
    const todoId = await addTodo('', '');
    const todo = await getTodoById(todoId ?? '');
    if (todo) {
      setTodo(todo);
      navigation.navigate('TodoEditScreen', { todo: todo });
    }
    else {
      console.error('Todo not found');
    }
    setLoading(false);
  };

  if (loading) return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}} >
      <ActivityIndicator size={60} color={theme.coreColors.tertiary} />
    </View>
  );

  return (
    <ScrollView contentContainerStyle={{flexGrow: 1}}>
      <View style={styles.screenContainer}>
        <Text style={styles.textMedium}>Welcome, {user.user.displayName ?? "User"}</Text>
        <View style={{flexDirection: 'row', margin: 10, gap: 15}}>
          <Button
            mode="contained-tonal"
            onPress={async () => {await handleAddNote()}}
          >
            Add note
          </Button>
          <Button 
            mode="contained-tonal"
            onPress={async () => {await handleAddTodo()}}
          >
            Add todo
          </Button>
        </View>
        
        {combinedArray.map((item) => {
          if ('content' in item) {
            return (
              <NoteWidget key={item.id} note={item} setNote={setNote} />
            )
          }
          else {
            return (
            <TodoWidget key={item.id} todo={item} setTodo={setTodo} />
            )
          }
        })}
      </View>
    </ScrollView>
  );
};