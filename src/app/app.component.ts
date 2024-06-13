import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import moment from 'moment';

import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { FlexLayoutModule } from '@angular/flex-layout';

import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { CommonModule } from '@angular/common';

import { BarcodeFormat } from '@zxing/library';

import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';

import { MatInputModule } from '@angular/material/input';
import { ItemDetailsModalComponent } from './item-details-modal/item-details-modal.component';
import { MatDialog } from '@angular/material/dialog';

import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';

import { MatGridListModule } from '@angular/material/grid-list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { BehaviorSubject } from 'rxjs';
import { FirestoreService } from './services/firestore.service';
import { ConfirmDeleteDialogComponent } from './confirm-delete-dialog/confirm-delete-dialog.component';

import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'; // Importar MatSnackBarModule
import { ProgressSpinnerMode, MatProgressSpinnerModule } from '@angular/material/progress-spinner';



interface ScannerData {
    data: string;
    timestamp: string;
    id?: string;
    description?: string;
}

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, CommonModule, MatButtonModule, MatListModule, MatCardModule, FlexLayoutModule, ZXingScannerModule, MatMenuModule, MatIconModule, MatCheckboxModule, MatFormFieldModule, FormsModule, MatInputModule, ItemDetailsModalComponent, MatSelectModule, MatOptionModule, MatGridListModule, MatToolbarModule, MatSidenavModule, MatSnackBarModule, MatProgressSpinnerModule],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    providers: [FirestoreService],
})
export class AppComponent implements OnInit {
    title = 'QR & Barcode Scanner';
    scannedItems: ScannerData[] = [];
    scanning: boolean = false;
    manualInput: string = '';
    searchInput: string = '';
    tryHarder: boolean = false;
    flashEnabled: boolean = false;
    torchAvailable$ = new BehaviorSubject<boolean>(false);
    loading: boolean = false; // Variable de estado para el spinner

    availableFormats = [
        // { format: BarcodeFormat.QR_CODE, name: 'QR Code' },
        // { format: BarcodeFormat.DATA_MATRIX, name: 'Data Matrix' },
        // { format: BarcodeFormat.AZTEC, name: 'Aztec' },
        { format: BarcodeFormat.CODE_128, name: 'Code 128' },
        // { format: BarcodeFormat.CODE_39, name: 'Code 39' },
        // { format: BarcodeFormat.EAN_13, name: 'EAN-13' },
        // { format: BarcodeFormat.EAN_8, name: 'EAN-8' },
        // { format: BarcodeFormat.ITF, name: 'ITF' },
        // { format: BarcodeFormat.UPC_A, name: 'UPC-A' },
        // { format: BarcodeFormat.UPC_E, name: 'UPC-E' },
        // { format: BarcodeFormat.PDF_417, name: 'PDF 417' },
    ];

    allowedFormats: BarcodeFormat[] = this.availableFormats.map((f) => f.format);
    cameras: MediaDeviceInfo[] = [];
    selectedCamera!: MediaDeviceInfo;

    @ViewChild('inputElement') inputElement!: ElementRef;

    ngAfterViewInit() {
        // this.inputElement.nativeElement.focus();
    }

    constructor(public dialog: MatDialog, private snackBar: MatSnackBar, private fireStore: FirestoreService) {
        if (this.inputElement) {
            this.inputElement.nativeElement.focus();
            // Uppercase
        }
    }

    ngOnInit() {
        const inputs = async () => await this.getVideoInputDevices()
        inputs()

        this.loading = true; // Mostrar spinner al iniciar la carga de datos
        this.manualInput = this.manualInput.toLocaleUpperCase();

        this.fireStore.getAlls().subscribe({
            next: (data) => {
                this.scannedItems = data;
                this.loading = false; // Ocultar spinner cuando se complete la carga de datos
            },
            error: (error) => {
                this.loading = false; // Ocultar spinner en caso de error
                this.showSnackBar('Error al cargar los datos.');
            }
        });
    }

    async getVideoInputDevices() {
        const devices: MediaDeviceInfo[] = await navigator.mediaDevices.enumerateDevices();
        this.cameras = devices.filter((device) => device.kind === 'videoinput');
        this.tryHarder = true
    }

