import * as React from "react";
import * as firebase from 'firebase';
import {View,Text, Button} from 'react-native';
import * as Google from 'expo-google-app-auth';

export default class LoginScreen extends React.Component{
    isUserEqual = (googleUser, firebaseUser) => {
        if (firebaseUser) {
          var providerData = firebaseUser.providerData;
          for (var i = 0; i < providerData.length; i++) {
            if (
              providerData[i].providerId ===
                firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
              providerData[i].uid === googleUser.getBasicProfile().getId()
            ) {
              // We don't need to reauth the Firebase connection.
              return true;
            }
          }
        }
        return false;
      };
    
      onSignIn = googleUser => {
        // We need to register an Observer on Firebase Auth to make sure auth is initialized.
        var unsubscribe = firebase.auth().onAuthStateChanged(firebaseUser => {
          unsubscribe();
          // Check if we are already signed-in Firebase with the correct user.
          if (!this.isUserEqual(googleUser, firebaseUser)) {
            // Build Firebase credential with the Google ID token.
            var credential = firebase.auth.GoogleAuthProvider.credential(
              googleUser.idToken,
              googleUser.accessToken
            );
    
            // Sign in with credential from the Google user.
            firebase
              .auth()
              .signInWithCredential(credential)
              .then(function(result) {
                if (result.additionalUserInfo.isNewUser) {
                  firebase
                    .database()
                    .ref("/users/" + result.user.uid)
                    .set({
                      gmail: result.user.email,
                      profile_picture: result.additionalUserInfo.profile.picture,
                      locale: result.additionalUserInfo.profile.locale,
                      first_name: result.additionalUserInfo.profile.given_name,
                      last_name: result.additionalUserInfo.profile.family_name,
                      current_theme: "dark"
                    })
                    .then(function(snapshot) {});
                }
              })
              .catch(error => {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                // The email of the user's account used.
                var email = error.email;
                // The firebase.auth.AuthCredential type that was used.
                var credential = error.credential;
                // ...
              });
          } else {
            console.log("User already signed-in Firebase.");
          }
        });
      };

    signInWithGoogle = async() => {
        try{
            const response = await Google.logInAsync({
                behavior: "web" ,
                anroidClientId: "710429566660-kcptrc308023532ljbhvcvd70nqjrclg.apps.googleusercontent.com",
                scopes: [
                    "proflie",
                    "email"
                ]
            }) 
            if (response.type === "success"){
                this.onSignIn(response)
                return response.accessToken                
            }
            else{
                return {cancelled:true}
            }
        }
        catch (error) {
            console.log(error.message)
            return {error: true}
        }

    }

    render(){
        return(
            <View style={{
                flex:1,
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <Button title="Sign in with Google" onPress={()=>{
                    this.signInWithGoogle()
                }} />
            </View>
        )
    }
}