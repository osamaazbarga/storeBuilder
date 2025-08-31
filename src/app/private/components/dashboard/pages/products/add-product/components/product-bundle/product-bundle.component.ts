import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-product-bundle',
  templateUrl: './product-bundle.component.html',
  styleUrls: ['./product-bundle.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule]
})
export class ProductBundleComponent {
  @Input() productForm!: FormGroup;
}
