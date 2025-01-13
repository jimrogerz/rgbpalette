import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HelpComponent } from './help.component';
import { MatIconModule} from '@angular/material/icon';

const routes: Routes = [{ path: '', component: HelpComponent }];

@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
   RouterModule.forChild(routes)],
  declarations: [HelpComponent],
})
export class HelpModule { }
