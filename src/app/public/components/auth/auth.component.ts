import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LanguageService } from 'src/app/services/language.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {
  activeTab = 'login';

  loginForm: FormGroup;
  registerForm: FormGroup;

  constructor(private fb: FormBuilder,private languageService: LanguageService) {
    if(window.location.pathname.includes("register")){
      this.activeTab='register'
    }
    
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
      console.log(this.loginForm.value);
      // Call login API
    }
  }

  switchLang(lang: string) {
    this.languageService.setLanguage(lang);
  }

  onRegister() {
    if (this.registerForm.valid) {
      console.log(this.registerForm.value);
      // Call register API
    }
  }
}
