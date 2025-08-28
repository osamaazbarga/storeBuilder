import { Component, Input } from '@angular/core';

export interface StatCardData {
  title: string;
  value: string | number;
  icon: string;
  color: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'dark';
  percentage?: number;
  trend?: 'up' | 'down';
  description?: string;
  prefix?: string;
  suffix?: string;
  
}

@Component({
  selector: 'app-stat-card',
  templateUrl: './stat-card.component.html',
  styleUrls: ['./stat-card.component.css'],
  standalone: false
})
export class StatCardComponent {
  @Input() data!: StatCardData;

  getColorClass(): string {
    switch (this.data.color) {
      case 'primary':
        return 'bg-gradient-primary';
      case 'success':
        return 'bg-gradient-success';
      case 'warning':
        return 'bg-gradient-warning';
      case 'danger':
        return 'bg-gradient-danger';
      case 'info':
        return 'bg-gradient-info';
      case 'dark':
        return 'bg-gradient-dark';
      default:
        return 'bg-gradient-primary';
    }
  }

  getTrendIcon(): string {
    return this.data.trend === 'up' ? 'trending_up' : 'trending_down';
  }

  getTrendClass(): string {
    return this.data.trend === 'up' ? 'text-success' : 'text-danger';
  }

  formatValue(): string {
    const prefix = this.data.prefix || '';
    const suffix = this.data.suffix || '';
    
    if (typeof this.data.value === 'number') {
      return `${prefix}${this.data.value.toLocaleString()}${suffix}`;
    }
    
    return `${prefix}${this.data.value}${suffix}`;
  }
}
