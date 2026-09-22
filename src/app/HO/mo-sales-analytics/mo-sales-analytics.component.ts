import { Component, OnInit } from '@angular/core';
import { dbService } from '../../Service/db.service';
import { Response } from '@angular/http';
import { CookieService } from 'ngx-cookie-service';
import { ngxCsv } from 'ngx-csv/ngx-csv';
import { DatepickerOptions } from 'ng2-datepicker';
import * as enLocale from 'date-fns/locale/en';
declare var $: any;
@Component({
  selector: 'app-mo-sales-analytics',
  templateUrl: './mo-sales-analytics.component.html',
  styleUrls: ['./mo-sales-analytics.component.css']
})
export class MOSalesAnalyticsComponent implements OnInit {
  constructor(private objDbServ: dbService, private objCook: CookieService) {
    this.objDbServ.MasterCompDisplay.emit(true);
    this.objDbServ.HeaderDisplay.emit(true);
    this.objDbServ.LeftMenu.emit(true);
  }
  UserId: string = this.objCook.get('UID');
  YearList: any = [];
  StationList: any = [];
  QuarterList: any = [];
  MonthList: any = [];
  WeekList: any = [];
  Summary: any = null;
  SelectedYear: string = '';
  StationId: string = '';
  activeTab: string = 'quarter';       // quarter | weekly
  WeekFrom: string = '';
  WeekTo: string = '';
  monthNames = [
    'Jan', 'Feb', 'Mar',
    'Apr', 'May', 'Jun', 'Jul',
    'Aug', 'Sep', 'Oct',
    'Nov', 'Dec'
  ];
  options: DatepickerOptions = {
    minYear: 2021,
    locale: enLocale,
    displayFormat: 'DD-MMM-YYYY',
    maxDate: new Date(Date.now())
  };

  // ---- chart geometry (hand drawn SVG, no external chart library) ----
  chartW: number = 760;
  chartH: number = 260;
  padL: number = 64;
  padR: number = 16;
  padT: number = 16;
  padB: number = 34;

  ngOnInit() {
    const dt = new Date();
    this.WeekTo = dt.getDate() + '/' + this.monthNames[dt.getMonth()] + '/' + dt.getFullYear();
    const from = new Date(Date.now() - (84 * 86400000));   // 12 weeks back
    this.WeekFrom = from.getDate() + '/' + this.monthNames[from.getMonth()] + '/' + from.getFullYear();
    setTimeout(() => {
      this.getYears();
      this.getStations();
    });
  }
  getYears() {
    this.objDbServ.getMOSalesAnalytics({ Flag: 'SaleYears', UserId: this.UserId }).subscribe(
      (resp: Response) => {
        this.YearList = JSON.parse(resp.json()).Table;
        if (this.YearList != undefined && this.YearList.length > 0) {
          this.SelectedYear = this.YearList[0].FinYear;
          this.getQuarterData();
          this.getWeeklyData();
        }
      },
      (error) => { this.onErr(); }
    );
  }
  getStations() {
    this.objDbServ.getMOSalesAnalytics({ Flag: 'Stations', UserId: this.UserId }).subscribe(
      (resp: Response) => { this.StationList = JSON.parse(resp.json()).Table; },
      (error) => { this.onErr(); }
    );
  }
  getQuarterData() {
    this.objDbServ.ShowLoaders.emit(true);
    this.objDbServ.getMOSalesAnalytics({
      Flag: 'QuarterCompare', UserId: this.UserId,
      StationId: this.StationId == '' ? '0' : this.StationId,
      Year: this.SelectedYear
    }).subscribe(
      (resp: Response) => {
        const data = JSON.parse(resp.json());
        this.QuarterList = data.Table == undefined ? [] : data.Table;
        this.Summary = (data.Table1 != undefined && data.Table1.length > 0) ? data.Table1[0] : null;
        this.MonthList = data.Table2 == undefined ? [] : data.Table2;
        this.objDbServ.ShowLoaders.emit(false);
      },
      (error) => { this.onErr(); }
    );
  }
  getWeeklyData() {
    this.objDbServ.getMOSalesAnalytics({
      Flag: 'Weekly', UserId: this.UserId,
      StationId: this.StationId == '' ? '0' : this.StationId,
      FromDate: this.WeekFrom, ToDate: this.WeekTo
    }).subscribe(
      (resp: Response) => { this.WeekList = JSON.parse(resp.json()).Table; },
      (error) => { this.onErr(); }
    );
  }
  onErr() {
    alert('Something went wrong.');
    this.objDbServ.ShowLoaders.emit(false);
  }
  onYearSelect(val) {
    this.SelectedYear = val;
    this.getQuarterData();
  }
  onStationSelect(val) {
    this.StationId = val;
    this.getQuarterData();
    this.getWeeklyData();
  }
  OnWeekFrom(val) {
    const dt = new Date(val);
    this.WeekFrom = dt.getDate() + '/' + this.monthNames[dt.getMonth()] + '/' + dt.getFullYear();
  }
  OnWeekTo(val) {
    const dt = new Date(val);
    this.WeekTo = dt.getDate() + '/' + this.monthNames[dt.getMonth()] + '/' + dt.getFullYear();
  }
  setTab(t) { this.activeTab = t; }

