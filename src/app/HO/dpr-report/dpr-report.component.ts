import { Component, OnInit, ɵConsole} from '@angular/core';
import { dbService } from '../../Service/db.service';
import { CookieService } from 'ngx-cookie-service';
import { Response } from '@angular/http';
import { DatepickerOptions } from 'ng2-datepicker';
import * as enLocale from 'date-fns/locale/en';
import { EILSEQ } from 'constants';
import { fakeAsync } from '@angular/core/testing';
import { element } from 'protractor';
import { isNullOrUndefined } from 'util';
declare var $: any;
@Component({
  selector: 'app-dpr-report',
  templateUrl: './dpr-report.component.html',
  styleUrls: ['./dpr-report.component.css']
})
export class DPRReportComponent implements OnInit {
  ResponseList: any[];
  DPR: any[];
  DPRegionSale: any[];
  columnsDPR: string[] = [];
  columnsDPRRegionSale: string[] = [];
  RegionList: any[];
  StationList: any[];
  IsRegionSelected: boolean = false;
  selectedReport: string;
  dateFrom: string = this.objCook.get('CurrentDate');
  dateTo: string = this.objCook.get('CurrentDate');
  CurrentDate: string = this.objCook.get('CurrentDate');
  selectedRegion: string = 'All';
  selectedStation: string;
  ReportFlag: string = this.objCook.get('DepartmentCode');
  dateFromSec
  errorFound: boolean = true;
  IsJMRSelected: boolean = true;
  IsRegionDisable: boolean = true;
  IsStationDisable: boolean = true;
  IsDatesDisable: boolean = false;
  LoginID: string = 'Admin'; 
  ControlRoomCode: string = this.objCook.get('LoginId');
  dateRange: boolean = false;
  fiterBox: boolean = false;
  filterBoxFlag: number = 0;
  stCodeMy: "";
  JMRReportVisibility: boolean = false;
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
    maxDate: new Date(this.CurrentDate)
  };
  activeDPRReport: boolean = false;
  columns: string[] = [];
  sortingColumn: string = "";
  key: string = 'Name';
  reverse: boolean = true;
  this: any;
  selectedAll: any;
  selectedAllColumns: any;
  IscheckboxApply: boolean = false;
  dropdownSettings: { singleSelection: boolean; idField: string; textField: string; selectAllText: string; unSelectAllText: string; itemsShowLimit: number; allowSearchFilter: boolean; };
  todateshow:boolean=true;
  constructor(private objDbServ: dbService, private objCook: CookieService) {
    this.objDbServ.MasterCompDisplay.emit(true);
    this.objDbServ.HeaderDisplay.emit(true);
    this.objDbServ.LeftMenu.emit(true);
    this.SetDropDownSetting();
  }
  ngOnInit() {
    var loginId = localStorage.getItem('LoginId');
    var tempRequester = '';
    if (loginId.toLowerCase().indexOf('cng') > -1) {
      this.JMRReportVisibility = false;
    }
    else if (loginId.toLowerCase().indexOf('cr') > -1) {
      this.JMRReportVisibility = true;
    }
    else if (loginId.toLowerCase().indexOf('admin') > -1) {
      this.JMRReportVisibility = true;
    } 
    else if (loginId.toLowerCase().indexOf('finadmin') > -1) {
      this.JMRReportVisibility = true;
    } 
    const dt = new Date();
    this.CurrentDate = this.objCook.get('CurrentDate');
    this.dateFrom = this.objCook.get('CurrentDate');
    this.dateTo = this.objCook.get('CurrentDate');
    if(this.ReportFlag != 'CO'){
      this.IsRegionDisable = false;
      this.GetRegionByDept();
    }
    if(this.ReportFlag == 'HO'){
      this.IsRegionDisable = false;
      this.IsStationDisable=false;
      this.GetRegionByDept();
    }
    if(this.ReportFlag == 'FA'){
      this.IsRegionDisable = false;
      this.IsStationDisable=false;
      this.GetRegionByDept();
    }
    if(this.ReportFlag == 'CO'){
      this.IsRegionDisable = false;
      this.IsStationDisable=false;
      this.GetRegionByDept();
    }
    this.GetCOStation();
    $("#PMCheck").click(function(){
      $("#tgt_div").animate({left:"0px"});
    });
    $("#ef").click(function(){
      $("#tgt_div").animate({left: "95px"});
      });
      this.onRegionSelect('All');
  }
  OnDateChnagefrom(val) {
    const dt = new Date(val);
    this.dateFrom = dt.getDate() + "/" + this.monthNames[dt.getMonth()] + "/" + dt.getFullYear();
    this.checkdifference(this.dateFrom, this.dateTo);
  }
  OnDateChnageTo(val) {
    const dt = new Date(val);
    this.dateTo = dt.getDate() + "/" + this.monthNames[dt.getMonth()] + "/" + dt.getFullYear();
    this.checkdifference(this.dateFrom, this.dateTo);
  }
  filterBoxShow(itm) {
    if (this.filterBoxFlag == 0) {
      this.fiterBox = true;
      this.filterBoxFlag = 1;
    }
    else {
      this.fiterBox = false;
      this.filterBoxFlag = 0;
      this.stCodeMy = itm.StationName;
      this.selectedStation = itm.StationId;
    }
  }
  OnReportChnage(evt) {
    this.selectedReport = evt.target.value;
    if (this.selectedReport == "DPR") {
      this.IsJMRSelected = true;
      this.IsRegionDisable = true;
      this.IsStationDisable = true;
      this.IsDatesDisable = true;
      this.todateshow= false;
    }
    else if (this.selectedReport == "DPR MOTOR DRIVEN PACKAGE") {
      this.IsJMRSelected = true;
      this.IsRegionDisable = true;
      this.IsStationDisable = true;
      this.IsDatesDisable = true;
      this.todateshow= false;
    }
    else if (this.selectedReport == "PENDING STATIONS") {
       this.IsJMRSelected = true;
       this.IsRegionDisable=false;
       this.IsStationDisable=false;
       this.IsDatesDisable=false;
    }
    else if (this.selectedReport == "JMR REPORT") {
      this.IsJMRSelected = false;
      this.IsRegionDisable = true;
      this.IsStationDisable = true;
      this.IsDatesDisable = false;
    }
    else if (this.selectedReport == "DPR SUBMISSION REPORT") {
      this.IsJMRSelected = true;
      this.IsRegionDisable = true;
      this.IsStationDisable = true;
      this.IsDatesDisable = false;
    }
    else if (this.selectedReport == "CR SUBMISSION REPORT") {
      this.IsJMRSelected = true;
      this.IsRegionDisable = true;
      this.IsStationDisable = true;
    }
    else if (this.selectedReport == "GAS RECONCILIATION REPORT") {
      this.IsJMRSelected = true;
      this.IsRegionDisable = true;
      this.IsStationDisable = true;
    }
    else if (this.selectedReport == "PACKAGE AVAILABILITY REPORT") {
      this.IsJMRSelected = true;
      this.IsRegionDisable = false;
      this.IsStationDisable = false;
      this.IsDatesDisable = false;
    }
    else if (this.selectedReport == "TrendReports") {
      this.IsJMRSelected = false;
      this.IsRegionDisable = true;
      this.IsStationDisable = true;
      this.IsDatesDisable = true;
      this.todateshow= false;
    }
    else {
      this.IsJMRSelected = true;
      this.IsStationDisable = false;
      this.IsDatesDisable = false;
    }
  }
  onRegionSelect(val) {
    this.selectedRegion = val;
    if (this.selectedRegion != "All") {
      this.selectedStation = '';
      this.IsStationDisable = false;
      this.objDbServ.getStationDetails({ControlRoomCode: this.ControlRoomCode, Region: this.selectedRegion, Flag: this.ReportFlag }).subscribe(
        (resp: any) => {
          this.StationList = JSON.parse(resp.json()).Table;
        },
        (error) => {
          alert('Something went wrong.');
        }
      )
    }
    else if (this.selectedRegion == "All") {
      this.selectedStation = '';
      this.IsStationDisable = false;
      this.objDbServ.getStationDetails({ControlRoomCode: this.ControlRoomCode, Region: this.selectedRegion, Flag: this.ReportFlag }).subscribe(
        (resp: any) => {
          this.StationList = JSON.parse(resp.json()).Table;
        },
        (error) => {
          alert('Something went wrong.');
        }
      )
    }
    else {
      this.IsStationDisable = true;
    }
  }
  GetCOStation() {
    if (this.ReportFlag == 'CO') {
       this.selectedRegion='All';
       this.IsStationDisable=true;
      this.objDbServ.getStationDetails({ControlRoomCode: this.ControlRoomCode, Region: this.selectedRegion, Flag: this.ReportFlag }).subscribe(
        (resp: any) => {
          this.StationList = JSON.parse(resp.json()).Table;
        },
        (error) => {
          alert('Something went wrong.');
        }
      )
    }
  }
  GetRegionByDept() {
    this.objDbServ.ShowLoaders.emit(true);
    this.objDbServ.CommonGetData({ Flag: 'StationSubmittedStatusForMO', Id: this.objCook.get('UID') }).subscribe(
      (resp: any) => {
        this.RegionList = JSON.parse(resp.json()).Table1
        this.objDbServ.ShowLoaders.emit(false);
      },
      (error) => {
        alert('Something went wrong.');
        this.objDbServ.ShowLoaders.emit(false);
      }
    )
  }
  onStationSelect(val) {
    this.selectedStation = val;
  }
  GetExportDPRreports() {
    if (this.ValidationReports()) {
      const obj = {
        LoginID: this.LoginID,
        ControlRoomCode: this.ControlRoomCode,
        flag: 'Export',
        FromDate: this.dateFrom,
        ToDate: this.dateTo,
        Region: (this.selectedRegion === undefined) ? "" : this.selectedRegion,
        StationId: this.selectedStation,
        SelectedDate: (this.selectedReport == "DPR" || this.selectedReport == "DPR MOTOR DRIVEN PACKAGE"|| this.selectedReport == "TrendReports" ) ? this.dateFrom : this.CurrentDate
      }
      if (this.selectedReport == "DPR") {
        this.objDbServ.ShowProgress.emit(true);
        this.objDbServ.ExportDPR(obj).subscribe(
          (resp: any) => {
            const data = JSON.parse(resp.json());
            if (data.FileName != '') {
              if (JSON.parse(resp.json()).errMsg == 'success') {
                window.location.href = this.objDbServ.apiImageAttachment + "/Attachments/Excel/" + JSON.parse(resp.json()).FileName
              }
              else {
                alert(JSON.parse(resp.json()).errMsg);
                this.objDbServ.ShowProgress.emit(false);
              }
              this.objDbServ.ShowProgress.emit(false);
            }
            else {
              alert(JSON.parse(resp.json()).errMsg);
              this.objDbServ.ShowProgress.emit(false);
            }
          },
          (error) => {
            alert('Something went wrong.');
            this.objDbServ.ShowProgress.emit(false);
          }
        )
      }
      else if (this.selectedReport == "PENDING STATIONS") {
        if (this.dateFrom != null && this.dateTo != null) {
          this.objDbServ.ShowProgress.emit(true);
          this.objDbServ.ExportPendingStations(obj).subscribe(
            (resp: any) => {
              const data = JSON.parse(resp.json());
              if (data.FileName != '') {
                if (JSON.parse(resp.json()).errMsg == 'success') {
                  window.location.href = this.objDbServ.apiImageAttachment + "/Attachments/Excel/" + JSON.parse(resp.json()).FileName
                  this.objDbServ.ShowProgress.emit(false);
                }
                else {
                  alert(JSON.parse(resp.json()).errMsg)
                  this.objDbServ.ShowProgress.emit(false);
                }
              }
              else {
                alert("No Data found.!");
                this.objDbServ.ShowProgress.emit(false);
              }
            },
            (error) => {
              alert('Something went wrong.');
              this.objDbServ.ShowProgress.emit(false);
            }
          )
        }
        else {
          alert('Please Select Reporting Date.');
        }
      }
      else if (this.selectedReport == "OPENING CLOSING") {
        if (this.dateFrom != null && this.dateTo != null) {
          this.objDbServ.ShowProgress.emit(true);
          this.objDbServ.ExportClosingOpenig(obj).subscribe(
            (resp: any) => {
              const data = JSON.parse(resp.json());
              if (data.FileName != '') {
                if (JSON.parse(resp.json()).errMsg == 'success') {
                  window.location.href = this.objDbServ.apiImageAttachment + "/Attachments/Excel/" + JSON.parse(resp.json()).FileName
                  this.objDbServ.ShowProgress.emit(false);
                }
                else {
                  alert(JSON.parse(resp.json()).errMsg)
                  this.objDbServ.ShowProgress.emit(false);
                }
              }
              else {
                alert("No Data found.!");
                this.objDbServ.ShowProgress.emit(false);
              }
            },
            (error) => {
              alert('Something went wrong.');
              this.objDbServ.ShowProgress.emit(false);
            }
          )
        }
        else {
          alert('Please Select Reporting Date.');
        }
      }
      else if (this.selectedReport == "REMARK HISTORY") {
        if (this.dateFrom != null && this.dateTo != null) {
          this.objDbServ.ShowProgress.emit(true);
          this.objDbServ.ExportRemarkHistory(obj).subscribe(
            (resp: any) => {
              const data = JSON.parse(resp.json());
              if (data.FileName != '') {
                if (JSON.parse(resp.json()).errMsg == 'success') {
                  window.location.href = this.objDbServ.apiImageAttachment + "/Attachments/Excel/" + JSON.parse(resp.json()).FileName
                  this.objDbServ.ShowProgress.emit(false);
                }
                else {
                  alert(JSON.parse(resp.json()).errMsg)
                  this.objDbServ.ShowProgress.emit(false);
                }
              }
              else {
                alert("No Data found.!");
                this.objDbServ.ShowProgress.emit(false);
              }
            },
            (error) => {
              alert('Something went wrong.');
              this.objDbServ.ShowProgress.emit(false);
            }
          )
        }
        else {
          alert('Please Select Reporting Date.');
        }
      }
      else if (this.selectedReport == "REJECT STATION HISTORY") {
        if (this.dateFrom != null && this.dateTo != null) {
          this.objDbServ.ShowProgress.emit(true);
          this.objDbServ.ExportRejectStationHistory(obj).subscribe(
            (resp: any) => {
              const data = JSON.parse(resp.json());
              if (data.FileName != '') {
                if (JSON.parse(resp.json()).errMsg == 'success') {
                  window.location.href = this.objDbServ.apiImageAttachment + "/Attachments/Excel/" + JSON.parse(resp.json()).FileName
                  this.objDbServ.ShowProgress.emit(false);
                }
                else {
                  alert(JSON.parse(resp.json()).errMsg)
                  this.objDbServ.ShowProgress.emit(false);
                }
              }
              else {
                alert("No Data found.!");
                this.objDbServ.ShowProgress.emit(false);
              }
            },
            (error) => {
              alert('Something went wrong.');
              this.objDbServ.ShowProgress.emit(false);
            }
          )
        }
        else {
          alert('Please Select Reporting Date.');
        }
      }
      else if (this.selectedReport == "JUMP READING") {
        if (this.dateFrom != null && this.dateTo != null) {
          this.objDbServ.ShowProgress.emit(true);
          this.objDbServ.ExportJumpReading(obj).subscribe(
            (resp: any) => {
              const data = JSON.parse(resp.json());
              if (data.FileName != '') {
                if (JSON.parse(resp.json()).errMsg == 'success') {
                  window.location.href = this.objDbServ.apiImageAttachment + "/Attachments/Excel/" + JSON.parse(resp.json()).FileName
                  this.objDbServ.ShowProgress.emit(false);
                }
                else {
                  alert(JSON.parse(resp.json()).errMsg)
                  this.objDbServ.ShowProgress.emit(false);
                }
              }
              else {
                alert("No Data found.!");
                this.objDbServ.ShowProgress.emit(false);
              }
            },
            (error) => {
              alert('Something went wrong.');
              this.objDbServ.ShowProgress.emit(false);
            }
          )
        }
        else {
          alert('Please Select Reporting Date.');
        }
      }
      else if (this.selectedReport == "JMR REPORT") {
        if (this.dateFrom != null && this.dateTo != null) {
          this.objDbServ.ShowProgress.emit(true);
          this.objDbServ.ExportJMRReport(obj).subscribe(
            (resp: any) => {
              const data = JSON.parse(resp.json());
              this.objDbServ.ShowProgress.emit(false);
              if (data.FileName != '') {
                if (JSON.parse(resp.json()).errMsg == 'success') {
                  window.location.href = this.objDbServ.apiImageAttachment + "/Attachments/Excel/" + JSON.parse(resp.json()).FileName
                  this.objDbServ.ShowProgress.emit(false);
                }
                else {
                  alert(JSON.parse(resp.json()).errMsg)
                  this.objDbServ.ShowProgress.emit(false);
                }
              }
              else {
                alert("No Data found.!");
                this.objDbServ.ShowProgress.emit(false);
              }
            },
            (error) => {
              alert('Something went wrong.');
              this.objDbServ.ShowProgress.emit(false);
            }
          )
        }
        else {
          alert('Please Select Reporting Date.');
        }
      }
      else if (this.selectedReport == "DPR SUBMISSION REPORT") {
        if (this.dateFrom != null && this.dateTo != null) {
          this.objDbServ.ShowProgress.emit(true);
          this.objDbServ.ExportDPRSubmissionReport(obj).subscribe(
            (resp: any) => {
              const data = JSON.parse(resp.json());
              this.objDbServ.ShowProgress.emit(false);
              if (data.FileName != '') {
                if (JSON.parse(resp.json()).errMsg == 'success') {
                  window.location.href = this.objDbServ.apiImageAttachment + "/Attachments/Excel/" + JSON.parse(resp.json()).FileName
                  this.objDbServ.ShowProgress.emit(false);
                }
                else {
                  alert(JSON.parse(resp.json()).errMsg)
                  this.objDbServ.ShowProgress.emit(false);
                }
              }
              else {
                alert("No Data found.!");
                this.objDbServ.ShowProgress.emit(false);
              }
            },
            (error) => {
              alert('Something went wrong.');
              this.objDbServ.ShowProgress.emit(false);
            }
          )
        }
        else {
          alert('Please Select Reporting Date.');
        }
      }
      else if (this.selectedReport == "CR SUBMISSION REPORT") {
        if (this.dateFrom != null && this.dateTo != null) {
          this.objDbServ.ShowProgress.emit(true);
          this.objDbServ.ExportCRSubmissionReport(obj).subscribe(
            (resp: any) => {
              const data = JSON.parse(resp.json());
              this.objDbServ.ShowProgress.emit(false);
              if (data.FileName != '') {
                if (JSON.parse(resp.json()).errMsg == 'success') {
                  window.location.href = this.objDbServ.apiImageAttachment + "/Attachments/Excel/" + JSON.parse(resp.json()).FileName
                  this.objDbServ.ShowProgress.emit(false);
                }
                else {
                  alert(JSON.parse(resp.json()).errMsg)
                  this.objDbServ.ShowProgress.emit(false);
                }
              }
              else {
                alert("No Data found.!");
                this.objDbServ.ShowProgress.emit(false);
              }
            },
            (error) => {
              alert('Something went wrong.');
              this.objDbServ.ShowProgress.emit(false);
            }
          )
        }
        else {
          alert('Please Select Reporting Date.');
        }
      }
      else if (this.selectedReport == "GAS RECONCILIATION REPORT") {
        if (this.dateFrom != null && this.dateTo != null) {
          this.objDbServ.ShowProgress.emit(true);
          this.objDbServ.ExportGasReconciliationReport(obj).subscribe(
            (resp: any) => {
              const data = JSON.parse(resp.json());
              this.objDbServ.ShowProgress.emit(false);
              if (data.FileName != '') {
                if (JSON.parse(resp.json()).errMsg == 'success') {
                  window.location.href = this.objDbServ.apiImageAttachment + "/Attachments/Excel/" + JSON.parse(resp.json()).FileName
                  this.objDbServ.ShowProgress.emit(false);
                }
                else {
                  alert(JSON.parse(resp.json()).errMsg)
                  this.objDbServ.ShowProgress.emit(false);
                }
              }
              else {
                alert("No Data found.!");
                this.objDbServ.ShowProgress.emit(false);
              }
            },
            (error) => {
              alert('Something went wrong.');
              this.objDbServ.ShowProgress.emit(false);
            }
          )
        }
        else {
          alert('Please Select Reporting Date.');
        }
      }
      else if (this.selectedReport == "PACKAGE AVAILABILITY REPORT") {
        this.objDbServ.ShowProgress.emit(true);
        if (this.dateFrom != null && this.dateTo != null) {
          this.objDbServ.PackageAvailability(obj).subscribe(
            (resp: any) => {
              const data = JSON.parse(resp.json());
              if (data.FileName != '') {
                if (JSON.parse(resp.json()).errMsg == 'success') {
                  window.location.href = this.objDbServ.apiImageAttachment + "/Attachments/Excel/" + JSON.parse(resp.json()).FileName
                  this.objDbServ.ShowProgress.emit(false);
                }
                else {
                  alert(JSON.parse(resp.json()).errMsg)
                  this.objDbServ.ShowProgress.emit(false);
                }
              }
              else {
                alert(JSON.parse(resp.json()).errMsg)
                this.objDbServ.ShowProgress.emit(false);
              }
            },
            (error) => {
              alert('Something went wrong.');
              this.objDbServ.ShowProgress.emit(false);
            }
          )
        }
        else {
          alert('Please Select Reporting Date.');
        }
      }
      else if (this.selectedReport == "DPR MOTOR DRIVEN PACKAGE") {
        this.objDbServ.ShowProgress.emit(true);
        this.objDbServ.MOTORDRIVENPACKAGE(obj).subscribe(
          (resp: any) => {
            const data = JSON.parse(resp.json());
            if (data.FileName != '') {
              if (JSON.parse(resp.json()).errMsg == 'success') {
                window.location.href = this.objDbServ.apiImageAttachment + "/Attachments/Excel/" + JSON.parse(resp.json()).FileName
              }
              else {
                alert(JSON.parse(resp.json()).errMsg);
                this.objDbServ.ShowProgress.emit(false);
              }
              this.objDbServ.ShowProgress.emit(false); 
            }
            else {
              alert(JSON.parse(resp.json()).errMsg);
              this.objDbServ.ShowProgress.emit(false);
            }
          },
          (error) => {
            alert('Something went wrong.');
            this.objDbServ.ShowProgress.emit(false);
          }
        )
      }
      else if (this.selectedReport == "TrendReports") {
        this.objDbServ.ShowProgress.emit(true);
        this.objDbServ.TrendReportsExport(obj).subscribe(
          (resp: any) => {
            const data = JSON.parse(resp.json());
            if (data.FileName != '') {
              if (JSON.parse(resp.json()).errMsg == 'success') {
                window.location.href = this.objDbServ.apiImageAttachment + "/Attachments/Excel/" + JSON.parse(resp.json()).FileName
              }
              else {
                alert(JSON.parse(resp.json()).errMsg);
                this.objDbServ.ShowProgress.emit(false);
              }
              this.objDbServ.ShowProgress.emit(false); 
            }
            else {
              alert(JSON.parse(resp.json()).errMsg);
              this.objDbServ.ShowProgress.emit(false);
            }
          },
          (error) => {
            alert('Something went wrong.');
            this.objDbServ.ShowProgress.emit(false);
          }
        )
      }
    }
  }
  onReportShow() {
    this.activeDPRReport = false;
    if (this.ValidationReports()) {
      const obj = {
        LoginID: this.LoginID,
        ControlRoomCode: this.ControlRoomCode,
        flag: 'Export',
        FromDate: this.dateFrom,
        ToDate: this.dateTo,
        Region: (this.selectedRegion === undefined) ? "" : this.selectedRegion,
        StationId:this.selectedStation,
        SelectedDate: (this.selectedReport == "DPR"|| this.selectedReport == "DPR MOTOR DRIVEN PACKAGE"|| this.selectedReport == "TrendReports") ? this.dateFrom : this.CurrentDate,
        SelectedReport: this.selectedReport
      }
      this.objDbServ.ShowProgress.emit(true);
      if (this.dateFrom != null && this.dateTo != null) {
        this.objDbServ.ExcelExportDPRForHTML(obj).subscribe(
          (resp: any) => {
            this.ResponseList = JSON.parse(resp.json()).Table;
            if (this.selectedReport == "DPR") {
              this.activeDPRReport = true;
              this.ResponseList = JSON.parse(resp.json()).Table;
              this.DPR = JSON.parse(resp.json()).Table;
              this.DPRegionSale = JSON.parse(resp.json()).Table1;
              if (this.DPR.length != 0 || this.DPRegionSale.length != 0) {
                this.columns = Object.keys(this.ResponseList[0]);
                this.columnsDPR = Object.keys(this.DPR[0]);
                this.columnsDPRRegionSale = Object.keys(this.DPRegionSale[0]);
              } else {
                this.columns = [];
                alert('No Data found');
              }
            }
            if (this.ResponseList.length != 0) {
              this.columns = Object.keys(this.ResponseList[0]);
            } else {
              this.columns = [];
              alert('No Data found');
            }
            this.objDbServ.ShowProgress.emit(false);
          },
          (error) => {
            alert('Something went wrong.');
            this.objDbServ.ShowProgress.emit(false);
          }
        )
      }
      else {
        alert('Please Select Reporting Date.');
      }
    }
  }
  ValidationReports() {
    this.errorFound = true;
    var d1 = new Date(Date.parse(this.dateFrom));
    var d2 = new Date(Date.parse(this.dateTo));
    if ((d1 > d2)) {
      alert('From Date cant be greater than To Date.');
      this.errorFound = false;
    }
    if (this.selectedReport == "" || isNullOrUndefined(this.selectedReport)) {
      alert('Please select Report.!');
      this.errorFound = false;
    }
    return this.errorFound;
  }
  checkdifference(dateFrom, dateTo) {
    var date1 = new Date(dateFrom);
    var date2 = new Date(dateTo);
    var Difference_In_Time = date2.getTime() - date1.getTime();
    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
    if (Difference_In_Days > 31 && this.selectedReport != "DPR" && this.selectedReport != "DPR MOTOR DRIVEN PACKAGE" && this.selectedReport != "TrendReports") {
      this.dateRange = true;
      alert('Please Select Date Range within one month');
    }
    else {
      this.dateRange = false;
    }
  }
  sortCol(key: string) {
    this.sortingColumn = key;
    this.key = key;
    this.reverse = !this.reverse;
  }
  OnChangeStatus(evt, flag: string) {
    if (flag == 'dpr') {
      $("#PMCheck").prop("checked", true);
      $("#tgt_div").animate({ left: "0px" });
      if (this.DPR.length != 0) {
        this.ResponseList = this.DPR;
        this.columns = this.columnsDPR;
      } else {
        this.columns = [];
        alert('No Data found');
      }
    }
    else if (flag == 'dprRegionSale') {
      $("#ef").prop("checked", true);
      $("#tgt_div").animate({ left: "95px" });
      if (this.DPRegionSale.length != 0) {
        this.ResponseList = this.DPRegionSale;
        this.columns = this.columnsDPRRegionSale;
      }
      else {
        this.columns = [];
        alert('No Data found');
      }
    }
  }
  SetDropDownSetting(){
    this.dropdownSettings  = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
  }
  onItemSelect(item: any) {
  }
  onItemDeSelect(item: any) {
  }
  onSelectAll(items: any) {
  }
  onDeSelectAll() {
  }
}
