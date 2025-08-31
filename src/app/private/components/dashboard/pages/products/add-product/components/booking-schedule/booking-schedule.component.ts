import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-booking-schedule',
  templateUrl: './booking-schedule.component.html',
  styleUrls: ['./booking-schedule.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule]
})
export class BookingScheduleComponent {
  @Input() productForm!: FormGroup;
}
