import React, { useState, useEffect } from "react";
import { View, ScrollView } from "react-native";
import * as consts from '../modules/consts'
import { Button, IconButton, TextInput } from "react-native-paper";
import { updateNote, deleteDocument, updateNoteDate } from "../modules/FirebaseHandler";
import styles from "../modules/style";
import { Note } from "../modules/types";
import { useNavigation } from "@react-navigation/native";


export default function NoteEditScreen({ note }: { note: Note }) {
  const [title, setTitle] = useState<string>(note.title);
  const [content, setContent] = useState<string>(note.content);
  const [tags, setTags] = useState<string[]>(note.tags);
  const navigation = useNavigation<any>();

  useEffect(() => {
    async function updateNoteData() {
      const updatedNote = { ...note, title: title, content: content, tags: tags };
      await updateNote(updatedNote);
    };
    
    updateNoteData();
  }, [title, content, tags]);

  async function handleDeleteNote() {
    await deleteDocument(note.id, 'note');
    navigation.navigate('HomeScreen');
  }

  return (
    <ScrollView contentContainerStyle={{flexGrow: 1}}>
      <View style={styles.editScreenContainer}>
        <TextInput 
          value={title} 
          onChangeText={async text => {setTitle(text); await updateNoteDate(note.id);}} 
          multiline={true} 
          style={styles.titleTextInput}
          underlineColor={consts.ternaryActive}
          activeUnderlineColor={consts.primary}
          textColor={consts.textActiveLight}
          textAlignVertical="center"
          placeholder="Title"
          placeholderTextColor={'#777'}
        />
        <TextInput 
          value={content}
          onChangeText={async text => {setContent(text); await updateNoteDate(note.id);}}
          multiline={true}
          style={[styles.contentTextInput, {minHeight: 600}]}
          underlineColor={consts.ternaryActive}
          activeUnderlineColor={consts.primary}
          textColor={consts.textActiveLight}
          placeholder="Note content"
          placeholderTextColor={'#777'}
        />

        
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
        <View>
          {Array.isArray(tags) && tags.map((tag, index) => (
            <View key={index} style={{flexDirection: 'row', marginVertical: 4}}>
              <TextInput 
                key={index} 
                value={tag} 
                mode="outlined"
                placeholder="Enter tag"
                onChangeText={text => {
                  const updatedTags = [...tags];
                  updatedTags[index] = text;
                  setTags(updatedTags);
                }}
                style={{backgroundColor: consts.ternary}}
                textColor={consts.textActiveLight}
                outlineColor={consts.ternaryActive}
                activeOutlineColor={consts.secondary}
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

        <Button onPress={handleDeleteNote} textColor={consts.secondary}>Delete Note</Button>
      </View>
    </ScrollView>
  );
}