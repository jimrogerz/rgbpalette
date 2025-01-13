import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AngularResizeEventModule } from 'angular-resize-event';
import { MatSliderModule} from '@angular/material/slider';
import { MatButtonModule} from '@angular/material/button';
import { MatIconModule} from '@angular/material/icon';
import { MatTooltipModule} from '@angular/material/tooltip';
import { PaletteComponent } from './palette/palette.component';
import { DragDropModule} from '@angular/cdk/drag-drop';
import { CreateComponent } from './create/create.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatRadioModule} from '@angular/material/radio';

const routes: Routes = [
  { path: '', component: CreateComponent },
];


@NgModule({
  declarations: [
    PaletteComponent,
    CreateComponent,
  ],
  imports: [
    AngularResizeEventModule,
    CommonModule,
    FormsModule,
    MatRadioModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatIconModule,
    MatSliderModule,
    MatSlideToggleModule,
    ReactiveFormsModule,
    DragDropModule,
    MatSnackBarModule,
    RouterModule.forChild(routes),
  ],
  providers: [
  ],
})
export class PalettesModule { }
