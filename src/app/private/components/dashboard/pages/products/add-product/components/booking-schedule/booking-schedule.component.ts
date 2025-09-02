import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-booking-schedule',
  templateUrl: './booking-schedule.component.html',
  styleUrls: ['./booking-schedule.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule]
})
export class BookingScheduleComponent implements OnInit {
  @Input() productForm!: FormGroup;
  
  constructor(private translateService: TranslateService) {}
  
  activeTab: string = 'days';
  
  weekDays = [
    'PRODUCTS.SUNDAY',
    'PRODUCTS.MONDAY',
    'PRODUCTS.TUESDAY',
    'PRODUCTS.WEDNESDAY',
    'PRODUCTS.THURSDAY',
    'PRODUCTS.FRIDAY',
    'PRODUCTS.SATURDAY'
  ];

  // Time slots management for days tab
  timeSlots: { [key: number]: number[] } = {};
  
  // Time slots management for days-times tab
  detailedTimeSlots: { [key: number]: number[] } = {};

  // Booking exceptions management
  exceptions: string[] = []; // For days tab
  exceptionsDT: string[] = []; // For days-times tab

  // Custom calendar properties
  currentDate = new Date();
  currentMonth = new Date().getMonth();
  currentYear = new Date().getFullYear();
  
  monthNames: string[] = [];
  weekDaysShort: string[] = [];

  ngOnInit() {
    // Initialize time slots
    for (let i = 0; i < 7; i++) {
      this.timeSlots[i] = [0]; // Start with one time slot per day
      this.detailedTimeSlots[i] = [0]; // Start with one time slot per day
    }

    // Initialize translated month names
    this.loadTranslations();

    // No need for click outside listener for inline calendar
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  getFormControl(controlName: string): FormControl | null {
    const control = this.productForm.get(controlName);
    return control instanceof FormControl ? control : null;
  }

  // Days tab methods
  getTimeSlots(dayIndex: number): number[] {
    return this.timeSlots[dayIndex] || [0];
  }

  addTimeSlot(dayIndex: number) {
    if (!this.timeSlots[dayIndex]) {
      this.timeSlots[dayIndex] = [];
    }
    const newIndex = this.timeSlots[dayIndex].length;
    this.timeSlots[dayIndex].push(newIndex);
  }

  removeTimeSlot(dayIndex: number, slotIndex: number) {
    if (this.timeSlots[dayIndex] && this.timeSlots[dayIndex].length > 1) {
      this.timeSlots[dayIndex].splice(slotIndex, 1);
      // Re-index the remaining slots
      this.timeSlots[dayIndex] = this.timeSlots[dayIndex].map((_, index) => index);
    }
  }

  // Days-times tab methods
  getDetailedTimeSlots(dayIndex: number): number[] {
    return this.detailedTimeSlots[dayIndex] || [0];
  }

  addDetailedTimeSlot(dayIndex: number) {
    if (!this.detailedTimeSlots[dayIndex]) {
      this.detailedTimeSlots[dayIndex] = [];
    }
    const newIndex = this.detailedTimeSlots[dayIndex].length;
    this.detailedTimeSlots[dayIndex].push(newIndex);
  }

  removeDetailedTimeSlot(dayIndex: number, slotIndex: number) {
    if (this.detailedTimeSlots[dayIndex] && this.detailedTimeSlots[dayIndex].length > 1) {
      this.detailedTimeSlots[dayIndex].splice(slotIndex, 1);
      // Re-index the remaining slots
      this.detailedTimeSlots[dayIndex] = this.detailedTimeSlots[dayIndex].map((_, index) => index);
    }
  }

  // Booking exceptions methods for days tab
  addException(event: any) {
    const selectedDate = event.target.value;
    if (selectedDate && !this.exceptions.includes(selectedDate)) {
      this.exceptions.push(selectedDate);
      // Clear the input
      event.target.value = '';
    }
  }

  removeException(index: number) {
    this.exceptions.splice(index, 1);
  }

  // Booking exceptions methods for days-times tab
  addExceptionDT(event: any) {
    const selectedDate = event.target.value;
    if (selectedDate && !this.exceptionsDT.includes(selectedDate)) {
      this.exceptionsDT.push(selectedDate);
      // Clear the input
      event.target.value = '';
    }
  }

  removeExceptionDT(index: number) {
    this.exceptionsDT.splice(index, 1);
  }

  // Custom calendar methods - simplified for inline calendar

  previousMonth() {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
  }

  nextMonth() {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
  }

  getDaysInMonth(): number[][] {
    const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(this.currentYear, this.currentMonth, 1).getDay();
    
    const days: number[][] = [];
    let week: number[] = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      week.push(0);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      week.push(day);
      
      if (week.length === 7) {
        days.push(week);
        week = [];
      }
    }
    
    // Add empty cells for remaining days in the last week
    while (week.length < 7 && week.length > 0) {
      week.push(0);
    }
    
    if (week.length > 0) {
      days.push(week);
    }
    
    return days;
  }

