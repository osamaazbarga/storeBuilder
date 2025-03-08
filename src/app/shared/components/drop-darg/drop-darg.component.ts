import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, Output, SimpleChanges, ViewChild } from '@angular/core';

@Component({
  selector: 'app-drop-darg',
  templateUrl: './drop-darg.component.html',
  styleUrls: ['./drop-darg.component.css']
})
export class DropDargComponent {
  @Input() image!: string | null;
  @Input() cover!:boolean;
  @Input() disabled = false;
  @Input() isCoverImage = false;  // Indicates if the current image is the cover image
  @Output() imageUploaded = new EventEmitter<File>();
  @Output() imageRemoved = new EventEmitter<void>();
  @Output() coverImageSelected = new EventEmitter<boolean>();  // Emits when cover image is selected
  // favoriteSeason = null;

  constructor(private cdr: ChangeDetectorRef){}

  onFilesSelected(event: Event) {
    if (this.disabled) return;

    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.resizeImage(input.files[0]);
    }
  }

  onFilesDropped(files: FileList) {
    if (this.disabled) return;

    if (files.length > 0) {
      this.resizeImage(files[0]);
    }
  }

  resizeImage(file: File) {
    if (!file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target?.result as string;

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const maxWidth = 400; // Set max tile size
        const maxHeight = 400;
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = width * ratio;
          height = height * ratio;
        }

        canvas.width = width;
        canvas.height = height;

        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob((blob) => {
            if (blob) {
              const resizedFile = new File([blob], file.name, { type: file.type });
              this.imageUploaded.emit(resizedFile);
            }
          }, file.type);
        }
      };
    };
    reader.readAsDataURL(file);
  }

  removeImage() {
    this.imageRemoved.emit();
  }

  
}
