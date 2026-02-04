import { Injectable, NgZone } from '@angular/core';
import { Auth, RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult, User } from '@angular/fire/auth';
import { BehaviorSubject, Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebasePhoneAuthService {
  private confirmationResult: ConfirmationResult | null = null;
  private recaptchaVerifier: RecaptchaVerifier | null = null;
  
  // State management
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();
  
  private errorSubject = new BehaviorSubject<string | null>(null);
  public error$ = this.errorSubject.asObservable();

  constructor(
    private auth: Auth,
    private ngZone: NgZone
  ) {}

  /**
   * Initialize reCAPTCHA verifier
   * @param containerId - The ID of the HTML element for reCAPTCHA
   * @param size - 'invisible' or 'normal'
   */
  initRecaptcha(containerId: string, size: 'invisible' | 'normal' = 'invisible'): void {
    try {
      // Clear existing verifier
      if (this.recaptchaVerifier) {
        this.recaptchaVerifier.clear();
        this.recaptchaVerifier = null;
      }

      this.recaptchaVerifier = new RecaptchaVerifier(this.auth, containerId, {
        size: size,
        callback: () => {
          // reCAPTCHA solved - will proceed with OTP
          console.log('reCAPTCHA verified');
        },
        'expired-callback': () => {
          // Reset reCAPTCHA
          this.errorSubject.next('انتهت صلاحية reCAPTCHA. يرجى المحاولة مرة أخرى');
          this.resetRecaptcha();
        }
      });

      // Render if normal size
      if (size === 'normal') {
        this.recaptchaVerifier.render();
      }
    } catch (error: any) {
      console.error('Error initializing reCAPTCHA:', error);
      this.errorSubject.next('خطأ في تهيئة التحقق');
    }
  }

  /**
   * Send OTP to phone number
   * @param phoneNumber - Phone number with country code (e.g., +966500000000)
   * @returns Promise with success status
   */
  async sendOtp(phoneNumber: string): Promise<{ success: boolean; error?: string }> {
    if (!this.recaptchaVerifier) {
      return { success: false, error: 'reCAPTCHA غير مُهيأ' };
    }

    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    try {
      // Format phone number if needed
      const formattedPhone = this.formatPhoneNumber(phoneNumber);
      
      this.confirmationResult = await signInWithPhoneNumber(
        this.auth,
        formattedPhone,
        this.recaptchaVerifier
      );

      this.loadingSubject.next(false);
      return { success: true };

    } catch (error: any) {
      this.loadingSubject.next(false);
      const errorMessage = this.getErrorMessage(error.code);
      this.errorSubject.next(errorMessage);
      
      // Reset reCAPTCHA on error
      this.resetRecaptcha();
      
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Verify OTP code
   * @param otpCode - 6-digit OTP code
   * @returns Promise with Firebase ID token
   */
  async verifyOtp(otpCode: string): Promise<{ success: boolean; token?: string; user?: User; error?: string }> {
    if (!this.confirmationResult) {
      return { success: false, error: 'لم يتم إرسال رمز التحقق. يرجى طلب رمز جديد' };
    }

    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    try {
      const result = await this.confirmationResult.confirm(otpCode);
      const idToken = await result.user.getIdToken();

      this.loadingSubject.next(false);
      
      return {
        success: true,
        token: idToken,
        user: result.user
      };

    } catch (error: any) {
      this.loadingSubject.next(false);
      const errorMessage = this.getErrorMessage(error.code);
      this.errorSubject.next(errorMessage);
      
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Resend OTP (request new code)
   * @param phoneNumber - Phone number with country code
   */
  async resendOtp(phoneNumber: string): Promise<{ success: boolean; error?: string }> {
    // Reset and reinitialize
    this.resetRecaptcha();
    
    // Wait a moment for cleanup
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Re-initialize with the same container
    this.initRecaptcha('recaptcha-container', 'invisible');
    
    // Wait for initialization
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return this.sendOtp(phoneNumber);
  }

  /**
   * Get Firebase ID token for current user
   */
  async getIdToken(): Promise<string | null> {
    const user = this.auth.currentUser;
    if (user) {
      return user.getIdToken();
    }
    return null;
  }

  /**
   * Sign out from Firebase
   */
  async signOut(): Promise<void> {
    try {
      await this.auth.signOut();
      this.confirmationResult = null;
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }

  /**
   * Reset reCAPTCHA verifier
   */
  resetRecaptcha(): void {
    if (this.recaptchaVerifier) {
      try {
        this.recaptchaVerifier.clear();
      } catch (e) {
        // Ignore errors during cleanup
      }
      this.recaptchaVerifier = null;
    }
    this.confirmationResult = null;
  }

  /**
   * Format phone number to E.164 format
   */
  private formatPhoneNumber(phone: string): string {
    // Remove spaces and dashes
    let cleaned = phone.replace(/[\s\-\(\)]/g, '');
    
    // If starts with 0, assume Saudi Arabia
    if (cleaned.startsWith('0')) {
      cleaned = '+972' + cleaned.substring(1);
    }
    
    // If doesn't start with +, add it
    if (!cleaned.startsWith('+')) {
      cleaned = '+' + cleaned;
    }
    
    return cleaned;
  }

  /**
   * Get user-friendly error message
   */
  private getErrorMessage(errorCode: string): string {
    const errorMessages: { [key: string]: string } = {
      'auth/invalid-phone-number': 'رقم الهاتف غير صالح',
      'auth/missing-phone-number': 'يرجى إدخال رقم الهاتف',
      'auth/quota-exceeded': 'تم تجاوز الحد المسموح. يرجى المحاولة لاحقاً',
      'auth/user-disabled': 'الحساب معطل',
      'auth/operation-not-allowed': 'تسجيل الدخول بالهاتف غير مفعل',
      'auth/invalid-verification-code': 'رمز التحقق غير صحيح',
      'auth/invalid-verification-id': 'انتهت صلاحية الجلسة. يرجى طلب رمز جديد',
      'auth/code-expired': 'انتهت صلاحية رمز التحقق',
      'auth/too-many-requests': 'محاولات كثيرة. يرجى الانتظار قبل المحاولة مرة أخرى',
      'auth/captcha-check-failed': 'فشل التحقق من reCAPTCHA',
      'auth/network-request-failed': 'خطأ في الاتصال. تحقق من اتصالك بالإنترنت',
    };

    return errorMessages[errorCode] || 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى';
  }

  /**
   * Clean up on destroy
   */
  destroy(): void {
    this.resetRecaptcha();
    this.loadingSubject.complete();
    this.errorSubject.complete();
  }
}
