import { Component, OnInit } from '@angular/core';
import { dbService } from '../../Service/db.service';
import { DatepickerOptions } from 'ng2-datepicker';
import * as enLocale from 'date-fns/locale/en';
import { Response } from '@angular/http';
import { CookieService } from 'ngx-cookie-service';
import { ngxCsv } from 'ngx-csv/ngx-csv';
declare var $:any;
@Component({
  selector: 'app-jump-report-system',
  templateUrl: './jump-report-system.component.html',
  styleUrls: ['./jump-report-system.component.css']
})
export class JumpReportSystemComponent implements OnInit {
  JumpReadingData:any=[];
  Dashdate='';
  selectedStation:string='';
  DateFrom:string;
  DateTo:string;
  JumpDate:string;
  Status:string;
  Id:string;
  filter:string='';
  sortingColumn:string="";
  key: string = 'Name';
  reverse: boolean = true;
  DepartmentCode:string= this.objCook.get('DepartmentCode');
  LoginStationId:string= this.objCook.get('stationId');
  UserId:string= this.objCook.get('UID');
  ApprovedByIntrument:number=0
  ApprovedByStation:number=0
  ApprovedByONM:number=0
  errorFound: boolean;
  Action:string='';
  Remark:string='';
  TotalJump:number=0.00;
  StationId:string='';
  flag:string='';
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
 options:DatepickerOptions = {
  minYear: 2018,
  locale: enLocale,
  displayFormat: 'DD-MMM-YYYY',
  maxDate:new Date(Date.now())
 };
  ngOnInit() {
    this.DateFrom = this.objCook.get('CurrentDate');
    this.DateTo = this.objCook.get('CurrentDate');
    const dt = new Date();
     setTimeout(() => {
      this.getJumpReadingData();
    });
  }
  getJumpReadingData() {
    this.objDbServ.getJumpReadingData({Flag: 'JumpReadingSystemDataByRole', ReportFlag: this.DepartmentCode, ActivityLog_date:this.DateFrom, CDashdate:this.DateTo, Id:this.UserId}).subscribe(
      (resp: any) => {
        this.JumpReadingData=JSON.parse(resp.json()).Table
      },
      (error) => {alert("Something went wrong.");
       this.objDbServ.ShowLoaders.emit(false);
      }
    )
  }
  OnDateChnageFrom(val){
    const dt = new Date(val);
    this.DateFrom= dt.getDate() + "/" + this.monthNames[dt.getMonth()] + "/" + dt.getFullYear();
    this.getJumpReadingData();
 }
 OnDateChnageTo(val){
  const dt = new Date(val);
  this.DateTo= dt.getDate() + "/" + this.monthNames[dt.getMonth()] + "/" + dt.getFullYear();
  this.getJumpReadingData();
}
 GetRowdata(itm){
   this.Id=itm.ID,
    this.StationId= itm.StationId,
    this.JumpDate=itm.ApprovedDate,
    this.Remark=this.Remark,
    this.TotalJump=this.TotalJump
 }
  InsertRemarkByInstrumental(itm) {
    var Json = {
      Id : this.Id,
      SelectedDate : itm.ApprovedDate,
      StationId: this.StationId,
      DepartmentCode:this.DepartmentCode,
      Remark:this.Remark,
      Jump:this.TotalJump,
      LoginId:this.UserId
    };
    this.objDbServ.ShowLoaders.emit(true);
    this.objDbServ.InsertRemarkByInstrumental(Json).subscribe(
      (resp: Response) => {
        const data = JSON.parse(resp.json());
        alert(data.Table[0].Mesage);
        this.objDbServ.ShowLoaders.emit(false);
        $('.modal').modal('hide');
        this.JumpReadingData();
      },
      (error) => {alert("Something went wrong.");
       this.objDbServ.ShowLoaders.emit(false);
      }
    )
  }
  UpdateJumpReadingStatusByRole(status:string, itm) {
    this.Action=status;
    this.ApprovedByStation = itm.ApprovedByStation;
    this.ApprovedByONM=itm.IsApprovedByONM;
    var Json = {
      Id : itm.ID,
      SelectedDate : itm.ApprovedDate,
      StationId: itm.StationId,
      DepartmentCode:this.DepartmentCode,
      status: (status=='A') ? 1 : 2,
      Remark:this.Remark,
      Jump:this.TotalJump,
      LoginId:this.UserId,
      ApprovedByStation : itm.ApprovedByStation,
      ApprovedByONM: itm.IsApprovedByONM
    };
    this.errorFound = true;
    if(this.ValidateJRS()) {
      this.objDbServ.ShowLoaders.emit(true);
      this.objDbServ.UpdateJumpReadingStatusByRole(Json).subscribe(
        (resp: Response) => {
          const data = JSON.parse(resp.json());
          alert(data.Table[0].Mesage);
          if(this.DepartmentCode=='SO' && status=='A') {
            if(confirm("Do You want download jump certificate.?")) {
              this.GenerateJumpCertificate(itm.ApprovedDate);
            }
          }
          this.getJumpReadingData();
          this.objDbServ.ShowLoaders.emit(false); 
        },
        (error) => {alert("Something went wrong.");
        this.objDbServ.ShowLoaders.emit(false);
        }
      )
    }
  }
  GenerateJumpCertificate(ApprovedDate:string) {
    this.objDbServ.JumpReadingCertificate({Flag: 'getJumPReadingById',  CDashdate:ApprovedDate, Id:this.Id, Status:this.StationId}).subscribe(
      (resp: Response) => {
        const data = JSON.parse(resp.json());
        if(data) {
          var PdfUrl:string="";
          PdfUrl = this.objDbServ.apiUrl.substring(0,this.objDbServ.apiUrl.length-4)+JSON.parse(resp.json());
          const FileSaver = require('file-saver');
          FileSaver.saveAs(PdfUrl);
        }
      },
      (error) => {alert("Something went wrong.");
       this.objDbServ.ShowLoaders.emit(false);
      }
    )
  }
  ValidateJRS(){ 
     if(this.DepartmentCode == 'CO') {
       if(this.ApprovedByStation==0 && (this.Action=='A' || this.Action=='R')) {
          alert('ControlRoom cant approve/reject jump record before Station.');
          this.errorFound = false;
       }
       if(this.ApprovedByStation==2 &&  this.Action=='A') {
        alert('Record cant approved, As jump record rejected by Station.');
        this.errorFound = false;
      }
    }
    else if(this.DepartmentCode == 'MO'){
        if((this.ApprovedByONM==0 || this.ApprovedByONM==2) && (this.Action=='A' || this.Action=='R')) {
          alert('Marketing officer cant approve/reject jump record before ControlRoom.');
          this.errorFound = false;
      }
    }
    return this.errorFound;
  } 
  sortCol(key:string){
    this.sortingColumn = key;
    this.key = key;
    this.reverse = !this.reverse;
  }
}
