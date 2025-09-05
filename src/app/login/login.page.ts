import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage implements OnInit {
  ionViewWillEnter() {
    // Limpiar los campos del formulario al entrar a la página de login
    this.loginForm.reset({ username: '', password: '', remember: false });
    // Opcional: limpiar credenciales guardadas
    // localStorage.removeItem('username');
    // localStorage.removeItem('password');
  }
  loginForm: FormGroup;
  showPassword = false;
  // Método para manejar el submit del formulario y navegar a home
  login() {
    if (this.loginForm.valid) {
      // Aquí puedes agregar lógica de autenticación si lo deseas
      this.router.navigate(['/home']);
    } else {
      Object.keys(this.loginForm.controls).forEach(key => {
        this.loginForm.get(key)?.markAsTouched();
      });
    }
  }

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

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  testNavigation() {
    // Navegación de prueba, puedes cambiar la ruta si lo deseas
    this.router.navigate(['/dashboard']);
  }

  goToResetPassword() {
    this.router.navigate(['/reset-password']);
  }

  ngOnInit() {
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

  async onSubmit() {
    if (this.loginForm.valid) {
      const loading = await this.loadingController.create({
        message: 'Iniciando sesión...',
        spinner: 'crescent'
      });
      
      await loading.present();
      
      // Simular proceso de autenticación
      setTimeout(async () => {
        await loading.dismiss();
        
        const { username, password, remember } = this.loginForm.value;
        
        // Guardar credenciales si el usuario seleccionó "Recordarme"
        if (remember) {
          localStorage.setItem('username', username);
          localStorage.setItem('password', password);
        } else {
          localStorage.removeItem('username');
          localStorage.removeItem('password');
        }
        
        // Navegar al dashboard
        this.router.navigate(['/dashboard']);
      }, 1500);
    } else {
      // Marcar todos los campos como touched para mostrar errores
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