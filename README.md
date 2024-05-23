# Starling Messenger

The Messenger app that works without Internet using the Starling protocol over Bluetooth Low Energy.

# Getting Started

> **Note**: Make sure you have completed the [React Native - Environment Setup](https://reactnative.dev/docs/environment-setup) instructions till "Creating a new application" step, before proceeding.

## Step 1: Configure react-native-starling

Before react-native-starling is published to NPM, it has to be manually linked.
Make sure to clone and configure [`react-native-starling`](https://github.com/starling-protocol/react-native-starling)
and configure it according to your setup in the `package.json` file.

### Building for iOS

Run the following command to build all iOS related dependencies.

```shell
$ npm run pod-install
```

## Step 2: Start the Metro Server

First, you will need to start **Metro**, the JavaScript _bundler_ that ships _with_ React Native.

To start Metro, run the following command from the _root_ of your React Native project:

```bash
npm start
```

> NOTE: For Android run `adb reverse tcp:8081 tcp:8081` if the device cannot connect to the development server

## Step 3: Start your Application

Let Metro Bundler run in its _own_ terminal. Open a _new_ terminal from the _root_ of your React Native project. Run the following command to start your _Android_ or _iOS_ app:

### For Android

Open the `./android` directory with [Android Studio](https://developer.android.com/studio) and click Run to build and run the app.

### For iOS

Open the `./ios/starling_messenger.xcworkspace` project in [XCode](https://developer.apple.com/xcode/) and click Run to build and run the app.