  // ---------------- number helpers ----------------
  /** kg -> tonnes, for axis labels and tiles */
  toT(kg): number {
    const n = Number(kg);
    if (isNaN(n)) { return 0; }
    return n / 1000;
  }
  fmtT(kg): string {
    const t = this.toT(kg);
    if (t >= 1000) { return (t / 1000).toFixed(2) + ' kT'; }
    return t.toFixed(1) + ' T';
  }
  fmtPct(p): string {
    if (p == null || p === '') { return '-'; }
    const n = Number(p);
    return (n > 0 ? '+' : '') + n.toFixed(2) + '%';
  }
  pctClass(p): string {
    if (p == null || p === '') { return 'nv_flat'; }
    return Number(p) >= 0 ? 'nv_up' : 'nv_down';
  }

  // ---------------- shared chart maths ----------------
  private maxOf(rows: any[], keys: string[]): number {
    let m = 0;
    (rows || []).forEach(r => keys.forEach(k => {
      const v = this.toT(r[k]);
      if (v > m) { m = v; }
    }));
    return m === 0 ? 1 : m;
  }
  /** a round-ish upper bound so gridlines read nicely */
  private niceMax(m: number): number {
    const pow = Math.pow(10, Math.floor(Math.log(m) / Math.LN10));
    const step = pow / 2;
    return Math.ceil(m / step) * step;
  }
  get plotW(): number { return this.chartW - this.padL - this.padR; }
  get plotH(): number { return this.chartH - this.padT - this.padB; }

