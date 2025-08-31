import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-advanced-information',
  templateUrl: './advanced-information.component.html',
  styleUrls: ['./advanced-information.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule]
})
export class AdvancedInformationComponent {
  @Input() productForm!: FormGroup;
  @Input() submitted: boolean = false;
}
