import React from 'react';
import { View } from 'react-native';
import { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { Theme } from '@react-navigation/native';
import styles from '../modules/style';
import { Button, Text } from 'react-native-paper';

function LogoutScreen({ onLogout }: any) {
  return (
    <View style={styles.screenContainer}>
      <Text style={styles.textMedium}>Do you really want to log out?</Text>
      <Button style={{marginTop: 20}} onPress={() => onLogout()} mode='contained-tonal'>
        Logout
      </Button>
    </View>
  );
};

export default LogoutScreen;
