import { Component, OnInit } from '@angular/core';
import { dbService } from '../../Service/db.service';
import { CookieService } from 'ngx-cookie-service';
import { DatepickerOptions } from 'ng2-datepicker';
import * as enLocale from 'date-fns/locale/en';
declare var $:any;
@Component({
  selector: 'app-dpr-dashboard',
  templateUrl: './dpr-dashboard.component.html',
  styleUrls: ['./dpr-dashboard.component.css']
})
export class DPRDashboardComponent implements OnInit {
  DPRDashboardHOData:any = [];
  Dashdate:any = '';
  UserIdCook: string='';
  key: string = 'StationName';
  key1: string = 'StationName';
  reverse: boolean = true;
  date: Date;
  options:DatepickerOptions = {
  minYear: 2018,
  locale: enLocale,
  displayFormat: 'DD-MMM-YYYY',
  maxDate:new Date(Date.now())
 };
  constructor(private objDbServ: dbService, private objCook: CookieService) {
    this.objDbServ.MasterCompDisplay.emit(true);
    this.objDbServ.HeaderDisplay.emit(true);
    this.objDbServ.LeftMenu.emit(true);
  }
  ngOnInit() {
    this.Dashdate = this.objCook.get('CurrentDate');
    this.UserIdCook = this.objCook.get('UID');
    this.getDPRDashboardHOData();
  }
 OnDateChnagefrom(val){
  this.Dashdate = new Date(val)
  setTimeout(() => {
    this.getDPRDashboardHOData();
  });
}
getDPRDashboardHOData(){
    try
    {
      this.objDbServ.getDPRDashboardHOApi({Cdate:this.Dashdate}).subscribe(
        (response: any)=>{           
          const data = JSON.parse(response._body); 
          const data2 = JSON.parse(data).Table;    
          if(data2.length > 0){
            this.DPRDashboardHOData = data2; 
          }
          else{
            alert('No data available.');
          }             
        },
        (error)=>{
        }  
      );
    }catch(err){
    }
  }
  sortCol(key:string){
    this.key = key;
    this.reverse = !this.reverse;
   }
   monthNames = [
   "Jan", "Feb", "Mar",
   "Apr", "May", "Jun", "Jul",
   "Aug", "Sep", "Oct",
   "Nov", "Dec"
   ];
}
