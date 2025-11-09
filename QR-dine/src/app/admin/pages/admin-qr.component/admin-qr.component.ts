import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableQrComponent } from '../table-qr/table-qr.component';

@Component({
  selector: 'app-admin-qr',
  standalone: true,
  imports: [CommonModule, FormsModule, TableQrComponent],
  templateUrl: './admin-qr.component.html',
  styleUrls: ['./admin-qr.component.css']
})
export class AdminQrComponent {
  tables: number[] = [1, 2, 3, 4, 5, 6, 7, 8]; // example table numbers
}
