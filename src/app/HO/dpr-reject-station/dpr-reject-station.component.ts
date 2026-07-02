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
  selector: 'app-dpr-reject-station',
  templateUrl: './dpr-reject-station.component.html',
  styleUrls: ['./dpr-reject-station.component.css']
})
export class DPRRejectStationComponent implements OnInit {
  controlRooms: any[];
  listStation: any[];
  SelectedCRoom:string='';
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
    this.loadControlRooms();
    this.Rejectiondate= this.objCook.get('CurrentDate');
    if(this.DepartmentCode=='HO')
      this.IsDepartmentHO=true;
   else { 
      this.IsDepartmentHO=false;
      this.SelectedCRoom = this.LoginCode;
      this.getRejectDetails();
   }
  }
  OnSelectCRoom(evt) {
    this.SelectedCRoom = evt.target.value;
    this.getRejectDetails();
  }

  loadControlRooms() {
    this.objDbServ.GetControlOfficeForDropDown({}).subscribe(
      (resp: Response) => {
        this.controlRooms=JSON.parse(resp.json()).Table
      },
      (error) => {alert("Something went wrong.");
       this.objDbServ.ShowLoaders.emit(false);
      }
    )
  }

  
  getRejectDetails() {
    this.objDbServ.getRejectDetails({ControlRoomCode:this.SelectedCRoom, Flag:'FillStation', Rejectiondate: this.Rejectiondate, LoginId: this.LoginCode}).subscribe(
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
      this.objDbServ.getRejectDetails({ControlRoomCode:this.SelectedCRoom, Flag: this.SelectedStationCode, RejectionDate:this.Rejectiondate, LoginId: this.LoginCode}).subscribe(
        (resp: Response) => {
          const data = JSON.parse(resp.json());
         if(data.Table[0].Messages != "") {        
           this.getRejectDetails();        
           this.SelectedStationCode='';
           this.SelectedCRoom='';     
         }
         alert(data.Table[0].Messages); 
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
}