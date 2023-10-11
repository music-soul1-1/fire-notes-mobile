import { StyleSheet } from "react-native";
import * as consts from './consts';
import {theme, CombinedDarkTheme, CombinedDefaultTheme} from './theme';

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    height: 60,
    backgroundColor: consts.ternary,
    justifyContent: 'flex-start',
    alignContent: 'center',
    alignItems: 'center',
  },
  headerIcon: {
    width: 60, 
    height: 60,
    margin: 0,
  },
  headerText: {
    color: '#fff',
    fontSize: 26
  },
  noteWidgetContainer: {
    width: '80%',
    backgroundColor: consts.ternary,
    margin: 10,
    padding: 14,
    borderRadius: 16,
  },
  loginScreenContainer: {
    height: '100%',
    backgroundColor: consts.ternary,
    justifyContent: 'center', 
    alignItems: 'center'
  },
  loginScreenTitle: {
    color: "#fff",
    fontSize: 30,
    fontWeight: 'bold',
    margin: 5,
  },
  textStandart: {
    color: '#fff',
  },
  textMedium: {
    color: '#fff',
    fontSize: 17,
  },
  loginScreenIcon: {
    width: 150, 
    height: 150,
  },
  headerAvatar: {
    marginRight: 10,
  },
  headerAvatarImage: {
    width: 45,
    height: 45,
  },
  containerCentered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  screenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: consts.backgroundTernaryDark,
  },
  editScreenContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: consts.backgroundTernaryDark,
  },
  titleTextInput: {
    width: '100%',
    backgroundColor: consts.ternary,
    fontSize: 19,
    textAlignVertical: 'center',
  },
  contentTextInput: {
    width: '100%',
    textAlignVertical: 'top',
    backgroundColor: consts.ternary,
  },
  noteContentTextInput: {
    width: '100%',
    textAlignVertical: 'top',
    backgroundColor: consts.backgroundTernaryDark,
    minHeight: 600,
  },
  textStandartBlue: {
    color: consts.textActiveLight,
  },
  tagsContainer: {
    flexDirection: 'row',
    marginVertical: 4,
    marginHorizontal: 8,
    alignItems: 'center',
  },
  tagTextInput: {
    backgroundColor: consts.ternary,
    paddingHorizontal: 15,
    height: 40,
    justifyContent:"center",
    borderRadius: 13,
    color: consts.textActiveLight,
    borderColor: consts.secondary,
    borderWidth: 1,
  },
  subtaskContainer: {
    width: '100%', 
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: consts.ternary,
    borderRadius: 18,
    padding: 0,
    margin: 10,
  },
  dialog: {
    backgroundColor: consts.ternary,
    padding: 10,
    color: consts.textActiveLight,
  },
});

export default styles;