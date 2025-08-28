import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, takeUntil, Subject } from 'rxjs';
import { LanguageService } from 'src/app/services/language.service';

@Component({
    selector: 'app-first-home-part',
    templateUrl: './first-home-part.component.html',
    styleUrls: ['./first-home-part.component.css'],
    standalone: false
})
export class FirstHomePartComponent implements OnInit, OnDestroy {
    currentLang: string = 'ar';
    isRTL: boolean = true;
    
    private destroy$ = new Subject<void>();

    constructor(
        public languageService: LanguageService
    ) {}

    ngOnInit() {
        // Subscribe to language changes
        this.languageService.lang$.pipe(takeUntil(this.destroy$)).subscribe(lang => {
            this.currentLang = lang;
            this.isRTL = lang === 'ar' || lang === 'he';
        });
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    playDemo() {
        // TODO: Implement demo video modal or redirect to demo page
        console.log('Play demo clicked');
        // You can implement a modal or redirect to a demo video
        // For now, we'll just log it
    }
}
