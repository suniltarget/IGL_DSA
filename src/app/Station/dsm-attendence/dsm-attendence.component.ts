import { Component, OnInit } from '@angular/core';
import { dbService } from '../../Service/db.service';
import { Response } from '@angular/http';
import { CookieService } from 'ngx-cookie-service';
import { ngxCsv } from 'ngx-csv/ngx-csv';
import { isNullOrUndefined, isNumber } from 'util';
import { AsyncScheduler } from 'rxjs/scheduler/AsyncScheduler';
import { DatepickerOptions } from 'ng2-datepicker';
import * as enLocale from 'date-fns/locale/en';
declare var $:any;
@Component({
  selector: 'app-dsm-attendence',
  templateUrl: './dsm-attendence.component.html',
  styleUrls: ['./dsm-attendence.component.css']
})
export class DSMAttendenceComponent implements OnInit {
  listDSM:any=[];
  exportList:any=[];
  StationList:any=[];
  flag:string = '';
  DSMCode: string = '';
  DSMName: string= '';
  errorFound: boolean;
  selectedDSMnameId:string='';
  errMsg:string='';
  title: string;
  DSMPopup:boolean = false;
  StatusIsfalse:boolean=false;
  sortingColumn:string="";
  key: string = 'Name';
  reverse: boolean = true;
  filter:string='';
  uId:string="";
  DSMId:string="";
  DS:boolean=true;
  Status:string ='';
  CurrentDate:string='';
  DateAttendece:string;
  selectedStation:string='';
  StationId:string=this.objCook.get('stationId');
  fiterBox:boolean = false;
  filterBoxFlag:number = 0;
  stCodeMy:"";
  monthNames = [
    "Jan", "Feb", "Mar",
    "Apr", "May", "Jun", "Jul",
    "Aug", "Sep", "Oct",
    "Nov", "Dec"
  ];
  ShiftList:any=[];
  SubShiftList:any=[];
  SelectedShiftId:string='';
  SubShiftId:string='';
  Remark:string='';
  FHCode:any;
  FingerImage:any;
  Id:string="0"; 
  options:DatepickerOptions = {
    minYear: 2021,
    locale: enLocale,
    displayFormat: 'DD-MMM-YYYY',
    maxDate:null,
    minDate:new Date(Date.now()-86400000) 
    };
 constructor(private objDbServ: dbService, private objCook: CookieService) {
    this.objDbServ.MasterCompDisplay.emit(true);
    this.objDbServ.HeaderDisplay.emit(true);
    this.objDbServ.LeftMenu.emit(true);
  }
  ngOnInit() {
    const dt = new Date();
    this.CurrentDate = dt.getDate() + "/" + this.monthNames[dt.getMonth()] + "/" + dt.getFullYear();
    this.DateAttendece = this.objCook.get('CurrentDate'); 
    setTimeout(() => {
      this.getShift();
      this.getDSM();
    });
  }
  OnDateChnageFrom(val)  {
    const dt = new Date(val);
    this.DateAttendece= dt.getDate() + "/" + this.monthNames[dt.getMonth()] + "/" + dt.getFullYear();
  }
  filterBoxShow(itm) {
    if(this.filterBoxFlag == 0) {
      this.fiterBox = true;
      this.filterBoxFlag = 1;
    }   
    else {
      this.fiterBox = false;
      this.filterBoxFlag = 0;
      this.stCodeMy = itm.DSMName;
      this.DSMId = itm.DSMId;
    }
  }
  getDSM() {
    this.objDbServ.getDSMMaster({Flag: 'DSM', Id: 0, Status:this.Status}).subscribe(
      (resp: any) => {
        this.listDSM=JSON.parse(resp.json()).Table
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
  onShiftSelect(val){
    this.SelectedShiftId = val;
    this.getSubShift();  
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
  VarifyFinger(){
  }
  insertRecord(){
    this.errorFound = true;
    if(this.Validation()) {
      const obj = {
        Id: this.Id,
        EntryDate : this.DateAttendece,
        ShiftId:this.SelectedShiftId,
        SubShiftId:this.SubShiftId,    
        StationId: this.StationId,
        DSMId: this.DSMId,
        FHCode: this.FHCode,
        Remark:this.Remark
       };
       this.objDbServ.ShowLoaders.emit(true);
       this.objDbServ.InsertAttendance(obj).subscribe(
         (resp: Response) =>{
           const data = JSON.parse(resp.json());
           if(data.Table[0].Mesage.indexOf('successfully') > -1)
           {
             this.getShift();
             this.getDSM();
           }
           alert(data.Table[0].Mesage);
           this.objDbServ.ShowLoaders.emit(false);
       },
         (error) =>{
           alert('Something went wrong.');
           this.objDbServ.ShowLoaders.emit(false);
         }
       )
    }
  }
  Validation(){
    if(Number(this.SelectedShiftId) <= 0 || isNullOrUndefined(this.SelectedShiftId)){
      alert('Shift must be selected.');
      this.errorFound = false;
    }
    else if(Number(this.SubShiftId) <= 0 || isNullOrUndefined(this.SubShiftId)){
      alert('Sub-Shift must be selected.');
      this.errorFound = false;
    }
    else if(Number(this.DSMId) <= 0 || isNullOrUndefined(this.DSMId)){
      alert('DSM must be selected.');
      this.errorFound = false;
    }
    else if(this.FHCode == ''){
      alert('Code Cant be null.');
      this.errorFound = false;
    }
    return this.errorFound;
  }
}
