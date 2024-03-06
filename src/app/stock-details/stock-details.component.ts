import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StockDataService, Stock } from '../stocks-data.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-stock-details',
  templateUrl: './stock-details.component.html',
  styleUrls: ['./stock-details.component.css']
})
export class StockDetailsComponent implements OnInit {
  stock: Stock | null = null;

  constructor(
    private route: ActivatedRoute,
    private stockDataService: StockDataService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const stockSymbol = params.get('symbol');
      if (stockSymbol) {
        this.stockDataService.getStockBySymbol(stockSymbol).pipe(
          catchError(error => {
            console.error('Error fetching stock details', error);
            return of(null); 
          })
        ).subscribe(stockDetails => {
          if (stockDetails && 'symbol' in stockDetails) {
            this.stock = stockDetails;
          } else {
            console.error('Invalid stock details received', stockDetails);
            this.stock = null;
          }
        });
      }
    });
  }
}



