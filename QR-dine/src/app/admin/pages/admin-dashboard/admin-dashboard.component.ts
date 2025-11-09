import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuService, MenuItem } from '../../../services/menu.service';
import { OrderService, Order } from '../../../services/order.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  currentPage: string = 'orders'; // Default to orders page
  
  // Menu Items
  menuItems: MenuItem[] = [];
  newItem: MenuItem = { category: '', name: '', price: 0 };
  selectedFile: File | null = null;

  // Orders
  pendingOrders: Order[] = [];
  orderHistory: Order[] = [];
  
  // Audio for notification
  private notificationSound: HTMLAudioElement;
  private orderSubscription?: Subscription;

  constructor(
    private menuService: MenuService,
    private orderService: OrderService,
    private router: Router
  ) {
    // Create notification sound
    this.notificationSound = new Audio();
    this.notificationSound.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZWQ0PVqzn77BiHAU7k9n0wnMnBSl+zO7cizYHG2m98OShUQ4QW7Lr7aFCCw==';
  }

  ngOnInit(): void {
    this.loadMenuItems();
    this.loadPendingOrders();
    this.loadOrderHistory();
    
    // Subscribe to new orders
    this.orderSubscription = this.orderService.newOrder$.subscribe(order => {
      this.playNotificationSound();
      this.loadPendingOrders(); // Refresh orders
    });
  }

  ngOnDestroy(): void {
    if (this.orderSubscription) {
      this.orderSubscription.unsubscribe();
    }
  }

  // Navigation
  navigate(page: string): void {
    this.currentPage = page;
    if (page === 'orders') {
      this.loadPendingOrders();
    } else if (page === 'history') {
      this.loadOrderHistory();
    } else if (page === 'manage') {
      this.loadMenuItems();
    }
  }

  // ===== ORDER MANAGEMENT =====
  loadPendingOrders(): void {
    this.orderService.getPendingOrders().subscribe({
      next: (orders) => {
        this.pendingOrders = orders;
      },
      error: (err) => console.error('Error loading orders:', err)
    });
  }

  loadOrderHistory(): void {
    this.orderService.getOrderHistory().subscribe({
      next: (orders) => {
        this.orderHistory = orders;
      },
      error: (err) => console.error('Error loading history:', err)
    });
  }

  confirmOrder(order: Order): void {
    if (!order._id) return;
    
    this.orderService.confirmOrder(order._id).subscribe({
      next: () => {
        this.pendingOrders = this.pendingOrders.filter(o => o._id !== order._id);
        this.loadOrderHistory();
        alert('✅ Order confirmed!');
      },
      error: (err) => {
        console.error('Error confirming order:', err);
        alert('Failed to confirm order');
      }
    });
  }

  cancelOrder(order: Order): void {
    if (!order._id) return;
    
    if (!confirm('Are you sure you want to cancel this order?')) return;
    
    this.orderService.cancelOrder(order._id).subscribe({
      next: () => {
        this.pendingOrders = this.pendingOrders.filter(o => o._id !== order._id);
        this.loadOrderHistory();
        alert('❌ Order cancelled!');
      },
      error: (err) => {
        console.error('Error cancelling order:', err);
        alert('Failed to cancel order');
      }
    });
  }

  playNotificationSound(): void {
    this.notificationSound.play().catch(err => console.error('Could not play sound:', err));
  }

  // ===== MENU ITEM MANAGEMENT =====
  loadMenuItems(): void {
    this.menuService.getItems().subscribe({
      next: (data: MenuItem[]) => (this.menuItems = data),
      error: (err: any) => {
        console.error('Error loading items:', err);
        alert('Failed to load menu items.');
      },
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  addItem(): void {
    if (!this.newItem.category || !this.newItem.name || this.newItem.price <= 0) {
      alert('⚠️ Please fill all required fields.');
      return;
    }

    const formData = new FormData();
    formData.append('category', this.newItem.category);
    formData.append('name', this.newItem.name);
    formData.append('price', this.newItem.price.toString());
    formData.append('description', this.newItem.description || '');
    if (this.selectedFile) formData.append('image', this.selectedFile);

    this.menuService.addItem(formData).subscribe({
      next: (item: MenuItem) => {
        this.menuItems.push(item);
        this.menuService.triggerRefresh();
        this.newItem = { category: '', name: '', price: 0 };
        this.selectedFile = null;
        alert('✅ Item added successfully!');
      },
      error: (err: any) => {
        console.error('Add failed:', err);
        alert('Failed to add item.');
      },
    });
  }

  deleteItem(item: MenuItem): void {
    if (!item._id) return;

    if (!confirm(`Are you sure you want to delete "${item.name}"?`)) return;

    this.menuService.deleteItem(item._id).subscribe({
      next: () => {
        this.menuItems = this.menuItems.filter(i => i._id !== item._id);
        this.menuService.triggerRefresh();
        alert('🗑️ Item deleted successfully!');
      },
      error: (err: any) => {
        console.error('Delete failed:', err);
        alert('Failed to delete item.');
      },
    });
  }

  logout(): void {
    localStorage.removeItem('isAdminLoggedIn');
    this.router.navigate(['/admin-login']);
  }
}