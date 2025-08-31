import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-display-channels',
  templateUrl: './display-channels.component.html',
  styleUrls: ['./display-channels.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule]
})
export class DisplayChannelsComponent {
  @Input() productForm!: FormGroup;
  @Input() productType: string = '';
}
