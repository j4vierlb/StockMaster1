import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from './services/storage.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit {
  
  constructor(
    private router: Router,
    private storageService: StorageService
  ) {}

  ngOnInit() {
    this.checkAuthenticationState();
  }

  private checkAuthenticationState() {
    console.log('🚀 Verificando estado de autenticación al iniciar la app...');
    
    // Verificar si hay un usuario logueado
    const userData = this.storageService.getUserData();
    const authToken = this.storageService.getAuthToken();
    const isLoggedIn = this.storageService.isLoggedIn();
    
    console.log('🚀 Estado actual:', {
      userData: !!userData,
      authToken: !!authToken,
      isLoggedIn,
      userRole: userData?.role
    });

    if (isLoggedIn && userData && authToken) {
      // Usuario autenticado, redirigir según su rol
      console.log('🚀 Usuario autenticado encontrado, rol:', userData.role);
      
      if (userData.role === 'admin') {
        console.log('🚀 Redirigiendo admin a /admin');
        this.router.navigate(['/admin']);
      } else {
        console.log('🚀 Redirigiendo usuario normal a /home');
        this.router.navigate(['/home']);
      }
    } else {
      // No hay usuario autenticado, redirigir a login
      console.log('🚀 No hay usuario autenticado, redirigiendo a /login');
      // Limpiar cualquier dato corrupto
      this.storageService.logout();
      this.router.navigate(['/login']);
    }
  }
}
