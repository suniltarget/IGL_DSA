import { Component, OnInit } from '@angular/core';
import { dbService } from '../../Service/db.service';
import { DatepickerOptions } from 'ng2-datepicker';
import * as enLocale from 'date-fns/locale/en';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { isNullOrUndefined } from 'util';
import { DatePipe } from '@angular/common';
import { analyzeAndValidateNgModules } from '@angular/compiler';
declare var $: any;
@Component({
  selector: 'app-dispenser-entry',
  templateUrl: './dispenser-entry.component.html',
  styleUrls: ['./dispenser-entry.component.css']
})
export class DispenserEntryComponent implements OnInit {
  SelectedDate: string = this.objCook.get('CurrentDate');
  detailsStation: { StationId: string, SummeryDate: string, UserId: string }
  StationShift: { ShiftId: string, SubShiftId: string, ActiveTab: string }
  cnt = 0;
  armA: string = '';
  armAPrevReading: string = '';
  armB: string = '';
  armBPrevReading: string = '';
  UpdateArmA: string = '';
  UpdateArmB: string = '';
  remark: string = '';
  prevReadingA: string = '';
  prevReadingB: string = '';
  jumpReadingA: string = '';
  jumpReadingB: string = '';
  ArmASale = '0.00';
  ArmBSale = '0.00';
  TArmSale = '0.00';
  oldvalueA: string = '';
  oldvalueB: string = '';
  errorFlag: boolean = false;
  before: string = '';
  after: string = '';
  popupFlag: boolean = false;
  UpdateFlag: boolean = false;
  popupFor: string = "ArmA";
  StationId: string = '';
  JumpSide = '';
  CashCollection = 0.0;
  IsJumpSelected: boolean = false;
  uploadedfile: File;
  JumpType: string = '';
  FileName: string = '';
  IsFileSelected: boolean = false;
  allDispenserData: any = [];
  listJumpedReading: any = [];
  ValidatelistJumpedReading: any = [];
  armSide: string = "armA";
  dispId: number = 0;
  jumppopup: boolean = true;
  submittedflag: boolean = false;
  isDispencerLocked: boolean = true;
  DispLockMsg: string = "";
  showNext: boolean = true;
  showPrevious: boolean = true;
  totalDispenser: number = 0;
  dispCounterIndex: number = 0;
  FlagJumpType = 'Jump';
  DispencerCount = 0;
  listDispensers: { DispenserName, DispenserId, StationId }[];
  selectedDispId = 0;
  cmbShiftData: {}[];
  selectedShiftId = '-1'
  cmbSubShiftData: { SubShiftId, SubShiftDetails }[];
  selectedSubShiftId = '-1'
  SubShiftCount = 0;
  SubShiftCurrentCount = 0;
  CurrentRate = '0.00';
  NormalRate = '0.00';
  DiscountedRate = '0.00';
  StationCode: string = localStorage.getItem('LoginId');
  DispanserJumpId: string = '';
  stationName: string = "";
  CompanyName: string = '';
  CompanyId: string = '';
  SummeryDate: any = this.objCook.get('CurrentDate');
  selectedStation: number = 0;
  shiftsubshift: boolean = false;
  IsTimeOverlocal: boolean = false;
  localLockDate: string = '';
  ArmAReadingAverage: string = '';
  ArmBReadingAverage: string = '';
  date: Date;
  fileUploadNew: File;
  flagIsReset: boolean = false;
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
    maxDate: new Date(this.SelectedDate)
  };
  constructor(private objDbServ: dbService, private objCook: CookieService, private objRoute: Router, private dp: DatePipe) {
    this.objDbServ.MasterCompDisplay.emit(true);
    this.objDbServ.StationDetails.subscribe(
      (test: { StationId: string, SummeryDate: string, UserId: string }) => {
        this.detailsStation = test;
      }
    );
    this.objDbServ.LockDate.subscribe(value =>
      this.localLockDate = value
    );
  }
  unlockpayment() {
    alert("Please unlock this from payment collection tab.");
  }
  ngOnInit() {
    if (this.IsTimeOverlocal == false || this.submittedflag == false) {
      this.objDbServ.lockUnlockDispenserEntry.subscribe(value =>
        this.IsTimeOverlocal = value
      );
      this.objDbServ.lockUnlockDispenserEntry.subscribe(value =>
        this.submittedflag = value
      );
    }
    this.SelectedDate = this.objCook.get('CurrentDate'); 
    this.selectedStation = Number(this.objCook.get('stationId'));
    this.OnDateChnage(this.SelectedDate);
    this.JRSValidate();
  }
  OnDateChnage(val) {
    const dt = new Date(val);
    this.SummeryDate = dt.getDate() + "/" + this.monthNames[dt.getMonth()] + "/" + dt.getFullYear();
    this.checkEntryPending();
    this.FetchDSASubmittedData();
    if (this.localLockDate == this.SummeryDate || this.IsTimeOverlocal == true)
      this.submittedflag = true;
    else
      this.submittedflag = false;
      this.CheckDispencerLockUnlock();
  }
  FetchDSASubmittedData() {
    var Obj = {
      StationCode: JSON.parse(sessionStorage.getItem("globalDetail"))[0].StationCode,
      StationId: this.selectedStation,
      CDate: this.SummeryDate,
    }
    this.objDbServ.FetchDSASubmittedData(Obj).subscribe(
      (resp: any) => {
        var arr: any = [];
        const data1 = JSON.parse(resp.json());
        if (data1 != '') {
          arr = data1.Table;
          if (arr.length > 0) {
            if (arr[0].IsSubmittedBySOP == 1) {
              this.objDbServ.LockDate.next(this.SummeryDate);
              this.objDbServ.LockDate.subscribe(value =>
                this.localLockDate = value
              );
              if (this.localLockDate == this.SummeryDate || this.IsTimeOverlocal == true)
                this.submittedflag = true;
              else
                this.submittedflag = false;
            }
          }
        }
      },
      (error) => {
        alert('Something went wrong.');
      }
    )
  }
  checkEntryPending() {
    this.GetStationCompany();
    this.objDbServ.CommonGetData({ Id: this.selectedStation, Status: this.SummeryDate, Flag: 'validatePopup' }).subscribe(
      (resp: any) => {
        const data = JSON.parse(resp.json());
        if (data.Table[0].Msg == 'Allow') {
          this.shiftsubshift = false;
          this.GetReadingbyShift();
        }
        else {
          this.shiftsubshift = true;
          alert(data.Table[0].Msg);
          this.allDispenserData = [];
          this.selectedShiftId = '-1';
          this.selectedSubShiftId = '-1';
          this.CurrentRate = '0.00';
        }
      if (this.CompanyId == '1' || this.CompanyId == '2' || this.CompanyId == '4' ||
          this.CompanyId == '5' || this.CompanyId == '6' || this.CompanyId == '8' || 
          this.CompanyId == '9') {
          this.selectedShiftId = '4';
          this.selectedSubShiftId = '6';
          this.shiftsubshift = true;
        }
        else {
          this.shiftsubshift = false;
        }
      },
      (error) => {
        alert('Something went wrong.');
      }
    )
  }
  onChangeImage(file: FileList, event: any) {
    this.uploadedfile = file.item(0);
    if (this.uploadedfile.size > 0)
      this.IsFileSelected = true;
    else
      this.IsFileSelected = false;
  }
  GetStationCompany() {
    this.objDbServ.GetStationCompany({ Flag: 'CompanyByStation', Id: this.selectedStation, Status: 1 }).subscribe(
      (resp: any) => {
        this.CompanyName = JSON.parse(resp.json()).Table[0].CompanyName;
        this.CompanyId = JSON.parse(resp.json()).Table[0].CompanyId;
      if (this.CompanyId == '1' || this.CompanyId == '2' || this.CompanyId == '4' ||
          this.CompanyId == '5' || this.CompanyId == '6' || this.CompanyId == '8' ||
          this.CompanyId == '9') {
          this.selectedShiftId = '4';
          this.selectedSubShiftId = '6';
          this.shiftsubshift = true;
        }
        this.CheckCompany();
      },
      (error) => {
        alert("Something went wrong.");
        this.objDbServ.ShowLoaders.emit(false);
      }
    )
  }
  CheckCompany() {
    if (this.CompanyName == 'OMC' || this.CompanyName == 'DTC' || this.CompanyName == 'DIMITS' || this.CompanyName == 'NMRC') {
      this.objDbServ.IsCompanyValid.emit(true);
    }
    else {
      this.objDbServ.IsCompanyValid.emit(false);
    }
  }
  GetReadingbyShift() {
  if (this.CompanyId == '1' || this.CompanyId == '2' || this.CompanyId == '4' ||
      this.CompanyId == '5' || this.CompanyId == '6' || this.CompanyId == '8' || 
      this.CompanyId == '9') {
      this.selectedShiftId = '1';
      this.selectedSubShiftId = '1';
    }
    const obj = {
      StationId: Number(this.objCook.get('stationId')),
      EntryDate: this.SummeryDate,
      DispenserId: this.selectedDispId,
      ShiftId: this.selectedShiftId,
      SubShiftId: this.selectedSubShiftId
    };
    this.objDbServ.ShowLoaders.emit(true);
    this.objDbServ.GetReadingbyShift(obj).subscribe(
      (resp: any) => {
        this.DispencerCount = JSON.parse(resp.json()).Table4.length;
        if (this.DispencerCount != 0) {
          if (this.selectedDispId == 0)
            this.selectedDispId = JSON.parse(resp.json()).Table4[0].DispenserId;
          this.listDispensers = JSON.parse(resp.json()).Table4;
          this.allDispenserData = JSON.parse(resp.json()).Table;
          this.totalDispenser = JSON.parse(resp.json()).Table4.length;
          this.cmbShiftData = JSON.parse(resp.json()).Table1;
        if (this.CompanyId != '1' && this.CompanyId != '2' && this.CompanyId != '4' &&
            this.CompanyId != '5' && this.CompanyId != '6' && this.CompanyId != '8' &&
            this.CompanyId != '9') {
            this.cmbSubShiftData = JSON.parse(resp.json()).Table2;
          }
          else {
            this.cmbSubShiftData = JSON.parse(resp.json()).Table5
          }
        if (this.CompanyId == '1' || this.CompanyId == '2' || this.CompanyId == '4' ||
            this.CompanyId == '5' || this.CompanyId == '6' || this.CompanyId == '8' ||
            this.CompanyId == '9') {
            this.selectedShiftId = '4';
            this.selectedSubShiftId = '6';
            this.shiftsubshift = true;
          }
          else {
            this.selectedShiftId = JSON.parse(resp.json()).Table3[0].ShiftId;
            this.selectedSubShiftId = JSON.parse(resp.json()).Table3[0].SubShiftId;
          }
          this.DiscountedRate = (parseFloat(JSON.parse(resp.json()).Table3[0].DisountedRate).toFixed(2)).toString();
          this.NormalRate = (parseFloat(JSON.parse(resp.json()).Table3[0].CurrentRate).toFixed(2)).toString();
          if (this.selectedShiftId == '-1')
            this.CurrentRate = '0.00';
          else if (this.selectedSubShiftId == '6')
            this.CurrentRate = this.DiscountedRate;
          else
            this.CurrentRate = this.NormalRate;
          this.SubShiftCount = JSON.parse(resp.json()).Table2.length;
          var element = 0;
          if (this.selectedShiftId == '-1' || this.selectedSubShiftId == '-1')
            this.jumppopup = true;
          else
            this.jumppopup = false;
          this.ArmASale = (parseFloat(JSON.parse(resp.json()).Table[0].TotA).toFixed(2)).toString()
          this.ArmBSale = (parseFloat(JSON.parse(resp.json()).Table[0].TotB).toFixed(2)).toString()
          this.TArmSale = (parseFloat(JSON.parse(resp.json()).Table[0].FinalTot).toFixed(2)).toString()
        if (this.CompanyId != '1' && this.CompanyId != '2' && this.CompanyId != '4' &&
            this.CompanyId != '5' && this.CompanyId != '6' && this.CompanyId != '8' &&
            this.CompanyId != '9') {
            for (let index = 0; index < this.cmbSubShiftData.length; index++) {
              if (this.cmbSubShiftData[index].SubShiftId == this.selectedSubShiftId)
                element = index;
            }
            this.SubShiftCurrentCount = (element + 1)
          }
          else {
            for (let index = 0; index < this.cmbSubShiftData.length; index++) {
              if (this.cmbSubShiftData[index].SubShiftId == this.selectedSubShiftId)
                element = index;
            }
            this.SubShiftCurrentCount = (element + 1)
          }
          this.objDbServ.ShowLoaders.emit(false);
        }
        else {
          alert('No Dispenser Available');
          this.objDbServ.ShowLoaders.emit(false);
        }
      },
      (error) => { alert("Something went wrong."); this.objDbServ.ShowLoaders.emit(false); }
    )
  }
  onSelectShift(shiftId: string) {
    this.selectedShiftId = shiftId;
    setTimeout(() => { this.GetReadingbyShift(); });
    this.CheckDispencerLockUnlock();
  }
  onSelectSubShift(SubShiftId: string) {
    this.selectedSubShiftId = SubShiftId;
    if (SubShiftId == '-1')
      this.SubShiftCurrentCount = -1
    else {
      var element = 0;
      for (let index = 0; index < this.cmbSubShiftData.length; index++) {
        if (this.cmbSubShiftData[index].SubShiftId == SubShiftId)
          element = index;
      }
      this.SubShiftCurrentCount = (element + 1)
    }
    setTimeout(() => { this.GetReadingbyShift(); });
    this.CheckDispencerLockUnlock();
  }
  numberOnly(event): boolean {
    var val = event.target.value;
    const charCode = (event.which) ? event.which : event.keyCode;
    if (event.target.selectionDirection == "backward" && event.target.selectionStart == 0 && event.target.selectionEnd > 0 && (charCode == 45 || charCode == 46 || (charCode > 31 && (charCode > 47 && charCode < 58)))) {
      return true;
    }
    if (!(val)) {
      if (charCode == 45) {
        return true;
      }
      if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
      }
      return true;
    }
    else {
      if (charCode == 45 || charCode == 46 || (charCode > 31 && (charCode > 47 && charCode < 58))) {
        var points = 0;
        var minus = -1;
        points = val.indexOf(".", points);
        minus = val.indexOf("-", minus);
        if (minus != -1 && event.target.selectionStart <= minus) {
          return false
        }
        if (points >= 0 && charCode == 46) {
          return false;
        }
        else if (minus >= 0 && charCode == 45 || event.target.selectionStart != 0 && charCode == 45) {
          return false;
        }
        else {
          return true;
        }
      }
      else {
        return false;
      }
    }
  }
  OnchangeA(itm) {
    if (itm.ArmReadingA < 0) {
      alert('Reading must be positive');
      itm.ArmReadingA = 0;
    }
    if (itm.ArmReadingA != '') {
      var rx = /^\d+(?:\.\d{1,3})?$/
      if (rx.test(itm.ArmReadingA)) {
        this.oldvalueA = itm.ArmReadingA;
      }
      else {
        itm.ArmReadingA = this.oldvalueA;
      }
    }
    else {
      itm.ArmReadingA = '';
    }
    const ArmASaleCal = ((parseFloat(itm.ArmReadingA) - parseFloat(itm.PreArmReadingA) - parseFloat(itm.JumpArmA)).toFixed(2)).toString();
    itm.TotA = Number(isNaN(parseFloat(ArmASaleCal)) ? '0.00' : ArmASaleCal);
    const TArmSaleCal = ((parseFloat(itm.TotA) + parseFloat(itm.TotB)).toFixed(2)).toString();
    itm.FinalTot = Number((isNaN(parseFloat(TArmSaleCal)) ? '0.00' : TArmSaleCal));
  }
  OnchangeB(itm) {
    var regexNumeric = /^[+-]?[0-9]{1,1000}(?:\.[0-9]{1,1000})?$/;
    if (itm.ArmReadingB < 0) {
      alert('Reading must be positive')
      itm.ArmReadingB = 0;
    }
    if (itm.ArmReadingB != '') {
      var rx = /^\d+(?:\.\d{1,3})?$/
      if (rx.test(itm.ArmReadingB)) {
        this.oldvalueB = itm.ArmReadingB;
      }
      else {
        itm.ArmReadingB = this.oldvalueB;
      }
    }
    else {
      itm.ArmReadingB = '';
    }
    const ArmBSaleCal = ((parseFloat(itm.ArmReadingB) - parseFloat(itm.PreArmReadingB) - parseFloat(itm.JumpArmB)).toFixed(2)).toString();
    itm.TotB = Number(isNaN(parseFloat(ArmBSaleCal)) ? '0.00' : ArmBSaleCal);
    const TArmSaleCal = ((parseFloat(itm.TotB) + parseFloat(itm.TotA)).toFixed(2)).toString();
    itm.FinalTot = Number((isNaN(parseFloat(TArmSaleCal)) ? '0.00' : TArmSaleCal));
  }
  CheckDispencerLockUnlock()
  {
    const obj = {
      EntryDate: this.SummeryDate,
      StationId: Number(this.objCook.get('stationId')),
      StationCode: this.StationCode,
    };
    this.objDbServ.ShowLoaders.emit(true);
        this.objDbServ.CheckDispencerLockUnlockStatus(obj).subscribe(
          (resp: any) => {
            const data = JSON.parse(resp.json());
            if(data.Table[0].Status == "1")
            {
              this.isDispencerLocked = false;
              this.DispLockMsg = data.Table[0].Message;
            }
            else
            {
              this.isDispencerLocked = true;
              this.DispLockMsg = "";
            }
            this.objDbServ.ShowLoaders.emit(false);
          },
          (error) => { alert("Something went wrong."); this.objDbServ.ShowLoaders.emit(false); }
        )
  }
  saveAll() {
    if (this.checkSale()) {
      var arr: any = [];
      arr = this.allDispenserData.filter(element => element.ArmReadingA)
      if (this.selectedShiftId == "-1" || isNullOrUndefined(this.selectedShiftId)) {
        alert('Please select Shift.');
      }
      else if (this.selectedSubShiftId == "-1" || isNullOrUndefined(this.selectedSubShiftId)) {
        alert('Please select Sub Shift.');
      }
      else if (arr.length == 0 && this.flagIsReset == false) {
        alert('Please Enter Arm Reading.');
      }
      else {
        var array: any = [];
        this.allDispenserData.forEach(element => {
          array.push({ DispenserId: element.DispenserId, ArmReadingA: element.ArmReadingA, ArmReadingB: element.ArmReadingB });
        });
        const obj = {
          UserId: this.objCook.get('UID'),
          EntryDate: this.SummeryDate,
          StationId: Number(this.objCook.get('stationId')),
          shiftId: this.selectedShiftId,
          SubShiftId: this.selectedSubShiftId,
          StationCode: this.StationCode,
          CurrentRate: this.CurrentRate,
          DispanserEntryData: array
        };
        this.objDbServ.ShowLoaders.emit(true);
        this.objDbServ.DispenserEntryMaster(obj).subscribe(
          (resp: any) => {
            this.CheckDispencerLockUnlock();
            const data = JSON.parse(resp.json());
            if (data.Table[0].Meaasge.indexOf('successfully') > -1) {
              alert(data.Table[0].Meaasge);
            }
            else
              alert(data.Table[0].Meaasge);
            this.objDbServ.ShowLoaders.emit(false);
          },
          (error) => { alert("Something went wrong."); this.objDbServ.ShowLoaders.emit(false); }
        )
      }
    }
  }
  checkSale() {
    var sumArmASale = 0.00;
    var sumArmBSale = 0.00;
    for (var i = 0; i < this.allDispenserData.length; i++) {
      sumArmASale = parseFloat(sumArmASale + this.allDispenserData[i].TotA);
    }
    for (var i = 0; i < this.allDispenserData.length; i++) {
      sumArmBSale = parseFloat(sumArmBSale + this.allDispenserData[i].TotB);
    }
    if (sumArmASale < 0) {
      alert('Please enter positive sale for Arm A');
      return false;
    }
    else if (sumArmBSale < 0) {
      alert('Please enter positive sale for Arm B');
      return false;
    }
    else {
      return true;
    }
  }
  validation1(ArmReadingA, PreArmReadingA, DispenserName, dispId) {
    var JumpDispenserName;
    var DispanserAfterJump;
    var Jumpflag;
    var side;
    this.dispId = dispId;
    if (String(Number(ArmReadingA)) == 'NaN') {
      alert('Please enter the numeric value for Arm A.');
      return false;
    }
    else if (parseFloat(ArmReadingA) == 0 && parseFloat(PreArmReadingA) > 0) {
      this.objDbServ.GetJumpReadingByShift({ EntryDate: this.SummeryDate, ShiftId: this.selectedShiftId, SubShiftId: this.selectedSubShiftId, DispenserId: this.dispId }).subscribe(
        (resp: any) => {
          this.listJumpedReading = JSON.parse(resp.json()).Table;
          if (this.listJumpedReading.length > 0) {
            for (var i = 0; i < this.listJumpedReading.length; i++) {
              JumpDispenserName = this.listJumpedReading[i].DispenserName;
              Jumpflag = this.listJumpedReading[i].FlagJumpType;
              side = this.listJumpedReading[i].DispanserSide;
              this.flagIsReset = (Jumpflag == 'Reset') ? true : false;
              DispanserAfterJump = parseFloat(this.listJumpedReading[i].DispanserAfterJump);
              if (DispenserName == JumpDispenserName && DispanserAfterJump > 0 && Jumpflag != 'Reset' && parseFloat(ArmReadingA) == 0 && side == 'ArmA') {
                alert('Zero is not allowed for ' + side);
                return false;
              }
            }
          }
          else {
            alert('Zero is not allowed for Arm A.');
            return false;
          }
        },
        (error) => {
          alert("Something went wrong.");
          this.objDbServ.ShowLoaders.emit(false);
        }
      )
    }
    else if (parseFloat(ArmReadingA) <= parseFloat(PreArmReadingA)) {
      const ret = confirm('There is a suspecious entry in Arm A. Do you want to continue?')
      return false;
    }
    else if (ArmReadingA == '') {
      alert('Please enter reading for Arm A.');
      return false;
    }
    else if (ArmReadingA != '') {
      this.objDbServ.DispenserAverage({ StationId: Number(this.objCook.get('stationId')), ShiftId: this.selectedShiftId, SubShiftId: this.selectedSubShiftId, EntryDate: this.dp.transform(this.SummeryDate, 'dd-MMM-yyyy') }).subscribe(
        (resp: any) => {
          const data = JSON.parse(resp.json()).Table[0]
          this.ArmAReadingAverage = data.FinalArmA;
          this.ArmBReadingAverage = data.FinalArmB;
          if (ArmReadingA > this.ArmAReadingAverage && Number(this.ArmAReadingAverage) != 0) {
            if (confirm('Wrong Entry for Arm A Reading, Do you want to continue?')) {
              return true;
            }
            else {
              ArmReadingA = 0;
              return false;
            }
          }
        },
        (error) => {
          alert("Something went wrong.");
          this.objDbServ.ShowLoaders.emit(false);
        }
      )
    }
  }
  validation2(ArmReadingB, PreArmReadingB, DispenserName, dispId) {
    var JumpDispenserName;
    var DispanserAfterJump;
    var Jumpflag;
    var side;
    this.dispId = dispId;
    if (String(Number(ArmReadingB)) == 'NaN') {
      alert('Please enter the numeric value for Arm B.');
      return false;
    }
    else if (parseFloat(ArmReadingB) == 0 && parseFloat(PreArmReadingB) > 0) {
      this.objDbServ.GetJumpReadingByShift({ EntryDate: this.SummeryDate, ShiftId: this.selectedShiftId, SubShiftId: this.selectedSubShiftId, DispenserId: this.dispId }).subscribe(
        (resp: any) => {
          this.listJumpedReading = JSON.parse(resp.json()).Table;
          if (this.listJumpedReading.length > 0) {
            for (var i = 0; i < this.listJumpedReading.length; i++) {
              JumpDispenserName = this.listJumpedReading[i].DispenserName;
              Jumpflag = this.listJumpedReading[i].FlagJumpType;
              this.flagIsReset = (Jumpflag == 'Reset') ? true : false;
              side = this.listJumpedReading[i].DispanserSide;
              DispanserAfterJump = parseFloat(this.listJumpedReading[i].DispanserAfterJump);
              if (DispenserName == JumpDispenserName && DispanserAfterJump > 0 && Jumpflag != 'Reset' && parseFloat(ArmReadingB) == 0 && side == 'ArmB') {
                alert('Zero is not allowed for ' + side);
                return false;
              }
            }
          }
          else {
            alert('Zero is not allowed for Arm B.');
            return false;
          }
        },
        (error) => {
          alert("Something went wrong.");
          this.objDbServ.ShowLoaders.emit(false);
        }
      )
    }
    else if (parseFloat(ArmReadingB) <= parseFloat(PreArmReadingB)) {
      const ret = confirm('There is a suspecious entry in Arm B. Do you want to continue?')
      return false; 
    }
    else if (ArmReadingB == '') {
      alert('Please enter reading for Arm B.');
      return false;
    }
    else if (ArmReadingB != '') {
      this.objDbServ.DispenserAverage({ StationId: Number(this.objCook.get('stationId')), ShiftId: this.selectedShiftId, SubShiftId: this.selectedSubShiftId, EntryDate: this.dp.transform(this.SummeryDate, 'dd-MMM-yyyy') }).subscribe(
        (resp: any) => {
          const data = JSON.parse(resp.json()).Table[0]
          this.ArmAReadingAverage = data.FinalArmA;
          this.ArmBReadingAverage = data.FinalArmB;
          if (ArmReadingB > this.ArmBReadingAverage && Number(this.ArmBReadingAverage) != 0) {
            const ret = confirm('Wrong Entry for Arm B Reading, Do you want to continue?')
            return false;
          }
        },
        (error) => {
          alert("Something went wrong.");
          this.objDbServ.ShowLoaders.emit(false);
        }
      )
    }
  }
  ArmSelection(value) {
    this.popupFor = value;
  }
  getvalues(itm) {
    this.armSide = "ArmA";
    this.before = "";
    this.after = "";
    this.remark = "";
    this.dispId = itm.DispenserId;
    this.armAPrevReading = itm.PreArmReadingA;
    this.armBPrevReading = itm.PreArmReadingB;
    this.getJumpReadingList(this.dispId);
  }
  getJumpReadingList(itm) {
    const obj = {
      EntryDate: this.SummeryDate,
      ShiftId: (this.CompanyId == '1' || this.CompanyId == '2' || this.CompanyId == '4' ||
        this.CompanyId == '5' || this.CompanyId == '6' || this.CompanyId == '8' ||
        this.CompanyId == '9') ? 1 : this.selectedShiftId,
      SubShiftId: (this.CompanyId == '1' || this.CompanyId == '2' || this.CompanyId == '4' ||
        this.CompanyId == '5' || this.CompanyId == '6' || this.CompanyId == '8' ||
        this.CompanyId == '9') ? 1 : this.selectedSubShiftId,
      DispenserId: this.dispId
    };
    this.objDbServ.ShowLoaders.emit(true);
    this.objDbServ.GetJumpReadingByShift(obj).subscribe(
      (resp: any) => {
        this.listJumpedReading = JSON.parse(resp.json()).Table;
        this.objDbServ.ShowLoaders.emit(false);
      },
      (error) => {
        alert("Something went wrong.");
        this.objDbServ.ShowLoaders.emit(false);
      }
    )
  }
  DeleteJumpReading(DispanserJumpId: string, itm: any) {
    if (confirm("Are you sure to delete this record..?")) {
      var Json = {
        DispanserJumpId: DispanserJumpId,
        EntryDate: this.SummeryDate,
        StationId: Number(this.objCook.get('stationId')),
        DispanserSide: this.popupFor
      }
      this.objDbServ.DeleteJumpReading(Json).subscribe(
        (resp: any) => {
          const data = JSON.parse(resp.json());
          alert(data.Table[0].Meaasge);
          this.openPopup(this.popupFor);
          setTimeout(() => {
            this.GetReadingbyShift();
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
  openPopup(flag: string) {
    this.popupFor = flag;
    this.DispanserJumpId = '';
    this.listJumpedReading = [];
    this.getJumpReadingList(this.dispId);
    this.refreshPopup();
  }
  refreshPopup() {
    this.before = '';
    this.after = '';
    this.remark = '';
    this.DispanserJumpId = '';
    this.FlagJumpType = 'Jump';
    this.IsJumpSelected = true;
    $('#fileInput').val(null);
    this.uploadedfile = null;
    this.fileUploadNew = null;
    this.FileName = '';
  }
  UpdateJumpReading(DispanserJumpId: string, itm: any) {
    this.DispanserJumpId = DispanserJumpId;
    this.before = itm.DispanserBeforeJump;
    this.after = itm.DispanserAfterJump;
    this.remark = itm.DispanserJumpRemark;
    this.FlagJumpType = itm.FlagJumpType;
    var ImagePath = itm.DispanserJumpCeritificate;
    this.armSide = itm.DispanserSide;
    this.FileName = ImagePath.substring(1, ImagePath.length);
    if (this.FileName.length > 0) {
      this.IsFileSelected = false;
      this.uploadedfile = null;
    }
    else
      this.IsFileSelected = true;
  }
  saveJumpReading() {
    this.errorFlag = false;
    if (this.validationPopup('JumpReading') == true)
      return false;
    var obj = {
      EntryDate: this.SummeryDate,
      DispanserJumpId: (this.DispanserJumpId == "") ? '0' : this.DispanserJumpId,
      DispenserId: this.dispId,
      StationId: Number(this.objCook.get('stationId')),
      ShiftId: this.selectedShiftId,
      SubShiftId: this.selectedSubShiftId,
      DispanserBeforeJump: this.before,
      DispanserAfterJump: this.after,
      DispanserJumpRemark: this.remark,
      DispanserSide: this.popupFor,
      JumpTypeFlag: this.FlagJumpType,
      RequestFrom: this.objCook.get('UID')
    };
    this.objDbServ.ShowLoaders.emit(true);
    var frmData = new FormData();
    var fileInput = this.uploadedfile;
    frmData.append("DispJumpDetail", JSON.stringify(obj));
    if (!isNullOrUndefined(this.uploadedfile)) {
      frmData.append('DipsanserJumpfile', this.uploadedfile, this.uploadedfile.name);
    }
    this.objDbServ.SaveJumpReading(frmData).subscribe(
      (resp: any) => {
        const data = JSON.parse(resp._body);
        alert(data);
        if (data.indexOf('Error:') == -1) 
        {
          if (data.indexOf('Error') > -1)
          {
            this.objCook.set('UID', '');
            this.objRoute.navigate(['']);
          }
          this.refreshPopup();
          this.getJumpReadingList(this.dispId);
          setTimeout(() => { this.GetReadingbyShift(); });
        }
        this.uploadedfile = null;
        this.FileName = '';
        this.objDbServ.ShowLoaders.emit(false);
      },
      (error) => {
        alert("Something went wrong.");
        this.objDbServ.ShowLoaders.emit(false);
      }
    )
  }
  validationPopup(flag: string) {
    this.fileUploadNew = $('#fileInput');
    var fileInput = this.fileUploadNew[0];
    if (this.before == '' && flag == 'JumpReading') {
      alert('Please enter the value for before reading.');
      this.errorFlag = true;
    }
    else if (String(Number(this.before)) == 'NaN' && flag == 'JumpReading') {
      alert('Please enter the numeric value for before reading.');
      this.errorFlag = true;
    }
    else if ((Number(this.before) < 0 || Number(this.before) < 0) && flag == 'JumpReading') {
      alert('Jump Reading can not be negative.');
      this.errorFlag = true;
    }
    else if (this.after == '' && flag == 'JumpReading') {
      alert('Please enter the value for after reading.');
      this.errorFlag = true;
    }
    else if (String(Number(this.after)) == 'NaN' && flag == 'JumpReading') {
      alert('Please enter the numeric value for after reading.');
      this.errorFlag = true;
    }
    else if ((Number(this.after) < 0 || Number(this.after) < 0) && flag == 'JumpReading') {
      alert('Jump Reading can not be negative.');
      this.errorFlag = true;
    }
    else if (this.popupFor.toLowerCase() == 'arma' && Number(this.armAPrevReading) <= 0 && flag == 'JumpReading') {
      alert('Before entry can not allowed if previous entry is zero.');
      this.errorFlag = true;
    }
    else if (this.popupFor.toLowerCase() == 'armb' && Number(this.armBPrevReading) <= 0 && flag == 'JumpReading') {
      alert('Before entry can not allowed if previous entry is zero.');
      this.errorFlag = true;
    }
    if (fileInput.files.length > 0) {
      var validExtension = 'jpeg,jpg,png,gif';
      for (var i = 0; i < fileInput.files.length; i++) {
        var fileExtension = fileInput.files[i].name.split('.').pop().toLowerCase()[1];
        if (validExtension.indexOf(fileExtension) < 0) {
          alert('Attachment allowed only for [' + validExtension + '].');
          this.errorFlag = true;
        }
      }
    }
    return this.errorFlag;
  }
  ChangeJumpType(val) {
    this.JumpType = val;
    if (this.JumpType == 'Jump' || this.JumpType == 'Reset' || this.JumpType == 'GasTesting')
      this.IsJumpSelected = false;
    else
      this.IsJumpSelected = true;
  }
  abc() {
    this.objDbServ.DispenserAverage({ StationId: Number(this.objCook.get('stationId')), ShiftId: this.selectedShiftId, SubShiftId: this.selectedSubShiftId, EntryDate: this.dp.transform(this.SummeryDate, 'dd-MMM-yyyy') }).subscribe(
      (resp: any) => {
        const data = JSON.parse(resp.json()).Table[0]
        this.ArmAReadingAverage = data.FinalArmA;
        this.ArmBReadingAverage = data.FinalArmB;
      },
      (error) => {
        alert("Something went wrong.");
        this.objDbServ.ShowLoaders.emit(false);
      }
    )
  }
  JRSValidate() {
    var json = {
      Flag: 'JRSValidate',
      Id: this.selectedStation,
      CDashdate: this.SummeryDate,
      ReportFlag: 'DISP'
    }
    this.objDbServ.CommonGetData(json).subscribe(
      (resp: any) => {
        const data = JSON.parse(resp.json());
        if (data.Table[0].Msgs != '') {
          alert(data.Table[0].Msgs);
        }
      },
      (error) => {
        alert("Something went wrong.");
        this.objDbServ.ShowLoaders.emit(false);
      }
    )
  }
}
