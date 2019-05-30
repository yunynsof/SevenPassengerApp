# Seven Passenger App


This is an ionic project UI for Seven Passenger application.
 You need to have Cordova and Ionic 3.0.1 installed on the 
system to run it successfully


## Using this project

You
 must have cordova installed prior to this.


```
    npm install -g cordova
```


Install Ionic globally
```
    npm install -g ionic
```





## Installation of this project



* Install npm dependecies


```bash
    npm install
```

* Add Platform (whichever required)


```
   ionic cordova platform add android
   
   ionic cordova platform add ios
```


In few cases, you might need to install the latest platform

```
   ionic cordova platform add android@latest
   ionic cordova platform add ios@latest
```



* Create icon and splash resources (You should keep your 1024x1024 icon.png and 2048x2048 splash.png in resources folder in root )


```
    ionic cordova resources
```

* Make sure you copy `icon-1024.png` file from the root folder to `resources/ios/icon` folder, if you are building for iOS 11


* Initialize the new git

```
	git init
```



* Setup the new git remotes accordingly

```    
	git remote add origin <new remote>
```




## Plugins List

(In ionic 3 environment, plugins are installed automatically by `npm install` command)
```

    "cordova-plugin-device",

    "cordova-plugin-console",

    "cordova-plugin-whitelist",

    "cordova-plugin-splashscreen",

    "cordova-plugin-statusbar",

    "ionic-plugin-keyboard"
    
```



* Run app on device

```
  
  ionic cordova run android
  
  ionic cordova run ios --device
```

(To run the app on iPhone, you need to have proper developer certificate, provisioning profile and appID from developer.apple.com, as well as correct version of XCode. For instructions, see https://www.youtube.com/watch?v=Xh2nnjttOwo)

* Create signing key for android to release on Google Play


```bash
    keytool -genkey -v -keystore <keystore folder address> -alias <app alias> -keyalg RSA -keysize 2048 -validity 10000
```



* Create release build for Android Play Store

```bash
    ionic build android --release
```



* Sign the 'unsigned' APK for upload on Play store


```bash
    jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore <.keystore file full path> <unsigned apk full path> <app alias>
```




* Zipalign to optimize size for play store upload


```
    ./zipalign -v 4 <signed apk full path> <path for final APK> 
```
## Troubleshooting
* If you encounter Merge debug resouces while bulding for android
  ```
   Error : Mergedebugresouces

   ```
   Then just put this folder to the shortest path and then error will resolve


* If you encounter an error something like this when adding iOS platform
```
Error: Source path does not exist: resources/ios/splash/Default@2x~universal~anyany.png
```
go to config.xml -> Remove the error file name from iOS platform parameters

* If you get this error when building from XCode
`linker command failed with exit code 1`

Try these steps
    * Uninstall cordova-ios first, with npm uninstall cordova-ios
    * Install cordova-ios with npm install cordova-ios@4.4.0
    * After that we should add platform with ionic cordova platform add ios@4.4.0
    * The last one, run ionic cordova build ios, that open with xcode and build with your settins.




## Ionic Information of the generator system

```

cli packages: (C:\Users\Bunny\AppData\Roaming\npm\node_modules)

    @ionic/cli-utils  : 1.13.0
    ionic (Ionic CLI) : 3.13.0

global packages:

    cordova (Cordova CLI) : 6.5.0

local packages:

    @ionic/app-scripts : 1.1.4
    Cordova Platforms  : android 6.2.3
    Ionic Framework    : ionic-angular 2.3.0

System:

    Android SDK Tools : 26.1.1
    Node              : v6.9.5
    npm               : 3.10.10
    OS                : Windows 8.1

Misc:

    backend : legacy



```


# # build has firebase Authentication login, In this code we use {email:'hi@ionic.io',password:'puppies123'} statically  ,It also has facebook Auth logIn

# # Build is fully compatible with ios 11 
