import { Component, OnInit } from '@angular/core';
import { dbService } from '../../Service/db.service';
import { Response } from '@angular/http';
import { CookieService } from 'ngx-cookie-service';
import { ngxCsv } from 'ngx-csv/ngx-csv';
import { DatepickerOptions } from 'ng2-datepicker';
import * as enLocale from 'date-fns/locale/en';
import { isNullOrUndefined } from 'util';
declare var $: any;
@Component({
  selector: 'app-station-asset-status',
  templateUrl: './station-asset-status.component.html',
  styleUrls: ['./station-asset-status.component.css']
})
export class StationAssetStatusComponent implements OnInit {
  constructor(private objDbServ: dbService, private objCook: CookieService) {
    this.objDbServ.MasterCompDisplay.emit(true);
    this.objDbServ.HeaderDisplay.emit(true);
    this.objDbServ.LeftMenu.emit(true);
  }
  StationList: any = [];
  AssetList: any = [];
  ShiftList: any = [];
  SubShiftList: any = [];
  SubShiftList_To: any = [];
  listData: any = [];
  filter: string = '';
  key: string = 'Id';
  reverse: boolean = true;
  sortingColumn: string = '';
  errorFound: boolean;
  UserId: string = this.objCook.get('UID');
  DeptCode: string = this.objCook.get('DepartmentCode');
  IsStationLogin: boolean = this.objCook.get('DepartmentCode') != 'MO';
  StationName: string = '';
  RecipientList: any = [];
  Id: string = '0';
  StationId: string = '';
  AssetKey: string = 'Station|0';       // AssetType|AssetId, "Station|0" = whole station
  SelectedShiftId: string = '';
  SubShiftId: string = '';
  SelectedShiftId_To: string = '';
  SubShiftId_To: string = '';
  StatusFlag: string = 'InActive';
  AlertMode: string = 'Email';
  Remark: string = '';
  DateFrom: string;
  DateTo: string;
  monthNames = [
    'Jan', 'Feb', 'Mar',
    'Apr', 'May', 'Jun', 'Jul',
    'Aug', 'Sep', 'Oct',
    'Nov', 'Dec'
  ];
  options: DatepickerOptions = {
    minYear: 2021,
    locale: enLocale,
    displayFormat: 'DD-MMM-YYYY',
    maxDate: null,
    minDate: null
  };
  ngOnInit() {
    this.DateFrom = this.objCook.get('CurrentDate');
    this.DateTo = this.objCook.get('CurrentDate');
    setTimeout(() => {
      this.getShift();
      if (this.IsStationLogin) {
        // station login - the station is fixed, it is the one that is logged in
        this.StationId = this.objCook.get('stationId');
        this.getStationById();
        this.getAssets();
        this.getData();
        this.getRecipients();
      } else {
        // MO login - list only, across every station mapped to this MO
        this.StationId = '';
        this.getStations();
        this.getData();
      }
    });
  }
  getStationById() {
    this.objDbServ.getStationAssetStatus({ Flag: 'StationById', StationId: this.StationId }).subscribe(
      (resp: Response) => {
        const tbl = JSON.parse(resp.json()).Table;
        if (tbl != undefined && tbl.length > 0) {
          this.StationName = tbl[0].StationName + ' (' + tbl[0].StationCode + ')';
        }
      },
      (error) => {
        alert('Something went wrong.');
        this.objDbServ.ShowLoaders.emit(false);
      }
    );
  }
  getRecipients() {
    this.RecipientList = [];
    if (this.StationId == '') { return; }
    this.objDbServ.getStationAssetStatus({ Flag: 'Recipients', StationId: this.StationId }).subscribe(
      (resp: Response) => {
        this.RecipientList = JSON.parse(resp.json()).Table;
      },
      (error) => {
        alert('Something went wrong.');
        this.objDbServ.ShowLoaders.emit(false);
      }
    );
  }
  getStations() {
    this.objDbServ.getStationAssetStatus({ Flag: 'StationsByMO', UserId: this.UserId }).subscribe(
      (resp: Response) => {
        this.StationList = JSON.parse(resp.json()).Table;
      },
      (error) => {
        alert('Something went wrong.');
        this.objDbServ.ShowLoaders.emit(false);
      }
    );
  }
  getAssets() {
    this.AssetList = [];
    if (this.StationId == '') { return; }
    this.objDbServ.getStationAssetStatus({ Flag: 'AssetsByStation', StationId: this.StationId }).subscribe(
      (resp: Response) => {
        this.AssetList = JSON.parse(resp.json()).Table;
      },
      (error) => {
        alert('Something went wrong.');
        this.objDbServ.ShowLoaders.emit(false);
      }
    );
  }
  getData() {
    if (this.IsStationLogin && this.StationId == '') { return; }
    const stationFilter = this.StationId == '' ? '0' : this.StationId;
    this.objDbServ.getStationAssetStatus({ Flag: 'StatusList', StationId: stationFilter, UserId: this.UserId }).subscribe(
      (resp: Response) => {
        this.listData = JSON.parse(resp.json()).Table;
      },
      (error) => {
        alert('Something went wrong.');
        this.objDbServ.ShowLoaders.emit(false);
      }
    );
  }
  getShift() {
    this.objDbServ.getStation({ Flag: 'StationShift', Id: 0, Status: 1 }).subscribe(
      (resp: Response) => {
        this.ShiftList = JSON.parse(resp.json()).Table;
      },
      (error) => {
        alert('Something went wrong.');
        this.objDbServ.ShowLoaders.emit(false);
      }
    );
  }
  getSubShift() {
    this.objDbServ.getStation({ Flag: 'SubShift', Id: this.SelectedShiftId, Status: 1 }).subscribe(
      (resp: Response) => {
        this.SubShiftList = JSON.parse(resp.json()).Table;
      },
      (error) => {
        alert('Something went wrong.');
        this.objDbServ.ShowLoaders.emit(false);
      }
    );
  }
  getSubShift_To() {
    this.objDbServ.getStation({ Flag: 'SubShift', Id: this.SelectedShiftId_To, Status: 1 }).subscribe(
      (resp: Response) => {
        this.SubShiftList_To = JSON.parse(resp.json()).Table;
      },
      (error) => {
        alert('Something went wrong.');
        this.objDbServ.ShowLoaders.emit(false);
      }
    );
  }
  onStationSelect(val) {
    this.StationId = val;
    this.resetForm();
    if (this.StationId != '') {
      this.getAssets();
      this.getRecipients();
    } else {
      this.AssetList = [];
      this.RecipientList = [];
    }
    this.getData();
  }
  onShiftSelect(val) {
    this.SelectedShiftId = val;
    this.SubShiftId = '';
    this.getSubShift();
  }
  onShiftSelect_To(val) {
    this.SelectedShiftId_To = val;
    this.SubShiftId_To = '';
    this.getSubShift_To();
  }
  OnDateChnageFrom(val) {
    const dt = new Date(val);
    this.DateFrom = dt.getDate() + '/' + this.monthNames[dt.getMonth()] + '/' + dt.getFullYear();
  }
  OnDateChnageTo(val) {
    const dt = new Date(val);
    this.DateTo = dt.getDate() + '/' + this.monthNames[dt.getMonth()] + '/' + dt.getFullYear();
  }
  editRecord(itm) {
    if (!this.IsStationLogin) { return; }   // MO view is read only
    this.Id = itm.Id;
    this.AssetKey = itm.AssetType + '|' + itm.AssetId;
    this.DateFrom = itm.FromDate;
    this.DateTo = itm.ToDate;
    this.SelectedShiftId = itm.ShiftId;
    this.SelectedShiftId_To = itm.ShiftId_To;
    this.StatusFlag = itm.Status;
    this.AlertMode = itm.AlertMode;
    this.Remark = itm.Remark;
    if (this.SelectedShiftId != '' && !isNullOrUndefined(this.SelectedShiftId)) {
      this.objDbServ.getStation({ Flag: 'SubShift', Id: this.SelectedShiftId, Status: 1 }).subscribe(
        (resp: Response) => {
          this.SubShiftList = JSON.parse(resp.json()).Table;
          this.SubShiftId = itm.SubShiftId;
        }
      );
    }
    if (this.SelectedShiftId_To != '' && !isNullOrUndefined(this.SelectedShiftId_To)) {
      this.objDbServ.getStation({ Flag: 'SubShift', Id: this.SelectedShiftId_To, Status: 1 }).subscribe(
        (resp: Response) => {
          this.SubShiftList_To = JSON.parse(resp.json()).Table;
          this.SubShiftId_To = itm.SubShiftId_To;
        }
      );
    }
    $('html, body').animate({ scrollTop: 0 }, 300);
  }
  resetForm() {
    this.Id = '0';
    this.AssetKey = 'Station|0';
    this.StatusFlag = 'InActive';
    this.AlertMode = 'Email';
    this.Remark = '';
    this.SelectedShiftId = '';
    this.SubShiftId = '';
    this.SelectedShiftId_To = '';
    this.SubShiftId_To = '';
    this.SubShiftList = [];
    this.SubShiftList_To = [];
    this.DateFrom = this.objCook.get('CurrentDate');
    this.DateTo = this.objCook.get('CurrentDate');
  }
  insertRecord() {
    this.errorFound = true;
    if (this.Validation()) {
      const asset = this.AssetKey.split('|');
      const obj = {
        Id: this.Id,
        StationId: this.StationId,
        AssetType: asset[0],
        AssetId: asset[1],
        FromDate: this.DateFrom,
        ToDate: this.DateTo,
        ShiftId: this.SelectedShiftId,
        SubShiftId: this.SubShiftId,
        ShiftId_To: this.SelectedShiftId_To,
        SubShiftId_To: this.SubShiftId_To,
        Status: this.StatusFlag,
        Remark: this.Remark,
        AlertMode: this.AlertMode,
        UserId: this.UserId
      };
      this.objDbServ.ShowLoaders.emit(true);
      this.objDbServ.InsertStationAssetStatus(obj).subscribe(
        (resp: Response) => {
          const data = JSON.parse(resp.json());
          if (data.Table == undefined || data.Table.length == 0 || isNullOrUndefined(data.Table[0].Mesage)) {
            alert('Something went wrong.');
            this.objDbServ.ShowLoaders.emit(false);
            return;
          }
          let msg = data.Table[0].Mesage;
          if (data.Table1 != undefined && data.Table1.length > 0 && data.Table1[0].AlertSummary != '') {
            msg = msg + '\n' + data.Table1[0].AlertSummary;
          }
          if (data.Table[0].Mesage.indexOf('successfully') > -1) {
            this.resetForm();
            this.getData();
          }
          alert(msg);
          this.objDbServ.ShowLoaders.emit(false);
        },
        (error) => {
          alert('Something went wrong.');
          this.objDbServ.ShowLoaders.emit(false);
        }
      );
    }
  }
  Validation() {
    if (this.StationId == '' || isNullOrUndefined(this.StationId)) {
      alert('Station must be selected.');
      this.errorFound = false;
    } else if (this.AssetKey == '' || isNullOrUndefined(this.AssetKey)) {
      alert('Asset must be selected.');
      this.errorFound = false;
    } else if (this.StatusFlag == '' || isNullOrUndefined(this.StatusFlag)) {
      alert('Status must be selected.');
      this.errorFound = false;
    } else if (this.SelectedShiftId == '' || isNullOrUndefined(this.SelectedShiftId)) {
      alert('Shift(From) must be Selected.');
      this.errorFound = false;
    } else if (this.SelectedShiftId_To == '' || isNullOrUndefined(this.SelectedShiftId_To)) {
      alert('Shift(To) must be Selected.');
      this.errorFound = false;
    } else if (this.Remark == '' || isNullOrUndefined(this.Remark)) {
      alert('Remark must be entered.');
      this.errorFound = false;
    }
    return this.errorFound;
  }
  sortCol(col) {
    this.key = col;
    this.sortingColumn = col;
    this.reverse = !this.reverse;
  }
  exportFile() {
    if (this.listData == undefined || this.listData.length == 0) {
      alert('No record to export.');
      return;
    }
    const exportList = [];
    this.listData.forEach(itm => {
      exportList.push({
        Station: itm.StationName,
        StationCode: itm.StationCode,
        Asset: itm.AssetType == 'Station' ? 'Whole Station' : itm.AssetType + ' - ' + itm.AssetName,
        From: itm.FromDate + ' ' + itm.ShiftFrom,
        To: itm.ToDate + ' ' + itm.ShiftTo,
        Status: itm.StatusDetails,
        Remark: itm.Remark,
        AlertMode: itm.AlertMode,
        AlertStatus: itm.AlertStatus,
        ReportedOn: itm.CreatedOn
      });
    });
    const opt = {
      fieldSeparator: ',',
      quoteStrings: '"',
      showLabels: true,
      useBom: true,
      headers: ['Station', 'Station Code', 'Asset', 'From', 'To', 'Status', 'Remark', 'Alert Mode', 'Alert Status', 'Reported On']
    };
    return new ngxCsv(exportList, 'StationAssetStatus', opt);
  }
}
