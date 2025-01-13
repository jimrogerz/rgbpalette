import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
{
  path: 'help',
  loadChildren: () => import('./help/help.module').then(m => m.HelpModule),
},
{
  path: 'about',
  loadChildren: () => import('./about/about.module').then(m => m.AboutModule),
},
  {
    path: '**',
    loadChildren: () => import('./palettes/palettes.module').then(m => m.PalettesModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
