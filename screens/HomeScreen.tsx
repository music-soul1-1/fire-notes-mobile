import { FirebaseAuthTypes } from "@react-native-firebase/auth";
import React, { useState, useEffect } from "react";
import { View, ScrollView, RefreshControl } from "react-native";
import { ActivityIndicator, FAB, Portal } from "react-native-paper";
import { 
  addNote, addTodo, getAllNotes, getAllTodos, 
  subscribeToNotesChanges, subscribeToTodosChanges, 
  getNoteById, getTodoById
} from "../modules/FirebaseHandler";
import styles from "../modules/style";
import NoteWidget from "../modules/NoteWidget";
import TodoWidget from "../modules/TodoWidget";
import { Note, Todo } from "../modules/types";
import { useNavigation ,useFocusEffect } from "@react-navigation/native";
import { theme } from "../modules/theme";
import * as consts from '../modules/consts';


export default function NoteScreen({ user, setNote, setTodo }: { user: FirebaseAuthTypes.UserCredential, setNote: any, setTodo: any }) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isFabOpen, setIsFabOpen] = useState<boolean>(false);
  const [isFabVisible, setIsFabVisible] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const navigation = useNavigation<any>();

  async function fetchData() {
    const fetchedNotes = await getAllNotes();
    const fetchedTodos = await getAllTodos();

    if (fetchedNotes) {
      setNotes(fetchedNotes);
    }
    
    if (fetchedTodos) {
      setTodos(fetchedTodos);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      setIsFabVisible(true); // Show the FAB when the screen is focused

      return () => {
        setIsFabVisible(false); // Hide the FAB when the screen loses focus
      };
    }, [])
  );

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
    setIsFabVisible(false);
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
    setIsFabVisible(false);
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

  function onRefresh() {
    setRefreshing(true);
    fetchData();
    setRefreshing(false);
  };

  if (loading) return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}} >
      <ActivityIndicator size={60} color={consts.textTernaryLight} />
    </View>
  );

  return (
    <ScrollView
    contentContainerStyle={{flexGrow: 1}}
    refreshControl={
      <RefreshControl 
        refreshing={refreshing}
        onRefresh={onRefresh}
        colors={[consts.ternary, consts.backgroundTernaryDark]}
        tintColor={consts.ternary}
        progressBackgroundColor={consts.textActiveLight}/>
    }>
      <View style={styles.screenContainer}>
        
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
        <Portal>
          <FAB.Group
            open={isFabOpen}
            color={consts.ternary}
            fabStyle={{backgroundColor: consts.textActiveLight}}
            visible={isFabVisible}
            icon={'plus'}
            actions={[
              {icon: 'note', label: 'Add note', 
                onPress: async () => {await handleAddNote()}, 
                style: {backgroundColor: consts.ternary}, color: consts.textActiveLight},

              {icon: 'playlist-check', label: 'Add todo', 
                onPress: async () => {await handleAddTodo()}, 
                style: {backgroundColor: consts.ternary}, color: consts.textActiveLight},
            ]}
            onStateChange={() => setIsFabOpen(!isFabOpen)}
          />
        </Portal>
      </View>
    </ScrollView>
  );
};