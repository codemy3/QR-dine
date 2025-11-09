import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';  // ✅ Import CommonModule for *ngIf and basic directives
import * as QRCode from 'qrcode';

@Component({
  selector: 'app-table-qr',
  standalone: true,
  imports: [CommonModule], // ✅ CommonModule includes NgIf, NgFor, etc.
  templateUrl: './table-qr.component.html',
  styleUrls: ['./table-qr.component.css']
})
export class TableQrComponent implements OnInit {
  @Input() tableNumber: number = 1;   // Table number input
  qrDataUrl: string = '';             // Holds the generated QR code image URL

  ngOnInit() {
    // 🔗 Replace with your actual deployment URL or local dev URL
    const url: string = `https://your-app-url.com/order?$table={this.tableNumber}`;

    // ✅ Generate QR code for the given table
    QRCode.toDataURL(url, { errorCorrectionLevel: 'M', width: 200 })
      .then((dataUrl: string) => {
        this.qrDataUrl = dataUrl;
      })
      .catch((err: any) => {
        console.error('Error generating QR code:', err);
      });
      
  }
  downloadQR() {
  if (this.qrDataUrl) {
    const link = document.createElement('a');
    link.href = this.qrDataUrl;
    link.download = `table-${this.tableNumber}-qr.png`;
    link.click();
  }
}

}
