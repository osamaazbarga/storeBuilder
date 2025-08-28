import { Component, OnInit, ViewChild, ElementRef, Input, OnDestroy } from '@angular/core';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';
import { LanguageService } from 'src/app/services/language.service';
import { Subscription } from 'rxjs';

Chart.register(...registerables);

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
    fill?: boolean;
    tension?: number;
  }[];
}

@Component({
  selector: 'app-sales-chart',
  templateUrl: './sales-chart.component.html',
  styleUrls: ['./sales-chart.component.css'],
  standalone: false
})
export class SalesChartComponent implements OnInit, OnDestroy {
  @ViewChild('chartCanvas', { static: true }) chartCanvas!: ElementRef<HTMLCanvasElement>;
  @Input() chartType: ChartType = 'line';
  @Input() chartData!: ChartData;
  @Input() title: string = 'DASHBOARD.SALES_CHART';
  @Input() height: number = 300;

  private chart!: Chart;
  private langSubscription?: Subscription;

  constructor(private languageService: LanguageService) {}

  ngOnInit() {
    this.createChart();
    
    // Subscribe to language changes to update chart
    this.langSubscription = this.languageService.lang$.subscribe(() => {
      setTimeout(() => {
        this.updateChart();
      }, 100);
    });
  }

  ngOnDestroy() {
    if (this.chart) {
      this.chart.destroy();
    }
    if (this.langSubscription) {
      this.langSubscription.unsubscribe();
    }
  }

  private createChart() {
    const ctx = this.chartCanvas.nativeElement.getContext('2d')!;
    const isRTL = this.languageService.getCurrentLang() === 'ar' || this.languageService.getCurrentLang() === 'he';

    const config: ChartConfiguration = {
      type: this.chartType,
      data: this.chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            align: isRTL ? 'end' : 'start',
            rtl: isRTL,
            labels: {
              usePointStyle: true,
              boxWidth: 8,
              boxHeight: 8,
              font: {
                size: 12,
                family: 'Inter, sans-serif'
              },
              color: '#67748e'
            }
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: '#fff',
            bodyColor: '#fff',
            borderColor: '#e91e63',
            borderWidth: 1,
            cornerRadius: 8,
            displayColors: false,
            titleFont: {
              size: 13,
              weight: 'bold'
            },
            bodyFont: {
              size: 12
            }
          }
        },
        scales: {
          x: {
            grid: {
              display: false
            },
            ticks: {
              color: '#67748e',
              font: {
                size: 11
              }
            },
            border: {
              color: '#e9ecef'
            }
          },
          y: {
            grid: {
              color: '#f8f9fa',
              lineWidth: 1,
              // drawBorder: false
            },
            ticks: {
              color: '#67748e',
              font: {
                size: 11
              },
              callback: function(value) {
                return new Intl.NumberFormat().format(value as number);
              }
            },
            border: {
              color: '#e9ecef'
            }
          }
        },
        elements: {
          line: {
            tension: 0.4
          },
          point: {
            radius: 4,
            hoverRadius: 6
          }
        },
        interaction: {
          intersect: false,
          mode: 'index'
        }
      }
    };

    this.chart = new Chart(ctx, config);
  }

  private updateChart() {
    if (this.chart) {
      const isRTL = this.languageService.getCurrentLang() === 'ar' || this.languageService.getCurrentLang() === 'he';
      
      if (this.chart.options.plugins?.legend) {
        this.chart.options.plugins.legend.align = isRTL ? 'end' : 'start';
        this.chart.options.plugins.legend.rtl = isRTL;
      }
      
      this.chart.update();
    }
  }

  public updateChartData(newData: ChartData) {
    if (this.chart) {
      this.chart.data = newData;
      this.chart.update();
    }
  }
}
