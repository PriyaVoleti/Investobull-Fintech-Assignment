import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { StockDataService } from '../stocks-data.service';
import { Router } from '@angular/router';

interface EnrichedStock {
  allScans: any;
  symbol: string;
  ltp: number;
  open: number;
  high: number;
  low: number;
  pctChange: number;
  momentum: number;
  todaysRange: string;
  ohl: string;
}

@Component({
  selector: 'app-stocks-mat-table',
  templateUrl: './stocks-mat-table.component.html',
  styleUrls: ['./stocks-mat-table.component.css']
})
export class StocksMatTableComponent implements OnInit {
  displayedColumns: string[] = ['symbol', 'ltp', 'momentum', 'open', 'todaysRange', 'ohl'];
  dataSource!: MatTableDataSource<EnrichedStock>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private stockDataService: StockDataService, private router: Router) {}

  ngOnInit() {
    this.stockDataService.getStockData().subscribe(data => {
      const enrichedData = data.map(stock => ({
        symbol: stock.symbol,
        ltp: stock.ltp,
        open: stock.open,
        high: stock.high,
        low: stock.low,
        pctChange: stock.pctChange,
        momentum: this.calculateMomentum(stock.pctChange),
        todaysRange: `${stock.low} - ${stock.high}`,
        ohl: `${stock.open}/${stock.high}/${stock.low}`
      })) as EnrichedStock[];

      this.dataSource = new MatTableDataSource(enrichedData);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  calculateMomentum(pctChange: number): number {
    return pctChange;
  }

  getLtpColor(pctChange: number): string {
    return pctChange > 0 ? 'green' : pctChange < 0 ? 'red' : 'black';
  }

  goToStockDetails(stock: any) {
    this.router.navigate(['/stock-details', stock.symbol]);
  }

  getRangeBarWidth(stock: EnrichedStock): string {
    const totalRange = stock.high - stock.low;
    const ltpPosition = stock.ltp - stock.low;
    return `${(ltpPosition / totalRange) * 100}%`;
  }

  getNearestPivot(stock: EnrichedStock): { nearestPivot: number, deviation: number } {
    const levels = stock.allScans.intradayScans.map((scan: { level: any; }) => scan.level);
    levels.sort((a: number, b: number) => Math.abs(stock.ltp - a) - Math.abs(stock.ltp - b));
    const nearestPivot = levels[0];
    const deviation = Math.abs(stock.ltp - nearestPivot);
    return { nearestPivot, deviation };
  }

  getPivotBarPosition(stock: EnrichedStock): { width: string, left: string } {
    const levels = stock.allScans.intradayScans.map((scan: { level: any; }) => scan.level);
    const { nearestPivot, deviation } = this.getNearestPivot(stock);
    const remainingLevels = levels.filter((level: number) => level !== nearestPivot);
    const nextNearestPivot = remainingLevels.length > 0 ? 
                             remainingLevels.reduce((prev: number, curr: number) => Math.abs(curr - stock.ltp) < Math.abs(prev - stock.ltp) ? curr : prev) : 
                             nearestPivot;
    const sortedPivots = [nearestPivot, nextNearestPivot].sort((a, b) => a - b);
    const relativePosition = (stock.ltp - sortedPivots[0]) / (sortedPivots[1] - sortedPivots[0]);
    const barPositionPercentage = relativePosition * 100;
    const widthPercentage = nextNearestPivot === nearestPivot ? 0 : barPositionPercentage;
    return {
      left: `${Math.max(0, Math.min(100, barPositionPercentage))}%`,
      width: `${Math.max(0, Math.min(100, widthPercentage))}%`
    };
  }
}


  
  
  





