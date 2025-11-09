import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CartService } from '../cart.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];
  total = 0;
  showPopup = false;
  orderPlaced = false;
  tableNumber: string = '';
  tableId: string = '';

  constructor(
    private cartService: CartService,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    // Get table number from URL query params
    this.route.queryParams.subscribe(params => {
      this.tableNumber = params['table'] || '1'; // default to table 1
      this.fetchTableId();
    });

    this.loadCart();
    this.cartService.cart$.subscribe(items => {
      this.cartItems = items;
      this.total = this.cartService.getTotal();
    });
  }

  fetchTableId() {
    // Get table ID from backend using table number
    this.http.get<any>(`http://localhost:5000/api/tables/${this.tableNumber}`)
      .subscribe({
        next: (table) => {
          this.tableId = table._id;
          console.log('✅ Table loaded:', table);
        },
        error: (err) => {
          console.error('❌ Failed to load table:', err);
        }
      });
  }

  loadCart() {
    this.cartItems = this.cartService.getItems();
    this.total = this.cartService.getTotal();
  }

  increaseQuantity(index: number) {
    this.cartService.increaseQuantity(index);
  }

  decreaseQuantity(index: number) {
    this.cartService.decreaseQuantity(index);
  }

  removeItem(index: number) {
    this.cartService.removeItem(index);
  }

  openPopup() {
    if (!this.tableId) {
      alert('Table information not loaded. Please refresh the page.');
      return;
    }
    this.showPopup = true;
  }

  closePopup() {
    this.showPopup = false;
  }

  placeOrder() {
    if (!this.tableId) {
      alert('Table information missing!');
      return;
    }

    this.cartService.placeOrder(this.tableId).subscribe({
      next: (response) => {
        console.log('✅ Order placed successfully:', response);
        this.orderPlaced = true;
        this.showPopup = false;
        this.cartService.clearCart();
        setTimeout(() => (this.orderPlaced = false), 3000);
      },
      error: (error) => {
        console.error('❌ Order failed:', error);
        alert('Failed to place order. Please try again.');
      }
    });
  }
}