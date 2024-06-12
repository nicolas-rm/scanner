import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-item-details-modal',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './item-details-modal.component.html',
  styleUrl: './item-details-modal.component.scss'
})
export class ItemDetailsModalComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }


}
