import {
    ApplicationConfig,
    importProvidersFrom,
    provideZoneChangeDetection, isDevMode,
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
import { provideServiceWorker } from '@angular/service-worker';

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
        provideFirebaseApp(() => initializeApp(firebaseConfig, {
            automaticDataCollectionEnabled: true,
            name: 'ngx-qr-scanner',
        })),
        provideFirestore(() => getFirestore()),
        importProvidersFrom(AngularFirestoreModule),
        importProvidersFrom(AngularFirestoreModule.enablePersistence()),
        importProvidersFrom(AngularFireModule.initializeApp(firebaseConfig, {
            automaticDataCollectionEnabled: true,
            name: 'ngx-qr-scanner',
        })),
        importProvidersFrom(AngularFirestore), provideServiceWorker('ngsw-worker.js', {
            enabled: !isDevMode(),
            registrationStrategy: 'registerWhenStable:30000'
          }),
    ],
};