import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { HomePageComponent } from './page/home-page/home-page.component';
import { DamagePageComponent } from './page/damage-page/damage-page.component';
import { HitRatePageComponent } from './page/hit-rate-page/hit-rate-page.component';

const routes: Routes = [{
  path: '',
  component: MainLayoutComponent,
  children: [{
    path: '',
    component: HomePageComponent,
  }, {
    path: 'damage',
    component: DamagePageComponent,
  }, {
    path: 'hitRate',
    component: HitRatePageComponent,
  }],
}];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
  ],
  exports: [
    RouterModule,
  ],
})
export class AppRoutingModule {}