    async selectCamera(camera: MediaDeviceInfo) {
        this.selectedCamera = camera;
        this.tryHarder = true
    }

    async handleQrCodeResult(resultString: string) {
        const timestamp = moment().format('YYYY-MM-DD HH:mm A');
        // Verificar que no exista
        if (this.scannedItems.find((item) => item.data === resultString.toLocaleUpperCase())) {
            this.showSnackBar('Codigo Existente.' + '\n' + resultString.toLocaleUpperCase());
            return;
        }

        this.fireStore.create({ data: resultString.toLocaleUpperCase(), timestamp }).subscribe({
            next: () => {
                this.scanning = false; // Stop scanning after receiving a result
            },
            error: (error) => {
                this.showSnackBar('Error al guardar el código.');
            }
        });
        this.scanning = false; // Stop scanning after receiving a result
    }

    async startScan() {
        this.scanning = true;
        this.tryHarder = true;
    }

    async stopScan() {
        this.scanning = false;
        this.tryHarder = false;
        this.flashEnabled = false;
    }

    toggleFormat(format: BarcodeFormat) {
        const index = this.allowedFormats.indexOf(format);
        if (index === -1) {
            this.allowedFormats.push(format);
        } else {
            this.allowedFormats.splice(index, 1);
        }
    }

    addManualInput() {
        if (this.manualInput.trim()) {
            const timestamp = moment().format('YYYY-MM-DD HH:mm A');

            // Verificar si no existe
            if (this.scannedItems.find((item) => item.data === this.manualInput.toLocaleUpperCase())) {
                this.showSnackBar('Codigo Existente.' + '\n' + this.manualInput.toLocaleUpperCase());
                return;
            }

            this.fireStore.create({ data: this.manualInput.toLocaleUpperCase(), timestamp }).subscribe({
                next: () => {
                    this.manualInput = '';
                },
                error: (error) => {
                    this.showSnackBar('Error al guardar el código.');
                }
            });
            this.manualInput = '';
        }
    }

    search() {

        this.searchInput = this.searchInput.trim().toLocaleUpperCase();
        if (this.searchInput.length >= 3) {
            this.loading = true; // Mostrar spinner al iniciar la búsqueda
            this.fireStore.filter(this.searchInput).subscribe({
                next: (data) => {
                    this.scannedItems = data;
                    this.loading = false; // Ocultar spinner cuando se complete la búsqueda
                },
                error: (error) => {
                    this.loading = false; // Ocultar spinner en caso de error
                    this.showSnackBar('Error al realizar la búsqueda.');
                }
            });
        }else {
            this.loading = false; // Mostrar spinner al iniciar la carga de datos
            this.fireStore.getAlls().subscribe({
                next: (data) => {
                    this.scannedItems = data;
                    this.loading = false; // Ocultar spinner cuando se complete la carga de datos
                },
                error: (error) => {
                    this.loading = false; // Ocultar spinner en caso de error
                    this.showSnackBar('Error al cargar los datos.');
                }
            });
        }
    }

    viewItem(item: ScannerData) {
        const dialogRef = this.dialog.open(ItemDetailsModalComponent, {
            width: '400px',
            data: item,
        });
    }

    deleteItem(item: ScannerData) {
        const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent);

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.loading = true; // Mostrar spinner al iniciar la eliminación
                this.fireStore.delete(item.id!).subscribe({
                    next: () => {
                        this.loading = false; // Ocultar spinner cuando se complete la eliminación
                    },
                    error: (error) => {
                        this.loading = false; // Ocultar spinner en caso de error
                        this.showSnackBar('Error al eliminar el código.');
                    }
                });
            }
        });
    }

    onTorchCompatible(isCompatible: boolean): void {
        this.torchAvailable$.next(isCompatible || false);
        if (!isCompatible) {
            this.flashEnabled = false;
        }
    }

    toggleTorch(): void {
        this.flashEnabled = !this.flashEnabled;
    }

    private showSnackBar(message: string) {
        this.snackBar.open(message, 'Cerrar', {
            horizontalPosition: 'center', // Posición horizontal 'start' | 'center' | 'end' | 'left' | 'right'
            verticalPosition: 'top',
            duration: 5000, // Duración en milisegundos
        });
    }
}