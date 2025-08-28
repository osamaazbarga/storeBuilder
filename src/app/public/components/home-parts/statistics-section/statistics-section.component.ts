import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { LanguageService } from 'src/app/services/language.service';

@Component({
  selector: 'app-statistics-section',
  templateUrl: './statistics-section.component.html',
  styleUrls: ['./statistics-section.component.css'],
  standalone: false
})
export class StatisticsSectionComponent implements OnInit, OnDestroy, AfterViewInit {
  currentLang: string = 'ar';
  isRTL: boolean = true;
  
  private destroy$ = new Subject<void>();

  constructor(
    public languageService: LanguageService,
    private elementRef: ElementRef
  ) {}

  ngOnInit() {
    // Subscribe to language changes
    this.languageService.lang$.pipe(takeUntil(this.destroy$)).subscribe(lang => {
      this.currentLang = lang;
      this.isRTL = lang === 'ar' || lang === 'he';
    });
  }

  ngAfterViewInit() {
    // Initialize intersection observer for counter animation
    this.initCounterAnimation();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initCounterAnimation() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateCounters();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    const statsSection = this.elementRef.nativeElement.querySelector('.statistics-section');
    if (statsSection) {
      observer.observe(statsSection);
    }
  }

  private animateCounters() {
    const counters = this.elementRef.nativeElement.querySelectorAll('.stat-number');
    
    counters.forEach((counter: HTMLElement) => {
      const target = parseInt(counter.getAttribute('data-count') || '0');
      const increment = target / 100;
      let current = 0;
      
      const updateCounter = () => {
        if (current < target) {
          current += increment;
          if (counter.textContent?.includes('%')) {
            counter.textContent = Math.ceil(current) + '%';
          } else if (counter.textContent?.includes('M')) {
            counter.textContent = (current / 1000000).toFixed(1) + 'M+';
          } else if (counter.textContent?.includes('K')) {
            counter.textContent = (current / 1000).toFixed(0) + 'K+';
          } else if (current >= 1000) {
            counter.textContent = Math.ceil(current).toLocaleString() + '+';
          } else {
            counter.textContent = Math.ceil(current).toString();
          }
          requestAnimationFrame(updateCounter);
        }
      };
      
      requestAnimationFrame(updateCounter);
    });
  }
}