  /** four horizontal gridlines with their labels, for any series */
  gridLines(rows: any[], keys: string[]): any[] {
    const top = this.niceMax(this.maxOf(rows, keys));
    const out = [];
    for (let i = 0; i <= 4; i++) {
      const val = (top / 4) * i;
      out.push({
        y: this.padT + this.plotH - (this.plotH * (i / 4)),
        label: top >= 4000 ? (val / 1000).toFixed(1) + 'k' : val.toFixed(0)
      });
    }
    return out;
  }
  /** grouped bars: two series side by side per category */
  groupedBars(rows: any[], keyA: string, keyB: string): any[] {
    const top = this.niceMax(this.maxOf(rows, [keyA, keyB]));
    const n = (rows || []).length;
    if (n === 0) { return []; }
    const slot = this.plotW / n;
    const bw = Math.min(34, (slot - 14) / 2);
    const out = [];
    for (let i = 0; i < n; i++) {
      const base = this.padL + (slot * i) + (slot / 2);
      const hA = this.plotH * (this.toT(rows[i][keyA]) / top);
      const hB = this.plotH * (this.toT(rows[i][keyB]) / top);
      out.push({
        row: rows[i],
        labelX: base,
        aX: base - bw - 2, aY: this.padT + this.plotH - hA, aH: hA,
        bX: base + 2, bY: this.padT + this.plotH - hB, bH: hB,
        bw: bw
      });
    }
    return out;
  }
  /** single series bars, used by the weekly report */
  singleBars(rows: any[], key: string): any[] {
    const top = this.niceMax(this.maxOf(rows, [key]));
    const n = (rows || []).length;
    if (n === 0) { return []; }
    const slot = this.plotW / n;
    const bw = Math.min(30, slot - 8);
    const out = [];
    for (let i = 0; i < n; i++) {
      const h = this.plotH * (this.toT(rows[i][key]) / top);
      out.push({
        row: rows[i],
        x: this.padL + (slot * i) + ((slot - bw) / 2),
        y: this.padT + this.plotH - h,
        h: h, bw: bw,
        labelX: this.padL + (slot * i) + (slot / 2)
      });
    }
    return out;
  }
  /** polyline points for a line series */
  linePoints(rows: any[], key: string, keys: string[]): string {
    const top = this.niceMax(this.maxOf(rows, keys));
    const n = (rows || []).length;
    if (n === 0) { return ''; }
    const step = n === 1 ? 0 : this.plotW / (n - 1);
    const pts = [];
    for (let i = 0; i < n; i++) {
      const x = this.padL + (step * i);
      const y = this.padT + this.plotH - (this.plotH * (this.toT(rows[i][key]) / top));
      pts.push(x.toFixed(1) + ',' + y.toFixed(1));
    }
    return pts.join(' ');
  }
  lineDots(rows: any[], key: string, keys: string[]): any[] {
    const top = this.niceMax(this.maxOf(rows, keys));
    const n = (rows || []).length;
    if (n === 0) { return []; }
    const step = n === 1 ? 0 : this.plotW / (n - 1);
    const out = [];
    for (let i = 0; i < n; i++) {
      out.push({
        row: rows[i],
        cx: this.padL + (step * i),
        cy: this.padT + this.plotH - (this.plotH * (this.toT(rows[i][key]) / top))
      });
    }
    return out;
  }
  get axisY(): number { return this.padT + this.plotH; }

  // ---------------- export ----------------
  exportQuarter() {
    if (this.QuarterList == undefined || this.QuarterList.length == 0) {
      alert('No record to export.');
      return;
    }
    const rows = [];
    this.QuarterList.forEach(q => {
      rows.push({
        Quarter: q.QtrName,
        Months: q.QtrMonths,
        State: q.QtrState,
        CurrentKg: q.CurrKg,
        PreviousFullKg: q.PrevKg,
        PreviousComparableKg: q.ComparableKg,
        GrowthPct: q.GrowthPct == null ? '' : q.GrowthPct,
        CurrentDays: q.CurrDays,
        PreviousDays: q.PrevDays
      });
    });
    return new ngxCsv(rows, 'SaleQuarterComparison', {
      fieldSeparator: ',', quoteStrings: '"', showLabels: true, useBom: true,
      headers: ['Quarter', 'Months', 'State', 'Current FY (kg)', 'Previous FY full (kg)',
        'Previous FY comparable (kg)', 'Growth %', 'Days (current)', 'Days (previous)']
    });
  }
  exportWeekly() {
    if (this.WeekList == undefined || this.WeekList.length == 0) {
      alert('No record to export.');
      return;
    }
    const rows = [];
    this.WeekList.forEach(w => {
      rows.push({
        From: w.WeekStartText, To: w.WeekEndText,
        SaleKg: w.SaleKg, Days: w.Days, AvgPerDayKg: w.AvgPerDayKg
      });
    });
    return new ngxCsv(rows, 'WeeklySaleReport', {
      fieldSeparator: ',', quoteStrings: '"', showLabels: true, useBom: true,
      headers: ['Week from', 'Week to', 'Sale (kg)', 'Days reported', 'Avg per day (kg)']
    });
  }
}
