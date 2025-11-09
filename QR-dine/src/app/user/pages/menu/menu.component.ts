import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuService, MenuItem } from '../../../services/menu.service';
import { Subscription } from 'rxjs'; // 👈 add this

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit, OnDestroy {
  menuItems: MenuItem[] = [];
  loading = true;
  error = '';
  private refreshSub!: Subscription; // 👈 subscription holder

  constructor(private menuService: MenuService) {}

  ngOnInit(): void {
    this.loadMenuItems();

    // 👇 Listen for updates from admin dashboard
    this.refreshSub = this.menuService.refreshNeeded.subscribe(() => {
      console.log('🔄 Auto-refresh triggered!');
      this.loadMenuItems();
    });
  }

  loadMenuItems(): void {
    this.menuService.getItems().subscribe({
      next: (items) => {
        this.menuItems = items;
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Error fetching menu:', err);
        this.error = 'Failed to load menu items';
        this.loading = false;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.refreshSub) this.refreshSub.unsubscribe(); // 👈 cleanup
  }
}
