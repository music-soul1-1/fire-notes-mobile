import React from "react";
import { View, Text } from "react-native";
import styles from './style';
import { Todo } from "./types";
import { useNavigation } from "@react-navigation/native";
import { TouchableRipple, Checkbox } from "react-native-paper";
import * as consts from './consts';


export default function TodoWidget({ todo, setTodo }: { todo: Todo, setTodo: any }) {
  const navigation = useNavigation<any>();

  const handleTodoPress = () => {
    setTodo(todo);
    navigation.navigate('TodoEditScreen', { todo: todo });
  };
  

  return (
    <TouchableRipple key={todo.id} onPress={handleTodoPress} style={styles.noteWidgetContainer}>
      <View>
        <Text style={styles.textMedium}>{todo.title}</Text>
        {Array.isArray(todo.subtask) && todo.subtask.map((subtask, index) => (
          <View key={index} style={{  alignItems: 'center', flexDirection: 'row', }}>
              <Checkbox 
                status={subtask.completed ? "checked" : "unchecked"} 
                color={consts.ternaryActive}
                uncheckedColor={consts.ternaryActive} />
              <Text style={[styles.textStandart, {flex: 1,flexWrap: 'wrap'}]} numberOfLines={3}>
                {subtask.text}
              </Text>
          </View>
        ))}
      </View>
    </TouchableRipple>
  );
};