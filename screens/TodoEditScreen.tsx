import React, { useEffect, useState } from "react";
import { View, ScrollView, TextInput } from "react-native";
import { Button, IconButton, Checkbox, TextInput as PaperTextInput, Portal, Dialog, Text } from "react-native-paper";
import { 
  updateTodo, updateDate, updateCompletedDate, updateSubtaskDate, 
  deleteDocument, convertTimestampToString
} from "../modules/FirebaseHandler";
import styles from "../modules/style";
import { Todo } from "../modules/types";
import firestore from "@react-native-firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import * as consts from '../modules/consts';


export default function TodoEditScreen({ initialTodo }: { initialTodo: Todo }) {
  const [title, setTitle] = useState<string>(initialTodo.title);
  const [subtasks, setSubtasks] = useState<Todo["subtask"]>(initialTodo.subtask);
  const [tags, setTags] = useState<string[]>(initialTodo.tags);
  const [todo, setTodo] = useState<Todo>(initialTodo);
  const [dialogVisible, setDialogVisible] = useState<boolean>(false);
  const navigation = useNavigation<any>();

  useEffect(() => {
    async function updateTodoData() {
      try {
        const updatedTodo = { ...todo, title: title, subtask: subtasks, tags: tags };
        const newTodo = await updateTodo(updatedTodo);
        setTodo(newTodo);
      }
      catch (error) {
        console.error(error);
      }
    };
    
    updateTodoData();
  }, [title, subtasks, tags]);

  const handleSubtaskCompletion = async (index: number) => {
    const updatedSubtasks = [...subtasks];
    updatedSubtasks[index].completed = !updatedSubtasks[index].completed;
    setSubtasks(updatedSubtasks);
    await updateCompletedDate(todo, index);
  };

  const handleSubtaskTextChange = async (index: number, text: string) => {
    const updatedSubtasks = [...subtasks];
    if (updatedSubtasks[index]) {
      updatedSubtasks[index].text = text;
      updatedSubtasks[index].updatedAt = firestore.Timestamp.fromDate(new Date());
      setSubtasks(updatedSubtasks);
      await updateSubtaskDate(todo, index);
    }
  };
  
  const handleSubtaskDelete = async (index: number) => {
    const updatedSubtasks = [...subtasks];
    if (updatedSubtasks[index]) {
      updatedSubtasks.splice(index, 1);
      setSubtasks(updatedSubtasks);
      await updateSubtaskDate(todo, index);
    }
  };

  const addSubtask = () => {
    const initialSubtask = {
      text: '',
      completed: false,
      completedAt: firestore.Timestamp.fromDate(new Date()),
      updatedAt: firestore.Timestamp.fromDate(new Date()),
      createdAt: firestore.Timestamp.fromDate(new Date()),
    };
    const updatedSubtasks = [...subtasks, initialSubtask];
    setSubtasks(updatedSubtasks);
  };

  async function handleDeleteTodo() {
    await deleteDocument(todo.id, 'todo');
    navigation.navigate('HomeScreen');
  };

  return (
    <ScrollView contentContainerStyle={{flexGrow: 1}}>
      <View style={styles.editScreenContainer}>
        <PaperTextInput 
          value={title}
          onChangeText={async (text) => {setTitle(text); await updateDate(todo);}} 
          style={[ styles.titleTextInput, {marginBottom: 10} ]}
          underlineColor={consts.ternaryActive}
          activeUnderlineColor={consts.primary}
          textColor={consts.textActiveLight}
          placeholder="Title"
          placeholderTextColor={'#777'}
        />
        
        <View style={{paddingHorizontal: 10}}>
          {Array.isArray(subtasks) && subtasks.map((subtask, index) => (
            <View 
              key={index} 
              style={styles.subtaskContainer}
            >
              <Checkbox
                status={subtask.completed ? 'checked' : 'unchecked'}
                onPress={() => handleSubtaskCompletion(index)}
                color={consts.ternaryActive}
                uncheckedColor={consts.ternaryActive}
              />
              <PaperTextInput 
                key={index} 
                value={subtask.text} 
                onChangeText={async (text) => {
                  handleSubtaskTextChange(index, text);
                }}
                multiline={true}
                style={[styles.contentTextInput, {width: '70%', marginVertical: 10}]}
                underlineColor={consts.ternaryActive}
                activeUnderlineColor={consts.primary}
                textColor={consts.textActiveLight}
                placeholder="Enter subtask"
                placeholderTextColor={'#777'}
              />
              <IconButton
                icon="delete"
                onPress={() => handleSubtaskDelete(index)}
                iconColor={consts.ternaryActive}
              />
            </View>
          ))}
        </View>
        <Button
          icon="plus"
          mode="contained-tonal"
          onPress={addSubtask}
          style={{marginVertical: 10}}
          >
          Add subtask
        </Button>

        <Text style={styles.textStandartBlue}>Tags:</Text>
        <Button
          icon="plus"
          mode="contained-tonal"
          onPress={() => {
            setTags([...tags, '']);
            }}
          style={{marginTop: 10}}
          >
          Add tag
        </Button>
        <View style={{flexDirection: 'row', flex: 1, flexWrap: 'wrap', justifyContent: 'center'}}>
          {Array.isArray(tags) && tags.map((tag, index) => (
            <View key={index} style={styles.tagsContainer}>
              <TextInput 
                key={index} 
                value={tag} 
                placeholder="Enter tag"
                onChangeText={text => {
                  const updatedTags = [...tags];
                  updatedTags[index] = text;
                  setTags(updatedTags);
                }}
                style={styles.tagTextInput}
                placeholderTextColor={'#777'}
              />
              <IconButton 
                icon="delete"
                onPress={() => {
                  const updatedTags = [...tags];
                  updatedTags.splice(index, 1);
                  setTags(updatedTags);
                }}
                iconColor={consts.secondary}
              />
            </View>
          ))}
        </View>

        <Button
          onPress={() => setDialogVisible(true)}
          textColor={consts.secondary}
          style={{margin: 10}}>
            Delete todo
        </Button>
        <Portal>
          <Dialog style={styles.dialog} visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
            <Dialog.Title>Delete todo</Dialog.Title>
            <Dialog.Content>
              <Text>Are you sure you want to delete this todo?</Text>
            </Dialog.Content>
            <Dialog.Actions style={{justifyContent: 'space-between'}}>
              <Button textColor={consts.textActiveLight} style={{paddingHorizontal: 10}} onPress={() => setDialogVisible(false)}>No</Button>
              <Button textColor={consts.textActiveLight} onPress={() => {setDialogVisible(false); handleDeleteTodo()}}>Yes</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>

        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Text
            style={[styles.textStandart, {color: consts.textActiveLight, margin: 10}]}>
              Last updated: {convertTimestampToString(todo.updatedAt)}
          </Text>
          <Text
            style={[styles.textStandart, {color: consts.textActiveLight, margin: 10}]}>
              Created: {convertTimestampToString(todo.createdAt)}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}