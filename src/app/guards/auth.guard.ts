import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { StorageService } from '../services/storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private storageService: StorageService,
    private router: Router
  ) {}

  canActivate(): boolean {
    console.log('🛡️ AuthGuard ejecutándose...'); // Debug
    
    const userData = this.storageService.getUserData();
    const authToken = this.storageService.getAuthToken();
    
    console.log('🛡️ Datos en AuthGuard:', { 
      userData: !!userData, 
      authToken: !!authToken,
      userRole: userData?.role,
      userDataContent: userData,
      authTokenContent: authToken 
    });
    
    if (this.storageService.isLoggedIn()) {
      console.log('✅ Usuario autenticado, permitiendo acceso'); // Debug
      return true;
    } else {
      console.log('❌ Usuario no autenticado, limpiando datos y redirigiendo a login'); // Debug
      // Limpiar datos corruptos
      this.storageService.logout();
      this.router.navigate(['/login']);
      return false;
    }
  }
}