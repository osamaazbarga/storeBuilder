import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule]
})
export class FilesComponent {
  @Input() productForm!: FormGroup;
}
