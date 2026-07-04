import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { StoreCategory } from 'src/app/services/store-categories.service';

@Component({
  selector: 'app-store-products-grid',
  templateUrl: './store-products-grid.component.html',
  styleUrls: ['./store-products-grid.component.css'],
  standalone: false
})
export class StoreProductsGridComponent implements OnChanges {
  @Input() products: any[] = [];
  @Input() selectedCategory: StoreCategory | null = null;
  @Input() searchQuery = '';
  @Input() storeId!: number;
  @Input() loading = false;

  @Output() cartUpdated = new EventEmitter<void>();

  filteredProducts: any[] = [];
  skeletons = Array(8).fill(0);

  ngOnChanges() {
    this.applyFilters();
  }

  private applyFilters() {
    let result = [...this.products];

    // Filter by category
    if (this.selectedCategory) {
      result = result.filter((p) => p.categoryId === this.selectedCategory!.id);
    }

    // Filter by search
    if (this.searchQuery?.trim()) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
      );
    }

    this.filteredProducts = result;
  }

  onCartUpdated() {
    this.cartUpdated.emit();
  }
}
