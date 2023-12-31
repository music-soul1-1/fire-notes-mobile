# fire-notes-mobile

<p align="center"><br><img src="https://github.com/music-soul1-1/fire-notes/assets/72669184/5642a9ae-b6db-431e-bd74-8a0c702fbc32" width="128" height="128" /></p>
<h3 align="center">FireNotes</h3>

#### FireNotes - notes and to-do application.

This is a mobile version of [FireNotes](https://github.com/music-soul1-1/fire-notes). It is written in React Native and uses [Firebase](https://firebase.google.com/) as a storage.

### [See changelog](https://github.com/music-soul1-1/fire-notes-mobile#changelog)

## Features
* Save your notes and tasks.
* Mobile version of [FireNotes](https://github.com/music-soul1-1/fire-notes).
* Real-time updates.
* Storage and Authentication are provided by [Firebase](https://firebase.google.com/).

## Screenshots

![Screenshot_2023-10-13-15-18-00-182_com firenotes](https://github.com/music-soul1-1/fire-notes-mobile/assets/72669184/42f7b510-a6c8-4070-a91d-2553b0f9a856)
![Screenshot_2023-10-13-15-14-25-651_com firenotes](https://github.com/music-soul1-1/fire-notes-mobile/assets/72669184/a1e5bcff-3b74-4679-914e-55b3a1a1a618)
![Screenshot_2023-10-13-15-14-22-077_com firenotes](https://github.com/music-soul1-1/fire-notes-mobile/assets/72669184/bcb4ec66-8ee8-4f26-86d5-d0dbff23fb7d)
![Screenshot_2023-10-13-15-13-36-989_com firenotes](https://github.com/music-soul1-1/fire-notes-mobile/assets/72669184/57fc9876-6941-46c1-a162-e756d730ce34)


## Usage

1. Download the [latest release](https://github.com/music-soul1-1/fire-notes-mobile/releases/latest).
2. Install the app on your device.
3. Open the app and sign in with your Google account.
4. Enjoy!

## Plans

* Add support for other authentication methods.
* Improve UI.
* Add support for other languages.
* Optimize the app.
* Add features.


## Development

1. Clone the repository.
2. Install dependencies with `npm install`.
3. Download google-services.json from your Firebase project and put it in the android/app folder.
4. Run the app with `npm start` in one terminal, and `npx react-native run-android` in the other.
5. After making changes and testing, open pull request.

To build release version, run `cd android` in the project directory. Then run `./gradlew assembleRelease`. The apk will be in `android/app/build/outputs/apk/release/app-release.apk`. Don't forget to change app version (and increment versionCode) in `android/app/build.gradle`.

Note: if you're experiencing issues with building the app (Could not open proj generic class cache for build file '...\android\app\build.gradle'), 
try building the app with Android Studio first.

## Changelog
### v.0.0.2
- Styling improvements
- FAB added
- App icon added

### v.0.0.1
- Initial release

## License
FireNotes is an open-source project and released under the [MIT License](https://github.com/music-soul1-1/fire-notes-mobile/blob/main/LICENSE.txt).

## Credits
FireNotes is developed and maintained by [music-soul1-1](https://github.com/music-soul1-1/).
