import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { io, Socket } from 'socket.io-client';

export interface OrderItem {
  itemId?: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  _id?: string;
  tableId?: string;
  tableNumber: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: Date;
  updatedAt?: Date;
  isNewOrder?: boolean; // Changed from isNew to isNewOrder
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:5000/api/orders';
  private socket: Socket;
  private newOrderSubject = new Subject<Order>();
  
  newOrder$ = this.newOrderSubject.asObservable();

  constructor(private http: HttpClient) {
    // Initialize Socket.IO connection
    this.socket = io('http://localhost:5000', {
      transports: ['websocket', 'polling']
    });

    // Listen for new orders
    this.socket.on('newOrder', (order: Order) => {
      console.log('🔔 New order received:', order);
      this.newOrderSubject.next(order);
    });

    // Join admin room
    this.socket.emit('joinAdminRoom');
  }

  // Get all pending orders
  getPendingOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/pending`);
  }

  // Get order history (confirmed/cancelled)
  getOrderHistory(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/history`);
  }

  // Get all orders
  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiUrl);
  }

  // Create new order (from customer)
  createOrder(orderData: Partial<Order>): Observable<Order> {
    return this.http.post<Order>(this.apiUrl, orderData);
  }

  // Confirm order
  confirmOrder(orderId: string): Observable<Order> {
    return this.http.patch<Order>(`${this.apiUrl}/${orderId}/confirm`, {});
  }

  // Cancel order
  cancelOrder(orderId: string): Observable<Order> {
    return this.http.patch<Order>(`${this.apiUrl}/${orderId}/cancel`, {});
  }

  // Mark order as seen
  markAsSeen(orderId: string): Observable<Order> {
    return this.http.patch<Order>(`${this.apiUrl}/${orderId}/seen`, {});
  }

  // Delete order
  deleteOrder(orderId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${orderId}`);
  }

  // Disconnect socket when service is destroyed
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}