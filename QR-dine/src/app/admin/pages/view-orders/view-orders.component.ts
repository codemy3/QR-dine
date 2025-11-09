import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-view-orders',
  standalone: true,
  imports: [CommonModule],
  template: `<h3>Orders will be shown here...</h3>`
})
export class ViewOrdersComponent {}
