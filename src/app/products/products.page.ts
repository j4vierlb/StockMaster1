import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
  standalone: false,
})
export class ProductsPage implements OnInit {

  products: any[] = [];
  filteredProducts: any[] = [];
  searchTerm: string = '';
  isLoading: boolean = false;
  selectedCategory: string = 'all';
  
  categories = [
    { value: 'all', label: 'Todas las Categorías' },
    { value: 'Hardware', label: 'Hardware' },
    { value: 'Periféricos', label: 'Periféricos' },
    { value: 'Pantallas', label: 'Pantallas' },
    { value: 'Accesorios', label: 'Accesorios' },
    { value: 'Software', label: 'Software' }
  ];

  constructor(
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private modalController: ModalController,
    private toastController: ToastController,
    private storageService: StorageService
  ) { }

  ngOnInit() {
    this.loadProducts();
  }

  ionViewWillEnter() {
    this.loadProducts();
  }

  loadProducts() {
    this.isLoading = true;
    const userData = this.storageService.getUserData();
    this.products = this.storageService.getUserInventory(userData.id) || [];
    this.filteredProducts = [...this.products];
    this.isLoading = false;
  }

  filterProducts() {
    this.filteredProducts = this.products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           product.category.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           product.location.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesCategory = this.selectedCategory === 'all' || product.category === this.selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }

  async addProduct() {
    const alert = await this.alertController.create({
      header: 'Nuevo Producto',
      cssClass: 'glass-alert',
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'Nombre del producto'
        },
        {
          name: 'category',
          type: 'text',
          placeholder: 'Categoría'
        },
        {
          name: 'stock',
          type: 'number',
          placeholder: 'Stock inicial'
        },
        {
          name: 'price',
          type: 'number',
          placeholder: 'Precio unitario'
        },
        {
          name: 'location',
          type: 'text',
          placeholder: 'Ubicación (ej: A-001)'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Agregar',
          handler: (data) => {
            if (data.name && data.category && data.stock && data.price && data.location) {
              this.createProduct(data);
              return true;
            } else {
              this.showToast('Por favor, completa todos los campos', 'warning');
              return false;
            }
          }
        }
      ]
    });

    await alert.present();
  }

  createProduct(productData: any) {
    const newProduct = {
      id: Date.now(), // ID único basado en timestamp
      name: productData.name,
      category: productData.category,
      stock: parseInt(productData.stock),
      price: parseFloat(productData.price),
      location: productData.location,
      status: parseInt(productData.stock) < 10 ? 'Bajo Stock' : 'Disponible',
      createdAt: new Date().toISOString()
    };

    this.products.push(newProduct);
    this.saveProducts();
    this.filterProducts();
    
    this.showToast('Producto agregado exitosamente', 'success');
    
    // Registrar actividad
    this.registerActivity('Producto creado', `${newProduct.name} - ${newProduct.stock} unidades`);
  }

  async editProduct(product: any) {
    const alert = await this.alertController.create({
      header: 'Editar Producto',
      cssClass: 'glass-alert',
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'Nombre del producto',
          value: product.name
        },
        {
          name: 'category',
          type: 'text',
          placeholder: 'Categoría',
          value: product.category
        },
        {
          name: 'stock',
          type: 'number',
          placeholder: 'Stock',
          value: product.stock
        },
        {
          name: 'price',
          type: 'number',
          placeholder: 'Precio unitario',
          value: product.price
        },
        {
          name: 'location',
          type: 'text',
          placeholder: 'Ubicación',
          value: product.location
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Guardar',
          handler: (data) => {
            if (data.name && data.category && data.stock !== null && data.price && data.location) {
              this.updateProduct(product.id, data);
              return true;
            } else {
              this.showToast('Por favor, completa todos los campos', 'warning');
              return false;
            }
          }
        }
      ]
    });

    await alert.present();
  }

  updateProduct(productId: number, updatedData: any) {
    const index = this.products.findIndex(p => p.id === productId);
    if (index !== -1) {
      const oldStock = this.products[index].stock;
      
      this.products[index] = {
        ...this.products[index],
        name: updatedData.name,
        category: updatedData.category,
        stock: parseInt(updatedData.stock),
        price: parseFloat(updatedData.price),
        location: updatedData.location,
        status: parseInt(updatedData.stock) < 10 ? 'Bajo Stock' : 'Disponible',
        updatedAt: new Date().toISOString()
      };

      this.saveProducts();
      this.filterProducts();
      this.showToast('Producto actualizado exitosamente', 'success');
      
      // Registrar actividad si cambió el stock
      if (oldStock !== parseInt(updatedData.stock)) {
        const difference = parseInt(updatedData.stock) - oldStock;
        const action = difference > 0 ? 'Stock aumentado' : 'Stock reducido';
        this.registerActivity(action, `${this.products[index].name} - ${Math.abs(difference)} unidades`);
      }
    }
  }

  async deleteProduct(product: any) {
    const alert = await this.alertController.create({
      header: 'Eliminar Producto',
      message: `¿Estás seguro de que deseas eliminar "${product.name}"? Esta acción no se puede deshacer.`,
      cssClass: 'glass-alert',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.removeProduct(product.id);
          }
        }
      ]
    });

    await alert.present();
  }

  removeProduct(productId: number) {
    const productToDelete = this.products.find(p => p.id === productId);
    this.products = this.products.filter(p => p.id !== productId);
    this.saveProducts();
    this.filterProducts();
    
    this.showToast('Producto eliminado exitosamente', 'success');
    
    // Registrar actividad
    if (productToDelete) {
      this.registerActivity('Producto eliminado', `${productToDelete.name}`);
    }
  }

  private saveProducts() {
    const userData = this.storageService.getUserData();
    this.storageService.setUserInventory(userData.id, this.products);
  }

  private registerActivity(action: string, details: string) {
    const userData = this.storageService.getUserData();
    const activity = {
      id: Date.now(),
      action: action,
      details: details,
      timestamp: new Date().toISOString(),
      userId: userData.id
    };
    
    this.storageService.addUserActivity(userData.id, activity);
  }

  private async showToast(message: string, color: string = 'primary') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: color,
      position: 'top',
      cssClass: 'glass-toast'
    });
    await toast.present();
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'Disponible': return 'success';
      case 'Bajo Stock': return 'warning';
      case 'Crítico': return 'danger';
      default: return 'medium';
    }
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-CL', { 
      style: 'currency', 
      currency: 'CLP' 
    }).format(amount);
  }

  getLowStockCount(): number {
    return this.filteredProducts.filter(p => p.status === 'Bajo Stock').length;
  }

  goBack() {
    this.router.navigate(['/home']);
  }

  getInventoryValue(): number {
    return this.filteredProducts.reduce((total, p) => total + (p.price * p.stock), 0);
  }
}