import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { StoreService } from 'src/app/services/store.service';
import { ProductsService } from 'src/app/services/products.service';
import { StoreCategoriesService, StoreCategory } from 'src/app/services/store-categories.service';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.css'],
  standalone: false
})
export class StoreComponent implements OnInit, OnDestroy {
  store: any;
  products: any[] = [];
  categories: StoreCategory[] = [];
  theme: any;

  selectedCategory: StoreCategory | null = null;
  searchQuery = '';
  cartVisible = false;
  productsLoading = true;

  private subs: Subscription[] = [];

  constructor(
    private storeService: StoreService,
    private productsService: ProductsService,
    private categoriesService: StoreCategoriesService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const existing = this.storeService.getStoreData();
    if (existing?.id) {
      this.store = existing;
      this.loadStoreData();
    }

    const sub = this.storeService.storeData$.subscribe((store: any) => {
      if (store?.id && store.id !== this.store?.id) {
        this.store = store;
        this.loadStoreData();
      }
    });
    this.subs.push(sub);

    if (!existing?.id) {
      this.resolveStore();
    }
  }

  private resolveStore() {
    this.storeService.getCurrentStore().subscribe({
      next: (response: any) => {
        if (response?.store) {
          this.store = response.store;
          this.storeService.setCurrentStore(response.store);
          this.loadStoreData();
        }
      },
      error: (err: any) => console.error('Store resolution error:', err),
    });
  }

  private loadStoreData() {
    if (!this.store?.id) return;

    this.storeService.getStoreTheme(this.store.id).subscribe({
      next: (data: any) => {
        this.theme = data.themeSettings;
        this.applyTheme(data.themeSettings);
      },
    });

    this.productsLoading = true;
    forkJoin({
      products: this.productsService.getProductsByStoreId(this.store.id).pipe(catchError(() => of([]))),
      categories: this.categoriesService.getByStore(this.store.id).pipe(catchError(() => of([]))),
    }).subscribe({
      next: ({ products, categories }: any) => {
        this.products = products;
        this.categories = categories;
        this.productsLoading = false;
      },
      error: () => { this.productsLoading = false; },
    });
  }

  private applyTheme(theme: any) {
    if (!theme) return;
    const root = document.documentElement;
    const map: Record<string, string> = {
      '--store-primary':   theme.primaryColor    || '#6366F1',
      '--store-secondary': theme.secondaryColor  || '#EC4899',
      '--store-bg':        theme.backgroundColor || '#F9FAFB',
      '--store-text':      theme.textColor       || '#1F2937',
      '--store-header-bg': theme.headerBg        || '#FFFFFF',
      '--store-footer-bg': theme.footerBg        || '#1F2937',
    };
    Object.entries(map).forEach(([k, v]) => root.style.setProperty(k, v));
    if (theme.fontFamily) root.style.setProperty('--store-font', theme.fontFamily);
    if (this.store?.name) document.title = this.store.name;
  }

  onCategorySelected(cat: StoreCategory | null) { this.selectedCategory = cat; }
  onSearchChanged(query: string) { this.searchQuery = query; }
  onCartUpdated() { this.cartVisible = true; }

  ngOnDestroy() {
    this.subs.forEach((s) => s.unsubscribe());
    ['--store-primary','--store-secondary','--store-bg','--store-text','--store-header-bg','--store-footer-bg']
      .forEach((v) => document.documentElement.style.removeProperty(v));
  }
}

