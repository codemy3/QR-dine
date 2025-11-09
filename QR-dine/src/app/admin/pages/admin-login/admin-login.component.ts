import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent {
  username: string = '';
  password: string = '';
  showPassword: boolean = false;
  errorMessage: string = '';

  constructor(private router: Router) {
    // Redirect to dashboard if already logged in
    if (localStorage.getItem('isAdminLoggedIn') === 'true') {
      this.router.navigate(['/admin']);
    }
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  login() {
    if (!this.username || !this.password) {
      this.errorMessage = 'Please enter username and password';
      return;
    }

    // ⚠️ Demo credentials
    const adminUser = 'admin';
    const adminPass = 'admin123';

    if (this.username === adminUser && this.password === adminPass) {
      localStorage.setItem('isAdminLoggedIn', 'true'); // flag for Auth Guard
      this.errorMessage = '';
      this.router.navigate(['/admin']); // redirect to dashboard
    } else {
      this.errorMessage = 'Invalid username or password';
    }
  }
  
}
