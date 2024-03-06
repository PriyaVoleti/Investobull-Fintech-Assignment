import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StocksMatTableComponent } from './stocks-mat-table/stocks-mat-table.component';
import { StockDetailsComponent } from './stock-details/stock-details.component';

const routes: Routes = [
  { path: '', redirectTo: '/stocks', pathMatch: 'full' },
  { path: 'stocks', component: StocksMatTableComponent },
  { path: 'stock-details/:symbol', component: StockDetailsComponent }, 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
