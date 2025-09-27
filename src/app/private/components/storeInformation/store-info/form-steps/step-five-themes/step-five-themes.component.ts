import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-step-five-themes',
    templateUrl: './step-five-themes.component.html',
    styleUrls: ['./step-five-themes.component.scss'],
    standalone: false
})
export class StepFiveThemesComponent implements OnInit {
  themes = [
    { id: 'classic', name: 'كلاسيك' },
    { id: 'modern', name: 'مودرن' },
    { id: 'minimal', name: 'مينيمل' }
  ];
  selected = 'classic';
  constructor() {}
  ngOnInit(): void {}
  select(id: string) { this.selected = id; }
}
