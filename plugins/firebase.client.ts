import { initializeApp } from 'firebase/app'
import { getAuth } from "firebase/auth"
import { getFirestore } from 'firebase/firestore'
import { getAnalytics } from "firebase/analytics"
import { getDatabase } from 'firebase/database'

export default defineNuxtPlugin(nuxtApp => {
    const config = useRuntimeConfig();

    const firebaseConfig = {
        apiKey: config.app.firebaseApiKey,
        authDomain: config.app.firebaseAuthDomain,
        databaseURL: config.app.firebaseDbUrl,
        projectId: config.app.firebaseProjectId,
        storageBucket: config.app.firebaseStorageBucket,
        messagingSenderId: config.app.firebaseMessengerId,
        appId: config.app.firebaseAppId,
        measurementId: config.app.firebaseMeasurementId
    };

    const app = initializeApp(firebaseConfig);
    const database = getDatabase(app);

    // Make the database object available globally in your app
    nuxtApp.provide('firebaseDatabase', database);
})