  // For days tab calendar
  selectDate(day: number) {
    if (day === 0) return;
    
    const selectedDate = new Date(this.currentYear, this.currentMonth, day);
    const dateString = selectedDate.toISOString().split('T')[0];
    
    if (!this.exceptions.includes(dateString)) {
      this.exceptions.push(dateString);
    } else {
      // Remove if already selected
      const index = this.exceptions.indexOf(dateString);
      this.exceptions.splice(index, 1);
    }
  }

  isDateException(day: number): boolean {
    if (day === 0) return false;
    
    const dateString = new Date(this.currentYear, this.currentMonth, day).toISOString().split('T')[0];
    return this.exceptions.includes(dateString);
  }

  // For days-times tab calendar
  selectDateDT(day: number) {
    if (day === 0) return;
    
    const selectedDate = new Date(this.currentYear, this.currentMonth, day);
    const dateString = selectedDate.toISOString().split('T')[0];
    
    if (!this.exceptionsDT.includes(dateString)) {
      this.exceptionsDT.push(dateString);
    } else {
      // Remove if already selected
      const index = this.exceptionsDT.indexOf(dateString);
      this.exceptionsDT.splice(index, 1);
    }
  }

  isDateExceptionDT(day: number): boolean {
    if (day === 0) return false;
    
    const dateString = new Date(this.currentYear, this.currentMonth, day).toISOString().split('T')[0];
    return this.exceptionsDT.includes(dateString);
  }

  isToday(day: number): boolean {
    if (day === 0) return false;
    
    const today = new Date();
    return (
      day === today.getDate() &&
      this.currentMonth === today.getMonth() &&
      this.currentYear === today.getFullYear()
    );
  }

  formatDateForDisplay(dateString: string): string {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = this.monthNames[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  }

  loadTranslations() {
    // Load month names
    const monthKeys = [
      'PRODUCTS.JANUARY', 'PRODUCTS.FEBRUARY', 'PRODUCTS.MARCH', 'PRODUCTS.APRIL',
      'PRODUCTS.MAY', 'PRODUCTS.JUNE', 'PRODUCTS.JULY', 'PRODUCTS.AUGUST',
      'PRODUCTS.SEPTEMBER', 'PRODUCTS.OCTOBER', 'PRODUCTS.NOVEMBER', 'PRODUCTS.DECEMBER'
    ];

    // Load weekday names
    const weekDayKeys = [
      'PRODUCTS.SUNDAY', 'PRODUCTS.MONDAY', 'PRODUCTS.TUESDAY', 'PRODUCTS.WEDNESDAY',
      'PRODUCTS.THURSDAY', 'PRODUCTS.FRIDAY', 'PRODUCTS.SATURDAY'
    ];

    // Get translated month names
    this.monthNames = monthKeys.map(key => this.translateService.instant(key));
    
    // Get translated weekday names
    this.weekDaysShort = weekDayKeys.map(key => this.translateService.instant(key));

    // Listen for language changes
    this.translateService.onLangChange.subscribe(() => {
      this.monthNames = monthKeys.map(key => this.translateService.instant(key));
      this.weekDaysShort = weekDayKeys.map(key => this.translateService.instant(key));
    });
  }
}
