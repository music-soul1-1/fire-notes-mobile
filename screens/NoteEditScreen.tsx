import React, { useState, useEffect } from "react";
import { View, ScrollView, TextInput } from "react-native";
import * as consts from '../modules/consts'
import { Button, IconButton, TextInput as PaperTextInput, Dialog, Portal, Text } from "react-native-paper";
import { updateNote, deleteDocument, updateNoteDate, convertTimestampToString } from "../modules/FirebaseHandler";
import styles from "../modules/style";
import { Note } from "../modules/types";
import { useNavigation } from "@react-navigation/native";


export default function NoteEditScreen({ note }: { note: Note }) {
  const [title, setTitle] = useState<string>(note.title);
  const [content, setContent] = useState<string>(note.content);
  const [tags, setTags] = useState<string[]>(note.tags);
  const [dialogVisible, setDialogVisible] = useState<boolean>(false);
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
        <PaperTextInput 
          value={title} 
          onChangeText={async text => {setTitle(text); await updateNoteDate(note.id);}} 
          multiline={true} 
          style={[styles.titleTextInput, {marginTop: 10, backgroundColor: consts.backgroundTernaryDark}]}
          underlineColor={consts.ternaryActive}
          activeUnderlineColor={consts.primary}
          textColor={consts.textActiveLight}
          textAlignVertical="center"
          placeholder="Title"
          placeholderTextColor={'#777'}
        />
        <PaperTextInput 
          value={content}
          onChangeText={async text => {setContent(text); await updateNoteDate(note.id);}}
          multiline={true}
          style={styles.noteContentTextInput}
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
            Delete note
        </Button>
        <Portal>
          <Dialog style={styles.dialog} visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
            <Dialog.Title>Delete note</Dialog.Title>
            <Dialog.Content>
              <Text>Are you sure you want to delete this note?</Text>
            </Dialog.Content>
            <Dialog.Actions style={{justifyContent: 'space-between'}}>
              <Button textColor={consts.textActiveLight} style={{paddingHorizontal: 10}} onPress={() => setDialogVisible(false)}>No</Button>
              <Button textColor={consts.textActiveLight} onPress={() => {setDialogVisible(false); handleDeleteNote()}}>Yes</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>

        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Text
            style={[styles.textStandart, {color: consts.textActiveLight, margin: 10}]}>
              Last updated: {convertTimestampToString(note.updatedAt)}
          </Text>
          <Text
            style={[styles.textStandart, {color: consts.textActiveLight, margin: 10}]}>
              Created: {convertTimestampToString(note.createdAt)}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}