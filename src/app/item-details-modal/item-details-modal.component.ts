import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { FirestoreService } from '../services/firestore.service';

interface ScannerData {
  data: string;
  timestamp: string;
  id?: string;
  description?: string;
}

@Component({
  selector: 'app-item-details-modal',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule
  ],
  templateUrl: './item-details-modal.component.html',
  styleUrl: './item-details-modal.component.scss',
  providers: [FirestoreService]
})
export class ItemDetailsModalComponent implements OnInit {
  editableData!: ScannerData;

  constructor(
    public dialogRef: MatDialogRef<ItemDetailsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ScannerData,
    private firestoreService: FirestoreService
  ) { }

  ngOnInit(): void {
    // Crear una copia profunda de los datos para editar
    this.editableData = { ...this.data };
  }

  save(): void {
    const data = {
      data: this.editableData.data.toLocaleUpperCase(),
      timestamp: this.editableData.timestamp,
      description: this.editableData.description?.toLocaleUpperCase()
    };
    // Actualizar los datos originales solo al guardar
    this.firestoreService.update(this.editableData).subscribe(() => {
      this.dialogRef.close(this.editableData);
    });
  }
}