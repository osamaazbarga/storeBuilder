import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-step-four-payments',
    templateUrl: './step-four-payments.component.html',
    styleUrls: ['./step-four-payments.component.scss'],
    standalone: false
})
export class StepFourPaymentsComponent implements OnInit {
  methods = [
    { key: 'visa', label: 'البطاقات البنكية (فيزا/ماستركارد)' },
    { key: 'mada', label: 'مدى' },
    { key: 'applepay', label: 'Apple Pay' }
  ];
  enabled: Record<string, boolean> = {};
  constructor() {}
  ngOnInit(): void {}
}
