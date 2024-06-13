import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, from, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

interface ScannerData {
    data: string;
    timestamp: string;
    id?: string;
}

@Injectable({
    providedIn: 'root'
})
export class FirestoreService {

    private collection = '/scanners';

    constructor(private fireStore: AngularFirestore) { }

    // Crear un nuevo documento de scanner
    create(scanner: ScannerData): Observable<ScannerData> {
        return from(this.fireStore.collection(this.collection).add(scanner)).pipe(
            map(() => scanner),
            catchError(error => throwError(() => error))
        );
    }

    // Crear nuevos documentos de scanners
    createMany(scanners: ScannerData[]): Observable<ScannerData[]> {
        const scannerPromises = scanners.map(scanner => {
            return this.fireStore.collection(this.collection).add(scanner);
        });

        return from(Promise.all(scannerPromises)).pipe(
            map(() => scanners),
            catchError(error => throwError(() => error))
        );
    }

    // Obtener todos los documentos de scanners
    getAlls(): Observable<ScannerData[]> {
        return this.fireStore.collection(this.collection).snapshotChanges().pipe(
            map(actions =>
                actions.map(action => {
                    const data = action.payload.doc.data() as ScannerData;
                    const id = action.payload.doc.id;
                    return { id, ...data } as ScannerData;
                })
            ),
            catchError(error => throwError(() => error))
        );
    }

    // Obtener un documento de scanner
    getById(id: string): Observable<ScannerData> {
        return this.fireStore.collection(this.collection).doc(id).get().pipe(
            map(action => {
                const data = action.data() as ScannerData;
                return { id, ...data };
            }),
            catchError(error => throwError(() => error))
        );
    }

    // Actualizar un documento de scanner
    update(scanner: ScannerData): Observable<ScannerData> {
        const { id, ...updatedProject } = scanner;
        return from(this.fireStore.collection(this.collection).doc(scanner.id!).update(updatedProject)).pipe(
            map(() => scanner),
            catchError(error => throwError(() => error))
        );
    }

    // Eliminar un documento de scanner
    delete(id: string): Observable<ScannerData> {
        return from(this.fireStore.collection(this.collection).doc(id).delete()).pipe(
            map(() => ({ id, data: '', timestamp: '' })),
            catchError(error => throwError(() => error))
        );
    }
}
