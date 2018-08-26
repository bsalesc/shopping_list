import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { FormModule } from '../form/form.module';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, FormModule],
  declarations: [LoginComponent],
  providers: [UserService],
  exports: [LoginComponent],
})
export class LoginModule {}
