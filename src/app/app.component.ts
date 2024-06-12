import { Component, NgModule } from '@angular/core';
import { RouterOutlet } from '@angular/router';
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

import {MatInputModule} from '@angular/material/input';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    // BrowserModule,
    // BrowserAnimationsModule,
    MatButtonModule,
    MatListModule,
    MatCardModule,
    FlexLayoutModule,
    ZXingScannerModule,
    MatMenuModule,
    MatIconModule,
    MatCheckboxModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'QR & Barcode Scanner';
  scannedItems: { data: string; timestamp: string }[] = [];
  scanning: boolean = false;
  manualInput: string = '';
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

  handleQrCodeResult(resultString: string) {
    const timestamp = moment().format('YYYY-MM-DD HH:mm:ss');
    this.scannedItems.push({ data: resultString, timestamp });
    this.scanning = false; // Stop scanning after receiving a result
  }

  startScan() {
    this.scanning = true;
  }

  stopScan() {
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
}
