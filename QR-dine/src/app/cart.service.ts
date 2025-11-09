import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'http://localhost:5000/api/orders';
  private items: any[] = [];
  private cartSubject = new BehaviorSubject<any[]>([]);
  cart$ = this.cartSubject.asObservable();

  constructor(private http: HttpClient) {}

  getItems() {
    return this.items;
  }

  addItem(item: any) {
    const existing = this.items.find(i => i.name === item.name);
    if (existing) existing.quantity += item.quantity || 1;
    else this.items.push({ ...item, quantity: item.quantity || 1 });
    this.cartSubject.next(this.items);
  }

  removeItem(index: number) {
    this.items.splice(index, 1);
    this.cartSubject.next(this.items);
  }

  clearCart() {
    this.items = [];
    this.cartSubject.next(this.items);
  }

  getTotal() {
    return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }
// ✅ Send order to backend
placeOrder(tableId: string) {
  const orderData = {
    tableId,
    items: this.items.map(i => ({
      itemId: i._id || i.id, // Use _id if it exists, fallback to id
      name: i.name,
      quantity: i.quantity,
      price: i.price
    })),
    totalAmount: this.getTotal() // Add this line
  };
  
  console.log('📤 Sending order:', orderData); // Debug log
  return this.http.post(this.apiUrl, orderData);
}
  // ✅ Get all orders
  getOrders() {
    return this.http.get(this.apiUrl);
  }

  // ✅ Update order status
  updateOrderStatus(orderId: string, status: string) {
    return this.http.put(`${this.apiUrl}/${orderId}`, { status });
  }

  // ✅ Delete order
  deleteOrder(orderId: string) {
    return this.http.delete(`${this.apiUrl}/${orderId}`);
  }
    // Increase quantity
  increaseQuantity(index: number) {
    this.items[index].quantity += 1;
    this.cartSubject.next(this.items);
  }

  // Decrease quantity
  decreaseQuantity(index: number) {
    if (this.items[index].quantity > 1) {
      this.items[index].quantity -= 1;
      this.cartSubject.next(this.items);
    }
  }

}
