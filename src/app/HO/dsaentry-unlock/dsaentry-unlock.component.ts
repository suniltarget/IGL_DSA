import { Component, OnInit } from '@angular/core';
import { dbService } from '../../Service/db.service';
import { Response } from '@angular/http';
import { FilterSearchPipe } from '../../Filters/filter-search.pipe';
import { CookieService } from 'ngx-cookie-service';
import { isNullOrUndefined } from 'util';
import { DatepickerOptions } from 'ng2-datepicker';
import * as enLocale from 'date-fns/locale/en';
declare var $:any;
@Component({
  selector: 'app-dsaentry-unlock',
  templateUrl: './dsaentry-unlock.component.html',
  styleUrls: ['./dsaentry-unlock.component.css']
})
export class DSAEntryUnlockComponent implements OnInit {
  StaionDetails: {}[];
  listStation: any[];
  SelectedCRoom:string='';
  SelectedMO:string='';
  SelectedStationCode:string='';
  errorFound = true;
  IsDepartmentHO = true;
  DepartmentCode:string= this.objCook.get('DepartmentCode');
  LoginCode:string= this.objCook.get('LoginCode');
  Rejectiondate:any = '';
  date: Date;
  options:DatepickerOptions = {
  minYear: 2018,
  locale: enLocale,
  displayFormat: 'DD-MMM-YYYY',
  maxDate:new Date(Date.now())
 };
 monthNames = [
  "Jan", "Feb", "Mar",
  "Apr", "May", "Jun", "Jul",
  "Aug", "Sep", "Oct",
  "Nov", "Dec"
];
  constructor(private objDbServ: dbService, private objCook: CookieService) {
    this.objDbServ.MasterCompDisplay.emit(true);
    this.objDbServ.HeaderDisplay.emit(true);
    this.objDbServ.LeftMenu.emit(true);
   }
  ngOnInit() {
    this.Rejectiondate = this.objCook.get('CurrentDate');
    if(this.DepartmentCode=='HO')
      this.IsDepartmentHO=true;
   else { 
      this.IsDepartmentHO=false;
      this.SelectedCRoom = this.LoginCode;
      this.getRejectDetails();
   }
   this.StationDataMO();
  }
  OnSelectCRoom(evt) {
    this.SelectedMO = evt.target.value;
    this.getRejectDetails();
  }
  getRejectDetails() {
    if(this.DepartmentCode!='HO'){
      this.SelectedMO = this.objCook.get('UID');
  }
    this.objDbServ.GetStationByMO({Flag:'GetStationByMO', SOPId:this.SelectedMO}).subscribe(
      (resp: Response) => {
        this.listStation=JSON.parse(resp.json()).Table
      },
      (error) => {alert("Something went wrong.");
       this.objDbServ.ShowLoaders.emit(false);
      }
    )
  }
  UpdateRejectStation() {
    this.errorFound = true;
    if(this.ValidationRejection()) {
      this.objDbServ.GetStationByMO({Flag:'Unlock', StationId: this.SelectedStationCode, CDate:this.Rejectiondate}).subscribe(
        (resp: Response) => {
          const data = JSON.parse(resp.json());
         alert(data.Table[0].Msg); 
         this.objDbServ.ShowLoaders.emit(false);                 
        },
        (error) => {alert("Something went wrong.");
         this.objDbServ.ShowLoaders.emit(false);
        }
      )
    }
  }
  OnDateChnagefrom(val){
    const dt = new Date(val);
    this.Rejectiondate = dt.getDate() + "/" + this.monthNames[dt.getMonth()] + "/" + dt.getFullYear();   
  }
  ValidationRejection(){
    if(this.SelectedStationCode == '' || isNullOrUndefined(this.SelectedStationCode)){
       alert('Please Select Station for Unlock.');
       this.errorFound = false;
     }
    return this.errorFound;
  } 
  StationDataMO() {
    this.objDbServ.ShowLoaders.emit(true);
    this.objDbServ.CommonGetData({ Flag: 'StationSubmittedStatusForMO', Id: 0, CDashdate: '' }).subscribe(
      (resp: Response) => {
        this.objDbServ.ShowLoaders.emit(false);
        this.StaionDetails = JSON.parse(resp.json()).Table;
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
}
