import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import {MatRadioModule} from '@angular/material/radio';


@NgModule({
  imports: [
    CommonModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatButtonToggleModule,
    MatCheckboxModule,
    MatCardModule,
    MatListModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatIconModule,
    MatRadioModule
  ],
  exports: [
    MatSlideToggleModule,
    MatFormFieldModule,
    MatButtonToggleModule,
    MatCheckboxModule,
    MatCardModule,
    MatListModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatIconModule,
    MatRadioModule]
})
export class MaterialModule { }
