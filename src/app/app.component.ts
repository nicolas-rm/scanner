import { Component, ElementRef, NgModule, ViewChild } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import moment from 'moment';

// import { BrowserModule } from '@angular/platform-browser';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { FlexLayoutModule } from '@angular/flex-layout';

import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { CommonModule } from '@angular/common';

import { BarcodeFormat } from '@zxing/library';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
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
import { routes } from './app.routes';

import { MatGridListModule } from '@angular/material/grid-list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { BehaviorSubject } from 'rxjs';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, CommonModule, MatButtonModule, MatListModule, MatCardModule, FlexLayoutModule, ZXingScannerModule, MatMenuModule, MatIconModule, MatCheckboxModule, MatFormFieldModule, FormsModule, MatInputModule, ItemDetailsModalComponent, MatSelectModule, MatOptionModule, MatGridListModule, MatToolbarModule, MatSidenavModule],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
})
export class AppComponent {
    title = 'QR & Barcode Scanner';

    scannedItems: { data: string; timestamp: string }[] = [];

    scanning: boolean = false;

    manualInput: string = '';

    searchInput: string = '';

    tryHarder: boolean = false;

    flashEnabled: boolean = false;
    torchAvailable$ = new BehaviorSubject<boolean>(false);

    availableFormats = [
        { format: BarcodeFormat.QR_CODE, name: 'QR Code' },
        { format: BarcodeFormat.DATA_MATRIX, name: 'Data Matrix' },
        { format: BarcodeFormat.AZTEC, name: 'Aztec' },
        { format: BarcodeFormat.CODE_128, name: 'Code 128' },
        { format: BarcodeFormat.CODE_39, name: 'Code 39' },
        { format: BarcodeFormat.EAN_13, name: 'EAN-13' },
        { format: BarcodeFormat.EAN_8, name: 'EAN-8' },
        { format: BarcodeFormat.ITF, name: 'ITF' },
        { format: BarcodeFormat.UPC_A, name: 'UPC-A' },
        { format: BarcodeFormat.UPC_E, name: 'UPC-E' },
        { format: BarcodeFormat.PDF_417, name: 'PDF 417' },
    ];

    allowedFormats: BarcodeFormat[] = this.availableFormats.map((f) => f.format);

    cameras: MediaDeviceInfo[] = [];

    selectedCamera!: MediaDeviceInfo;

    @ViewChild('inputElement') inputElement!: ElementRef;

    ngAfterViewInit() {
        // this.inputElement.nativeElement.focus();
    }

    constructor(public dialog: MatDialog, private router: Router) {
        if (this.inputElement) {
            this.inputElement.nativeElement.focus();
        }
    }

    async ngOnInit() {
        await this.getVideoInputDevices();
    }

    async getVideoInputDevices() {
        const devices: MediaDeviceInfo[] = await navigator.mediaDevices.enumerateDevices();
        this.cameras = devices.filter((device) => device.kind === 'videoinput');
    }

    async selectCamera(camera: MediaDeviceInfo) {
        // this.router.navigate([], {
        //     queryParams: { cameraId: camera.deviceId },
        //     queryParamsHandling: 'merge',
        // });

        this.selectedCamera = camera;
    }

    async handleQrCodeResult(resultString: string) {
        const timestamp = moment().format('YYYY-MM-DD HH:mm:ss');
        this.scannedItems.push({ data: resultString, timestamp });
        this.scanning = false; // Stop scanning after receiving a result
    }

    async startScan() {
        this.scanning = true;
        this.tryHarder = true;
    }

    async stopScan() {
        this.scanning = false;
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
            const timestamp = moment().format('YYYY-MM-DD HH:mm:ss');
            this.scannedItems.push({ data: this.manualInput, timestamp });
            this.manualInput = '';
        }
    }

    search() {
        
    }

    viewItem(item: { data: string; timestamp: string }) {
        const dialogRef = this.dialog.open(ItemDetailsModalComponent, {
            width: '400px',
            data: item,
        });
    }

    deleteItem(item: { data: string; timestamp: string }) {
        const index = this.scannedItems.indexOf(item);
        if (index !== -1) {
            this.scannedItems.splice(index, 1);
        }
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

    // Generar qr por codigo
}
