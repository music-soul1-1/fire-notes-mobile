import React from "react";
import { Image, View } from "react-native";
import { Button, Text } from 'react-native-paper';
import styles from "../modules/style";


export default function LoginScreen({onGoogleButtonPress}: {onGoogleButtonPress: () => void}) : JSX.Element {
  return (
    <View style={styles.loginScreenContainer}>
      <Image 
        source={require('../assets/fire-notes-logo.png')} 
        style={styles.loginScreenIcon}
      />
      <Text style={styles.loginScreenTitle}>Login</Text>
      <Text style={styles.textMedium}>These are the options for now:</Text>
      <Button
          icon={'google'} // deprecated 
          mode="contained-tonal"
          onPress={() => onGoogleButtonPress()}
          style={{marginTop: 20}}
      >
        Sign-In with Google 
      </Button>
    </View>
  );
}