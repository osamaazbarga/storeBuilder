import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-quantity-management',
  templateUrl: './quantity-management.component.html',
  styleUrls: ['./quantity-management.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule]
})
export class QuantityManagementComponent {
  @Input() productForm!: FormGroup;
  @Input() hasShipping: boolean = true;

  decreaseQuantity() {
    const currentValue = this.productForm.get('mainQuantity')?.value || 0;
    if (currentValue > 0) {
      this.productForm.patchValue({ mainQuantity: currentValue - 1 });
    }
  }

  increaseQuantity() {
    const currentValue = this.productForm.get('mainQuantity')?.value || 0;
    this.productForm.patchValue({ mainQuantity: currentValue + 1 });
  }
}
