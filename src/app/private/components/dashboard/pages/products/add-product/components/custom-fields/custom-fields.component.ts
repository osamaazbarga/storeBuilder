import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-custom-fields',
  templateUrl: './custom-fields.component.html',
  styleUrls: ['./custom-fields.component.css'],
  standalone: true,
  imports: [CommonModule, TranslateModule]
})
export class CustomFieldsComponent {}
