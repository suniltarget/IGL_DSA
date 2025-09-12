import { Component, OnInit } from '@angular/core';
import {dbService} from '../../Service/db.service';
import { CookieService } from 'ngx-cookie-service';
import { isNullOrUndefined } from 'util';
import { getFullYear } from 'ngx-bootstrap/chronos/utils/date-getters';
declare var $;
@Component({
  selector: 'app-jmr-stations',
  templateUrl: './jmr-stations.component.html',
  styleUrls: ['./jmr-stations.component.css']
})
export class JMRStationsComponent implements OnInit {
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
  isStationSubmitted:boolean=true;
  Msg: any;
  Buttondisp:boolean=false;
  CompanyName: any;
  stationid:any= this.objCook.get('stationId');
  constructor(private objDbServ: dbService, private objCook: CookieService) { 
    this.objDbServ.MasterCompDisplay.emit(true);
    this.objDbServ.HeaderDisplay.emit(true);
    this.objDbServ.LeftMenu.emit(true);
    this.selectedYear = new Date().getFullYear();
     for ( let year = this.selectedYear; year >= 2020; year--) {
    this.years.push(year);
  }
  }
  ngOnInit() {
    this.GetStationCompany()
  }
  GetStationCompany() {
    this.objDbServ.GetStationCompany({Flag: 'CompanyByStation', Id: this.stationid, Status:1}).subscribe(
      (resp: any) => {
        this.CompanyName=JSON.parse(resp.json()).Table[0].CompanyName;
        this.CheckCompany();      
      },
      (error) => {alert("Something went wrong.");
       this.objDbServ.ShowLoaders.emit(false);
      }
    )
  }
  CheckCompany() {
    if(this.CompanyName == 'IGL' || this.CompanyName == 'DODO' || this.CompanyName == 'DTC' || this.CompanyName == 'DIMTS') {
      this.Buttondisp = true;
    }
    else {
      this.Buttondisp = false;
   }     
  }
  OnChangeStatus(evt, flag: string) {
    if (flag == 'jmrtotal') {
      $("#PMCheck").prop("checked", true);
      $("#tgt_div").animate({ left: "0px" });
      if (this.TotalSale.length != 0) {
        this.ResponseList = this.TotalSale;
        this.columns = this.columnstotal;
      } else {
        this.columns = [];
        alert('No Data found');
      }
    }
    else if (flag == 'diswise') {
      $("#ef").prop("checked", true);
      $("#tgt_div").animate({ left: "95px" });
      if (this.DisWIse.length != 0) {
        this.ResponseList = this.DisWIse;
        this.columns = this.columnsdiswise;
      }
      else {
        this.columns = [];
        alert('No Data found');
      }
    }
  }
  onyearselect(val){
  this.selectedYear=val;
  this.onReportShow();
  this.CheckStatusOfStation();
  }
  OnMonthChange(evt) {
    this.selectedMonth = evt.target.value;
    this.onReportShow();
    if(this.ValidationReports()){
      this.CheckStatusOfStation();
    }
  }
  OnFortChnage(evt){
    this.selectedfortnight=evt.target.value;
    this.onReportShow();
    this.CheckStatusOfStation();
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
      }
      {
        if (this.selectedMonth != null && this.selectedfortnight != null ) {
          this.objDbServ.ShowLoaders.emit(true);
          this.objDbServ.ExportJMRReportstations(obj).subscribe(
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
  GetPDF() {
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
      }
      {
        if (this.selectedMonth != null && this.selectedfortnight != null ) {
          this.objDbServ.ShowLoaders.emit(true);
          this.objDbServ.GetPdFReport(obj).subscribe(
            (resp: any) => {
              const data = JSON.parse(resp.json());
              this.objDbServ.ShowLoaders.emit(false);
                var PdfUrl:string="";
                PdfUrl = this.objDbServ.apiUrl.substring(0,this.objDbServ.apiUrl.length-4)+JSON.parse(resp.json());
                const FileSaver = require('file-saver');
                FileSaver.saveAs(PdfUrl);
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
        flag: 'StationReport',
        FromDate: this.dateFrom,
        ToDate: this.dateTo,
      }
      this.objDbServ.ShowLoaders.emit(true);
      if (this.selectedMonth != null && this.selectedfortnight != null) {
        this.objDbServ.ViewJMR(obj).subscribe(
          (resp: any) => {
            this.ResponseList = JSON.parse(resp.json()).Table;
              this.ResponseList = JSON.parse(resp.json()).Table;
              this.TotalSale = JSON.parse(resp.json()).Table;
              this.TotalSale = JSON.parse(resp.json()).Table;
              this.DisWIse = JSON.parse(resp.json()).Table1;
              if (this.TotalSale.length != 0 || this.DisWIse.length != 0) {
                this.columns = Object.keys(this.ResponseList[0]);
                this.columnstotal = Object.keys(this.TotalSale[0]);
                this.columnsdiswise = Object.keys(this.DisWIse[0]);
              } else {
                this.columns = [];
                alert('No Data found');
              }
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
    return this.errorFound;
  }
  OnSubmit()  {
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
         ControlRoomCode:this.ControlRoomCode,
         flag:'SubmitByStation',
         FromDate: this.dateFrom,
         ToDate: this.dateTo,
      };
        this.objDbServ.SubmitByStation(obj).subscribe(
        (response: any)=>{
          const data = JSON.parse(JSON.parse(response._body));
          if (data.Status == '2') {
            this.isStationSubmitted=false;
              return false;
          }
          if (data.Status == '1') {
            this.isStationSubmitted=false;
            alert('Data is submitted.');
             this.CheckStatusOfStation();
            return false;
        }                     
        },
        (error)=>{
        }  
      );
}
  }
  CheckStatusOfStation()
  {
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
    const obj = {
         ControlRoomCode:this.ControlRoomCode,
         flag:'SubmitByStation',
         FromDate: this.dateFrom,
         ToDate: this.dateTo,
    };
    this.objDbServ.CheckStatusOfStation(obj).subscribe(
      (response: any)=>{
        const data = JSON.parse(response.json());
        if (data.Table[0].Status == '1') {
              this.isStationSubmitted=false;
              this.Msg = data.Table[0].Message;
            return false;
        }
            else
            {
              this.isStationSubmitted = true;
              this.Msg = "";
            }
            this.objDbServ.ShowLoaders.emit(false);
          },
          (error) => { alert("Something went wrong."); this.objDbServ.ShowLoaders.emit(false); }
        )
  }
}
