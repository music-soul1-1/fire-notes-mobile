import 'react-native-gesture-handler';
import React, {useEffect, useState} from 'react';
import { useColorScheme, View, StatusBar } from 'react-native';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import googleServiceWebId from './android/app/google-services.json';
import { setUid, loadUid, logout } from './modules/FirebaseHandler';
import LoginScreen from './screens/LoginScreen';
import { PaperProvider, ActivityIndicator  } from 'react-native-paper';
import {theme, CombinedDarkTheme, CombinedDefaultTheme} from './modules/theme';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import LogoutScreen from './screens/LogoutScreen';
import NoteEditScreen from './screens/NoteEditScreen';
import { Note, Todo } from './modules/types';
import Header from './modules/Header';
import * as consts from './modules/consts';
import TodoEditScreen from './screens/TodoEditScreen';
import AboutScreen from './screens/AboutScreen';


const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

function App(): JSX.Element {
  // Set an initializing state whilst Firebase connects
  const [note, setNote] = useState<Note>({} as Note);
  const [todo, setTodo] = useState<Todo>({} as Todo);
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.UserCredential | null>(null);
  const isDarkMode = useColorScheme() === 'dark';
  

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: googleServiceWebId.client[0].oauth_client[2].client_id.toString() // Use the correct Client ID
    });
  
    async function login() {
      if (await loadUid()) {
        await onGoogleButtonPress();
      }
    };
  
    login().then(async () => {      
      const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
      return () => subscriber(); // unsubscribe on unmount
    });
  }, []);
  

  // Handle user state changes
  async function onAuthStateChanged() {
    if (initializing) setInitializing(false);
  };

  async function onGoogleButtonPress() {
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const { idToken } = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      const user = await auth().signInWithCredential(googleCredential);

      setUser(user);
      setUid(user.user.uid);
    }
    catch (error: any) {
      console.error('Google Sign-In Error', error.code);
      console.error(error);
    }
  };

  async function onLogout() {
    await logout();
    setUser(null);
  };

  function setNoteData(note: Note) {
    setNote(note);
  };

  function setTodoData(todo: Todo) {
    setTodo(todo);
  };

  if (initializing) return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}} >
      <ActivityIndicator size={60} color={theme.coreColors.tertiary} />
    </View>
  );

  return (
    <NavigationContainer theme={CombinedDarkTheme}>
      <PaperProvider theme={isDarkMode ? CombinedDarkTheme : CombinedDefaultTheme}>
        {user ? (
          <Drawer.Navigator screenOptions={{
              swipeEdgeWidth: 130,
              headerTitleStyle: {color: "#fff"},
              headerStyle: {backgroundColor: consts.ternary},
              headerTintColor: '#fff',
              drawerStyle: {
                backgroundColor: consts.ternary,
                width: 220,
              },
              drawerActiveTintColor: consts.secondary,
            }}>
            <Drawer.Screen 
              name="Main"
              options={{
                title: 'All',
                headerShown: false,
              }}
            >
              {() => (
                <Stack.Navigator screenOptions={{ 
                  headerShown: true,
                  headerShadowVisible: true,
                  headerTitleStyle: {color: "#fff"},
                  headerStyle: {backgroundColor: consts.ternary},
                  headerTintColor: '#fff', 
                  }}>
                  <Stack.Screen
                    name='HomeScreen'
                    options={{ headerShown: true, headerShadowVisible: true, header: () => <Header user={user} />, }}
                  >
                    {() => <HomeScreen user={user} setNote={setNoteData} setTodo={setTodoData} />}
                  </Stack.Screen>
                  <Stack.Screen name='NoteEditScreen' options={{headerTitle: ''}}>
                    {() => <NoteEditScreen note={note} />}
                  </Stack.Screen>
                  <Stack.Screen name='TodoEditScreen' options={{headerTitle: ''}}>
                    {() => <TodoEditScreen initialTodo={todo} />}
                  </Stack.Screen>
                </Stack.Navigator>
              )}
            </Drawer.Screen>
            <Drawer.Screen name='About' component={AboutScreen}/>
            <Drawer.Screen
              name="Logout"
              options={{ title: 'Log out' }}
            >
              {() => <LogoutScreen onLogout={onLogout} />}
            </Drawer.Screen>
          </Drawer.Navigator>
        ) : (
          <LoginScreen onGoogleButtonPress={onGoogleButtonPress} />
        )}
      </PaperProvider>
      <StatusBar backgroundColor={consts.ternary}/>
    </NavigationContainer>
  );
}

export default App;
