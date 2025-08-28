import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
  standalone: false
})
export class FooterComponent implements OnInit {
  currentYear = new Date().getFullYear();
  
  // Newsletter form properties
  newsletterEmail: string = '';
  isSubmitting: boolean = false;
  newsletterMessage: string = '';
  newsletterSuccess: boolean = false;

  constructor(
    private translate: TranslateService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadTranslations();
  }

  loadTranslations(): void {
    const lang = this.translate.currentLang || this.translate.getDefaultLang();
    this.http.get(`assets/i18n/${lang}/footer.json`).subscribe((res: any) => {
      this.translate.setTranslation(lang, res, true);
    });
  }

  onNewsletterSubmit(): void {
    if (this.isSubmitting || !this.newsletterEmail) {
      return;
    }

    this.isSubmitting = true;
    this.newsletterMessage = '';

    // Simulate newsletter subscription API call
    // In a real application, you would call your backend API here
    setTimeout(() => {
      try {
        // Simulate successful subscription
        this.newsletterSuccess = true;
        this.translate.get('NEWSLETTER.SUCCESS_MESSAGE').subscribe((message: string) => {
          this.newsletterMessage = message;
        });
        this.newsletterEmail = ''; // Clear the input
        
        // Clear the success message after 5 seconds
        setTimeout(() => {
          this.newsletterMessage = '';
        }, 5000);
        
      } catch (error) {
        // Handle error case
        this.newsletterSuccess = false;
        this.newsletterMessage = 'An error occurred. Please try again.';
      } finally {
        this.isSubmitting = false;
      }
    }, 1500); // Simulate network delay
  }

  // Utility method to handle social media link clicks
  onSocialClick(platform: string): void {
    // In a real application, you would open the actual social media links
    console.log(`Opening ${platform} social media page`);
    
    // Example URLs - replace with actual social media URLs
    const socialUrls: { [key: string]: string } = {
      facebook: 'https://facebook.com/superecommerce',
      twitter: 'https://twitter.com/superecommerce',
      linkedin: 'https://linkedin.com/company/superecommerce',
      instagram: 'https://instagram.com/superecommerce',
      youtube: 'https://youtube.com/c/superecommerce'
    };

    if (socialUrls[platform]) {
      window.open(socialUrls[platform], '_blank', 'noopener,noreferrer');
    }
  }

  // Utility method to handle navigation clicks
  onNavigationClick(section: string): void {
    // Smooth scroll to section or navigate to page
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  }

  // Handle legal link clicks
  onLegalClick(page: string): void {
    // In a real application, you would navigate to actual legal pages
    console.log(`Navigating to ${page} page`);
    // Example: this.router.navigate(['/legal', page]);
  }
}
