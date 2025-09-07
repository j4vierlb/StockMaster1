import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AnimationController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false
})
export class HomePage implements OnInit {
  logout() {
    // Limpiar datos de usuario si es necesario
    localStorage.removeItem('username');
    localStorage.removeItem('password');
    // Navegar al login
    this.router.navigate(['/login']);
  }
  userName: string = 'Usuario';
  
  metrics = {
    totalProducts: 125,
    lowStock: 8,
    inventoryValue: 25480,
    totalMovements: 42
  };

  quickActions = [
    { title: 'Productos', icon: 'cube-outline', route: '/products', color: 'primary' },
    { title: 'Movimientos', icon: 'swap-horizontal-outline', route: '/movements', color: 'secondary' },
    { title: 'Reportes', icon: 'document-text-outline', route: '/reports', color: 'tertiary' },
    { title: 'Ajustes', icon: 'settings-outline', route: '/settings', color: 'success' }
  ];

  recentActivities = [
    { action: 'Entrada de stock', product: 'Monitor LED 24"', quantity: 5, time: 'Hace 2 horas', icon: 'arrow-down-circle', color: 'success' },
    { action: 'Salida de stock', product: 'Teclado Mecánico', quantity: 2, time: 'Hace 5 horas', icon: 'arrow-up-circle', color: 'danger' },
    { action: 'Producto agregado', product: 'Mouse Inalámbrico', quantity: 10, time: 'Ayer', icon: 'add-circle', color: 'primary' },
    { action: 'Stock bajo', product: 'Impresora Láser', quantity: 2, time: 'Hace 3 días', icon: 'warning', color: 'warning' }
  ];

  constructor(
    private router: Router,
    private animationCtrl: AnimationController
  ) { }

  ngOnInit() {
    // Simular obtención del nombre de usuario
    setTimeout(() => {
      this.userName = 'Carlos Rodríguez';
      this.animateElements();
    }, 500);
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-CO', { 
      style: 'currency', 
      currency: 'COP',
      minimumFractionDigits: 0 
    }).format(amount);
  }

  animateElements() {
    const elements = [
      '.welcome-card',
      '.metrics-grid',
      '.actions-grid',
      '.activities-card'
    ];

    elements.forEach((selector, index) => {
      const element = document.querySelector(selector) as HTMLElement;
      if (element) {
        const animation = this.animationCtrl.create()
          .addElement(element)
          .duration(600)
          .delay(100 * index)
          .fromTo('opacity', '0', '1')
          .fromTo('transform', 'translateY(20px)', 'translateY(0)');
        animation.play();
      }
    });
  }

  doRefresh(event?: any) {
    setTimeout(() => {
      // Simular actualización de datos
      this.metrics.totalMovements += 1;
      if (event && event.target && event.target.complete) {
        event.target.complete();
      }
    }, 1500);
  }
}