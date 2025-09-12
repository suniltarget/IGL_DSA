import { Component, OnInit, ElementRef, ViewChild, EventEmitter } from '@angular/core';
import { dbService } from '../../Service/db.service';
import { Response } from '@angular/http';
import { CookieService } from 'ngx-cookie-service';
import { DatepickerOptions } from 'ng2-datepicker';
import * as enLocale from 'date-fns/locale/en';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import * as XLSX from 'xlsx';
import { DatePipe } from '@angular/common';
import { isNullOrUndefined } from 'util';
import { time } from 'console';
import { parse } from 'querystring';
import { convertToParamMap } from '@angular/router';
import { analyzeAndValidateNgModules } from '@angular/compiler';
declare var $: any;
@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css']
})
export class SummaryComponent implements OnInit {
  @ViewChild('customers') table: ElementRef;
  IsStatusGet: boolean = false;
  RegionList: any[];
  StationList: any[];
  Summary: any[];
  dispenserList: any[];
  MoStationList: any[];
  lowerDetLeft: any[];
  lowerDetCenter: any[];
  DisNonDicSmmry: any[];
  RateDetails: any[];
  selectedRegion = 0;
  selectedStation = 0;
  SummeryDate: any = this.objCook.get('CurrentDate');
  Cdate: string = this.objCook.get('CurrentDate');
  CdateTime = this.objCook.get('CurrentDateTime');
  MoUserId: string = '';
  LockUnlock: boolean;
  LockUnlockCaption: string = '';
  DepartmentCode: string = this.objCook.get('DepartmentCode');
  StationId: string = this.objCook.get('stationId');
  sideBarIsOpened = false;
  MySummaryDate = '';
  ForRate = '';
  ForDiscountedRate = '';
  stationName: string = "";
  CompanyName: string = '';
  submittedFlag: boolean = false;
  enterOtpfields: boolean = false;
  enteredotp: string = "";
  validotp: string = "";
  popupDate: string = "";
  successMessage: boolean = false;
  RegionName: string = "";
  currentStationName: string = "";
  SapCode: string = "";
  IsDropdownDisable: boolean = true;
  hoursLeft: number = 1;
  minutesLeft: number = 59;
  secondsLeft: number = 60;
  interval: any;
  CurrentTime: any;
  IsTimerStart: boolean = false;
  SkipedSeconds: any;
  IsShiftComplete: boolean = false;
  IsShiftIdComplete: number;
  CompleteShiftId: number;
  TestOnly: boolean = false;
  lockUnlockShiftId: string = '';
  lockUnlockDate: string = '';
  CurrentShiftId: string = '';
  StationSOPId: string = '';
  StationMOId: string = '';
  IsNotificationSent: boolean = false;
  NotificationType: string = '';
  ExistSOPShiftId: number = 0;
  ExistMOShiftId: number = 0;
  SummaryFlag: string = 'SummaryI';
  CompanyId: string = '';
  isButtonDisplay: boolean = false;
  date: string = this.objCook.get('CurrentDate');
  monthNames = [
    "Jan", "Feb", "Mar",
    "Apr", "May", "Jun", "Jul",
    "Aug", "Sep", "Oct",
    "Nov", "Dec"
  ];
  options: DatepickerOptions = {
    minYear: 2018,
    locale: enLocale,
    displayFormat: 'DD-MMM-YYYY',
    maxDate: new Date(this.SummeryDate)
  };
  constructor(private objDbServ: dbService, private objCook: CookieService, private dp: DatePipe) {
    this.objDbServ.MasterCompDisplay.emit(true);
    this.objDbServ.HeaderDisplay.emit(true);
    this.objDbServ.LeftMenu.emit(true);
  }
  toggleSideBar(shouldOpen: boolean) {
    this.GetStationCompany();
    this.objDbServ.CommonGetData({ Id: this.selectedStation, Status: this.SummeryDate, Flag: 'validatePopup' }).subscribe(
      (resp: any) => {
        const data = JSON.parse(resp.json());
        if (data.Table[0].Msg == 'Allow') {
          if (this.dispenserList.length != 0) {
            this.sideBarIsOpened = !this.sideBarIsOpened;
            if (this.sideBarIsOpened) {
              this.objDbServ.StationDetails.emit({
                StationId: this.selectedStation,
                SummeryDate: this.MySummaryDate,
                UserId: this.MoUserId
              });
              this.objDbServ.ShiftDetails.emit({
                ShiftId: '-1',
                SubShiftId: '-1',
                ActiveTab: "Dispenser"
              });
            }
          }
          else {
            alert('No Dispenser Available');
          }
        }
        else {
          alert(data.Table[0].Msg);
        }
      },
      (error) => {
        alert('Something went wrong.');
      }
    )
  }
  GetStationCompany() {
    this.objDbServ.GetStationCompany({ Flag: 'CompanyByStation', Id: this.selectedStation, Status: 1 }).subscribe(
      (resp: Response) => {
        this.CompanyName = JSON.parse(resp.json()).Table[0].CompanyName;
        this.CompanyId = JSON.parse(resp.json()).Table[0].CompanyId;
        this.CheckCompany();
      },
      (error) => {
        alert("Something went wrong.");
        this.objDbServ.ShowLoaders.emit(false);
      }
    )
  }
  CheckCompany() {
    if (this.CompanyName == 'DTC' ||  this.CompanyName == 'IOCL' || this.CompanyName == 'BPCL' || this.CompanyName == 'HPCL') {
      this.objDbServ.IsCompanyValid.emit(true);
    }
    else {
      this.objDbServ.IsCompanyValid.emit(false);
    }
    if (this.CompanyId == '1'  ||
      this.CompanyId == '5' || this.CompanyId == '6' || this.CompanyId == '8' || this.CompanyId == '9') {
      this.isButtonDisplay = false;
    }
    else {
      this.isButtonDisplay = true;
    }
  }
  OpenPopup() {
  }
  onSelectLock(e) {
    const actionToTake = confirm("Do you want to change the status?")
    if (actionToTake) {
      if (this.LockUnlock)
        this.LockUnlockCaption = 'Unlocked';
      else
        this.LockUnlockCaption = 'Locked';
    }
    else {
      e.target.checked = !e.target.checked;
    }
  }
  ngOnInit() {
    var now = new Date();
    if (this.DepartmentCode == 'HO' || this.DepartmentCode == 'CO' || this.DepartmentCode == 'MO')
      this.IsDropdownDisable = false
    else
      this.IsDropdownDisable = true
    if (JSON.parse(sessionStorage.getItem("globalDetail"))[0] == undefined) {
      this.stationName = JSON.parse(sessionStorage.getItem("globalDetail")).Name;
    }
    else {
      this.stationName = JSON.parse(sessionStorage.getItem("globalDetail"))[0].UserName;
    }
    setTimeout(() => {
      var now = new Date();
      this.GetBasicSummerData();
      this.getSummaryHO();
    });
    this.CheckShiftSubmitData();
    this.objDbServ.DispencerPopup.subscribe(
      (visibility: boolean) => {
        this.sideBarIsOpened = visibility;
        setTimeout(() => {
          this.getSummaryHO();
        });
      }
    );
    this.objDbServ.lockUnlockSOP.subscribe(value => {
    })
    this.MoUserId = this.objCook.get('UID');
    this.backgrounddisble()
    this.objDbServ.TestVar.subscribe(value => {
      if (value != "ABC" && this.IsTimerStart == false) {
        this.checkforTime();
      }
    })
    this.selectedStation = Number(this.objCook.get('stationId'));
    this.GetStationCompany();
  }
  checkforTime() {
    var ShiftTime = "00:00:00";
    var date = new Date().toLocaleDateString();
    var now = new Date();
    var dt1 = new Date(date);
    var dt2;
    var ampm = now.getHours() >= 12 ? 'PM' : 'AM';
    var H, M, S;
    var TimeA = H + ':' + M + ':' + S;
    var stime = this.dp.transform(now.toDateString(), 'yyyy/MM/dd') + ' ' + this.objDbServ.CurrentTime;
    var Servertime = new Date(Date.parse(stime));
    var a = this.dp.transform(now.toDateString(), 'yyyy/MM/dd') + ' ' + "06:00 AM";
    var AStart = new Date(Date.parse(this.dp.transform(now.toDateString(), 'yyyy/MM/dd') + ' ' + "06:30 PM"));
    var AEnd = new Date(Date.parse(this.dp.transform(now.toDateString(), 'yyyy/MM/dd') + ' ' + "08:30 PM"));
    var BStart = new Date(Date.parse(this.dp.transform(now.toDateString(), 'yyyy/MM/dd') + ' ' + "02:30 AM"));
    var BEnd = new Date(Date.parse(this.dp.transform(now.toDateString(), 'yyyy/MM/dd') + ' ' + "04:29 AM"));
    var CStart = new Date(Date.parse(this.dp.transform(now.toDateString(), 'yyyy/MM/dd') + ' ' + "04:30 AM"));
    var CEnd = new Date(Date.parse(this.dp.transform(now.toDateString(), 'yyyy/MM/dd') + ' ' + "06:30 AM"));
    var DStart = new Date(Date.parse(this.dp.transform(now.toDateString(), 'yyyy/MM/dd') + ' ' + "10:30 AM"));
    var DEnd = new Date(Date.parse(this.dp.transform(now.toDateString(), 'yyyy/MM/dd') + ' ' + "12:30 AM"));
    if (Servertime >= AStart && Servertime <= AEnd) {
      H = Number('20'), M = Number('30'), S = Number('00');
      TimeA = H + ':' + M + ':' + S;
    }
    else if (Servertime >= BStart && Servertime <= BEnd) {
      H = Number('04'), M = Number('29'), S = Number('00');
      TimeA = H + ':' + M + ':' + S;
    }
    else if (Servertime >= CStart && Servertime <= CEnd) {
      H = Number('06'), M = Number('30'), S = Number('00');
      TimeA = H + ':' + M + ':' + S;
    }
    else if (Servertime >= DStart && Servertime <= DEnd) {
      H = Number('12'), M = Number('30'), S = Number('00');
      TimeA = H + ':' + M + ':' + S;
    }
    dt2 = new Date(date + ' ' + TimeA);
    if (isNullOrUndefined(dt2) == false) {
      var diff = (dt2.getTime() - now.getTime()) / 1000;
      diff /= 60;
      diff = (diff * 60);
    }
    else
      diff = 0;
    var Hrs = Math.floor(diff / 3600);
    diff %= 3600;
    var Mns = Math.floor(diff / 60);
    var Sec = Math.floor(diff % 60);
    var BTimeStart = new Date(Date.parse(this.dp.transform(now.toDateString(), 'yyyy/MM/dd') + ' ' + "08:30 PM"));
    var BTimeEnd = new Date(Date.parse(this.dp.transform(now.toDateString(), 'yyyy/MM/dd') + ' ' + "02:29 AM"));
    var DTimeStart = new Date(Date.parse(this.dp.transform(now.toDateString(), 'yyyy/MM/dd') + ' ' + "04:29 AM"));
    var DTimeEnd = new Date(Date.parse(this.dp.transform(now.toDateString(), 'yyyy/MM/dd') + ' ' + "10:30 AM"));
    if (this.DepartmentCode == 'SO') {
      if ((Servertime >= AStart && Servertime <= AEnd) && this.IsTimerStart == false) {
        this.IsTimerStart = true;
        this.startTimer(Hrs, Mns, Sec);
      }
      else if ((Servertime >= BTimeStart && Servertime <= BTimeEnd) && this.IsTimerStart == false) {
        this.IsTimerStart = true;
        this.objDbServ.IsTimeOver.next(true);
        this.objDbServ.lockUnlock.emit(true);
        this.objDbServ.lockUnlockDispenserEntry.next(true);
      }
      else if ((Servertime >= BStart && Servertime <= BEnd) && this.IsTimerStart == false) {
        this.IsTimerStart = true;
        this.startTimer(Hrs, Mns, Sec);
      }
      else if ((Servertime >= DTimeStart && Servertime <= DTimeEnd) && this.IsTimerStart == false) {
        this.IsTimerStart = true;
        this.objDbServ.IsTimeOver.next(true);
        this.objDbServ.lockUnlock.emit(true);
        this.objDbServ.lockUnlockDispenserEntry.next(true);
      }
      else if ((Servertime >= DStart && Servertime <= DEnd) && this.IsTimerStart == false && (this.DepartmentCode == 'SO' || this.DepartmentCode == 'SOP')) {
        this.IsTimerStart = true;
        this.startTimer(Hrs, Mns, Sec);
      }
      else {
        this.IsTimerStart = false;
        this.objDbServ.IsTimeOver.next(false);
        this.objDbServ.lockUnlockDispenserEntry.next(false);
      }
    }
    else if (this.DepartmentCode == 'SOP') {
      this.objDbServ.IsShiftIdPending.subscribe(value => {
        this.IsShiftIdComplete = value;
      });
      if (this.IsShiftIdComplete == 0 && !isNullOrUndefined(this.objDbServ.IsShiftIdPending)) {
        if ((Servertime >= DStart && Servertime <= DEnd) && this.IsTimerStart == false) {
          this.IsTimerStart = true;
          this.startTimer(Hrs, Mns, Sec);
        }
        else
          this.IsTimerStart = false;
      }
      if (Servertime > DStart && this.IsShiftIdComplete == 0 && !isNullOrUndefined(this.objDbServ.IsShiftIdPending)) {
        this.objDbServ.IsTimeOver.next(true);
        var v = true;
        if (v == true) {
          this.objDbServ.SubmittedBySOFlag.emit(true);
        }
        else {
          this.objDbServ.SubmittedBySOFlag.emit(false);
        }
      }
      else {
        this.objDbServ.IsTimeOver.next(false);
        this.objDbServ.SubmittedBySOFlag.emit(false);
      }
    }
  }
  startTimer(Hrs: any, Mns: any, Sec: any) {
    this.hoursLeft = Hrs;
    this.minutesLeft = Mns;
    this.secondsLeft = Sec;
    this.interval = setInterval(() => {
      if (this.secondsLeft > 0) {
        this.secondsLeft--;
      }
      else if (this.secondsLeft == 0 && this.minutesLeft != 0) {
        this.minutesLeft--;
        this.secondsLeft = 60;
      }
      else if (this.minutesLeft == 0 && this.secondsLeft == 0 && this.hoursLeft != 0) {
        this.hoursLeft--;
        this.minutesLeft = 59;
        this.secondsLeft = 60;
      }
      else if (this.minutesLeft == 0 && this.hoursLeft == 0 && this.secondsLeft == 0) {
        clearInterval(this.interval);
      }
      else {
        this.secondsLeft = 60;
      }
    }, 1000)
  }
  backgrounddisble() {
    $(function () {
    });
  }
  GetBasicSummerData() {
    this.objDbServ.CommonGetData({ Id: this.MoUserId, Flag: 'SummeryFlag' }).subscribe(
      (resp: Response) => {
        this.Cdate = JSON.parse(resp.json()).Table2[0].Cdate;
        this.DepartmentCode = JSON.parse(resp.json()).Table2[0].DepartmentCode;
        this.SummeryDate = this.Cdate;
        this.RegionList = JSON.parse(resp.json()).Table;
        this.RegionName = this.RegionList[0].RegionName;
        this.selectedRegion = JSON.parse(resp.json()).Table[0].RegionId;
        this.StationList = JSON.parse(resp.json()).Table1;
        this.currentStationName = this.StationList[0].StationName;
        this.SapCode = this.StationList[0].SapCode;
        this.selectedStation = JSON.parse(resp.json()).Table1[0].StationId;
        setTimeout(() => {
          this.getSummaryHO();
        });
      },
      (error) => {
        alert('Something went wrong.');
      }
    )
  }
  CheckShiftSubmitData() {
    this.objDbServ.CommonGetData({ Id: this.selectedStation, Flag: 'IsShiftEntryComplete', Status: this.CdateTime, ReportFlag: this.DepartmentCode }).subscribe(
      (resp: Response) => {
        var val = JSON.parse(resp.json()).Table[0].IsShiftIdPending;
        this.IsShiftIdComplete = val;
        this.objDbServ.IsShiftIdPending.emit(val);
        this.IsStatusGet = true;
        if (this.IsNotificationSent == false) {
          this.GetStationMO_SOP();
        }
      },
      (error) => {
        alert('Something went wrong.');
      }
    )
  }
  OnDateChnage(val) {
    const dt = new Date(val);
    this.SummeryDate = dt.getDate() + "/" + this.monthNames[dt.getMonth()] + "/" + dt.getFullYear();
    this.CheckShiftSubmitData();
    setTimeout(() => {
      this.getSummaryHO();
    });
  }
  getSummaryHO() {
    this.sideBarIsOpened = false;
    this.objDbServ.ShowLoaders.emit(true);
    this.objDbServ.getSummaryHO({ StationId: this.selectedStation, EntryDate: this.SummeryDate }).subscribe(
      (resp: Response) => {
        this.objDbServ.ShowLoaders.emit(false);
        this.dispenserList = JSON.parse(resp.json()).Table;
        this.Summary = JSON.parse(resp.json()).Table1;
        this.FetchDSASubmittedData();
        if (this.LockUnlock)
          this.LockUnlockCaption = 'Unlocked';
        else
          this.LockUnlockCaption = 'Locked';
        this.MySummaryDate = JSON.parse(resp.json()).Table2[0].SummaryDate
        this.lowerDetLeft = JSON.parse(resp.json()).Table3;
        this.ForRate = JSON.parse(resp.json()).Table2[0].Rate;
        this.ForDiscountedRate = JSON.parse(resp.json()).Table2[0].DisountedRate;
        this.DisNonDicSmmry = JSON.parse(resp.json()).Table4;
        this.objDbServ.ShowLoaders.emit(false);
      },
      (error) => {
        alert('Something went wrong.');
        this.objDbServ.ShowLoaders.emit(false);
      }
    )
  }
  getReadingByDispName(DispName: string, SumRow: any[], DispSide: string) {
    for (let i = 0; i < Object.keys(SumRow).length; i++) {
      if (DispName == Object.keys(SumRow)[i].split('_##_')[0]) {
        if (DispSide == '_ArmA')
          return Object.values(SumRow)[i];
        else if (DispSide == '_ArmB')
          return Object.values(SumRow)[i + 1];
      }
    }
  }
  onRegionSelect() {
    this.objDbServ.CommonGetData({ Id: this.selectedRegion, Flag: 'StationByRegionId', Status: this.MoUserId, ReportFlag: this.DepartmentCode, UserId: this.MoUserId }).subscribe(
      (resp: Response) => {
        this.StationList = JSON.parse(resp.json()).Table;
        this.selectedStation = JSON.parse(resp.json()).Table[0].StationId;
        setTimeout(() => {
          this.getSummaryHO();
        });
      },
      (error) => {
        alert('Something went wrong.');
      }
    )
  }
  ExportFile() {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.table.nativeElement);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    var filename = "Summary_" + this.SummeryDate;
    XLSX.writeFile(wb, filename + '.xlsx');
  }
  onStationSelect() {
    setTimeout(() => {
      this.getSummaryHO();
    });
  }
  FetchDSASubmittedData() {
    var StationCode = JSON.parse(sessionStorage.getItem("globalDetail"))[0].StationCode;
    this.objDbServ.FetchDSASubmittedData({ StationId: this.selectedStation, CDate: this.SummeryDate, StationCode: StationCode }).subscribe(
      (resp: any) => {
        var arr: any = [];
        const data1 = JSON.parse(resp.json());
        if (data1 != '') {
          arr = data1.Table;
          this.popupDate = this.dp.transform(this.SummeryDate, 'dd-MMM-yyyy');
          if (arr[0].IsStationSubmitted == 1) {
            this.submittedFlag = true;
          }
          else {
            this.submittedFlag = false;
          }
        }
      },
      (error) => {
        alert('Something went wrong.');
      }
    )
  }
  CkeckLockUnlockShift() {
    var obj = {
      CDashdate: this.SummeryDate,
      Id: this.selectedStation,
      Flag: 'CheckLockUnlockShift'
    }
    this.objDbServ.CommonGetData(obj).subscribe(
      (resp: any) => {
        const data = JSON.parse(resp.json());
        if (data.length > 0) {
          this.lockUnlockDate = JSON.parse(resp.json()).Table[0].CDate;
          this.lockUnlockShiftId = JSON.parse(resp.json()).Table[0].ShiftId;
        }
      },
      (error) => {
        alert('Something went wrong.');
      }
    )
  }
  GetStationMO_SOP() {
    var obj = {
      Id: this.StationId,
      Flag: 'MO_SOPByStation',
      CDashdate: this.Cdate
    }
    this.objDbServ.CommonGetData(obj).subscribe(
      (resp: any) => {
        const data = (JSON.parse(resp.json()));
        if (data) {
          this.StationSOPId = JSON.parse(resp.json()).Table[0].SOPId;
          this.StationMOId = JSON.parse(resp.json()).Table[0].MOId;
          if (data.Table1.length > 0)
            this.ExistSOPShiftId = data.Table1[0].SOPShiftId;
          if (data.Table2.length > 0)
            this.ExistMOShiftId = data.Table2[0].MOShiftId;
          this.GetShiftIdByTime();
        }
      },
      (error) => {
        alert('Something went wrong.');
      }
    )
  }
  GetShiftIdByTime() {
    var cdate = new Date();
    var Servertime = new Date(Date.parse(this.dp.transform(cdate.toDateString(), 'yyyy/MM/dd') + ' ' + this.objDbServ.CurrentTime));
    var AStart = new Date(Date.parse(this.dp.transform(cdate.toDateString(), 'yyyy/MM/dd') + ' ' + "06:00 AM"));
    var AEnd = new Date(Date.parse(this.dp.transform(cdate.toDateString(), 'yyyy/MM/dd') + ' ' + "01:59 PM"));
    var BStart = new Date(Date.parse(this.dp.transform(cdate.toDateString(), 'yyyy/MM/dd') + ' ' + "02:00 PM"));
    var BEnd = new Date(Date.parse(this.dp.transform(cdate.toDateString(), 'yyyy/MM/dd') + ' ' + "09:59 PM"));
    var CStart = new Date(Date.parse(this.dp.transform(cdate.toDateString(), 'yyyy/MM/dd') + ' ' + "10:00 PM"));
    var CEnd = new Date(Date.parse(this.dp.transform(cdate.toDateString(), 'yyyy/MM/dd') + ' ' + "11:59 PM"));
    var DStart = new Date(Date.parse(this.dp.transform(cdate.toDateString(), 'yyyy/MM/dd') + ' ' + "12:00 AM"));
    var DEnd = new Date(Date.parse(this.dp.transform(cdate.toDateString(), 'yyyy/MM/dd') + ' ' + "05:59 AM"));
    var NOTTimeAShift = new Date(Date.parse(this.dp.transform(cdate.toDateString(), 'yyyy/MM/dd') + ' ' + "04:00 PM"));
    var NOTTimeBShift = new Date(Date.parse(this.dp.transform(cdate.toDateString(), 'yyyy/MM/dd') + ' ' + "12:00 AM"));
    var NOTTimeCShift = new Date(Date.parse(this.dp.transform(cdate.toDateString(), 'yyyy/MM/dd') + ' ' + "02:00 AM"));
    var NOTTimeDShift = new Date(Date.parse(this.dp.transform(cdate.toDateString(), 'yyyy/MM/dd') + ' ' + "08:00 AM"));
    var MONOTTimeAShift = new Date(Date.parse(this.dp.transform(cdate.toDateString(), 'yyyy/MM/dd') + ' ' + "06:00 PM"));
    var MONOTTimeBShift = new Date(Date.parse(this.dp.transform(cdate.toDateString(), 'yyyy/MM/dd') + ' ' + "02:00 AM"));
    var MONOTTimeCShift = new Date(Date.parse(this.dp.transform(cdate.toDateString(), 'yyyy/MM/dd') + ' ' + "04:00 AM"));
    var MONOTTimeDShift = new Date(Date.parse(this.dp.transform(cdate.toDateString(), 'yyyy/MM/dd') + ' ' + "10:00 AM"));
    if (Servertime >= AStart && Servertime <= AEnd) {
      this.objDbServ.lockUnlockShiftId.next(1);
    }
    else if (Servertime >= BStart && Servertime <= BEnd) {
      this.objDbServ.lockUnlockShiftId.next(2);
    }
    else if (Servertime >= CStart && Servertime <= CEnd) {
      this.objDbServ.lockUnlockShiftId.next(3);
    }
    else if (Servertime >= DStart && Servertime <= DEnd) {
      this.objDbServ.lockUnlockShiftId.next(4);
    }
    if (Servertime >= NOTTimeAShift && (this.IsShiftIdComplete == 0 || this.IsShiftIdComplete == 2) && this.ExistSOPShiftId == 0) {
      this.CurrentShiftId = '1';
      this.NotificationType = 'SOP';
      this.InsertSOP_OR_MONotification();
    }
    if (Servertime >= NOTTimeBShift && Servertime <= NOTTimeDShift) {
      if (Servertime >= NOTTimeBShift && (this.IsShiftIdComplete == 0 || this.IsShiftIdComplete == 2) && this.ExistSOPShiftId == 0) {
        this.CurrentShiftId = '2';
        this.NotificationType = 'SOP';
        this.InsertSOP_OR_MONotification();
      }
      else if (Servertime >= NOTTimeCShift && (this.IsShiftIdComplete == 0 || this.IsShiftIdComplete == 2) && this.ExistSOPShiftId == 0) {
        this.CurrentShiftId = '3';
        this.NotificationType = 'SOP';
        this.InsertSOP_OR_MONotification();
      }
      else if (Servertime >= NOTTimeDShift && (this.IsShiftIdComplete == 0 || this.IsShiftIdComplete == 2) && this.ExistSOPShiftId == 0) {
        this.CurrentShiftId = '4';
        this.NotificationType = 'SOP';
        this.InsertSOP_OR_MONotification();
      }
    }
    if (Servertime >= MONOTTimeAShift && (this.IsShiftIdComplete == 0 || this.IsShiftIdComplete == 2) && this.ExistMOShiftId == 0) {
      this.CurrentShiftId = '1';
      this.NotificationType = 'MO';
      this.InsertSOP_OR_MONotification();
    }
    if (Servertime >= NOTTimeBShift && Servertime <= MONOTTimeDShift) {
      if (Servertime >= MONOTTimeBShift && (this.IsShiftIdComplete == 0 || this.IsShiftIdComplete == 2) && this.ExistMOShiftId == 0) {
        this.CurrentShiftId = '2';
        this.NotificationType = 'MO';
        this.InsertSOP_OR_MONotification();
      }
      else if (Servertime >= MONOTTimeCShift && (this.IsShiftIdComplete == 0 || this.IsShiftIdComplete == 2) && this.ExistMOShiftId == 0) {
        this.CurrentShiftId = '3';
        this.NotificationType = 'MO';
        this.InsertSOP_OR_MONotification();
      }
      else if (Servertime >= MONOTTimeDShift && (this.IsShiftIdComplete == 0 || this.IsShiftIdComplete == 2) && this.ExistMOShiftId == 0) {
        this.CurrentShiftId = '4';
        this.NotificationType = 'MO';
        this.InsertSOP_OR_MONotification();
      }
    }
  }
  InsertSOP_OR_MONotification() {
    if (this.StationSOPId != "0" || this.StationMOId != "0") {
      var obj = {
        StationId: this.StationId,
        SOPId: (this.NotificationType == 'SOP') ? this.StationSOPId : 0,
        MOId: (this.NotificationType == 'MO') ? this.StationMOId : 0,
        SelectedDate: this.Cdate,
        ShiftId: this.CurrentShiftId,
        flag: this.NotificationType,
      }
      this.objDbServ.InsertSOPMONotifiaction(obj).subscribe(
        (resp: any) => {
          const data = JSON.parse(resp.json());
          this.IsNotificationSent = true;
        },
        (error) => {
          alert('Something went wrong.');
        }
      )
    }
  }
}
