import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, Inject, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CredentialResponse } from 'google-one-tap';
import { jwtDecode } from 'jwt-decode';
import { take } from 'rxjs';
import { LoginWithExternal } from 'src/app/models/account/loginWithExternal';
import { User } from 'src/app/models/account/user';
import { UsersService } from 'src/app/services/users.service';
import { SharedService } from 'src/app/shared/shared.service';
import { LanguageService } from 'src/app/services/language.service';
declare const FB: any;

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
    standalone: false
})
export class LoginComponent implements OnInit{
  @ViewChild('googleButton',{static:true})
  googleButton:ElementRef=new ElementRef({});
  loginForm:FormGroup=new FormGroup({});
  submitted:boolean=false;
  errorMessages:string[]=[]
  loading: boolean=false;

  // New UI state properties
  showPassword: boolean = false;
  rememberMe: boolean = false;

  // Device detection
  isTablet: boolean = false;
  isMobile: boolean = false;
  
  // Language properties
  currentLang: string = 'ar';
  isRTL: boolean = true;

  // Return URL for redirect after login
  returnUrl: string = '/dashboard';

  constructor(private usersService:UsersService,
    private router:Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private sharedService:SharedService,
    private translateService: TranslateService,
    private languageService: LanguageService,
    private renderer2:Renderer2,@Inject(DOCUMENT) private _document:Document){
    // Check if user is already logged in
    const token = this.usersService.getJWT();
    if(token){
      this.router.navigateByUrl('/')
    }
  }
  ngOnInit():void{
    this.detectDevice();
    this.initializeForm();
    this.initializeGoogleButton();
    this.initializeLanguage();
    
    // Get returnUrl from query params
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
  }
  ngAfterViewInit(){
    const script1=this.renderer2.createElement('script');
    script1.src='https://accounts.google.com/gsi/client';
    script1.async='true';
    script1.defer='true';
    this.renderer2.appendChild(this._document.body,script1);
    
  }
  
  initializeForm():void{
    this.loginForm=this.formBuilder.group({
      email:new FormControl('',[Validators.required]),
      password:new FormControl('',[Validators.required])
    })
  }
  loginUser(loginData: any) {
    this.usersService.login(loginData).subscribe({
      next: (response: any) => {
        this.loading = false;
        
        // Check if phone verification is required
        if (response?.requiresVerification || response?.error === 'PHONE_NOT_VERIFIED') {
          this.sharedService.showNotification(
            false, 
            'التحقق مطلوب', 
            'يرجى التحقق من رقم هاتفك أولاً'
          );
          // Redirect to OTP verification page
          this.router.navigate(['/verify-otp'], {
            queryParams: {
              phone: response.phoneNumber || '',
              userId: response.userId || '',
              mode: 'login'
            }
          });
          return;
        }
        
        if (response && response.token) {
          // Redirect to returnUrl or dashboard
          this.router.navigateByUrl(this.returnUrl);
          this.sharedService.showNotification(true, 'نجح تسجيل الدخول', 'مرحباً بك في منصتنا!');
        } else {
          this.sharedService.showNotification(false, 'خطأ في تسجيل الدخول', 'لم يتم استلام التوكين من الخادم');
        }
      },
      error: error => {
        this.loading = false;
        this.submitted = true;

        // Handle other errors
        if (error.error?.errors) {
          this.errorMessages = error.error.errors;
        } else if (error.error?.message) {
          this.errorMessages.push(error.error.message);
        } else {
          this.errorMessages.push('بيانات الدخول غير صحيحة');
        }

        this.sharedService.showNotification(false, 'خطأ في تسجيل الدخول', 'يرجى التحقق من بياناتك والمحاولة مرة أخرى');
      }
    });
  }

  onSubmit() {
    this.submitted = true;
    this.errorMessages = [];

    if(this.loginForm.valid){
      this.loading = true;
      this.loginUser(this.loginForm.value);
    } else {
      this.focusFirstInvalidField();
    }
  }

