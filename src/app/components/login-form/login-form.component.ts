import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
  standalone: false,
})
export class LoginFormComponent implements OnInit {
  loginForm: FormGroup;
  showPassword = false;

  constructor(
    private formBuilder: FormBuilder,
    public router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      remember: [false]
    });
  }

  ngOnInit() {
    // Limpiar el formulario al iniciar el componente
    this.loginForm.reset({ username: '', password: '', remember: false });
    // Verificar si hay credenciales guardadas
    const savedUsername = localStorage.getItem('username');
    const savedPassword = localStorage.getItem('password');
    if (savedUsername && savedPassword) {
      this.loginForm.patchValue({
        username: savedUsername,
        password: savedPassword,
        remember: true
      });
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  loading = false;

  async login() {
    const btn = document.querySelector('.btn-login');
    if (btn) {
      btn.classList.add('animated');
      setTimeout(() => btn.classList.remove('animated'), 500);
    }
    if (this.loginForm.valid) {
      this.loading = true;
      const loading = await this.loadingController.create({
        message: 'Iniciando sesión...',
        spinner: 'crescent',
        duration: 1500,
        cssClass: 'custom-login-loader',
        mode: 'md',
        translucent: true,
        keyboardClose: true
      });
      await loading.present();
      setTimeout(async () => {
        await loading.dismiss();
        this.loading = false;
        this.router.navigate(['/home']);
      }, 1500);
    } else {
      Object.keys(this.loginForm.controls).forEach(key => {
        this.loginForm.get(key)?.markAsTouched();
      });
    }
  }

  testNavigation() {
    this.router.navigate(['/dashboard']);
  }

  goToResetPassword() {
    this.router.navigate(['/reset-password']);
  }

  async onSubmit() {
    if (this.loginForm.valid) {
      const loading = await this.loadingController.create({
        message: 'Iniciando sesión...',
        spinner: 'crescent'
      });
      await loading.present();
      setTimeout(async () => {
        await loading.dismiss();
        const { username, password, remember } = this.loginForm.value;
        if (remember) {
          localStorage.setItem('username', username);
          localStorage.setItem('password', password);
        } else {
          localStorage.removeItem('username');
          localStorage.removeItem('password');
        }
        this.router.navigate(['/dashboard']);
      }, 1500);
    } else {
      Object.keys(this.loginForm.controls).forEach(key => {
        this.loginForm.get(key)?.markAsTouched();
      });
    }
  }

  async onForgotPassword(event: Event) {
    event.preventDefault();
    const alert = await this.alertController.create({
      header: 'Recuperar Contraseña',
      message: 'Por favor, contacta al administrador del sistema para restablecer tu contraseña.',
      buttons: ['OK']
    });
    await alert.present();
  }
}

