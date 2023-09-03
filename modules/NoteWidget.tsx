import React from "react";
import { View, Text } from "react-native";
import styles from './style';
import { Note } from "./types";
import { useNavigation } from "@react-navigation/native";
import { TouchableRipple } from "react-native-paper";


export default function NoteWidget({ note, setNote }: { note: Note, setNote: any }) {
  const navigation = useNavigation<any>();

  const handleNotePress = () => {
    setNote(note);
    navigation.navigate('NoteEditScreen', { note: note });
  };
  

  return (
    <TouchableRipple key={note.id} onPress={handleNotePress} style={styles.noteWidgetContainer}>
      <View>
        <Text style={styles.textMedium}>{note.title}</Text>
        <Text style={styles.textStandart}>{note.content}</Text>
      </View>
    </TouchableRipple>
  );
};