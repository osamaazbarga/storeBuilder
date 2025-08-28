import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';

// Dashboard Shared Components
import { StatCardComponent } from './shared/stat-card/stat-card.component';
import { SalesChartComponent } from './shared/sales-chart/sales-chart.component';
import { RecentOrdersComponent } from './shared/recent-orders/recent-orders.component';

@NgModule({
  declarations: [
    StatCardComponent,
    SalesChartComponent,
    RecentOrdersComponent
  ],
  imports: [
    CommonModule,
    TranslateModule,
    RouterModule
  ],
  exports: [
    StatCardComponent,
    SalesChartComponent,
    RecentOrdersComponent,
    TranslateModule,
    CommonModule
  ]
})
export class SharedModule { }
