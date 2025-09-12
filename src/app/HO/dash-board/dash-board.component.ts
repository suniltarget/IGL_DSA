import { Component, OnInit } from '@angular/core';
import { dbService } from '../../Service/db.service';
import { Response } from '@angular/http';
import { DatepickerOptions } from 'ng2-datepicker';
import * as enLocale from 'date-fns/locale/en';
import { FilterSearchPipe } from '../../Filters/filter-search.pipe';
import { CookieService } from 'ngx-cookie-service';
declare var $: any;
@Component({
  selector: 'app-dash-board',
  templateUrl: './dash-board.component.html',
  styleUrls: ['./dash-board.component.css']
})
export class DashBoardComponent implements OnInit {
  StaionDetails: {}[];
  UserIdCook: string;
  UserType: string;
  searchText: string = '';
  MOStaionDetails: {}[];
  key: string = 'StationName';
  key1: string = 'StationName';
  reverse: boolean = true;
  Dashdate = '';
  sortingColumn: string = "";
  constructor(private objDbServ: dbService, private objCook: CookieService) {
    this.objDbServ.MasterCompDisplay.emit(true);
    this.objDbServ.HeaderDisplay.emit(true);
    this.objDbServ.LeftMenu.emit(true);
  }
  options: DatepickerOptions = {
    minYear: 2018,
    locale: enLocale,
    displayFormat: 'DD-MMM-YYYY',
    maxDate: new Date(Date.now())
  };
  ngOnInit() {
    this.Dashdate= this.objCook.get('CurrentDate');
    this.UserIdCook = this.objCook.get('UID');
    setTimeout(() => {
      this.StationDataMO();
    });
  }
  monthNames = [
    "Jan", "Feb", "Mar",
    "Apr", "May", "Jun", "Jul",
    "Aug", "Sep", "Oct",
    "Nov", "Dec"
  ];
  OnDateChnage(val) {
    const dt = new Date(val);
    this.Dashdate = dt.getDate() + "/" + this.monthNames[dt.getMonth()] + "/" + dt.getFullYear();
    setTimeout(() => {
      this.StationDataMO();
    });
  }
  StationDataMO() {
    this.objDbServ.ShowLoaders.emit(true);
    this.objDbServ.CommonGetData({ Flag: 'StationSubmittedStatusForMO', Id: this.UserIdCook, CDashdate: this.Dashdate }).subscribe(
      (resp: Response) => {
        this.objDbServ.ShowLoaders.emit(false);
        this.StaionDetails = JSON.parse(resp.json()).Table;
        this.UserType = JSON.parse(resp.json()).Table[0].UserType;
        setTimeout(() => {
        });
        this.objDbServ.ShowLoaders.emit(false);
      },
      (error) => {
        alert("Something went wrong.");
        this.objDbServ.ShowLoaders.emit(false);
      }
    )
  }
  GetMOStation(MOID: string) {
    this.objDbServ.CommonGetData({ Flag: 'MOwiseStation', Id: MOID }).subscribe(
      (resp: Response) => {
        this.MOStaionDetails = JSON.parse(resp.json()).Table;
      },
      (error) => { alert("Something went wrong.") }
    )
  }
  sortCol(key: string) {
    this.sortingColumn = key;
    this.key = key;
    this.reverse = !this.reverse;
  }
}