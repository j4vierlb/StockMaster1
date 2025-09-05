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

  async onSubmit() {
    if (this.resetForm.valid) {
      const loading = await this.loadingController.create({
        message: 'Enviando instrucciones...',
        spinner: 'crescent'
      });
      await loading.present();

      const email = this.resetForm.get('email')?.value;
      
      // Simulamos el envío de instrucciones con un timeout
      setTimeout(async () => {
        await loading.dismiss();
        this.showSuccessMessage = true;
        
        console.log('Instrucciones enviadas a:', email);
        
        // Ocultamos el mensaje después de 5 segundos
        setTimeout(() => {
          this.showSuccessMessage = false;
        }, 5000);
      }, 2000);
    } else {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Por favor, ingresa un correo electrónico válido.',
        buttons: ['OK']
      });
      await alert.present();
    }
  }

  goToHome() {
    // Cambiado para redirigir al login en lugar de home
    this.router.navigate(['/login']);
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}