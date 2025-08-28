import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { UsersService } from 'src/app/services/users.service';
import { LanguageService } from 'src/app/services/language.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  standalone: false
})
export class NavbarComponent implements OnInit, OnDestroy {

  // Scroll and hover states
  isScrolled = false;
  isHovered = false;

  // Mobile menu state
  isMobileMenuOpen = false;

  // Dropdown states
  activeDropdown: string | null = null;
  mobileActiveDropdown: string | null = null;

  // Active section tracking
  activeSection: string = 'home';

  // Device detection
  isTablet = false;
  isMobile = false;
  isTouch = false;

  // Subscriptions
  private routerSubscription?: Subscription;
  private dropdownTimeout?: any;

  constructor(
    public userService: UsersService,
    public languageService: LanguageService,
    private translate: TranslateService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.detectDevice();
    this.trackActiveSection();
    this.preloadImages();
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
    if (this.dropdownTimeout) {
      clearTimeout(this.dropdownTimeout);
    }
  }

  // Window scroll listener
  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.isScrolled = window.scrollY > 50;
  }

  // Escape key listener for mobile menu
  @HostListener('document:keydown.escape', [])
  onEscapeKey(): void {
    if (this.isMobileMenuOpen) {
      this.closeMobileMenu();
    }
    this.hideDropdown();
  }

  // Click outside listener
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.dropdown') && !target.closest('.mobile-menu')) {
      this.hideDropdown();
    }
  }

  // Resize listener for responsive behavior
  @HostListener('window:resize', [])
  onWindowResize(): void {
    if (window.innerWidth > 768 && this.isMobileMenuOpen) {
      this.closeMobileMenu();
    }
  }

  /**
   * Navigation hover handler
   */
  onNavHover(isHovering: boolean): void {
    this.isHovered = isHovering;
  }

  /**
   * Get appropriate brand logo based on scroll state
   */
  getBrandLogo(): string {
    if (this.isScrolled || this.isHovered) {
      return './assets/images/whiteLogo.png';
    }
    return './assets/images/redLogoHovered.png';
  }

  /**
   * Desktop dropdown handlers
   */
  showDropdown(dropdown: string): void {
    if (this.dropdownTimeout) {
      clearTimeout(this.dropdownTimeout);
    }
    this.activeDropdown = dropdown;
  }

  hideDropdown(): void {
    this.dropdownTimeout = setTimeout(() => {
      this.activeDropdown = null;
    }, 150);
  }

  /**
   * Mobile menu handlers
   */
  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    this.toggleBodyScroll();
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
    this.mobileActiveDropdown = null;
    this.toggleBodyScroll();
  }

  /**
   * Mobile dropdown handlers
   */
  toggleMobileDropdown(dropdown: string): void {
    if (this.mobileActiveDropdown === dropdown) {
      this.mobileActiveDropdown = null;
    } else {
      this.mobileActiveDropdown = dropdown;
    }
  }

  /**
   * Body scroll management for mobile menu
   */
  private toggleBodyScroll(): void {
    if (this.isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = this.getScrollbarWidth() + 'px';
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }
  }

  /**
   * Get scrollbar width to prevent layout shift
   */
  private getScrollbarWidth(): number {
    const outer = document.createElement('div');
    outer.style.visibility = 'hidden';
    outer.style.overflow = 'scroll';
    document.body.appendChild(outer);

    const inner = document.createElement('div');
    outer.appendChild(inner);

    const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;
    outer.parentNode?.removeChild(outer);

    return scrollbarWidth;
  }

  /**
   * Track active section based on route
   */
  private trackActiveSection(): void {
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const url = event.url;
        if (url === '/' || url === '/home') {
          this.activeSection = 'home';
        } else if (url.includes('/solutions')) {
          this.activeSection = 'solutions';
        } else if (url.includes('/resources')) {
          this.activeSection = 'resources';
        } else if (url.includes('/pricing')) {
          this.activeSection = 'pricing';
        }
      });
  }

  /**
   * Preload logo images for smooth transitions
   */
  private preloadImages(): void {
    const images = [
      './assets/images/whiteLogo.png',
      './assets/images/redLogoHovered.png'
    ];

    images.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }

  /**
   * Smooth scroll to section
   */
  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

      this.closeMobileMenu();
    }
  }

  /**
   * Handle navigation click
   */
  onNavClick(section: string, event?: Event): void {
    if (event) {
      event.preventDefault();
    }

    this.activeSection = section;
    
    // Handle different navigation types
    switch (section) {
      case 'home':
        this.router.navigate(['/']);
        break;
      case 'pricing':
        this.scrollToSection('pricing');
        break;
      default:
        // Handle other sections or external links
        break;
    }

    this.closeMobileMenu();
  }

  /**
   * User authentication methods
   */
  logout(): void {
    this.userService.logout();
    this.closeMobileMenu();
  }

//   isLoggedIn(): boolean {
//     return this.userService.isLoggedIn();
//   }

//   getCurrentUser(): any {
//     return this.userService.getCurrentUser();
//   }

  /**
   * Language switching
   */
  switchLanguage(lang: string): void {
    this.languageService.setLanguage(lang);
  }

  getCurrentLanguage(): string {
    return this.languageService.getCurrentLang();
  }

  /**
   * Handle dropdown link clicks
   */
  onDropdownLinkClick(link: string, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    
    // Handle dropdown navigation
    console.log('Navigating to:', link);
    
    // Close dropdowns
    this.hideDropdown();
    this.closeMobileMenu();
    
    // Add your navigation logic here
    // Example: this.router.navigate([link]);
  }

  /**
   * Check if current route is active
   */
  isRouteActive(route: string): boolean {
    return this.router.url === route || this.router.url.startsWith(route + '/');
  }

  /**
   * Handle feature announcement clicks
   */
  onFeatureClick(feature: string): void {
    console.log('Feature clicked:', feature);
    // Implement feature-specific logic
    this.closeMobileMenu();
  }

  /**
   * Track click events for analytics
   */
  trackEvent(eventName: string, properties?: any): void {
    // Implement analytics tracking
    console.log('Event tracked:', eventName, properties);
  }

  /**
   * Detect device type for optimal experience
   */
  private detectDevice(): void {
    const userAgent = navigator.userAgent.toLowerCase();
    const screenWidth = window.innerWidth;

    // Check for touch capabilities
    this.isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    // Detect tablets
    this.isTablet = (
      /ipad/.test(userAgent) ||
      (/android/.test(userAgent) && !/mobile/.test(userAgent)) ||
      (screenWidth >= 768 && screenWidth <= 1024 && this.isTouch)
    );

    // Detect mobile phones
    this.isMobile = (
      screenWidth < 768 ||
      /iphone|ipod|android.*mobile|blackberry|iemobile/.test(userAgent)
    );

    // Adjust hover behavior for touch devices
    if (this.isTouch) {
      document.documentElement.classList.add('touch-device');
    }
  }

  /**
   * Handle touch-specific dropdown behavior
   */
  onDropdownTouch(dropdown: string, event: Event): void {
    if (this.isTouch) {
      event.preventDefault();
      if (this.activeDropdown === dropdown) {
        this.hideDropdown();
      } else {
        this.showDropdown(dropdown);
      }
    }
  }

  /**
   * Get optimized dropdown position for tablets
   */
  getDropdownPosition(): string {
    if (this.isTablet) {
      return 'left';
    }
    return 'center';
  }
}
