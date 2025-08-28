import { Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { first } from 'rxjs/operators';
import { TblUser } from 'src/app/models/TblUser';
import { SuperEcommere } from 'src/app/models/super-ecommere';
import { CustomValidators } from 'src/app/shared/_helpers/custom-validators';
import { UsersService } from 'src/app/services/users.service';
import { SharedService } from 'src/app/shared/shared.service';
import { LanguageService } from 'src/app/services/language.service';
import { CredentialResponse } from 'google-one-tap';
import { jwtDecode } from 'jwt-decode';
import { DOCUMENT } from '@angular/common';


declare const FB:any;
@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css'],
    standalone: false
})
export class RegisterComponent implements OnInit {
  @ViewChild('googleButton',{static:true})
  googleButton:ElementRef=new ElementRef({});
  title = 'SuperEcommere';
  submitted:boolean=false;
  errorMessages:string[]=[]
  registerForm:FormGroup=new FormGroup({});

  // Enhanced UI state
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  acceptTerms: boolean = false;
  currentStep: number = 1;

  // Password strength
  passwordStrength: any = {
    level: '',
    text: ''
  };

  // Device detection
  isTablet: boolean = false;
  isMobile: boolean = false;

  // Language properties
  currentLang: string = 'ar';
  isRTL: boolean = true;

  form:FormGroup=new FormGroup({
    email:new FormControl('',[Validators.required,Validators.email]),
    //username:new FormControl(null,[Validators.required,Validators.email]),
    password:new FormControl('',[Validators.required]),
    passwordConfirm:new FormControl('',[Validators.required])
  },
  {
    validators:CustomValidators.passwordMatching
  }
  )

  get email():FormControl{
    return this.form.get('email') as FormControl
  }
  get password():FormControl{
    return this.form.get('password') as FormControl
  }
  get passwordConfirm():FormControl{
    return this.form.get('passwordConfirm') as FormControl
  }
  addUserRequest:TblUser={
    id:'',
    lastName:'',
    firstName:'',
    merchant:'',
    email:'',
    phone:'',
    password:'',
    username:''
  }
  heroes:SuperEcommere[]=[]
  ecommToEdit?:SuperEcommere
  @Input() ecomm?:SuperEcommere


  //form!: FormGroup;
    loading = false;



  // @Output() userUpdated= new EventEmitter<TblUser[]>()
  constructor(private usersService:UsersService,
    private router:Router,
    private formBuilder: FormBuilder,
    private sharedService:SharedService,
    private translateService: TranslateService,
    private languageService: LanguageService,
    private renderer2:Renderer2,@Inject(DOCUMENT) private _document:Document){
  }
  ngOnInit():void{
    this.detectDevice();
    this.initializeGoogleButton();
    this.initializeForm();
    this.initializeLanguage();
  }

  /**
   * Initialize language settings
   */
  private initializeLanguage(): void {
    // Subscribe to language changes
    this.languageService.lang$.subscribe(lang => {
      this.currentLang = lang;
      this.isRTL = lang === 'ar' || lang === 'he';
      this.translateService.use(lang);
    });

    // Set initial language
    this.currentLang = this.languageService.currentLang;
    this.isRTL = this.currentLang === 'ar' || this.currentLang === 'he';
    this.translateService.use(this.currentLang);
  }

  ngAfterViewInit(){
    const script1=this.renderer2.createElement('script');
    script1.src='https://accounts.google.com/gsi/client';
    script1.async='true';
    script1.defer='true';
    this.renderer2.appendChild(this._document.body,script1);

  }
  
  get f() { return this.form.controls; }

  initializeForm():void{
    this.registerForm=this.formBuilder.group({
      email:new FormControl('',[Validators.required,Validators.pattern('^([0-9a-zA-Z]+[-._+&amp;])*[0-9a-zA-Z]+@([-0-9a-zA-Z]+[.])+[a-zA-Z]{2,6}$')]),
      fullName:new FormControl('',[Validators.required,Validators.pattern(/^[\p{L} ]+$/u),Validators.minLength(3)]),
      // lastname:new FormControl('',[Validators.required,Validators.minLength(3),Validators.maxLength(15)]),
      // merchant:new FormControl('',[Validators.required,Validators.minLength(3),Validators.maxLength(60)]),
      phone:new FormControl('',[Validators.required,Validators.pattern(/^\+?\d{10,15}$/)]),
      password:new FormControl('',[Validators.required,Validators.minLength(8)]),
      passwordConfirm:new FormControl('',[Validators.required,Validators.minLength(8)])
    })
  }