  loginWithFacebook() {
    if (this.loading) return;

    this.loading = true;

    FB.login(async (fbResult: any) => {
      if (fbResult.authResponse) {
        const userId = fbResult.authResponse.userID;
        const accessToken = fbResult.authResponse.accessToken;

        this.usersService.loginWithThirdParty(new LoginWithExternal(accessToken, userId, "facebook")).subscribe({
          next: () => {
            this.loading = false;
            this.router.navigateByUrl(this.returnUrl);
            this.sharedService.showNotification(true, 'نجح تسجيل الدخول', 'مرحباً بك في منصتنا!');
          },
          error: error => {
            this.loading = false;
            this.sharedService.showNotification(false, "فشل تسجيل الدخول", error.error);
          }
        });
      } else {
        this.loading = false;
        this.sharedService.showNotification(false, "فشل", "لم نتمكن من تسجيل الدخول عبر فيسبوك");
      }
    });
  }

  resendEmailConfirmationLink(){
    this.router.navigateByUrl('users/sendEmail/resendemailconfirmationlink');
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
        {size:'medium',shape:'rectangular',text:'signin_with',logo_alignment:'center'}
      )

    }
  }

  private async googleCallBack(response:CredentialResponse){
    const decodeToken:any=jwtDecode(response.credential);
    this.usersService.loginWithThirdParty(new LoginWithExternal(response.credential,decodeToken.sub,"google"))
    .subscribe({
      next:_=>{
        // Redirect to returnUrl or dashboard
        this.router.navigateByUrl(this.returnUrl)
      },
      error:error=>{
        this.sharedService.showNotification(false,"Failed",error.error);
      }

    })
  }

  /**
   * Toggle password visibility
   */
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
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
   * Handle form submission with enhanced validation
   */
  onSubmitEnhanced(): void {
    this.submitted = true;
    this.errorMessages = [];

    if (this.loginForm.valid) {
      this.loading = true;

      // Add remember me logic if needed
      const loginData = {
        ...this.loginForm.value,
        rememberMe: this.rememberMe
      };

      this.loginUser(loginData);
    } else {
      // Focus on first invalid field
      this.focusFirstInvalidField();
    }
  }

  /**
   * Focus on the first invalid form field
   */
  private focusFirstInvalidField(): void {
    const firstInvalidField = document.querySelector('.form-input.ng-invalid') as HTMLElement;
    if (firstInvalidField) {
      firstInvalidField.focus();
    }
  }

  /**
   * Enhanced login method with better error handling
   */
  private loginUserEnhanced(loginData: any): void {
    this.usersService.login(loginData).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigateByUrl(this.returnUrl);
        this.sharedService.showNotification(true, 'نجح تسجيل الدخول', 'مرحباً بك في منصتنا!');
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
        this.sharedService.showNotification(false, 'خطأ في تسجيل الدخول', 'يرجى التحقق من بياناتك والمحاولة مرة أخرى');
      }
    });
  }

  /**
   * Enhanced Facebook login with better error handling
   */
  loginWithFacebookEnhanced(): void {
    if (this.loading) return;

    this.loading = true;

    FB.login(async (fbResult: any) => {
      if (fbResult.authResponse) {
        const userId = fbResult.authResponse.userID;
        const accessToken = fbResult.authResponse.accessToken;

        this.usersService.loginWithThirdParty(new LoginWithExternal(accessToken, userId, "facebook")).subscribe({
          next: () => {
            this.loading = false;
            this.router.navigateByUrl(this.returnUrl);
            this.sharedService.showNotification(true, 'نجح تسجيل الدخول', 'مرحباً بك في منصتنا!');
          },
          error: error => {
            this.loading = false;
            this.sharedService.showNotification(false, "فشل تسجيل الدخول", error.error);
          }
        });
      } else {
        this.loading = false;
        this.sharedService.showNotification(false, "فشل", "لم نتمكن من تسجيل الدخول عبر فيسبوك");
      }
    });
  }

  /**
   * Get optimized input type for device
   */
  getInputType(baseType: string): string {
    if (this.isMobile && baseType === 'email') {
      return 'email'; // This will show email keyboard on mobile
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


}
