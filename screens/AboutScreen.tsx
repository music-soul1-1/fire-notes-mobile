import React, {useState, useEffect} from "react";
import { View, Linking } from "react-native";
import { Button, Text } from "react-native-paper";
import { version, author, repository } from '../package.json';
import styles from "../modules/style";
import * as consts from '../modules/consts';

export default function AboutScreen() {
  const [latestVersion, setLatestVersion] = useState<string | null>(null);

  useEffect(() => {
    getLatestVersion();
  }, []);

  async function getLatestVersion() {
    const link = `https://api.github.com/repos/${author}/fire-notes-mobile/releases/latest`;

    try {
      const response = await fetch(link);
      const data = await response.json();

      if (response.ok) {
        setLatestVersion(data?.tag_name);
      }
      else {
        console.log('There was an error getting response from GitHub API');
      }
    }
    catch (error) {
      console.error(error);
    }
  };

  function checkUpdateStatus() {
    if (latestVersion) {
      if (latestVersion != `v.${version}`) {
        return `Update to ${latestVersion} available:`;
      }
      else {
        return 'You are using the latest version';
      }
    }
    else {
      return 'Unable to check for updates';
    }
  };

  return (
    <View style={[styles.screenContainer, {gap: 10}]}>
      <Text
        style={styles.textMedium}
        onPress={() => Linking.openURL(`https://github.com/${author}`)}
      >
        Author: {author}
      </Text>
      <Text style={styles.textMedium}>Version: {version}</Text>
      <Text style={styles.textMedium}>{checkUpdateStatus()}</Text>
      {latestVersion != `v.${version}` ? (
        <Button
          buttonColor={consts.ternary}
          mode="contained-tonal"
          textColor={consts.textActiveLight}
          onPress={() => Linking.openURL(`https://github.com/${author}/${repository}/releases/latest`)}
        >
          Update
        </Button>
      ): null}
      <Button
        buttonColor={consts.ternary}
        mode="contained-tonal"
        textColor={consts.textActiveLight}
        onPress={() => Linking.openURL(`https://github.com/${author}/${repository}`)}>
        See Github
      </Button>
      <Button 
        buttonColor={consts.ternary}
        mode="contained-tonal"
        textColor={consts.textActiveLight}
        onPress={() => Linking.openURL(`https://github.com/${author}/${repository}/blob/main/LICENSE.txt`)}>
        MIT license
      </Button>
    </View>
  );
}