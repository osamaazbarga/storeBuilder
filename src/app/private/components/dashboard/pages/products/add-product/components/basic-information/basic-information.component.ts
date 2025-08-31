import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-basic-information',
  templateUrl: './basic-information.component.html',
  styleUrls: ['./basic-information.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule]
})
export class BasicInformationComponent {
  @Input() productForm!: FormGroup;
  @Input() submitted: boolean = false;
  @Output() filesSelected = new EventEmitter<FileList>();

  onFileSelect(event: any) {
    const files = event.target.files;
    if (files) {
      this.filesSelected.emit(files);
    }
  }

  onUploadBoxClick() {
    const fileInput = document.getElementById('imageUpload') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }
}
