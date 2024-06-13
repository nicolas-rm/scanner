import {
    ApplicationConfig,
    importProvidersFrom,
    provideZoneChangeDetection,
} from "@angular/core";
import { provideRouter } from "@angular/router";

import { routes } from "./app.routes";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";

import { AngularFireModule } from "@angular/fire/compat";
import {
    AngularFirestore,
    AngularFirestoreModule,
} from "@angular/fire/compat/firestore";
import { getFirestore, provideFirestore } from "@angular/fire/firestore";
import { initializeApp, provideFirebaseApp } from "@angular/fire/app";

const firebaseConfig = {
    apiKey: "AIzaSyDsioBhqFy87gwD7O_1d3U0f3KX82TKplw",
    authDomain: "ngx-qr-scanner.firebaseapp.com",
    projectId: "ngx-qr-scanner",
    storageBucket: "ngx-qr-scanner.appspot.com",
    messagingSenderId: "433743684669",
    appId: "1:433743684669:web:a026009568af5c74aeb654"
  };

export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(routes),
        provideAnimationsAsync(),
        provideFirebaseApp(() => initializeApp(firebaseConfig)),
        provideFirestore(() => getFirestore()),
        importProvidersFrom(AngularFirestoreModule),
        importProvidersFrom(AngularFireModule.initializeApp(firebaseConfig)),
        importProvidersFrom(AngularFirestore),
    ],
};

/*
provideFirebaseApp(() => initializeApp({ projectId: 'ngx-qr-scanner', appId: '1:433743684669:web:a026009568af5c74aeb654', storageBucket: 'ngx-qr-scanner.appspot.com', apiKey: 'AIzaSyDsioBhqFy87gwD7O_1d3U0f3KX82TKplw', authDomain: 'ngx-qr-scanner.firebaseapp.com', messagingSenderId: '433743684669' })), 
        provideFirestore(() => getFirestore())
         */
