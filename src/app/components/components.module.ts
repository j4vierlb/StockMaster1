import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { LoginLogoComponent } from './login-logo/login-logo.component';
import { LoginHeaderComponent } from './login-header/login-header.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { LoginFooterComponent } from './login-footer/login-footer.component';

@NgModule({
  declarations: [
    LoginLogoComponent,
    LoginHeaderComponent,
    LoginFormComponent,
    LoginFooterComponent
  ],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule],
  exports: [
    LoginLogoComponent,
    LoginHeaderComponent,
    LoginFormComponent,
    LoginFooterComponent
  ]
})
export class ComponentsModule {}
