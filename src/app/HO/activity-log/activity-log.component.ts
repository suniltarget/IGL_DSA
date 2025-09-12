import { Component, OnInit } from '@angular/core';
import { dbService } from '../../Service/db.service';
import { Response } from '@angular/http';
import { CookieService } from 'ngx-cookie-service';
import { DatepickerOptions } from 'ng2-datepicker';
import * as enLocale from 'date-fns/locale/en';
import { ngxCsv } from 'ngx-csv';
declare var $:any;
@Component({
  selector: 'app-activity-log',
  templateUrl: './activity-log.component.html',
  styleUrls: ['./activity-log.component.css']
})
export class ActivityLogComponent implements OnInit {
  ActivityLogData:any = [];
  searchText:string = '';
  SummeryDate='';
  key: string = 'Name';
  reverse: boolean = true;
  errorFound: boolean;
  filter:string='';
  page:number=1;
  exportList:any=[];
  ListUsers:any=[];
  UserId:string='';
  UserIdCook: string;
  SelectedUserId:string;
  sortingColumn:string="";
  dateFrom ='';
  dateTo='';
  CDate:string;
  monthNames = [
    "Jan", "Feb", "Mar",
    "Apr", "May", "Jun", "Jul",
    "Aug", "Sep", "Oct",
    "Nov", "Dec"
  ];
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
    const dt = new Date();
    this.UserIdCook = this.objCook.get('UID');    
    this.dateFrom= this.objCook.get('CurrentDate');
    this.CDate = dt.getDate() + "/" + this.monthNames[dt.getMonth()] + "/" + dt.getFullYear();
    document.getElementsByClassName('ngx-datepicker-container');
    this.getActivityLog(); 
    this.GetUsers();
  }
  GetUsers() {
    this.objDbServ.getMenus({UserID: this.UserIdCook}).subscribe(
      (resp: Response) => {
        this.ListUsers=JSON.parse(resp.json()).Table2
      },
      (error) => {alert("Something went wrong.");
       this.objDbServ.ShowLoaders.emit(false);
      }
    )
  }
  OnDateChnageFrom(val){
    const dt = new Date(val);
     this.SummeryDate = dt.getDate() + "/" + this.monthNames[dt.getMonth()] + "/" + dt.getFullYear();
      this.dateFrom = dt.getDate() + "/" + this.monthNames[dt.getMonth()] + "/" + dt.getFullYear();
      this.page=1;
      setTimeout(() => {
        this.getActivityLog();
      });
  }
  OnUserChange(value) {
    this.UserId = value;
    this.getActivityLog();
  }
  getActivityLog(){
    this.errorFound = true;
      this.objDbServ.ShowLoaders.emit(true);
      this.objDbServ.CommonGetData({Flag: 'HO_ActivityLog', Id: this.objCook.get('UID'), ActivityLog_date: this.dateFrom, UserId : this.UserId}).subscribe(
        (resp: any) => {
          this.ActivityLogData = JSON.parse(resp.json()).Table;
          this.objDbServ.ShowLoaders.emit(false);
        },
        (error) =>{alert('Something went wrong.');
        this.objDbServ.ShowLoaders.emit(false);
      }
      )
  }
  sortCol(key:string){
    this.sortingColumn = key;
    this.key = key;
    this.reverse = !this.reverse;
  }
 exportFile() {
    this.exportList = [];
    if(this.ActivityLogData.length > 0)
    {
      this.ActivityLogData.forEach((element,i)=>{
        this.exportList.push({'SrNo':i+1,'Name':element.Name,'Action':element.Action,'StationName':element.StationName,'Menu':element.Menu,'Details':element.Details,'LDateTime':element.LDateTime })
      })
      var head = ['Sr. No.', 'User', 'Action','Station Name','Menu','Details','Date & Time'];  
      var filename = 'ActivityLog_DSA_'+this.CDate;
      new ngxCsv(this.exportList, filename, {headers: (head)});
  }
  else{
    alert('No Data available to export.!');
  }
}
}
