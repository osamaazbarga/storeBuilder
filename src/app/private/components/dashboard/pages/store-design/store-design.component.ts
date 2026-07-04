import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { MessageService } from 'primeng/api';
import { StoreService } from 'src/app/services/store.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-store-design',
  templateUrl: './store-design.component.html',
  styleUrls: ['./store-design.component.css'],
  standalone: false
})
export class StoreDesignComponent implements OnInit {
  store: any;
  stores: any[] = [];
  storesLoading = true;
  templates: any[] = [];
  selectedTemplateId: number | null = null;
  saving = false;
  previewDevice: 'desktop' | 'mobile' = 'desktop';
  logoPreview: string | null = null;
  logoFile: File | null = null;
  logoSize = 42; // px

  themeForm: Record<string, string> = {
    primaryColor:       '#6366F1',
    secondaryColor:     '#EC4899',
    backgroundColor:    '#F9FAFB',
    textColor:          '#1F2937',
    headerBg:           '#FFFFFF',
    footerBg:           '#1F2937',
    fontFamily:         'Cairo',
    heroBannerTitle:    'مرحباً بكم في متجرنا',
    heroBannerSubtitle: 'اكتشف أفضل المنتجات بأسعار مميزة',
    heroBannerCta:      'تسوق الآن',
    heroBannerImage:    '',
  };

  colorFields = [
    { key: 'primaryColor',    label: 'اللون الأساسي' },
    { key: 'secondaryColor',  label: 'اللون الثانوي' },
    { key: 'backgroundColor', label: 'خلفية الصفحة' },
    { key: 'textColor',       label: 'لون النص' },
    { key: 'headerBg',        label: 'خلفية الهيدر' },
    { key: 'footerBg',        label: 'خلفية الفوتر' },
  ];

  fontOptions = [
    { label: 'Cairo (كايرو)', value: 'Cairo' },
    { label: 'Tajawal (تجوال)', value: 'Tajawal' },
    { label: 'Noto Sans Arabic', value: 'Noto Sans Arabic' },
    { label: 'Almarai (المرعي)', value: 'Almarai' },
    { label: 'IBM Plex Sans Arabic', value: 'IBM Plex Sans Arabic' },
  ];

  constructor(
    private storeService: StoreService,
    private http: HttpClient,
    private messageService: MessageService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.loadUserStores();
    this.loadTemplates();
  }

  private loadUserStores() {
    this.storesLoading = true;
    this.storeService.getUserStores().pipe(catchError(() => of([]))).subscribe((stores) => {
      this.stores = stores;
      this.storesLoading = false;
      if (!this.store && stores.length > 0) {
        this.selectStore(stores[0]);
      }
    });
  }

  selectStore(store: any) {
    this.store = store;
    this.logoPreview = null;
    this.logoFile = null;
    this.themeForm = {
      primaryColor:       '#6366F1',
      secondaryColor:     '#EC4899',
      backgroundColor:    '#F9FAFB',
      textColor:          '#1F2937',
      headerBg:           '#FFFFFF',
      footerBg:           '#1F2937',
      fontFamily:         'Cairo',
      heroBannerTitle:    'مرحباً بكم في متجرنا',
      heroBannerSubtitle: 'اكتشف أفضل المنتجات بأسعار مميزة',
      heroBannerCta:      'تسوق الآن',
      heroBannerImage:    '',
    };
    this.loadTheme();
  }

  private loadTheme() {
    this.storeService.getStoreTheme(this.store.id).subscribe({
      next: (data: any) => {
        if (data.themeSettings) {
          this.themeForm = { ...this.themeForm, ...data.themeSettings };
          if (data.themeSettings.logoSize) {
            this.logoSize = Number(data.themeSettings.logoSize);
          }
        }
        if (data.templateId) this.selectedTemplateId = data.templateId;
      },
    });
  }

  private loadTemplates() {
    this.http.get<any[]>(`${environment.apiUrl}/templates`).pipe(
      catchError(() => of([]))
    ).subscribe((templates) => {
      this.templates = templates;
    });
  }

  selectTemplate(tpl: any) {
    this.selectedTemplateId = tpl.id;
    if (tpl.templateData?.colors) {
      this.themeForm = { ...this.themeForm, ...tpl.templateData.colors };
    }
  }

  onColorChange() {}
  onFontChange() {}

  onLogoSelected(event: any) {
    const file: File = event.files[0];
    if (!file) return;
    this.logoFile = file;
    const reader = new FileReader();
    reader.onload = (e) => { this.logoPreview = e.target?.result as string; };
    reader.readAsDataURL(file);
  }

  removeLogo() {
    this.logoPreview = null;
    this.logoFile = null;
  }

  onHeroImageSelected(event: any) {
    const file: File = event.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      this.themeForm = { ...this.themeForm, heroBannerImage: e.target?.result as string };
    };
    reader.readAsDataURL(file);
  }

  get heroImageStyle(): SafeStyle {
    const img = this.themeForm['heroBannerImage'];
    if (img) {
      return this.sanitizer.bypassSecurityTrustStyle(`url(${img})`);
    }
    return this.sanitizer.bypassSecurityTrustStyle(
      `linear-gradient(135deg, ${this.themeForm['primaryColor']}, ${this.themeForm['secondaryColor']})`
    );
  }

  get currentLogoSrc(): string | null {
    return this.logoPreview || this.store?.logo || null;
  }

  saveTheme() {
    if (!this.store?.id) return;
    this.saving = true;

    const uploadLogo$ = this.logoFile
      ? this.storeService.uploadLogo(this.store.id, this.logoFile)
      : of(null);

    uploadLogo$.subscribe({
      next: (logoRes: any) => {
        if (logoRes?.logo) {
          this.store.logo = logoRes.logo;
          this.logoPreview = logoRes.logo;
        }

        if (this.selectedTemplateId) {
          this.http.post(`${environment.apiUrl}/templates/apply`, {
            storeId: this.store.id,
            templateId: this.selectedTemplateId,
            customizations: this.themeForm,
          }).pipe(catchError(() => of(null))).subscribe();
        }

        const themePayload = { ...this.themeForm, logoSize: String(this.logoSize) };
        this.storeService.updateTheme(this.store.id, themePayload).subscribe({
          next: () => {
            this.saving = false;
            this.messageService.add({
              severity: 'success',
              summary: 'تم الحفظ',
              detail: `تم حفظ تصميم متجر "${this.store.name}" بنجاح`,
            });
          },
          error: () => {
            this.saving = false;
            this.messageService.add({ severity: 'error', summary: 'خطأ', detail: 'فشل حفظ الإعدادات' });
          },
        });
      },
      error: () => {
        this.saving = false;
        this.messageService.add({ severity: 'error', summary: 'خطأ', detail: 'فشل رفع الشعار' });
      },
    });
  }

  previewStore() {
    if (this.store?.subdomain) {
      window.open(`https://${this.store.subdomain}.${environment.platformDomain}`, '_blank');
    }
  }
}

