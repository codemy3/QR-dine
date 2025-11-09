import { Routes } from '@angular/router';
import { HomeComponent } from './customer/pages/home/home.component';
import { AdminDashboardComponent } from './admin/pages/admin-dashboard/admin-dashboard.component';
import { CartComponent } from './cart/cart.component';
import { AdminLoginComponent } from './admin/pages/admin-login/admin-login.component';
import { AdminAuthGuard } from './admin/pages/admin-auth-guard';
import { TableQrComponent } from './admin/pages/table-qr/table-qr.component'; // ✅ import here

export const routes: Routes = [
  { path: 'admin-login', component: AdminLoginComponent },

  {
    path: 'admin',
    canActivate: [AdminAuthGuard],
    children: [
      { path: '', component: AdminDashboardComponent }, // default admin page
      { path: 'table-qr', component: TableQrComponent }, // ✅ your QR page
    ],
  },

  { path: '', component: HomeComponent },
  { path: 'cart', component: CartComponent },
  { path: '**', redirectTo: '' },
];
