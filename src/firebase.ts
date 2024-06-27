import firebase from "firebase-admin";

firebase.initializeApp({
    credential: firebase.credential.cert({
    })
});


export { firebase };

