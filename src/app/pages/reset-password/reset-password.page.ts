import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
  standalone: false,
})
export class ResetPasswordPage implements OnInit {
  resetForm: FormGroup;
  showSuccessMessage = false;
  email = '';
  isLoading = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) {
    // Inicializar el formulario
    this.resetForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit() {
  }

  mostrarMensajeExito() {
    this.showSuccessMessage = true;
    setTimeout(() => {
      this.showSuccessMessage = false;
    }, 5000);
  }

  async resetPassword() {
    if (!this.email || !this.isValidEmail(this.email)) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Por favor, ingresa un correo electrónico válido.',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    this.isLoading = true;
    
    // Simulamos el envío de instrucciones con un timeout
    setTimeout(() => {
      this.isLoading = false;
      this.showSuccessMessage = true;
      
      console.log('Instrucciones enviadas a:', this.email);
      
      // Redirigimos al login después de 5 segundos
      setTimeout(() => {
        this.redirectToLogin();
      }, 5000);
    }, 2000);
  }

  // Nueva función específica para manejar la redirección
  redirectToLogin() {
    this.showSuccessMessage = false;
    this.router.navigate(['/login']).then(() => {
      console.log('Redirigido exitosamente al login');
    });
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  async onSubmit() {
    await this.resetPassword();
  }

  goToHome() {
    // Cambiado para redirigir al login en lugar de home
    this.router.navigate(['/login']);
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}