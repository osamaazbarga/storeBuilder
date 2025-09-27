import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-step-six-plans',
    templateUrl: './step-six-plans.component.html',
    styleUrls: ['./step-six-plans.component.scss'],
    standalone: false
})
export class StepSixPlansComponent implements OnInit {
  plans = [
    { id: 'free', name: 'سلة بيسك', price: 'مجانا', features: ['منتجات غير محدودة','طرق دفع متنوعة'] },
    { id: 'basic', name: 'سلة بلس', price: '990.00 ر.س سنويًا', features: ['قوالب احترافية','دعم فني'] },
    { id: 'pro', name: 'سلة برو', price: '2990.00 ر.س سنويًا', features: ['مزايا التسويق المتقدمة','تقارير تفصيلية'] }
  ];
  constructor() {}
  ngOnInit(): void {}
}
