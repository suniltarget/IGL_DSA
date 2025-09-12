import { Component, OnInit } from '@angular/core';
import { dbService } from '../../Service/db.service';
import { CookieService } from 'ngx-cookie-service';
import { DatepickerOptions } from 'ng2-datepicker';
import * as enLocale from 'date-fns/locale/en';
import { window } from 'rxjs/operator/window';
import { isNullOrUndefined } from 'util';
declare var $:any;
declare var require: any
@Component({
  selector: 'app-dsa-summary',
  templateUrl: './dsa-summary.component.html',
  styleUrls: ['./dsa-summary.component.css']
})
export class DsaSummaryComponent implements OnInit {
  stationReportData:any = [];
  DispensarTable1:any = [];
  DispensarTable2:any = [];
  DispensarTable3:any = [];
  DispensarTable4:any = [];
  DispensarTable5:any = [];
  DispensarTable6:any = [];
  DispensarTable7:any = [];
  enterOtpfields:boolean=false;
  DataSalesTable:any = [];
  DataTable3:any = [];
  LoginId:string = this.objCook.get('LoginCode');
  StationCode:string = this.objCook.get('stationCode');
  DepartmentCode :string= this.objCook.get('DepartmentCode');
  glovalJson:any = JSON.parse(sessionStorage.getItem('globalDetail'));
  stationName:string="";
  selectedStation=0;
  SummeryDate:string;
  detailsStation:{StationId:string,SummeryDate:string,UserId:string};
  StationShift:{ShiftId:string,SubShiftId:string,ActiveTab:string};
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
  selectedShiftId:string='-1';
  selectedSubShiftId:string='';
  attchPop:boolean = false;
  attchPopFlag:number = 0;
  LocalLockDate:string='';
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
    this.objDbServ.ShiftDetails.subscribe(
      (test1: {ShiftId:string,SubShiftId:string,ActiveTab:string}) => 
      {
        this.StationShift =test1;
        this.selectedShiftId=this.StationShift.ShiftId;
        this.selectedSubShiftId=this.StationShift.SubShiftId;
        if(this.StationShift.ActiveTab=='Summary'){
          setTimeout(() => {
            this.GetReadingbyShift();
            this.CheckShiftSubmitData();
          });
        }
      }
    );
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
    if(this.DepartmentCode =='SOP')
       this.Submitbtn = 'Final Submit'
      else
       this.Submitbtn = 'Submit'
    this.GetReadingbyShift();
    this.CheckShiftSubmitData();
    this.objDbServ.LockDate.subscribe(value => 
      this.LocalLockDate = value
    );
  }
 OnDateChnagefrom(val){
    this.submitButton = true;
    this.submitFile = null;
    const dt = new Date(val);     
    this.SummeryDate= dt.getDate() + "-" + this.monthNames[dt.getMonth()] + "-" + dt.getFullYear();
    this.GetReadingbyShift();
    this.objDbServ.LockDate.subscribe(value => 
      this.LocalLockDate = value
    );
  if(this.LocalLockDate == this.detailsStation.SummeryDate)
    this.submittedflag = true;
  else
    this.submittedflag = false;
 }
  attchPopupShow() {
    if(this.attchPopFlag == 0){
      this.attchPop = true;
      this.attchPopFlag = 1;
    }
  }
  attchPopupClose() {
    if(this.attchPopFlag == 1) {
      this.attchPop = false;
      this.attchPopFlag = 0;
    }
  }
  GetReadingbyShift(){
    const obj = {
      StationId:Number(this.objCook.get('stationId')),
      EntryDate:this.detailsStation.SummeryDate
    };
    this.objDbServ.ShowLoaders.emit(true);
    this.objDbServ.getSummaryHO(obj).subscribe(
      (resp: any) => {
        this.DispensarTable3 = JSON.parse(resp.json()).Table2;
        this.DispensarTable4 = JSON.parse(resp.json()).Table3;
        this.DispensarTable5 = JSON.parse(resp.json()).Table4;
        this.DispensarTable6 = JSON.parse(resp.json()).Table5;
        this.DispensarTable7 = JSON.parse(resp.json()).Table6;
        this.stationName = isNullOrUndefined(this.DispensarTable3[0].StationName) ? '' : this.DispensarTable3[0].StationName;
        this.FetchDSASubmittedData();
        this.objDbServ.ShowLoaders.emit(false);
      },
      (error) => {alert("Something went wrong.");this.objDbServ.ShowLoaders.emit(false);}
    )
  }
  checkPendingEntry() {
    var obj ={
      Id: Number(this.objCook.get('stationId')),
      Status: this.detailsStation.SummeryDate,
      Flag: 'IsFinalEntry'
    }
    this.objDbServ.CommonGetData(obj).subscribe(
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
      CDate:this.detailsStation.SummeryDate,
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
      StationId:Number(this.objCook.get('stationId')),
      EntryDate:this.detailsStation.SummeryDate,
      StationCode:this.objCook.get('stationCode'),
      Action:"SO"
    };
    this.objDbServ.DispenserSummaryPDF(obj).subscribe(
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
      CDate: this.detailsStation.SummeryDate,
      Flag : this.DepartmentCode,
      SOPId : this.DepartmentCode == 'SOP' ? this.objCook.get('UID') : 0 
    };
    this.objDbServ.FetchDSASubmittedData(objson).subscribe(
      (resp: any) => {
        var arr:any=[];
        const data1 = JSON.parse(resp.json());
        try 
        {
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
      }
      catch{
        this.submitButton = true;
      }
      },
      (error) =>{
        alert('Something went wrong.');
      }
    )
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
      CDate : this.detailsStation.SummeryDate
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
        CDate : this.detailsStation.SummeryDate,
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
}
