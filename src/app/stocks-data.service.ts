import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EMPTY, Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface Stock {
  allScans: any;
  symbol: string;
  open: number;
  high: number;
  low: number;
  ltp: number;
  close: number;
  volume: number;
  prevClose: number;
  change: number;
  pctChange: number;
}


@Injectable({
  providedIn: 'root'
})
export class StockDataService {
  private apiUrl = 'https://intradayscreener.com/api/openhighlow/cash';

  constructor(private http: HttpClient) { }

  getStockData(): Observable<Stock[]> {
    return this.http.get<Stock[]>(this.apiUrl).pipe(
      catchError(error => {
        console.error('Error fetching stock data', error);
        return of([]);
      })
    );
  }
  

  getStockBySymbol(symbol: string): Observable<Stock> {
    const url = `https://intradayscreener.com/api/openhighlow/cash`;
    return this.http.get<any[]>(url).pipe(
      map(response => {
        const stockData = response.find(stock => stock.symbol === symbol);
        if (stockData) {
          return {
            symbol: stockData.symbol,
            open: stockData.open,
            high: stockData.high,
            low: stockData.low,
            ltp: stockData.ltp,
            close: stockData.close,
            volume: stockData.volume,
            prevClose: stockData.prevClose,
            change: stockData.change,
            pctChange: stockData.pctChange,
            allScans: stockData.allScans
          };
        } else {
          throw new Error('Stock not found');
        }
      }),
      catchError(error => {
        console.error('Error fetching stock by symbol', error);
        return throwError('Stock not found');
      })
    );
  }
  
  
}