  createUser(registerData: any) {
    this.usersService.register(registerData).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.sharedService.showNotification(true, res.title, res.message);
        this.router.navigateByUrl('/login');
      },
      error: error => {
        this.loading = false;
        this.submitted = true;

        if (error.error.errors) {
          this.errorMessages = error.error.errors;
        } else {
          this.errorMessages.push(error.error);
        }

        this.sharedService.showNotification(false, 'خطأ في التسجيل', 'يرجى التحقق من بياناتك والمحاولة مرة أخرى');
      }
    });
  }

  onSubmit() {
    this.submitted = true;
    this.errorMessages = [];

    if (this.registerForm.valid && this.acceptTerms && this.passwordsMatch) {
      this.loading = true;
      const { passwordConfirm, ...cleanData } = this.registerForm.value;
      this.createUser(cleanData);
    } else {
      this.focusFirstInvalidField();

      if (!this.acceptTerms) {
        this.errorMessages.push('يرجى الموافقة على الشروط والأحكام');
      }

      if (!this.passwordsMatch) {
        this.errorMessages.push('كلمات المرور غير متطابقة');
      }
    }
  }

  registerWithFacebook() {
    if (this.loading) return;

    this.loading = true;

    FB.login(async (fbResult: any) => {
      if (fbResult.authResponse) {
        const userId = fbResult.authResponse.userID;
        const accessToken = fbResult.authResponse.accessToken;

        this.router.navigateByUrl(`/register/thirdParty/facebook?access_token=${accessToken}&userId=${userId}`);
      } else {
        this.loading = false;
        this.sharedService.showNotification(false, "فشل", "لم نتمكن من التسجيل عبر فيسبوك");
      }
    });
  }

  initializeGoogleButton() {
    
    (window as any).onGoogleLibraryLoad =(x:any)=>{ 
      // @ts-ignore
      google.accounts.id.initialize({
        client_id:'903332559756-m2g1umap0snv9d9e6lbfmpaa518ro4bi.apps.googleusercontent.com',
        callback:this.googleCallBack.bind(this),
        auto_select:false,
        cancel_on_tap_outside:true
      });
      // @ts-ignore
      google.accounts.id.renderButton(
        this.googleButton.nativeElement,
        {size:'medium',shape:'rectangular',text:'signup_with',logo_alignment:'center'}
      )

    }
  }

  private async googleCallBack(response:CredentialResponse){
    const decodeToken:any=jwtDecode(response.credential);
    this.router.navigateByUrl(`/register/thirdParty/google?access_token=${response.credential}&userId=${decodeToken.sub}`)


    
  }

  ngOnDestroy():void{
    //cleanup if needed
  }

  /**
   * Toggle password visibility
   */
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  /**
   * Toggle confirm password visibility
   */
  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  /**
   * Check if passwords match
   */
  get passwordsMatch(): boolean {
    const password = this.registerForm.get('password')?.value;
    const passwordConfirm = this.registerForm.get('passwordConfirm')?.value;
    return password === passwordConfirm;
  }

  /**
   * Handle password change and update strength indicator
   */
  onPasswordChange(): void {
    const password = this.registerForm.get('password')?.value || '';
    this.passwordStrength = this.calculatePasswordStrength(password);

    // Update current step based on form completion
    this.updateCurrentStep();
  }

  /**
   * Calculate password strength
   */
  private calculatePasswordStrength(password: string): any {
    if (!password) {
      return { level: '', text: '' };
    }

    let score = 0;
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      numbers: /\d/.test(password),
      symbols: /[^A-Za-z0-9]/.test(password)
    };

    // Calculate score
    Object.values(checks).forEach(check => {
      if (check) score++;
    });

    // Determine strength level
    if (score < 2) {
      return { level: 'weak', text: 'ضعيفة' };
    } else if (score < 3) {
      return { level: 'fair', text: 'متوسطة' };
    } else if (score < 4) {
      return { level: 'good', text: 'جيدة' };
    } else {
      return { level: 'strong', text: 'قوية جداً' };
    }
  }

  /**
   * Update current step based on form completion
   */
  private updateCurrentStep(): void {
    const fullName = this.registerForm.get('fullName')?.value;
    const email = this.registerForm.get('email')?.value;
    const phone = this.registerForm.get('phone')?.value;
    const password = this.registerForm.get('password')?.value;
    const passwordConfirm = this.registerForm.get('passwordConfirm')?.value;

    if (!fullName || !email || !phone) {
      this.currentStep = 1;
    } else if (!password || !passwordConfirm || !this.passwordsMatch) {
      this.currentStep = 2;
    } else {
      this.currentStep = 3;
    }
  }

  /**
   * Detect device type for optimal experience
   */
  private detectDevice(): void {
    const userAgent = navigator.userAgent.toLowerCase();
    const screenWidth = window.innerWidth;

    // Detect tablets
    this.isTablet = (
      /ipad/.test(userAgent) ||
      (/android/.test(userAgent) && !/mobile/.test(userAgent)) ||
      (screenWidth >= 768 && screenWidth <= 1024)
    );

    // Detect mobile phones
    this.isMobile = (
      screenWidth < 768 ||
      /iphone|ipod|android.*mobile|blackberry|iemobile/.test(userAgent)
    );
  }

  /**
   * Enhanced form submission with better validation
   */
  onSubmitEnhanced(): void {
    this.submitted = true;
    this.errorMessages = [];

    if (this.registerForm.valid && this.acceptTerms && this.passwordsMatch) {
      this.loading = true;

      const { passwordConfirm, ...cleanData } = this.registerForm.value;
      this.createUser(cleanData);
    } else {
      // Focus on first invalid field
      this.focusFirstInvalidField();

      // Show validation messages
      if (!this.acceptTerms) {
        this.errorMessages.push('يرجى الموافقة على الشروط والأحكام');
      }

      if (!this.passwordsMatch) {
        this.errorMessages.push('كلمات المرور غير متطابقة');
      }
    }
  }

  /**
   * Focus on the first invalid form field
   */
 

  /**
   * Enhanced user creation with better error handling
   */
  private createUserEnhanced(registerData: any): void {
    this.usersService.register(registerData).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.sharedService.showNotification(true, res.title, res.message);
        this.router.navigateByUrl('/login');
      },
      error: error => {
        this.loading = false;
        this.submitted = true;

        if (error.error.errors) {
          this.errorMessages = error.error.errors;
        } else {
          this.errorMessages.push(error.error);
        }

        // Show user-friendly error notification
        this.sharedService.showNotification(false, 'خطأ في التسجيل', 'يرجى التحقق من بياناتك والمحاولة مرة أخرى');
      }
    });
  }

  /**
   * Enhanced Facebook registration
   */
  registerWithFacebookEnhanced(): void {
    if (this.loading) return;

    this.loading = true;

    FB.login(async (fbResult: any) => {
      if (fbResult.authResponse) {
        const userId = fbResult.authResponse.userID;
        const accessToken = fbResult.authResponse.accessToken;

        this.router.navigateByUrl(`/register/thirdParty/facebook?access_token=${accessToken}&userId=${userId}`);
      } else {
        this.loading = false;
        this.sharedService.showNotification(false, "فشل", "لم نتمكن من التسجيل عبر فيسبوك");
      }
    });
  }

  /**
   * Handle real-time form validation
   */
  onFieldChange(fieldName: string): void {
    const field = this.registerForm.get(fieldName);
    if (field && field.value) {
      // Update step progress
      this.updateCurrentStep();

      // Real-time validation feedback
      if (fieldName === 'password') {
        this.onPasswordChange();
      }
    }
  }

  /**
   * Get optimized input type for device
   */
  getInputType(baseType: string): string {
    if (this.isMobile) {
      if (baseType === 'email') return 'email';
      if (baseType === 'tel') return 'tel';
    }
    return baseType;
  }

  /**
   * Check if current device supports touch
   */
  get isTouch(): boolean {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }

  /**
   * Focus on the first invalid form field
   */
  private focusFirstInvalidField(): void {
    const firstInvalidField = document.querySelector('.form-input.ng-invalid') as HTMLElement;
    if (firstInvalidField) {
      firstInvalidField.focus();
      firstInvalidField.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }
}
