import { Component, OnInit } from '@angular/core';
import { dbService } from '../../Service/db.service';
import { CookieService } from 'ngx-cookie-service';
import { DatepickerOptions } from 'ng2-datepicker';
import * as enLocale from 'date-fns/locale/en';
import { window } from 'rxjs/operator/window';
import { isNullOrUndefined } from 'util';
import { ColdObservable } from 'rxjs/testing/ColdObservable';
declare var $:any;
declare var require: any
@Component({
  selector: 'app-dsa-station-summary2',
  templateUrl: './dsa-station-summary2.component.html',
  styleUrls: ['./dsa-station-summary2.component.css']
})
export class DsaStationSummary2Component implements OnInit {
  DispenserTableRes:any = [];
  stationReportData:any = [];
  DispensarTable1:any = [];
  DispensarTable2:any = [];
  DispensarTable3:any = [];
  DispensarTable4:any = [];
  DispensarTable5:any = [];
  DispensarTable6:any = [];
  enterOtpfields:boolean=false;
  StationList:any[];
  StationListTmp:any[];
  DataSalesTable:any = [];
  DataTable3:any = [];
  LoginId:string = this.objCook.get('LoginCode');
  StationCode:string = this.objCook.get('stationCode');
  DepartmentCode:string= this.objCook.get('DepartmentCode');
  ReportFlag: string = this.objCook.get('DepartmentCode');
  CurrentDate:string= this.objCook.get('CurrentDate');
  stationName:string="";
  selectedStation=0;
  SummeryDate:any;
  SummeryDateTo:any;
  glovalJson:any = JSON.parse(sessionStorage.getItem('globalDetail'));
  detailsStation:{StationId:string,SummeryDate:any,UserId:string};
  FinalTotal:any = 0;
  submitFile : File = null;
  submitButton:boolean = true;
  submitButtonBySOP:boolean = true;
  FileName:string="";
  imgDisplay:boolean = false;
  imgURL:string = "";
  Submitbtn:string='';
  submittedflag:boolean = false;
  CdateTime:any= new Date();
  SubmittedBySOFlaglocal:boolean = false;
  enteredotp:string = "";
  validotp:string="";
  popupDate:string="";
  successMessage:boolean = false;
  LocalLockDate:string="";
  SelectedStationCode:string='';
  fiterBox:boolean = false;
  filterBoxFlag:number = 0;
  stCodeMy:"";
  CDate:string;
  selectCompany: string;
  CompanyList: any[];
  selectRegion: string="0";
  UserId: string = this.objCook.get('UID');
  date: Date;
  options:DatepickerOptions = {
    minYear: 2018,
    locale: enLocale,
    displayFormat: 'DD-MMM-YYYY',
    maxDate:new Date(this.CurrentDate)
  };
  monthNames = [
    "Jan", "Feb", "Mar",
    "Apr", "May", "Jun", "Jul",
    "Aug", "Sep", "Oct",
    "Nov", "Dec"
  ];
  constructor(private objDbServ: dbService, private objCook: CookieService) {
    this.objDbServ.HeaderDisplay.emit(true);
    this.objDbServ.LeftMenu.emit(true);
    this.objDbServ.SubmittedBySOFlag.subscribe(value => {
      this.SubmittedBySOFlaglocal = value;
    })
    this.objDbServ.lockUnlock.subscribe(value => {
      this.submittedflag = value;
    })
  }
  ngOnInit() {
    this.objDbServ.StationDetails.subscribe(
      (test: {StationId:string,SummeryDate:string,UserId:string}) => 
      {
        this.detailsStation =test;
      }
    );
    this.SummeryDate = this.objCook.get('CurrentDate');
    this.SummeryDateTo = this.objCook.get('CurrentDate');
    if(this.DepartmentCode =='SOP')
    {
       this.Submitbtn = 'Final Submit'
    }
      else
      {
       this.Submitbtn = 'Submit'
      }
    this.GetAllStations();
    this.CheckShiftSubmitData();
    this.GetCompany();
  }
  OnDateChnagefrom(val){
    this.submitButton = true;
    this.submitFile = null;
    const dt = new Date(val);     
    this.SummeryDate= dt.getDate() + "-" + this.monthNames[dt.getMonth()] + "-" + dt.getFullYear();
    if(this.selectedStation != 0)
    {
      this.GetReadingbyShift(this.selectedStation);
    }
    this.objDbServ.LockDate.subscribe(value => 
      this.LocalLockDate = value
    );
    if(this.LocalLockDate == this.SummeryDate)
      this.submittedflag = true;
   else
      this.submittedflag = false;
  }
 OnDateChnageTo(val){  
  this.submitButton = true;
  this.submitFile = null;
  const dt = new Date(val);     
  this.SummeryDateTo = dt.getDate() + "-" + this.monthNames[dt.getMonth()] + "-" + dt.getFullYear();
  if(this.selectedStation != 0) {
    this.GetReadingbyShift(this.selectedStation);
  }
  this.objDbServ.LockDate.subscribe(value => 
    this.LocalLockDate = value
  );
  if(this.LocalLockDate == this.SummeryDate)
    this.submittedflag = true;
 else
    this.submittedflag = false;
 }
 GetReadingbyShift(Id){
    const obj = {
      StationId:Id,
      EntryDateFrom:this.SummeryDate,
      EntryDateTo:this.SummeryDateTo
    };
    this.objDbServ.ShowLoaders.emit(true);
    this.objDbServ.getSummaryHOForAdmin(obj).subscribe(
      (resp: any) => {
        this.DispenserTableRes = JSON.parse(resp.json());
        this.DispensarTable3 = JSON.parse(resp.json()).Table;
        this.DispensarTable5 = JSON.parse(resp.json()).Table1;
        this.stationName = "";
        this.FetchDSASubmittedData();
        this.objDbServ.ShowLoaders.emit(false);
      },
      (error) => {alert("Something went wrong.");this.objDbServ.ShowLoaders.emit(false);}
    )
  }
 checkPendingEntry() {
    this.objDbServ.CommonGetData({Id: Number(this.objCook.get('stationId')), Status: this.SummeryDate, Flag: 'IsFinalEntry'}).subscribe(
      (resp: any) => {
        const data = JSON.parse(resp.json());
        if(data.Table[0].Msg=='Allow'){
          this.DispenserSummarySubmitted();
        }
        else{
          alert(data.Table[0].Msg);
        }
      },
      (error) =>{
        alert('Something went wrong.');
      }
    )
  }
  DispenserSummarySubmitted() {
    const obj = {
      StationId:Number(this.objCook.get('stationId')),
      StationCode: this.objCook.get('stationCode'), 
      CDate:this.SummeryDate,
      IsStationSubmitted: 1,
      Flag : this.DepartmentCode,
      IsSubmittedBySOP : this.DepartmentCode == 'SOP' ? 1 : 0,
      SOPId : this.DepartmentCode == 'SOP' ? this.objCook.get('UID') : 0 
    };
    var frmData = new FormData();
    frmData.append("SubmissionDetails", JSON.stringify(obj));
    if(this.submitFile != undefined) {
      if(this.validation()){
        return false;
      }
      frmData.append('file', this.submitFile, this.submitFile.name);
    }
    this.objDbServ.DispenserSummarySubmitted(frmData).subscribe(
      (resp: any) => {
        const data = JSON.parse(resp.json()).Table[0].Msg;
        this.FetchDSASubmittedData();
        alert(data);
        this.objDbServ.ShowLoaders.emit(false);
      },
      (error) => {
        alert("Something went wrong.");
        this.objDbServ.ShowLoaders.emit(false);
    }
    )
  }
  ExportToPdf(){
    const obj = {
      StationId:this.selectedStation,
      EntryDateFrom:this.SummeryDate,
      EntryDateTo:this.SummeryDateTo,
      StationCode : this.StationCode
    };
    this.objDbServ.DispenserSummaryPDF_ForAdmin(obj).subscribe(
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
  uploadImage(file: FileList, event: any) {
    this.submitFile = file.item(0);
  }
  FetchDSASubmittedData() {
    var objson= {
      StationId : Number(this.objCook.get('stationId')), 
      StationCode : this.objCook.get('stationCode'),
      CDate: this.SummeryDate,
      Flag : this.DepartmentCode,
      SOPId : this.DepartmentCode == 'SOP' ? this.objCook.get('UID') : 0 
    };
    this.objDbServ.FetchDSASubmittedData(objson).subscribe(
      (resp: any) => {
        var arr:any=[];
        const data1 = JSON.parse(resp.json());
        if(data1.Table1.length > 0 || data1.Table2.length > 0) {
            if(JSON.parse(resp.json()).Table1[0].FileName != '' || isNullOrUndefined(JSON.parse(resp.json()).Table1[0].FileName)==false) {
              this.FileName = JSON.parse(resp.json()).Table1[0].FileName;
              this.imgDisplay = true;
              this.imgURL = this.objDbServ.apiUrl.substring(0,this.objDbServ.apiUrl.length-4)+"Images/"+this.FileName;
            }
            else {
              this.FileName = '';
              this.imgDisplay = false;
            }
            if(JSON.parse(resp.json()).Table[0].IsStationSubmitted == 1 || JSON.parse(resp.json()).Table[0].IsSubmittedBySOP == 1)
              this.submitButton = false;
            else
              this.submitButton = true;             
       }
      },
      (error) =>{
        alert('Something went wrong.');
      }
    )
  }
  GetAllStations(){
        this.objDbServ.CommonGetData({Id: 0, CompanyId: 0,  ReportFlag: 'HO', Flag: 'GetAllStationsForDSA', Status:'',UserId:1}).subscribe(
          (resp: any) => {
            this.StationList = JSON.parse(resp.json()).Table;
            this.stCodeMy = this.StationList[0].StationName;
            this.GetReadingbyShift(this.StationList[0].StationId);
          },
          (error) =>{
            alert('Something went wrong.');
          }
        )
  }
  filterBoxShow(itm) {
    if(this.filterBoxFlag == 0) {
      this.fiterBox = true;
      this.filterBoxFlag = 1;
    }   
    else {
      this.fiterBox = false;
      this.filterBoxFlag = 0;
      this.stCodeMy = itm.StationName;
      this.selectedStation=itm.StationId;
      this.GetReadingbyShift(this.selectedStation);
      this.StationCode = itm.StationCode
    }
  }
  validation(){
    var errorFlag:boolean = false;
    if(this.submitFile != undefined){
    const fileName = (',' + this.submitFile.name.split('.')[1] + ',').toLowerCase();
    if(',png,jpeg,jpg,'.indexOf(fileName) == -1){
      alert('Please select the valid file (png, jpeg, jpg)');
      errorFlag = true;
    }
    else if(this.submitFile.size > 2097152){
      alert('Please select the file under size limit (2 MB)');
      errorFlag = true;
    }
  }
    return errorFlag;
  }
  CheckShiftSubmitData() {
    this.objDbServ.CommonGetData({Id: this.selectedStation, Flag: 'IsShiftEntryComplete', Status:this.CdateTime, ReportFlag: this.DepartmentCode}).subscribe(
      (resp: any) => {
        this.objDbServ.IsShiftIdPending=JSON.parse(resp.json()).Table2[0].IsShiftIdPending;
      },
      (error) =>{
        alert('Something went wrong.');
      }
    )
  }
  requestOTP() {
    this.enterOtpfields = true;
    var obj = {
      StationCode: this.StationCode,
      CDate : this.SummeryDate
    };
    this.objDbServ.AuthenticationMail(obj).subscribe(
      (resp: any) => {
        var arr:any=[];
        const data1 = JSON.parse(resp.json());
        if(data1 != '') {
          arr = data1.Table;
          this.successMessage = true;
          this.validotp = arr[0].OTP;
       }
      },
      (error) =>{
        alert('Something went wrong.');
      }
    )
  }
  confirmOtp() {
    if(this.enteredotp == this.validotp) {
      var obj = {
        StationCode: this.StationCode,
        CDate : this.SummeryDate,
        IsStationSubmitted: 0
      }
      this.objDbServ.updateDSAFlag(obj).subscribe(
        (resp: any) => {
          var arr:any=[];
          const data1 = JSON.parse(resp.json());
          this.SubmittedBySOFlaglocal = false;
          location.reload();
          $('.modal').modal('hide');
        },
        (error) =>{
          alert('Something went wrong.');
        }
      )
    }
    else {
      alert('Please enter Valid OTP');
    }
  }
  requestPopup() {
     this.enteredotp = "";
     this.successMessage = false;
     this.enterOtpfields = false;
  }
  GetCompany() {
      this.objDbServ.CommonGetData({ Id: 0, Flag: 'CompanyByRegion', Status: '', RegionId: this.selectRegion }).subscribe(
        (resp: any) => {
          this.CompanyList = JSON.parse(resp.json()).Table;
        },
        (error) => {
          alert('Something went wrong.');
        }
      )
  }
  onRegionSelect(val, CompanyId: string) {
    this.selectCompany = CompanyId;
    if (this.selectCompany != "All") {
      this.objDbServ.CommonGetData({ Id: this.selectRegion, CompanyId: CompanyId, ReportFlag: this.ReportFlag, Flag: 'StationByCompanyIdForDSASummary', Status: '', UserId: this.UserId }).subscribe(
        (resp: any) => {
          this.StationList = JSON.parse(resp.json()).Table;
          this.stCodeMy = this.StationList[0].StationName;
          this.GetReadingbyShift(this.StationList[0].StationId);
          if (this.selectCompany == '' || isNullOrUndefined(this.selectCompany))
            this.GetCompany();
          else
            this.selectCompany = CompanyId;
        },
        (error) => {
          alert('Something went wrong.');
        }
      )
    }
    else if (this.selectCompany == "All" || this.selectCompany == "") {
      this.objDbServ.CommonGetData({ Id: this.selectRegion, CompanyId: CompanyId, ReportFlag: this.ReportFlag, Flag: 'StationByCompanyIdForDSASummary', Status: '', UserId: this.UserId }).subscribe(
        (resp: any) => {
          this.StationList = JSON.parse(resp.json()).Table;
          this.stCodeMy = this.StationList[0].StationName;
          this.GetReadingbyShift(this.StationList[0].StationId);
          if (this.selectCompany == '' || isNullOrUndefined(this.selectCompany))
            this.GetCompany();
          else
            this.selectCompany = CompanyId;
        },
        (error) => {
          alert('Something went wrong.');
        }
      )
    }
    else {
    }
  }
  onCompanySelect(val) {
    this.selectCompany = val;
    if (this.selectCompany.length > 0)
      this.onRegionSelect(this.selectRegion, this.selectCompany);
  }
}
