import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  // Guardar datos en localStorage
  setItem(key: string, value: any): void {
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
    } catch (error) {
      console.error('Error guardando en localStorage:', error);
    }
  }

  // Recuperar datos de localStorage
  getItem(key: string): any {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error recuperando de localStorage:', error);
      return null;
    }
  }

  // Eliminar un elemento específico
  removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error eliminando de localStorage:', error);
    }
  }

  // Limpiar todo el localStorage
  clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error limpiando localStorage:', error);
    }
  }

  // Verificar si existe una clave
  hasItem(key: string): boolean {
    return localStorage.getItem(key) !== null;
  }

  // Métodos específicos para la aplicación
  
  // Guardar datos del usuario
  setUserData(userData: any): void {
    this.setItem('userData', userData);
  }

  // Obtener datos del usuario
  getUserData(): any {
    return this.getItem('userData');
  }

  // Guardar token de sesión
  setAuthToken(token: string): void {
    this.setItem('authToken', token);
  }

  // Obtener token de sesión
  getAuthToken(): string {
    return this.getItem('authToken');
  }

  // Verificar si hay sesión activa
  isLoggedIn(): boolean {
    try {
      const token = this.getAuthToken();
      const userData = this.getUserData();
      const isValid = token && token.length > 0 && userData && userData.id;
      console.log('isLoggedIn check:', { 
        hasToken: !!token, 
        tokenLength: token?.length,
        hasUserData: !!userData, 
        userDataId: userData?.id, 
        isValid 
      }); // Debug
      return !!isValid;
    } catch (error) {
      console.error('Error checking login status:', error);
      return false;
    }
  }

  // Guardar datos del inventario del usuario
  setUserInventory(userId: string, inventory: any[]): void {
    this.setItem(`inventory_${userId}`, inventory);
  }

  // Obtener inventario del usuario
  getUserInventory(userId: string): any[] {
    return this.getItem(`inventory_${userId}`) || [];
  }

  // Guardar actividades del usuario
  setUserActivities(userId: string, activities: any[]): void {
    this.setItem(`activities_${userId}`, activities);
  }

  // Obtener actividades del usuario
  getUserActivities(userId: string): any[] {
    return this.getItem(`activities_${userId}`) || [];
  }

  // Agregar una nueva actividad al usuario
  addUserActivity(userId: string, activity: any): void {
    const activities = this.getUserActivities(userId);
    activities.unshift(activity); // Agregar al inicio para mostrar las más recientes primero
    
    // Mantener solo las últimas 50 actividades para no sobrecargar
    if (activities.length > 50) {
      activities.splice(50);
    }
    
    this.setUserActivities(userId, activities);
  }

  // Guardar configuraciones de la app
  setAppSettings(settings: any): void {
    this.setItem('appSettings', settings);
  }

  // Obtener configuraciones de la app
  getAppSettings(): any {
    return this.getItem('appSettings') || {
      theme: 'light',
      notifications: true,
      language: 'es'
    };
  }

  // Cerrar sesión (limpiar datos del usuario)
  logout(): void {
    console.log('🚨 Ejecutando logout completo...');
    
    // Limpiar datos básicos del usuario
    this.removeItem('userData');
    this.removeItem('authToken');
    
    // No limpiar datos persistentes de usuarios registrados ni configuraciones
    // Solo limpiar datos de sesión actual
    console.log('🚨 Logout completado');
  }

  // Método para limpiar completamente todo (solo para casos extremos)
  clearAllData(): void {
    console.log('🧹 Limpiando todos los datos...');
    localStorage.clear();
    console.log('🧹 Todos los datos eliminados');
  }
}