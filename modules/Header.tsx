import React from "react";
import { Image, View, Text } from "react-native";
import styles from './style';
import { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { Avatar, IconButton } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";


export default function Header({user} : {user: FirebaseAuthTypes.UserCredential}): JSX.Element {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.header}>
      <IconButton 
        icon={() =>
          <Image
            source={require('../assets/fire-notes-logo.png')}
            style={styles.headerIcon}
          />}
        onPress={() => navigation.openDrawer()}
        style={{marginLeft: 15, alignItems: 'center', justifyContent: 'center'}}
      />
      <Text style={styles.headerText}>
        FireNotes
      </Text>
      <View style={[styles.headerAvatar, { position: 'absolute', right: 0 }]}>
        <Avatar.Image size={45} source={{ uri: user.user.photoURL ?? '' }} style={styles.headerAvatarImage} />
      </View>
    </View>
  );
}