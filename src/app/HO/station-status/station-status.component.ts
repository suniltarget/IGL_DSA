import { Component, OnInit } from '@angular/core';
import { dbService } from '../../Service/db.service';
import { Response } from '@angular/http';
import { CookieService } from 'ngx-cookie-service';
import { ngxCsv } from 'ngx-csv/ngx-csv';
import { DatepickerOptions } from 'ng2-datepicker';
import * as enLocale from 'date-fns/locale/en';
import { isNullOrUndefined } from 'util';
import { inflate } from 'zlib';
import { FromEventObservable } from 'rxjs/observable/FromEventObservable';
declare var $:any;
@Component({
  selector: 'app-station-status',
  templateUrl: './station-status.component.html',
  styleUrls: ['./station-status.component.css']
})
export class StationStatusComponent implements OnInit {
  Table: any;
  constructor(private objDbServ: dbService, private objCook: CookieService) {
    this.objDbServ.MasterCompDisplay.emit(true);
    this.objDbServ.HeaderDisplay.emit(true);
    this.objDbServ.LeftMenu.emit(true);
  }
  listData:any=[];
  exportList:any=[];
  ShiftList:any=[];
  SubShiftList:any=[];
  flag:string = '';
  DSMCode: string = '';
  DSMName: string= '';
  errorFound: boolean;
  selectedDSMnameId:string='';
  errMsg:string='';
  title: string;
  DSMPopup:boolean = false;
  StatusIsfalse:boolean=false;
  key: string = 'Name';
  reverse: boolean = true;
  filter:string='';
  Id:string="0";
  sortingColumn:string="";
  DSMId:string="";
  DS:boolean=true;
  Status:string ='';
  CDate:string;
  selectedStation:string='';
  StationId:string=this.objCook.get('stationId');
  SelectedShiftId:string='';
  SubShiftId:string='';
  Remark:string='';
  CurrentDate:string='';
  DateFrom:string;
  DateTo:string;
  StatusFlag:string='InActive';
  monthNames = [
    "Jan", "Feb", "Mar",
    "Apr", "May", "Jun", "Jul",
    "Aug", "Sep", "Oct",
    "Nov", "Dec"
  ];
  SelectedShiftId_To:string='';
  SubShiftId_To:string='';
  SubShiftList_To:any=[];
  options:DatepickerOptions = {
  minYear: 2021,
  locale: enLocale,
  displayFormat: 'DD-MMM-YYYY',
  maxDate:null,
  minDate:new Date(Date.now()-86400000) 
  };
  ngOnInit() {
    const dt = new Date();
    this.CurrentDate = dt.getDate() + "/" + this.monthNames[dt.getMonth()] + "/" + dt.getFullYear();
    this.DateFrom = this.objCook.get('CurrentDate'); 
    this.DateTo = this.objCook.get('CurrentDate'); 
    setTimeout(() => {
      this.getShift();
    });
  }
  getData() {
    this.objDbServ.getDSMMaster({Flag: 'StationStatus', Id: this.Id, Status:this.StationId}).subscribe(
      (resp: Response) => {
        this.listData=JSON.parse(resp.json()).Table
        if(this.listData.length > 0) {
          this.Id = this.listData[0].Id;
          this.StatusFlag = this.listData[0].Status;
          this.SelectedShiftId =this.listData[0].ShiftId;
          this.SubShiftId =this.listData[0].SubShiftId;
          this.Remark =this.listData[0].Remark;
        }
      },
      (error) => {alert("Something went wrong.");
       this.objDbServ.ShowLoaders.emit(false);
      }
    )
  }
  getShift() {
    this.objDbServ.getStation({Flag: 'StationShift', Id: 0, Status:1}).subscribe(
      (resp: Response) => {
        this.ShiftList=JSON.parse(resp.json()).Table
      },
      (error) => {alert("Something went wrong.");
       this.objDbServ.ShowLoaders.emit(false);
      }
    )
  }
  getSubShift() {
    this.objDbServ.getStation({Flag: 'SubShift', Id: this.SelectedShiftId, Status:1}).subscribe(
      (resp: Response) => {
        this.SubShiftList=JSON.parse(resp.json()).Table
      },
      (error) => {alert("Something went wrong.");
       this.objDbServ.ShowLoaders.emit(false);
      }
    )
  }
  getSubShift_To() {
    this.objDbServ.getStation({Flag: 'SubShift', Id: this.SelectedShiftId_To, Status:1}).subscribe(
      (resp: Response) => {
        this.SubShiftList_To=JSON.parse(resp.json()).Table
      },
      (error) => {alert("Something went wrong.");
       this.objDbServ.ShowLoaders.emit(false);
      }
    )
  }
  onShiftSelect(val){
    this.SelectedShiftId = val;
    this.getSubShift();  
  }
  onShiftSelect_To(val){
    this.SelectedShiftId_To = val;
    this.getSubShift_To();  
  }
   OnDateChnageFrom(val)  {
    const dt = new Date(val);
    this.DateFrom= dt.getDate() + "/" + this.monthNames[dt.getMonth()] + "/" + dt.getFullYear();
  }
  OnDateChnageTo(val)  {
    const dt = new Date(val);
    this.DateTo= dt.getDate() + "/" + this.monthNames[dt.getMonth()] + "/" + dt.getFullYear();
  }
  insertRecord(){
    this.errorFound = true;
    if(this.Validation()) {
      const obj = {
        Id: this.Id,
        FromDate : this.DateFrom,
        ToDate : this.DateTo,
        ShiftId:this.SelectedShiftId,
        SubShiftId:this.SubShiftId,    
        flag: this.StatusFlag,
        StationIDs: this.StationId,
        Remark:this.Remark,
        ShiftId_To:this.SelectedShiftId_To,
        SubShiftId_To:this.SubShiftId_To
       };
       this.objDbServ.ShowLoaders.emit(true);
       this.objDbServ.InsertStationStatus(obj).subscribe(
         (resp: Response) =>{
           const data = JSON.parse(resp.json());
           if(data.Table[0].Mesage.indexOf('successfully') > -1)
           {
             this.DSMPopup = false;
             this.StatusFlag = 'InActive';
           }
           alert(data.Table[0].Mesage);
           this.objDbServ.ShowLoaders.emit(false);
           this.ngOnInit();
           this.Remark="";
           this.SelectedShiftId="";
           this.SubShiftId="";
           this.SelectedShiftId_To="";
           this.SubShiftId_To=""
       },
         (error) =>{
           alert('Something went wrong.');
           this.objDbServ.ShowLoaders.emit(false);
         }
       )
    }
  }
  Validation(){
    if(this.StatusFlag == '' || isNullOrUndefined(this.StatusFlag)){
      alert('Status must be selected.');
      this.errorFound = false;
    }
    else if(this.SelectedShiftId == ''){
      alert('Shift(From) must be Slected.');
      this.errorFound = false;
    }
    else if(this.SelectedShiftId_To == ''){
      alert('Shift(To) must be Slected.');
      this.errorFound = false;
    }
    else if(this.Remark == ''){
      alert('Remark must be entered.');
      this.errorFound = false;
    }
    return this.errorFound;
  }
}
