const admin = require('firebase-admin');


admin.initializeApp({
    credential: admin.credential.cert({
        projectId: process.env.PROJECT_ID,
        clientEmail: `firebase-adminsdk-dlojn@${process.env.PROJECT_ID}.iam.gserviceaccount.com`,
        privateKey: process.env.PRIVATE_KEY_FIREBASE
    }),
    storageBucket: 'gs://beat-stream.appspot.com' // Replace with your bucket name
});

module.exports = admin;
