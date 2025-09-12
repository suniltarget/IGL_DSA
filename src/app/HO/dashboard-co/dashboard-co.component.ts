import { Component, OnInit } from '@angular/core';
import { dbService } from '../../Service/db.service';
import { CookieService } from 'ngx-cookie-service';
import { DatepickerOptions } from 'ng2-datepicker';
import * as enLocale from 'date-fns/locale/en';
@Component({
  selector: 'app-dashboard-co',
  templateUrl: './dashboard-co.component.html',
  styleUrls: ['./dashboard-co.component.css']
})
export class DashboardCOComponent implements OnInit {
  dashboardCoData:any = [];
  DPREntryDate:string;
  key: string = 'Name';
  reverse: boolean = true;
  sortingColumn:string="";
  LoginId :string= this.objCook.get('LoginId');
  monthNames = [
    "Jan", "Feb", "Mar",
    "Apr", "May", "Jun", "Jul",
    "Aug", "Sep", "Oct",
    "Nov", "Dec"
  ];
  date: Date;
  options:DatepickerOptions = {
    minYear: 2018,
    locale: enLocale,
    displayFormat: 'DD-MMM-YYYY',
    maxDate:new Date(Date.now())
  };
  constructor(private objDbServ: dbService, private objCook: CookieService) { 
    this.objDbServ.HeaderDisplay.emit(true);
    this.objDbServ.LeftMenu.emit(true);
  }
  ngOnInit() {
    this.DPREntryDate= this.objCook.get('CurrentDate');
    this.getDashboardControlData();
  }
  OnDateChnagefrom(val){
    const dt = new Date(val);     
    this.DPREntryDate= dt.getDate() + "-" + this.monthNames[dt.getMonth()] + "-" + dt.getFullYear();
    this.getDashboardControlData();
  }
  getDashboardControlData(){
    try {
      this.objDbServ.ShowLoaders.emit(true);
      this.objDbServ.getDashboardControlApi({LoginId:this.LoginId, DPREntryDate:this.DPREntryDate}).subscribe(
        (response: any)=>{
          const data = JSON.parse(response._body);  
          if(data != '{}'){
            const data2 = JSON.parse(data);
            if(data2.Table.length > 0){
              this.dashboardCoData = data2.Table;
            }
            else{
            }
          }else{
          }    
          this.objDbServ.ShowLoaders.emit(false);             
        },
        (error)=>{
          this.objDbServ.ShowLoaders.emit(false);
        }  
      );
    }
    catch(err){
    }
  }
  sortCol(key:string){
    this.sortingColumn = key;
    this.key = key;
    this.reverse = !this.reverse;
   }
}
