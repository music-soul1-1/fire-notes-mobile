import { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

export type HeaderProps = {
  user: FirebaseAuthTypes.UserCredential;
  onGoogleSignOutPress: () => void;
};

export type Note = {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: FirebaseFirestoreTypes.Timestamp;
  updatedAt: FirebaseFirestoreTypes.Timestamp;
  isPinned: boolean;
};

export type Todo = {
  id: string;
  title: string;
  tags: string[];
  createdAt: FirebaseFirestoreTypes.Timestamp;
  updatedAt: FirebaseFirestoreTypes.Timestamp;
  isPinned: boolean;
  subtask: {
    text: string;
    completed: boolean;
    completedAt: FirebaseFirestoreTypes.Timestamp;
    createdAt: FirebaseFirestoreTypes.Timestamp;
    updatedAt: FirebaseFirestoreTypes.Timestamp;
  }[];
};
