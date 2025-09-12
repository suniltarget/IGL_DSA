import { Component, OnInit } from '@angular/core';
import { dbService } from '../../Service/db.service';
import { CookieService } from 'ngx-cookie-service';
import { Response } from '@angular/http';
import { DatepickerOptions } from 'ng2-datepicker';
import * as enLocale from 'date-fns/locale/en';
import { EILSEQ } from 'constants';
import { isNullOrUndefined } from 'util';
import { Container } from '@angular/compiler/src/i18n/i18n_ast';
declare var $:any;
@Component({
  selector: 'app-report-master',
  templateUrl: './report-master.component.html',
  styleUrls: ['./report-master.component.css']
})
export class ReportMasterComponent implements OnInit {
  listDisp: any = [];
  DSStatus = ""
  RegionList: any[];
  StationList: any[];
  CompanyList: any[];
  ResponseList: any[];
  ResponseListCash: any[];
  ResponseListCashReCon: any[];
  CashReconIf: boolean = false;
  IsRegionSelected: boolean = false;
  IsStationPending: boolean = false;
  IsStationDisable: boolean = false;
  IsPaymentTypeDisable: boolean = false;
  IsDiffTextDisable: boolean = false;
  selectedReport: string;
  selectRegion: string='All';
  selectedRegion = 0;
  selectedStation: string;
  dateFrom: string = this.objCook.get('CurrentDate');
  dateTo: string = this.objCook.get('CurrentDate');
  CurrentDate: string = this.objCook.get('CurrentDate');
  dateRange: boolean = false;
  isZeroSale:boolean = false;
  selectedFilter: string = "All";
  errorFound: boolean = true;
  selectCompany: string;
  ReportFlag: string = this.objCook.get('DepartmentCode');
  JMRReportVisibility: boolean = false;
  UserId: string = this.objCook.get('UID');
  ControlRoomCodeVar: string = "All";
  IsJMRSelected: boolean = true;
  ModalName:string = '';
  DocumentImagePath:string = '';
  isClusterSelected: boolean ;
  monthNames = [
    "Jan", "Feb", "Mar",
    "Apr", "May", "Jun", "Jul",
    "Aug", "Sep", "Oct",
    "Nov", "Dec"
  ];
  dateFromSec
  date: Date;
  options: DatepickerOptions = {
    minYear: 2018,
    locale: enLocale,
    displayFormat: 'DD-MMM-YYYY',
    maxDate: new Date(this.CurrentDate)
  };
  fiterBox: boolean = false;
  filterBoxFlag: number = 0;
  stCodeMy: "";
  CDate: string;
  IsDatedisable = false;
  IsStationDisabled = false;
  AmtDiff : string = '00.0';
  columns: any[];
  columnsCheckbox: any[];
  columnsCash: string[] = [];
  columnsCashRecon: string[] = [];
  activeCashRecon: boolean = false;
  sortingColumn: string = "";
  key: string = 'Name';
  reverse: boolean = true;
  SheetType:string ='All';
  ReportType:string ='';
  selectedAll: any;
  selectedAllColumns: any;
  IscheckboxApply: boolean = false;
  dropdownSettings: { singleSelection: boolean; idField: string; textField: string; selectAllText: string; unSelectAllText: string; itemsShowLimit: number; allowSearchFilter: boolean; };
  constructor(private objDbServ: dbService, private objCook: CookieService) {
    this.objDbServ.MasterCompDisplay.emit(true);
    this.objDbServ.HeaderDisplay.emit(true);
    this.objDbServ.LeftMenu.emit(true);
    this.SetDropDownSetting();
    }
  ngOnInit() {
    var loginId = localStorage.getItem('LoginId');
    if (loginId.toLowerCase().indexOf('mo') > -1) {
      this.JMRReportVisibility = true;
    }
    else {
      this.JMRReportVisibility = false;
    }
    this.dateFrom = this.objCook.get('CurrentDate');
    this.dateTo = this.objCook.get('CurrentDate');
    this.RegionByDept();
    this.getDispList();
    this.onRegionSelect('All', this.selectCompany);
    $("#PMCheck").click(function(){
      $("#tgt_div").animate({left:"0px"});
    });
    $("#ef").click(function(){
      $("#tgt_div").animate({left: "95px"});
      });
  }
  RegionByDept() {
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
  onReportShow() {
    this.activeCashRecon = false;
    if (this.selectedReport == "CLUSTER COMPANY" ) {
        this.isClusterSelected = true;
      }
      else {
        this.isClusterSelected = false;
      }
    if (this.ValidationReports()) {
      this.objDbServ.ShowProgress.emit(true);
      const obj =
      {
        UserId: this.UserId,
        DateFrom: this.dateFrom,
        DateTo: this.dateTo,
        Flag: this.selectedReport,
        Region: (this.selectRegion=='') ? 'All' : this.selectRegion,
        ControlRoomCode: this.ControlRoomCodeVar,
        CompanyId: (this.selectCompany == 'All') ? '0' : this.selectCompany,
        SelectedStationId: this.selectedStation,
        DepartmentCode: this.ReportFlag,
        Filter:this.selectedFilter,
        SheetType : this.SheetType,
        ReportType: (this.selectedReport== "PAYMENT RECONCILIATION (2)") ? 3 : 0,
        AmtDiff : this.AmtDiff
      }
      if (this.IsStationPending == true && this.selectedReport == "PENDING STATIONS") {
        this.objDbServ.ExcelExportDSAForHTML(obj).subscribe(
          (resp: any) => {
            this.ResponseList = JSON.parse(resp.json()).Table;
            if (this.ResponseList.length != 0) {
              this.columns = Object.keys(this.ResponseList[0]);
              this.columnsCheckbox = this.ResponseList;
            }
             else {
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
      else if (this.IsStationPending == true && this.selectedReport == "DSA SUBMISSION REPORT") {
        this.objDbServ.ExportDSASubmissionReportForHTML(obj).subscribe(
          (resp: any) => {
            this.ResponseList = JSON.parse(resp.json());
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
      else if (this.selectedReport == "CASH RECON") {
        this.activeCashRecon = true;
        this.objDbServ.ExcelExportCashReconForHTML(obj).subscribe(
          (resp: any) => {
            this.ResponseList = JSON.parse(resp.json()).Table;
            this.ResponseListCash = JSON.parse(resp.json()).Table;
            this.ResponseListCashReCon = JSON.parse(resp.json()).Table1;
            if (this.ResponseListCash.length != 0 || this.ResponseListCashReCon.length != 0) {
              this.columns = Object.keys(this.ResponseList[0]);
              this.columnsCash = Object.keys(this.ResponseListCash[0]);
              this.columnsCashRecon = Object.keys(this.ResponseListCashReCon[0]);
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
      else if (this.IsStationPending == true && this.selectedReport == "STATION OPERATOR SUBMISSION REPORT") {
        this.objDbServ.ExportSOPSubmissionReportForHTML(obj).subscribe(
          (resp: any) => {
            this.ResponseList = JSON.parse(resp.json());
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
        if (this.IsRegionSelected == false) {
          if (this.dateFrom != null && this.dateTo != null && this.selectedReport != null && this.selectedReport != "")
          {
            this.objDbServ.ExcelExportDSAForHTML(obj).subscribe(
              (resp: any) => {
                this.ResponseList = JSON.parse(resp.json());
                if (this.ResponseList.length != 0) {
                  this.columns = Object.keys(this.ResponseList[0]);
                  this.columnsCheckbox =  Object.keys(this.ResponseList[0]);
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
            alert('Please select Report.!');
            this.objDbServ.ShowProgress.emit(false);
          }
        }
        else {
          if (this.dateFrom != null && this.dateTo != null && this.selectedReport != null) {
            this.objDbServ.ExcelExportDSAForHTML(obj).subscribe(
              (resp: any) => {
                this.ResponseList = JSON.parse(resp.json());
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
            alert('Please select Report.!');
            this.objDbServ.ShowProgress.emit(false);
          }
        }
      }
    }
  }
  OnChangeStatus(evt, flag:string) {
    if(flag=='dailyCash') {
      $("#PMCheck").prop("checked", true);
            $("#tgt_div").animate({left:"0px"});
      if (this.ResponseListCash.length != 0) {
        this.ResponseList = this.ResponseListCash;
        this.columns = this.columnsCash;
      } else {
        this.columns = [];
        alert('No Data found');
      }
    }
    else if(flag=='cashRecon') {
      $("#ef").prop("checked", true);
      $("#tgt_div").animate({left:"95px"});
      if (this.ResponseListCashReCon.length != 0) {
        this.ResponseList = this.ResponseListCashReCon;
        this.columns = this.columnsCashRecon;
      }
       else {
        this.columns = [];
        alert('No Data found');
      }
    }
  }
  onReportSelect() {
    if (this.ValidationReports()) {
      this.objDbServ.ShowProgress.emit(true);
      const obj =
      {
        UserId: this.UserId,
        DateFrom: this.dateFrom,
        DateTo: this.dateTo,
        Flag: this.selectedReport,
        Region: (this.selectRegion=='') ? 'All' : this.selectRegion,
        ControlRoomCode: this.ControlRoomCodeVar,
        CompanyId: (this.selectCompany == 'All') ? '0' : this.selectCompany,
        SelectedStationId: this.selectedStation,
        DepartmentCode: this.ReportFlag,
        Filter:this.selectedFilter,
        SheetType : this.SheetType,
        ReportType: (this.selectedReport=="PAYMENT RECONCILIATION (2)") ? 3 : 0,
        AmtDiff : this.AmtDiff
      }
      const obj1 =
      {
        UserId: this.UserId,
        FromDate: this.dateFrom,
        ToDate: this.dateTo,
        Flag: this.selectedReport,
        Region: (this.selectRegion=='') ? 'All' : this.selectRegion,
        ControlRoomCode: this.ControlRoomCodeVar,
        CompanyId: (this.selectCompany == 'All') ? '0' : this.selectCompany,
        SelectedStationId: this.selectedStation,
        DepartmentCode: this.ReportFlag,
        Filter:this.selectedFilter,
        SheetType : this.SheetType,
        ReportType: (this.selectedReport=="PAYMENT RECONCILIATION (2)") ? 3 : 0,
        AmtDiff : this.AmtDiff
      }
      if (this.IsStationPending == true && this.selectedReport == "STATION ENTRY STATUS") {
        this.objDbServ.ExcelExportDSA(obj).subscribe(
          (resp: any) => {
            var errMsg = JSON.parse(resp.json()).errMsg;
            if (errMsg == 'success') {
              var FileName = JSON.parse(resp.json()).FileName;
              window.location.href = this.objDbServ.apiImageAttachment + "/Attachments/Excel/" + FileName
              this.objDbServ.ShowProgress.emit(false);
            }
            else {
              alert(JSON.parse(resp.json()).errMsg)
              this.objDbServ.ShowProgress.emit(true);
            }
          },
          (error) => {
            alert('Something went wrong.');
            this.objDbServ.ShowProgress.emit(false);
          }
        )
      }
      else if (this.IsStationPending == true && this.selectedReport == "EXCEPTIONAL REPORT") {
        this.objDbServ.ExcelExportDSA(obj).subscribe(
          (resp: any) => {
            var errMsg = JSON.parse(resp.json()).errMsg;
            if (errMsg == 'success') {
              var FileName = JSON.parse(resp.json()).FileName;
              window.location.href = this.objDbServ.apiImageAttachment + "/Attachments/Excel/" + FileName
              this.objDbServ.ShowProgress.emit(false);
            }
            else {
              alert(JSON.parse(resp.json()).errMsg)
              this.objDbServ.ShowProgress.emit(true);
            }
          },
          (error) => {
            alert('Something went wrong.');
            this.objDbServ.ShowProgress.emit(false);
          }
        )
      }
      else if (this.IsStationPending == true && this.selectedReport == "DSA SUBMISSION REPORT") {
        this.objDbServ.ExportDSASubmissionReport(obj).subscribe(
          (resp: any) => {
            if (JSON.parse(resp.json()).errMsg == 'success') {
              var FileName = JSON.parse(resp.json()).FileName;
              window.location.href = this.objDbServ.apiImageAttachment + "/Attachments/Excel/" + FileName;
              this.objDbServ.ShowProgress.emit(false);
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
      else if (this.selectedReport == "CASH RECON") {
        this.objDbServ.ExcelExportCashRecon(obj).subscribe(
          (resp: any) => {
            if (JSON.parse(resp.json()).errMsg == 'success') {
              var FileName = JSON.parse(resp.json()).FileName;
              window.location.href = this.objDbServ.apiImageAttachment + "/Attachments/Excel/" + FileName;
              this.objDbServ.ShowProgress.emit(false);
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
      else if (this.IsStationPending == true && this.selectedReport == "STATION OPERATOR SUBMISSION REPORT") {
        this.objDbServ.ExportSOPSubmissionReport(obj).subscribe(
          (resp: any) => {
            if (JSON.parse(resp.json()).errMsg == 'success') {
              var FileName = JSON.parse(resp.json()).FileName;
              window.location.href = this.objDbServ.apiImageAttachment + "/Attachments/Excel/" + FileName
              this.objDbServ.ShowProgress.emit(false);
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
      else if (this.selectedReport == "JMR REPORT") {
        this.objDbServ.ExportJMRReport(obj1).subscribe(
          (resp: any) => {
            if (JSON.parse(resp.json()).errMsg == 'success') {
              var FileName = JSON.parse(resp.json()).FileName;
              window.location.href = this.objDbServ.apiImageAttachment + "/Attachments/Excel/" + FileName
              this.objDbServ.ShowProgress.emit(false);
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
        if (this.IsRegionSelected == false) {
          if (this.dateFrom != null && this.dateTo != null && this.selectedReport != null && this.selectedReport != "")
          {
            this.objDbServ.ExcelExportDSA(obj).subscribe(
              (resp: any) => {
                const data = JSON.parse(resp.json());
                if (data.FileName != '') {
                  if (JSON.parse(resp.json()).errMsg == 'success') {
                    var FileName = JSON.parse(resp.json()).FileName;
                    window.location.href = this.objDbServ.apiImageAttachment + "/Attachments/Excel/" + FileName
                    this.objDbServ.ShowProgress.emit(false);
                  }
                  else {
                    alert(JSON.parse(resp.json()).errMsg)
                    this.objDbServ.ShowProgress.emit(false);
                  }
                }
                else {
                  alert('No Report Data Found !');
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
            alert('Please select Report.!');
            this.objDbServ.ShowProgress.emit(false);
          }
        }
        else {
          if (this.dateFrom != null && this.dateTo != null && this.selectedReport != null) {
            this.objDbServ.ExcelExportDSA(obj).subscribe(
              (resp: any) => {
                const data = JSON.parse(resp.json());
                if (data.FileName != '') {
                  if (JSON.parse(resp.json()).errMsg == 'success') {
                    var FileName = JSON.parse(resp.json()).FileName;
                    window.location.href = this.objDbServ.apiImageAttachment + "/Attachments/Excel/" + FileName
                    this.objDbServ.ShowProgress.emit(false);
                  }
                  else {
                    alert(JSON.parse(resp.json()).errMsg)
                    this.objDbServ.ShowProgress.emit(false);
                  }
                }
                else {
                  alert('No Report Data Found !');
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
            alert('Please select Report.!');
            this.objDbServ.ShowProgress.emit(false);
          }
        }
      }
    }
  }
  onCompanySelect(val) {
    this.selectCompany = val;
    if (this.selectCompany.length > 0)
      this.onRegionSelect(this.selectRegion, this.selectCompany);
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
  onRegionSelect(val, CompanyId: string) {
    this.selectRegion = val;
    if (this.selectRegion != "All") {
      this.selectedStation = '';
      this.IsStationDisable = false;
      this.objDbServ.CommonGetData({ Id: this.selectRegion, CompanyId: this.selectCompany, ReportFlag: this.ReportFlag, Flag: 'StationByRegionIdForDSA_MultiDropdown', Status: '', UserId: this.UserId }).subscribe(
        (resp: any) => {
          this.StationList = JSON.parse(resp.json()).Table;
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
    else if (this.selectRegion == "All") {
      this.IsStationDisable = false;
      this.objDbServ.CommonGetData({ Id: this.selectRegion, CompanyId: CompanyId, ReportFlag: this.ReportFlag, Flag: 'StationByRegionIdForDSA_MultiDropdown', Status: '', UserId: this.UserId }).subscribe(
        (resp: any) => {
          this.StationList = JSON.parse(resp.json()).Table;
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
      this.IsStationDisable = true;
    }
  }
  GetCompany() {
    if (this.selectCompany != "All") {
      this.IsStationDisable = false;
      this.objDbServ.CommonGetData({ Id: 0, Flag: 'CompanyByRegion', Status: '', RegionId: this.selectRegion }).subscribe(
        (resp: any) => {
          this.CompanyList = JSON.parse(resp.json()).Table;
        },
        (error) => {
          alert('Something went wrong.');
        }
      )
    }
    else {
      this.selectCompany = '0';
    }
  }
  onStationSelect(val) {
    this.selectedStation = val;
  }
  OnPaymentTypeChnage(val) {
    this.SheetType = val.target.value;
    if(this.SheetType=='All')
       this.IscheckboxApply=false;
    else
      this.IscheckboxApply=true;
  }
  OnReportChnage(val) {
    this.selectedReport = val.target.value;
    this.selectedStation = '';
    if (this.selectedReport == "STATION ENTRY STATUS") {
      this.IsDatedisable = true;
      this.IsStationDisabled = true;
      this.isZeroSale = false;
      this.ControlRoomCodeVar='All';
      this.IsJMRSelected = true;
      this.IsPaymentTypeDisable =false;
    }
    else if (this.selectedReport == "EXCEPTIONAL REPORT") {
      this.IsDatedisable = true;
      this.IsStationDisabled = true;
      this.isZeroSale = false;
      this.ControlRoomCodeVar='All';
      this.IsJMRSelected = true;
      this.IsPaymentTypeDisable =false;
    }
    else if (this.selectedReport == "STATION STATUS REPORT") {
      this.IsDatedisable = true;
      this.IsStationDisabled = true;
      this.isZeroSale = false;
      this.ControlRoomCodeVar='All';
      this.IsJMRSelected = true;
      this.IsPaymentTypeDisable =false;
    }
    else if (this.selectedReport == "DSA SUBMISSION REPORT" || this.selectedReport == "STATION OPERATOR SUBMISSION REPORT") {
      this.IsStationPending = true;
      this.IsRegionSelected = true;
      this.IsStationDisable = true;
      this.selectRegion = 'All';
      this.selectCompany = 'All';
      this.isZeroSale = false;
      this.ControlRoomCodeVar='All';
      this.IsJMRSelected = true;
      this.IsPaymentTypeDisable =false;
    }
    else if (this.selectedReport == "ZERO SALE" ) {
      this.IsRegionSelected = false;
      this.selectRegion = '';
      this.IsStationDisable = false;
      this.IsDatedisable = false;
      this.IsStationDisabled = false;
      this.isZeroSale = true;
      this.ControlRoomCodeVar='All';
      this.IsJMRSelected = true;
      this.IsPaymentTypeDisable =false;
    }
    else if (this.selectedReport == "JMR REPORT" ) {
      this.IsRegionSelected = true;
      this.selectRegion = '';
      this.IsStationDisable = true;
      this.IsDatedisable = false;
      this.IsStationDisabled = true;
      this.isZeroSale = false;
      this.ControlRoomCodeVar=localStorage.getItem('LoginId');
      this.IsJMRSelected = false;
      this.IsPaymentTypeDisable =false;
    }
    else {
      this.IsRegionSelected = false;
      this.selectRegion = '';
      this.IsStationDisable = false;
      this.IsDatedisable = false;
      this.IsStationDisabled = false;
      this.isZeroSale = false;
      this.ControlRoomCodeVar='All';
      this.IsJMRSelected = true;
      this.IsPaymentTypeDisable =false;
    }
     if(this.selectedReport == "PAYMENT RECONCILIATION" ||this.selectedReport == "PAYMENT RECONCILIATION (2)")
     {
      this.IsPaymentTypeDisable=true; 
     }
    else{
      this.IsPaymentTypeDisable=false;
    }
    if(this.selectedReport == "PAYMENT RECONCILIATION (2)")
    {
      this.IsDiffTextDisable =true;  
    }
    else{
      this.IsDiffTextDisable =false;
    }
  }
  OnFilterChnage(val) {
    this.selectedFilter = val.target.value;
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
  OnDateChnagefromSec(val) {
    const dt = new Date(val);
    this.dateFromSec = dt.getDate() + "/" + this.monthNames[dt.getMonth()] + "/" + dt.getFullYear();
  }
  onReportSelectSec() {
    const obj = { dateFromSec: this.dateFromSec }
    if (this.dateFromSec != null) {
      this.objDbServ.ShowLoaders.emit(true);
      this.objDbServ.ExcelExportDSASec(obj).subscribe(
        (resp: any) => {
          if (JSON.parse(resp.json()).errMsg == 'success') {
            var FileName = JSON.parse(resp.json()).FileName;
            window.location.href = this.objDbServ.apiImageAttachment + "/Attachments/Excel/" + FileName
          }
          else {
            alert(JSON.parse(resp.json()).errMsg)
            this.objDbServ.ShowLoaders.emit(false);
          }
          this.objDbServ.ShowLoaders.emit(false);
        },
        (error) => {
          alert('Something went wrong.');
          this.objDbServ.ShowLoaders.emit(false);
        }
      )
    }
    else {
      alert('Please Select Reporting Date.');
    }
  }
  ValidationReports() {
    var d1 = new Date(Date.parse(this.dateFrom));
    var d2 = new Date(Date.parse(this.dateTo));
    if ((d1 > d2)) {
      alert('From Date cant be greater than To Date.');
      this.errorFound = false;
    }
    return this.errorFound;
  }
  checkdifference(dateFrom, dateTo) {
    var date1 = new Date(dateFrom);
    var date2 = new Date(dateTo);
    var Difference_In_Time = date2.getTime() - date1.getTime();
    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
    if (Difference_In_Days > 31 &&  (this.selectedReport!='SHIFT WISE PCS')) {
      this.dateRange = true;
      alert('Please Select Date Range within one month.');
    } 
    else if (Difference_In_Days > 15 && (this.selectedReport=='SHIFT WISE SALE')) {
      this.dateRange = true;
      alert('Please Select Date Range within two week.');
    }
    else if (Difference_In_Days > 7 && (this.selectedReport=='SHIFT WISE PCS')) {
      this.dateRange = true;
      alert('Please Select Date Range within one week.');
    }
    else {
      this.dateRange = false;
    }
  }
  getDispList() {
    this.objDbServ.ShowLoaders.emit(true);
    this.objDbServ.getDispList({ Flag: 'DispenserList', Status: this.DSStatus }).subscribe(
      (resp: Response) => {
        this.listDisp = JSON.parse(resp.json()).Table;
        this.objDbServ.ShowLoaders.emit(false);
      },
      (error) => {
        alert('Something went wrong.');
        this.objDbServ.ShowLoaders.emit(false);
      }
    )
  }
  sortCol(key: string) {
    this.sortingColumn = key;
    this.key = key;
    this.reverse = !this.reverse;
  }
  ViewVoucherImage(Path:string, itm:any){
    if(Path.split('.').pop() == "pdf") {
      this.ModalName = "#none";
      window.open(this.objDbServ.apiImageAttachment+"/Attachments/"+Path, '_blank');
    }
    else {
      this.ModalName = "#myModalVoucher";
      this.DocumentImagePath = this.objDbServ.apiImageAttachment+"/Attachments/"+Path;
    }
  }
  selectAll() {
    for (var i = 0; i < this.ResponseList.length; i++) {
      this.ResponseList[i].selected = this.selectedAll;
    }
  }
  checkIfAllSelected() {
    this.selectedAll = this.ResponseList.every(function(item:any) {
        return item.selected == true;
      })
  }
  MailSentCashRecon() {
    var temparray:any=[];
    temparray = this.ResponseList.filter(obj => obj.selected == true);
    if (temparray.length == 0) {
      alert('Please Select Altleast One Station.');
      return false;
    }
    var stJson = [];
    temparray.forEach(element => {
      stJson.push({
            StationName: element.StationName,
            SapCode: element.SapCode,
            StationCode: element.StationCode      
        });
    });
    const obj = {
      CashRecoEntryData :stJson,
      SheetType : this.SheetType,
      StartDate: this.dateFrom,
      EndDate: this.dateTo
    };
      this.objDbServ.ShowLoaders.emit(true);   
      this.objDbServ.MailSentCashRecon(obj).subscribe(
        (resp: any) => {
            const data= JSON.parse(resp.json()).Table;
            if(data[0].Mesage=="1") {
              alert('Mail sent Successfully.!');   
            }
            else {
              alert('Something went wrong.');
              this.objDbServ.ShowLoaders.emit(false);
            }
            this.objDbServ.ShowLoaders.emit(false);
        },
        (error) =>{
          alert('Something went wrong.');
        this.objDbServ.ShowLoaders.emit(false);
       }
    )
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
