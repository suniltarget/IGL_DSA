import { Component, OnInit } from '@angular/core';
import { dbService } from '../../Service/db.service';
import { CookieService } from 'ngx-cookie-service';
import { DatepickerOptions } from 'ng2-datepicker';
import * as enLocale from 'date-fns/locale/en';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-station-summary',
  templateUrl: './station-summary.component.html',
  styleUrls: ['./station-summary.component.css']
})
export class StationSummaryComponent implements OnInit {
  stationReportData:any = [];
   DataTable1:any = [];
   DataTable2:any = [];
   DataTable3:any = [];
  StationCode:string = this.objCook.get('stationCode');
  LoginId :string = this.objCook.get('stationCode');
  glovalJson:any = JSON.parse(sessionStorage.getItem('globalDetail'));
  stationName:string="";
  MeterSkitdiffAVG:number=0.00;
  StationGasLoss:number=0.00;
  GrossSale:number=0.00;
  TotalList:any = [];
  SummeryDate:string;
  summary:any = { 
    prm_id: (this.glovalJson[0].prm_id == null || this.glovalJson[0].prm_id === undefined) ? 0 : this.glovalJson[0].prm_id
   };
  constructor(private objDbServ: dbService, private objCook: CookieService, private dp: DatePipe) {
     this.objDbServ.HeaderDisplay.emit(true);
     this.objDbServ.LeftMenu.emit(true);
   }
  ngOnInit() {
    this.SummeryDate =this.objCook.get('CurrentDate'); 
    this.stationName = JSON.parse(sessionStorage.getItem("globalDetail"))[0].UserName;
    this.getStationReportData();
  }
  date: Date;
  options:DatepickerOptions = {
    minYear: 2018,
    locale: enLocale,
    displayFormat: 'DD-MMM-YYYY',
    maxDate:new Date(Date.now())
  };
  OnDateChnagefrom(val){
    const dt = new Date(val);     
    this.SummeryDate= dt.getDate() + "-" + this.monthNames[dt.getMonth()] + "-" + dt.getFullYear();
    this.getStationReportData();
 }
  monthNames = [
    "Jan", "Feb", "Mar",
    "Apr", "May", "Jun", "Jul",
    "Aug", "Sep", "Oct",
    "Nov", "Dec"
  ];
  getStationReportData(){
    try
    {
      this.objDbServ.ShowLoaders.emit(true);
      this.objDbServ.getStationReportApi({StationCode:this.StationCode, LoginId:this.LoginId, DPREntryDate:this.SummeryDate}).subscribe(
        (response: any)=>{
          const data = JSON.parse(response._body);
          if(data){
            this.stationReportData = JSON.parse(data);
            this.MeterSkitdiffAVG = this.stationReportData.Table[0].MeterskitdiffAVG;
            this.StationGasLoss = (this.MeterSkitdiffAVG == null ? 0.00 : this.MeterSkitdiffAVG) - parseFloat(this.stationReportData.Table[0].DispenserTotalSale == null ? 0.00 : this.stationReportData.Table[0].DispenserTotalSale);
             this.DataTable1=this.stationReportData.Table1;
             this.DataTable2=this.stationReportData.Table2;
             this.DataTable3=this.stationReportData.Table3;
             this.StationGasLoss = parseFloat(this.StationGasLoss.toFixed(2));
             this.objDbServ.ShowLoaders.emit(false);
          }
          else {
            alert('No data available. Please try again.')
          }             
        },
        (error)=>{
        }  
      );
    }
    catch(err){
    }
  }
  stationSummarySubmit() {
    if (!confirm('You won\'t be able to make changes after submit, are you sure?')){return false;}
    try
    {
     const obj = {       
        LoginId:this.glovalJson[0].LoginId,
        StationName:this.glovalJson[0].StationCode,
        StationCode:this.glovalJson[0].StationCode,
        DPREntryDate:this.SummeryDate
      };
      this.objDbServ.getFinalSubmitStation(obj).subscribe(
        (response: any)=>{
          const data = JSON.parse(JSON.parse(response._body));
          if (data.Status.indexOf('#999#') > -1) {
            var missingFor = data.Status.split('#999#')[1];
            alert('Please fill the entry for ' + missingFor + '.');
            return false;
          }
          if (data.Status == '3') {
              alert('Data is already submitted.');
              return false;
          }
          if (data.Status == '4') {
              alert('You are not authorized to submit data.');
              return false;
          }
          else
              alert('Data is submitted.');                        
        },
        (error)=>{
        }  
      );
    }
    catch(err){
    }    
  }
  ExportToPdf() {
    const obj = {
      StationCode:this.StationCode, 
      LoginId:this.LoginId, 
      DPREntryDate:this.dp.transform(this.SummeryDate,"dd-MMM-yyyy"),
      StationName: this.glovalJson[0].StationName
    };
    this.objDbServ.DPRSummaryPDF(obj).subscribe(
      (resp: any) => {
        const data = JSON.parse(resp.json());
        if(data != 'No Data Available') {
          var PdfUrl:string="";
          PdfUrl = this.objDbServ.apiUrl.substring(0,this.objDbServ.apiUrl.length-4)+JSON.parse(resp.json());
          const FileSaver = require('file-saver');
          FileSaver.saveAs(PdfUrl);
        }
        else {
          alert(data);
        }
        this.objDbServ.ShowLoaders.emit(false);
      },
      (error) => {alert("Something went wrong.");this.objDbServ.ShowLoaders.emit(false);}
    )
  }
}
