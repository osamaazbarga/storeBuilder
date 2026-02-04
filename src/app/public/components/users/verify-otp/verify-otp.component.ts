import { Component, OnInit, OnDestroy, ViewChildren, QueryList, ElementRef, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subject, interval, takeUntil } from 'rxjs';
import { UsersService } from 'src/app/services/users.service';
import { SharedService } from 'src/app/shared/shared.service';
import { LanguageService } from 'src/app/services/language.service';
import { FirebasePhoneAuthService } from 'src/app/services/firebase-phone-auth.service';

@Component({
  selector: 'app-verify-otp',
  templateUrl: './verify-otp.component.html',
  styleUrls: ['./verify-otp.component.scss'],
  standalone: false
})
export class VerifyOtpComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef>;

  // OTP digits
  otpDigits: string[] = ['', '', '', '', '', ''];
  
  // User data from registration
  phoneNumber: string = '';
  userId: string = '';
  mode: 'register' | 'login' = 'register';
  
  // UI State
  loading: boolean = false;
  sendingOtp: boolean = false;
  resending: boolean = false;
  submitted: boolean = false;
  errorMessage: string = '';
  otpSent: boolean = false;
  
  // Timer for resend
  canResend: boolean = false;
  resendTimer: number = 60;
  private timerSubscription: any;
  
  // Language
  currentLang: string = 'ar';
  isRTL: boolean = true;

  private destroy$ = new Subject<void>();

  constructor(
    private usersService: UsersService,
    private router: Router,
    private route: ActivatedRoute,
    private sharedService: SharedService,
    private translateService: TranslateService,
    private languageService: LanguageService,
    private firebasePhoneAuth: FirebasePhoneAuthService
  ) {}

  ngOnInit(): void {
    this.initializeLanguage();
    this.getDataFromRoute();
  }

  ngAfterViewInit(): void {
    // Initialize reCAPTCHA after view is ready
    setTimeout(() => {
      this.initializeRecaptcha();
    }, 500);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.firebasePhoneAuth.destroy();
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  /**
   * Initialize language settings
   */
  private initializeLanguage(): void {
    this.languageService.lang$.pipe(takeUntil(this.destroy$)).subscribe(lang => {
      this.currentLang = lang;
      this.isRTL = lang === 'ar' || lang === 'he';
      this.translateService.use(lang);
    });

    this.currentLang = this.languageService.currentLang;
    this.isRTL = this.currentLang === 'ar' || this.currentLang === 'he';
  }

  /**
   * Get data from route parameters
   */
  private getDataFromRoute(): void {
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
      if (params['phone']) {
        this.phoneNumber = params['phone'];
        this.userId = params['userId'] || '';
        this.mode = params['mode'] === 'login' ? 'login' : 'register';
      } else {
        // If no phone, redirect back to register
        this.router.navigateByUrl('/register');
      }
    });
  }

  /**
   * Initialize reCAPTCHA
   */
  private initializeRecaptcha(): void {
    this.firebasePhoneAuth.initRecaptcha('recaptcha-container', 'invisible');
  }

  /**
   * Send OTP to phone number
   */
  async sendOtp(): Promise<void> {
    if (this.sendingOtp || !this.phoneNumber) return;

    this.sendingOtp = true;
    this.errorMessage = '';

    const result = await this.firebasePhoneAuth.sendOtp(this.phoneNumber);

    this.sendingOtp = false;

    if (result.success) {
      this.otpSent = true;
      this.startResendTimer();
      this.sharedService.showNotification(
        true,
        this.currentLang === 'ar' ? 'تم الإرسال' : 'Sent',
        this.currentLang === 'ar' ? 'تم إرسال رمز التحقق إلى هاتفك' : 'Verification code sent to your phone'
      );
      // Focus first input
      setTimeout(() => {
        const inputs = this.otpInputs?.toArray();
        if (inputs && inputs.length > 0) {
          inputs[0].nativeElement.focus();
        }
      }, 100);
    } else {
      this.errorMessage = result.error || (this.currentLang === 'ar' ? 'فشل في إرسال الرمز' : 'Failed to send code');
    }
  }

  /**
   * Start resend timer countdown
   */
  private startResendTimer(): void {
    this.canResend = false;
    this.resendTimer = 60;

    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }

    this.timerSubscription = interval(1000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        if (this.resendTimer > 0) {
          this.resendTimer--;
        } else {
          this.canResend = true;
          if (this.timerSubscription) {
            this.timerSubscription.unsubscribe();
          }
        }
      });
  }

  /**
   * Handle OTP input change
   */
  onOtpInput(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    let value = input.value;

    // Only allow numbers - take only the last digit if multiple
    value = value.replace(/\D/g, '');
    
    // If multiple digits entered (can happen on some mobile keyboards), take only the last one
    if (value.length > 1) {
      value = value.slice(-1);
    }

    // Update input value to single digit
    input.value = value;

    // Skip if value is same as current (prevents double entry)
    if (this.otpDigits[index] === value) {
      return;
    }

    // Store the digit
    this.otpDigits[index] = value;

    // Clear error when typing
    this.errorMessage = '';

    // Auto-focus next input only if we have a value
    if (value && index < 5) {
      setTimeout(() => {
        const inputs = this.otpInputs.toArray();
        inputs[index + 1]?.nativeElement.focus();
      }, 10);
    }

    // Auto-submit when all digits are filled
    if (this.isOtpComplete) {
      setTimeout(() => this.verifyOtp(), 100);
    }
  }

  /**
   * Handle backspace key
   */
  onKeyDown(event: KeyboardEvent, index: number): void {
    if (event.key === 'Backspace' && !this.otpDigits[index] && index > 0) {
      const inputs = this.otpInputs.toArray();
      inputs[index - 1]?.nativeElement.focus();
    }
  }

  /**
   * Handle paste event
   */
  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const pastedData = event.clipboardData?.getData('text') || '';
    const digits = pastedData.replace(/\D/g, '').slice(0, 6).split('');

    digits.forEach((digit, index) => {
      if (index < 6) {
        this.otpDigits[index] = digit;
        const inputs = this.otpInputs.toArray();
        if (inputs[index]) {
          inputs[index].nativeElement.value = digit;
        }
      }
    });

    // Focus last filled input or next empty one
    const lastFilledIndex = Math.min(digits.length - 1, 5);
    const inputs = this.otpInputs.toArray();
    inputs[lastFilledIndex]?.nativeElement.focus();

    // Auto-submit if complete
    if (this.isOtpComplete) {
      this.verifyOtp();
    }
  }

  /**
   * Track by index for ngFor to prevent re-rendering
   */
  trackByIndex(index: number): number {
    return index;
  }

  /**
   * Check if OTP is complete
   */
  get isOtpComplete(): boolean {
    return this.otpDigits.every(digit => digit !== '');
  }

  /**
   * Get full OTP code
   */
  get otpCode(): string {
    return this.otpDigits.join('');
  }

  /**
   * Verify OTP code
   */
  async verifyOtp(): Promise<void> {
    if (!this.isOtpComplete) {
      this.errorMessage = this.currentLang === 'ar' 
        ? 'يرجى إدخال رمز التحقق كاملاً' 
        : 'Please enter the complete verification code';
      return;
    }

    this.loading = true;
    this.submitted = true;
    this.errorMessage = '';

    try {
      // Step 1: Verify OTP with Firebase and get token
      const firebaseResult = await this.firebasePhoneAuth.verifyOtp(this.otpCode);

      if (!firebaseResult.success || !firebaseResult.token) {
        this.loading = false;
        this.errorMessage = firebaseResult.error || 
          (this.currentLang === 'ar' ? 'رمز التحقق غير صحيح' : 'Invalid verification code');
        this.clearOtp();
        return;
      }

      // Step 2: Send Firebase token to backend
      if (this.mode === 'register') {
        // Verify phone registration
        this.usersService.verifyPhoneRegistration(firebaseResult.token, this.userId).subscribe({
          next: (response) => {
            this.loading = false;
            this.sharedService.showNotification(
              true,
              this.currentLang === 'ar' ? 'نجاح' : 'Success',
              this.currentLang === 'ar' ? 'تم تفعيل حسابك بنجاح!' : 'Your account has been activated successfully!'
            );
            // Navigate to dashboard
            this.router.navigateByUrl('/dashboard');
          },
          error: (error) => {
            this.loading = false;
            this.errorMessage = error.error?.message || 
              (this.currentLang === 'ar' ? 'فشل في تفعيل الحساب' : 'Failed to activate account');
            this.clearOtp();
          }
        });
      } else {
        // Login with phone
        this.usersService.loginWithPhone(firebaseResult.token).subscribe({
          next: (response) => {
            this.loading = false;
            this.sharedService.showNotification(
              true,
              this.currentLang === 'ar' ? 'مرحباً' : 'Welcome',
              this.currentLang === 'ar' ? 'تم تسجيل الدخول بنجاح!' : 'Logged in successfully!'
            );
            // Navigate to dashboard
            this.router.navigateByUrl('/dashboard');
          },
          error: (error) => {
            this.loading = false;
            this.errorMessage = error.error?.message || 
              (this.currentLang === 'ar' ? 'فشل في تسجيل الدخول' : 'Login failed');
            this.clearOtp();
          }
        });
      }
    } catch (error: any) {
      this.loading = false;
      this.errorMessage = this.currentLang === 'ar' ? 'حدث خطأ غير متوقع' : 'Unexpected error occurred';
      this.clearOtp();
    }
  }

  /**
   * Resend OTP code
   */
  async resendOtp(): Promise<void> {
    if (!this.canResend || this.resending) return;

    this.resending = true;
    this.errorMessage = '';

    const result = await this.firebasePhoneAuth.resendOtp(this.phoneNumber);

    this.resending = false;

    if (result.success) {
      this.sharedService.showNotification(
        true,
        this.currentLang === 'ar' ? 'تم الإرسال' : 'Sent',
        this.currentLang === 'ar' ? 'تم إرسال رمز تحقق جديد' : 'A new verification code has been sent'
      );
      // Reset timer
      this.startResendTimer();
      // Clear existing input
      this.clearOtp();
    } else {
      this.errorMessage = result.error || 
        (this.currentLang === 'ar' ? 'فشل في إرسال الرمز' : 'Failed to send code');
    }
  }

  /**
   * Clear OTP inputs
   */
  clearOtp(): void {
    // Reset array values
    for (let i = 0; i < 6; i++) {
      this.otpDigits[i] = '';
    }
    
    // Clear input elements
    const inputs = this.otpInputs?.toArray();
    if (inputs) {
      inputs.forEach(input => {
        input.nativeElement.value = '';
      });
      // Focus first input after a small delay
      setTimeout(() => {
        inputs[0]?.nativeElement.focus();
      }, 50);
    }
  }

  /**
   * Format timer display
   */
  get formattedTimer(): string {
    const minutes = Math.floor(this.resendTimer / 60);
    const seconds = this.resendTimer % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  /**
   * Format phone number for display
   */
  get maskedPhone(): string {
    if (!this.phoneNumber) return '';
    // Show only last 4 digits
    const lastFour = this.phoneNumber.slice(-4);
    return `****${lastFour}`;
  }

  /**
   * Go back to register
   */
  goBack(): void {
    this.router.navigateByUrl('/register');
  }

  /**
   * Go to login
   */
  goToLogin(): void {
    this.router.navigateByUrl('/login');
  }
}
