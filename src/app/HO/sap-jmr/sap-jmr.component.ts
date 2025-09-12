import { Component, OnInit } from '@angular/core';
import {dbService} from '../../Service/db.service';
import { CookieService } from 'ngx-cookie-service';
import { isNullOrUndefined } from 'util';
import { getFullYear } from 'ngx-bootstrap/chronos/utils/date-getters';
declare var $;
@Component({
  selector: 'app-sap-jmr',
  templateUrl: './sap-jmr.component.html',
  styleUrls: ['./sap-jmr.component.css']
})
export class SAPJMRComponent implements OnInit {
  selectedMonth:string='';
  selectedfortnight: string='';
  ResponseList: any[];
  columns: string[] = [];
  errorFound: boolean = true;
  ControlRoomCode:string= this.objCook.get('LoginId');
  dateFrom: string='';
  dateTo: string='';
  columnstotal: string[] = [];
  columnsdiswise: string[] = [];
  TotalSale: any[];
  DisWIse: any[];
  selectedYear: any;
  years: number[] = [];
  visible:boolean = true;
  glovalJson:any = JSON.parse(sessionStorage.getItem('globalDetail'));
  IsRegionDisable: boolean = true;
  IsStationDisable: boolean = true;
  selectedRegion: string = 'All';
  selectedStation: string;
  StationList: any[];
  RegionList:any[];
  ReportFlag: string = this.objCook.get('DepartmentCode');
  dropdownSettings: { singleSelection: boolean; idField: string; textField: string; selectAllText: string; unSelectAllText: string; itemsShowLimit: number; allowSearchFilter: boolean; };
  IscheckboxApply: boolean = false;
  constructor(private objDbServ: dbService, private objCook: CookieService) { 
    this.objDbServ.MasterCompDisplay.emit(true);
    this.objDbServ.HeaderDisplay.emit(true);
    this.objDbServ.LeftMenu.emit(true);
    this.selectedYear = new Date().getFullYear();
     for ( let year = this.selectedYear; year >= 2020; year--) {
    this.years.push(year);
  }
  this.SetDropDownSetting();
  }
  ngOnInit() {
    if(this.ReportFlag == 'JMRAdmin'){
      this.IsRegionDisable = false;
      this.IsStationDisable=false;
      this.GetRegionByDept();
    }
    this.onRegionSelect('All');
    this.GetRegionByDept();
  }
  onRegionSelect(val) {
    this.selectedRegion = val;
    if (this.selectedRegion != "All") {
      this.selectedStation = '';
      this.IsStationDisable = false;
      this.objDbServ.getStationDetails({ControlRoomCode: this.ControlRoomCode, Region: this.selectedRegion, Flag: this.ReportFlag }).subscribe(
        (resp: any) => {
          this.StationList = JSON.parse(resp.json()).Table;
        },
        (error) => {
          alert('Something went wrong.');
        }
      )
    }
    else if (this.selectedRegion == "All") {
      this.selectedStation = '';
      this.IsStationDisable = false;
      this.objDbServ.getStationDetails({ControlRoomCode: this.ControlRoomCode, Region: this.selectedRegion, Flag: this.ReportFlag }).subscribe(
        (resp: any) => {
          this.StationList = JSON.parse(resp.json()).Table;
        },
        (error) => {
          alert('Something went wrong.');
        }
      )
    }
    else {
      this.IsStationDisable = true;
    }
  }
  GetRegionByDept() {
    this.objDbServ.ShowLoaders.emit(true);
    this.objDbServ.CommonGetData({ Flag: 'StationSubmittedStatusForMO', Id: this.objCook.get('UID') }).subscribe(
      (resp: any) => {
        this.RegionList = JSON.parse(resp.json()).Table1
        this.objDbServ.ShowLoaders.emit(false);
      },
      (error) => {
        alert('Something went wrong.');
        this.objDbServ.ShowLoaders.emit(false);
      }
    )
  }
  onStationSelect(val) {
    this.selectedStation = val;
  }
  SetDropDownSetting(){
    this.dropdownSettings  = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
  }
  onItemSelect(item: any) {
  }
  onItemDeSelect(item: any) {
  }
  onSelectAll(items: any) {
  }
  onDeSelectAll() {
  }
  onyearselect(val){
  this.selectedYear=val;
  }
  OnMonthChange(evt) {
    this.selectedMonth = evt.target.value;
  }
  OnFortChnage(evt){
    this.selectedfortnight=evt.target.value;
  }
  GetExportJMRreports() {
    const dt = new Date();
    if(this.selectedMonth =="Jan"){
      var month = 0;
      var d = new Date(dt.getFullYear(), month + 1, 0).getDate();
    }
   else if(this.selectedMonth =="Feb"){
      var month = 1;
      var d = new Date(dt.getFullYear(), month + 1, 0).getDate();
    }
    else if(this.selectedMonth =="Mar"){
      var month = 2;
      var d = new Date(dt.getFullYear(), month + 1, 0).getDate();
    }
    else if(this.selectedMonth =="Apr"){
      var month = 3;
      var d = new Date(dt.getFullYear(), month + 1, 0).getDate();
    }
    else  if(this.selectedMonth =="May"){
      var month = 4;
      var d = new Date(dt.getFullYear(), month + 1, 0).getDate();
    }
    else   if(this.selectedMonth =="June"){
      var month = 5;
      var d = new Date(dt.getFullYear(), month + 1, 0).getDate();
    }
    if(this.selectedMonth =="July"){
      var month = 6;
      var d = new Date(dt.getFullYear(), month + 1, 0).getDate();
    }
    else  if(this.selectedMonth =="Aug"){
      var month = 7;
      var d = new Date(dt.getFullYear(), month + 1, 0).getDate();
    }
    else if(this.selectedMonth =="Sep"){
      var month = 8;
      var d = new Date(dt.getFullYear(), month + 1, 0).getDate();
    }
    else if(this.selectedMonth =="Oct"){
      var month = 9;
      var d = new Date(dt.getFullYear(), month + 1, 0).getDate();
    }
    else   if(this.selectedMonth =="Nov"){
      var month = 10;
      var d = new Date(dt.getFullYear(), month + 1, 0).getDate();
    }
    else if (this.selectedMonth == "Dec"){
      var month = 11;
      var d = new Date(dt.getFullYear(), month + 1, 0).getDate();
    }
    {
      if(this.selectedfortnight == "Fortnight1"){
        this.dateFrom ="01-"+this.selectedMonth + "-"+ this.selectedYear;
        this.dateTo="15-"+this.selectedMonth + "-"+this.selectedYear;
      }
      else{
        var date = new Date();
        this.dateFrom ="16-"+this.selectedMonth + "-"+ this.selectedYear;
        this.dateTo=d+"-"+this.selectedMonth + "-"+ this.selectedYear;
      }
    }
    if (this.ValidationReports()) {
      const obj = {
          ControlRoomCode: this.ControlRoomCode,
          flag: 'Export',
          FromDate: this.dateFrom,
          ToDate: this.dateTo,
          Region: (this.selectedRegion === undefined) ? "" : this.selectedRegion,
          StationId: this.selectedStation,
      }
      {
        if (this.selectedMonth != null && this.selectedfortnight != null ) {
          this.objDbServ.ShowLoaders.emit(true);
          this.objDbServ.ExportSAPJMRReport(obj).subscribe(
            (resp: any) => {
              const data = JSON.parse(resp.json());
              this.objDbServ.ShowLoaders.emit(false);
              if (data.FileName != '') {
                if (JSON.parse(resp.json()).errMsg == 'success') {
                  window.location.href = this.objDbServ.apiImageAttachment + "/Attachments/Excel/" + JSON.parse(resp.json()).FileName
                  this.objDbServ.ShowLoaders.emit(false);
                }
                else {
                  alert(JSON.parse(resp.json()).errMsg)
                  this.objDbServ.ShowLoaders.emit(false);
                }
              }
              else {
                alert("No Data found.!");
                this.objDbServ.ShowLoaders.emit(false);
              }
            },
            (error) => {
              alert('Something went wrong.');
              this.objDbServ.ShowLoaders.emit(false);
            }
          )
        }
        else {
          alert('Please Select Reporting Date.');
        }
      }
    }
  }
  onReportShow() {
    const dt = new Date();
    if(this.selectedMonth =="Jan"){
      var month = 0;
      var d = new Date(dt.getFullYear(), month + 1, 0).getDate();
    }
   else if(this.selectedMonth =="Feb"){
      var month = 1;
      var d = new Date(dt.getFullYear(), month + 1, 0).getDate();
    }
    else if(this.selectedMonth =="Mar"){
      var month = 2;
      var d = new Date(dt.getFullYear(), month + 1, 0).getDate();
    }
    else if(this.selectedMonth =="Apr"){
      var month = 3;
      var d = new Date(dt.getFullYear(), month + 1, 0).getDate();
    }
    else  if(this.selectedMonth =="May"){
      var month = 4;
      var d = new Date(dt.getFullYear(), month + 1, 0).getDate();
    }
    else   if(this.selectedMonth =="June"){
      var month = 5;
      var d = new Date(dt.getFullYear(), month + 1, 0).getDate();
    }
    if(this.selectedMonth =="July"){
      var month = 6;
      var d = new Date(dt.getFullYear(), month + 1, 0).getDate();
    }
    else  if(this.selectedMonth =="Aug"){
      var month = 7;
      var d = new Date(dt.getFullYear(), month + 1, 0).getDate();
    }
    else if(this.selectedMonth =="Sep"){
      var month = 8;
      var d = new Date(dt.getFullYear(), month + 1, 0).getDate();
    }
    else if(this.selectedMonth =="Oct"){
      var month = 9;
      var d = new Date(dt.getFullYear(), month + 1, 0).getDate();
    }
    else   if(this.selectedMonth =="Nov"){
      var month = 10;
      var d = new Date(dt.getFullYear(), month + 1, 0).getDate();
    }
    else if (this.selectedMonth == "Dec"){
      var month = 11;
      var d = new Date(dt.getFullYear(), month + 1, 0).getDate();
    }
    {
      if(this.selectedfortnight == "Fortnight1"){
        this.dateFrom ="01-"+this.selectedMonth + "-"+ this.selectedYear;
        this.dateTo="15-"+this.selectedMonth + "-"+this.selectedYear;
      }
      else{
        var date = new Date();
        this.dateFrom ="16-"+this.selectedMonth + "-"+ this.selectedYear;
        this.dateTo=d+"-"+this.selectedMonth + "-"+ this.selectedYear;
      }
    }
    if (this.ValidationReports()) {
      const obj = {
        ControlRoomCode: this.ControlRoomCode,
        flag: 'Export',
        FromDate: this.dateFrom,
        ToDate: this.dateTo,
        Region: (this.selectedRegion === undefined) ? "" : this.selectedRegion,
        StationId: this.selectedStation,
      }
      this.objDbServ.ShowLoaders.emit(true);
      if (this.selectedMonth != null && this.selectedfortnight != null) {
        this.objDbServ.ViewSAPJMR(obj).subscribe(
          (resp: any) => {
            this.ResponseList = JSON.parse(resp.json()).Table;
            if (this.ResponseList.length != 0) {
              this.columns = Object.keys(this.ResponseList[0]);
            } else {
              this.columns = [];
              alert('No Data found');
            }
            this.objDbServ.ShowLoaders.emit(false);
          },
          (error) => {
            alert('Something went wrong.');
            this.objDbServ.ShowLoaders.emit(false);
          }
        )
      }
      else {
        alert('Please Select Reporting Date.');
      }
    }
  }
  ValidationReports() {
    this.errorFound = true;
     if (this.selectedMonth == "" || isNullOrUndefined(this.selectedMonth)) {
      alert('Please select Month.!');
      this.errorFound = false;
    }
    else if (this.selectedfortnight == "" || isNullOrUndefined(this.selectedfortnight)) {
      alert('Please select Fornight.!');
      this.errorFound = false;
    }
    else if (this.selectedStation == "" || isNullOrUndefined(this.selectedStation)) {
      alert('Please select Station(s).!');
      this.errorFound = false;
    }
    return this.errorFound;
  }
}
