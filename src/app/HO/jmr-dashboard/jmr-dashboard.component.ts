import { Component, OnInit } from '@angular/core';
import { dbService } from '../../Service/db.service';
import { Response } from '@angular/http';
import { DatepickerOptions } from 'ng2-datepicker';
import * as enLocale from 'date-fns/locale/en';
import { FilterSearchPipe } from '../../Filters/filter-search.pipe';
import { CookieService } from 'ngx-cookie-service';
import { isNullOrUndefined } from 'util';
declare var $: any;
@Component({
  selector: 'app-jmr-dashboard',
  templateUrl: './jmr-dashboard.component.html',
  styleUrls: ['./jmr-dashboard.component.css']
})
export class JMRDashboardComponent implements OnInit {
  StaionDetails: {}[];
  UserIdCook: string;
  UserType: string;
  searchText: string = '';
  MOStaionDetails: {}[];
  key: string = 'StationName';
  key1: string = 'StationName';
  reverse: boolean = true;
  Dashdate = '';
  sortingColumn: string = "";
  selectedYear: any;
  years: number[] = [];
  selectedMonth: string = '';
  selectedfortnight: string = '';
  dateFrom: string = '';
  dateTo: string = '';
  errorFound: boolean = true;
  listMO: { Email }[];
  UserId: string = this.objCook.get('loginId');
  emailid: any;
  remstation: any;
  userid: any;
  id: any;
  glovalJson: any = JSON.parse(sessionStorage.getItem('globalDetail'));
  pendinglist: any;
  displayStyle = "none";
  Popup: boolean = false;
  constructor(private objDbServ: dbService, private objCook: CookieService) {
    this.objDbServ.MasterCompDisplay.emit(true);
    this.objDbServ.HeaderDisplay.emit(true);
    this.objDbServ.LeftMenu.emit(true);
    this.objDbServ.LeftMenu.emit(true);
    this.selectedYear = new Date().getFullYear();
    for (let year = this.selectedYear; year >= 2020; year--) {
      this.years.push(year);
    }
  }
  ngOnInit() {
    this.Dashdate = this.objCook.get('CurrentDate');
    this.UserIdCook = this.objCook.get('UID');
  }
  monthNames = [
    "Jan", "Feb", "Mar",
    "Apr", "May", "Jun", "Jul",
    "Aug", "Sep", "Oct",
    "Nov", "Dec"
  ];
  closePopup() {
    this.displayStyle = "none";
  }
  onyearselect(val) {
    this.selectedYear = val;
    this.StationDataMO();
  }
  OnMonthChange(evt) {
    this.selectedMonth = evt.target.value;
    this.StationDataMO();
  }
  OnFortChnage(evt) {
    this.selectedfortnight = evt.target.value;
    this.StationDataMO();
  }
  StationDataMO() {
    const dt = new Date();
    if (this.selectedMonth == "Jan") {
      var month = 0;
      var d = new Date(dt.getFullYear(), month + 1, 0).getDate();
    }
    else if (this.selectedMonth == "Feb") {
      var month = 1;
      var d = new Date(dt.getFullYear(), month + 1, 0).getDate();
    }
    else if (this.selectedMonth == "Mar") {
      var month = 2;
      var d = new Date(dt.getFullYear(), month + 1, 0).getDate();
    }
    else if (this.selectedMonth == "Apr") {
      var month = 3;
      var d = new Date(dt.getFullYear(), month + 1, 0).getDate();
    }
    else if (this.selectedMonth == "May") {
      var month = 4;
      var d = new Date(dt.getFullYear(), month + 1, 0).getDate();
    }
    else if (this.selectedMonth == "June") {
      var month = 5;
      var d = new Date(dt.getFullYear(), month + 1, 0).getDate();
    }
    if (this.selectedMonth == "July") {
      var month = 6;
      var d = new Date(dt.getFullYear(), month + 1, 0).getDate();
    }
    else if (this.selectedMonth == "Aug") {
      var month = 7;
      var d = new Date(dt.getFullYear(), month + 1, 0).getDate();
    }
    else if (this.selectedMonth == "Sep") {
      var month = 8;
      var d = new Date(dt.getFullYear(), month + 1, 0).getDate();
    }
    else if (this.selectedMonth == "Oct") {
      var month = 9;
      var d = new Date(dt.getFullYear(), month + 1, 0).getDate();
    }
    else if (this.selectedMonth == "Nov") {
      var month = 10;
      var d = new Date(dt.getFullYear(), month + 1, 0).getDate();
    }
    else if (this.selectedMonth == "Dec") {
      var month = 11;
      var d = new Date(dt.getFullYear(), month + 1, 0).getDate();
    }
    {
      if (this.selectedfortnight == "Fortnight1") {
        this.dateFrom = "01-" + this.selectedMonth + "-" + this.selectedYear;
        this.dateTo = "15-" + this.selectedMonth + "-" + this.selectedYear;
      }
      else {
        var date = new Date();
        this.dateFrom = "16-" + this.selectedMonth + "-" + this.selectedYear;
        this.dateTo = d + "-" + this.selectedMonth + "-" + this.selectedYear;
      }
    }
    if (this.ValidationReports()) {
      this.objDbServ.ShowLoaders.emit(true);
      this.objDbServ.CommonGetData({ Flag: 'jmradmin', Id: this.UserIdCook, FromDate: this.dateFrom, ToDate: this.dateTo }).subscribe(
        (resp: Response) => {
          this.objDbServ.ShowLoaders.emit(false);
          this.StaionDetails = JSON.parse(resp.json()).Table;
          this.UserType = JSON.parse(resp.json()).Table[0].UserType;
          setTimeout(() => {
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
  GetMOStation(MOID: string) {
    this.objDbServ.CommonGetData({ Flag: 'MOwiseStation', Id: MOID }).subscribe(
      (resp: Response) => {
        this.MOStaionDetails = JSON.parse(resp.json()).Table;
      },
      (error) => { alert("Something went wrong.") }
    )
  }
  sortCol(key: string) {
    this.sortingColumn = key;
    this.key = key;
    this.reverse = !this.reverse;
  }
  ExportReport(UserId: string) {
    const dt = new Date();
    if (this.selectedMonth == "Jan") {
      var month = 0;
      var d = new Date(dt.getFullYear(), month + 1, 0).getDate();
    }
    else if (this.selectedMonth == "Feb") {
      var month = 1;
      var d = new Date(dt.getFullYear(), month + 1, 0).getDate();
    }
    else if (this.selectedMonth == "Mar") {
      var month = 2;
      var d = new Date(dt.getFullYear(), month + 1, 0).getDate();
    }
    else if (this.selectedMonth == "Apr") {
      var month = 3;
      var d = new Date(dt.getFullYear(), month + 1, 0).getDate();
    }
    else if (this.selectedMonth == "May") {
      var month = 4;
      var d = new Date(dt.getFullYear(), month + 1, 0).getDate();
    }
    else if (this.selectedMonth == "June") {
      var month = 5;
      var d = new Date(dt.getFullYear(), month + 1, 0).getDate();
    }
    if (this.selectedMonth == "July") {
      var month = 6;
      var d = new Date(dt.getFullYear(), month + 1, 0).getDate();
    }
    else if (this.selectedMonth == "Aug") {
      var month = 7;
      var d = new Date(dt.getFullYear(), month + 1, 0).getDate();
    }
    else if (this.selectedMonth == "Sep") {
      var month = 8;
      var d = new Date(dt.getFullYear(), month + 1, 0).getDate();
    }
    else if (this.selectedMonth == "Oct") {
      var month = 9;
      var d = new Date(dt.getFullYear(), month + 1, 0).getDate();
    }
    else if (this.selectedMonth == "Nov") {
      var month = 10;
      var d = new Date(dt.getFullYear(), month + 1, 0).getDate();
    }
    else if (this.selectedMonth == "Dec") {
      var month = 11;
      var d = new Date(dt.getFullYear(), month + 1, 0).getDate();
    }
    {
      if (this.selectedfortnight == "Fortnight1") {
        this.dateFrom = "01-" + this.selectedMonth + "-" + this.selectedYear;
        this.dateTo = "15-" + this.selectedMonth + "-" + this.selectedYear;
      }
      else {
        var date = new Date();
        this.dateFrom = "16-" + this.selectedMonth + "-" + this.selectedYear;
        this.dateTo = d + "-" + this.selectedMonth + "-" + this.selectedYear;
      }
    }
    if (this.ValidationReports()) {
      const obj = {
        ControlRoomCode: UserId,
        flag: 'Export',
        FromDate: this.dateFrom,
        ToDate: this.dateTo,
      }
      {
        if (this.selectedMonth != null && this.selectedfortnight != null) {
          this.objDbServ.ShowLoaders.emit(true);
          this.objDbServ.ExportJMRReportForDashboard(obj).subscribe(
            (resp: any) => {
              const data = JSON.parse(resp.json());
              this.objDbServ.ShowLoaders.emit(false);
              if (data.FileName != '') {
                if (JSON.parse(resp.json()).errMsg == 'success') {
                  window.location.href = this.objDbServ.apiImageAttachment + "/Attachments/Excel/" + JSON.parse(resp.json()).FileName
                  this.objDbServ.ShowLoaders.emit(false);
                }
                else {
                  alert(JSON.parse(resp.json()).errMsg)
                  this.objDbServ.ShowLoaders.emit(false);
                }
              }
              else {
                alert("No Data found.!");
                this.objDbServ.ShowLoaders.emit(false);
              }
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
    }
  }


  RejectByJMRAdmin(UserId: string, Name: string) {
  // Confirmation Alert
  if (!confirm(`Are you sure to Reject JMR of "${Name}"?`)) {
    return; // Stop execution if user cancels
  }

  const dt = new Date();
  const monthsMap: { [key: string]: number } = {
    Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4,
    June: 5, July: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
  };

  const monthIndex = monthsMap[this.selectedMonth];
  if (monthIndex === undefined) {
    alert('Invalid month selected.');
    return;
  }

  const daysInMonth = new Date(dt.getFullYear(), monthIndex + 1, 0).getDate();

  // Set date range based on selected fortnight
  if (this.selectedfortnight === "Fortnight1") {
    this.dateFrom = `01-${this.selectedMonth}-${this.selectedYear}`;
    this.dateTo = `15-${this.selectedMonth}-${this.selectedYear}`;
  } else if (this.selectedfortnight === "Fortnight2") {
    this.dateFrom = `16-${this.selectedMonth}-${this.selectedYear}`;
    this.dateTo = `${daysInMonth}-${this.selectedMonth}-${this.selectedYear}`;
  } else {
    alert('Please select a valid fortnight.');
    return;
  }

  const obj = {
    MOId: UserId,
    flag: 'RejectByAdmin',
    FromDate: this.dateFrom,
    ToDate: this.dateTo
  };

  if (this.selectedMonth && this.selectedfortnight) {
    this.objDbServ.ShowLoaders.emit(true);
    this.objDbServ.RejectByJMRAdmin(obj).subscribe(
      (resp: any) => {
        const data = JSON.parse(resp.json());
        this.objDbServ.ShowLoaders.emit(false);
        alert('JMR Rejected Successfully');
      },
      (error) => {
        alert('Something went wrong.');
        this.objDbServ.ShowLoaders.emit(false);
      }
    );
  } else {
    alert('Please Select Reporting Date.');
  }
}

  ShowPending(Id: string) {
    const dt = new Date();
    if (this.selectedMonth == "Jan") {
      var month = 0;
      var d = new Date(dt.getFullYear(), month + 1, 0).getDate();
    }
    else if (this.selectedMonth == "Feb") {
      var month = 1;
      var d = new Date(dt.getFullYear(), month + 1, 0).getDate();
    }
    else if (this.selectedMonth == "Mar") {
      var month = 2;
      var d = new Date(dt.getFullYear(), month + 1, 0).getDate();
    }
    else if (this.selectedMonth == "Apr") {
      var month = 3;
      var d = new Date(dt.getFullYear(), month + 1, 0).getDate();
    }
    else if (this.selectedMonth == "May") {
      var month = 4;
      var d = new Date(dt.getFullYear(), month + 1, 0).getDate();
    }
    else if (this.selectedMonth == "June") {
      var month = 5;
      var d = new Date(dt.getFullYear(), month + 1, 0).getDate();
    }
    if (this.selectedMonth == "July") {
      var month = 6;
      var d = new Date(dt.getFullYear(), month + 1, 0).getDate();
    }
    else if (this.selectedMonth == "Aug") {
      var month = 7;
      var d = new Date(dt.getFullYear(), month + 1, 0).getDate();
    }
    else if (this.selectedMonth == "Sep") {
      var month = 8;
      var d = new Date(dt.getFullYear(), month + 1, 0).getDate();
    }
    else if (this.selectedMonth == "Oct") {
      var month = 9;
      var d = new Date(dt.getFullYear(), month + 1, 0).getDate();
    }
    else if (this.selectedMonth == "Nov") {
      var month = 10;
      var d = new Date(dt.getFullYear(), month + 1, 0).getDate();
    }
    else if (this.selectedMonth == "Dec") {
      var month = 11;
      var d = new Date(dt.getFullYear(), month + 1, 0).getDate();
    }
    {
      if (this.selectedfortnight == "Fortnight1") {
        this.dateFrom = "01-" + this.selectedMonth + "-" + this.selectedYear;
        this.dateTo = "15-" + this.selectedMonth + "-" + this.selectedYear;
      }
      else {
        var date = new Date();
        this.dateFrom = "16-" + this.selectedMonth + "-" + this.selectedYear;
        this.dateTo = d + "-" + this.selectedMonth + "-" + this.selectedYear;
      }
    }
    if (this.ValidationReports()) {
      const obj = {
        ControlRoomCode: Id,
        flag: '',
        FromDate: this.dateFrom,
        ToDate: this.dateTo,
      }
      this.Popup = true;
      this.objDbServ.ShowLoaders.emit(true);
      this.objDbServ.ViewPending({ ControlRoomCode: Id, flag: '', FromDate: this.dateFrom, ToDate: this.dateTo }).subscribe(
        (resp: Response) => {
          this.objDbServ.ShowLoaders.emit(false);
          this.pendinglist = JSON.parse(resp.json()).Table;
          setTimeout(() => {
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
  closeHistoryPop() {
    this.Popup = false;
  }
  ExportReportOfPending(stationCode: string) {
    const dt = new Date();
    const monthsMap: { [key: string]: number } = {
      Jan: 0,
      Feb: 1,
      Mar: 2,
      Apr: 3,
      May: 4,
      June: 5,
      July: 6,
      Aug: 7,
      Sep: 8,
      Oct: 9,
      Nov: 10,
      Dec: 11
    };

    const monthIndex = monthsMap[this.selectedMonth];
    if (monthIndex === undefined) {
      alert('Invalid month selected.');
      return;
    }

    const daysInMonth = new Date(dt.getFullYear(), monthIndex + 1, 0).getDate();

    if (this.selectedfortnight === "Fortnight1") {
      this.dateFrom = `01-${this.selectedMonth}-${this.selectedYear}`;
      this.dateTo = `15-${this.selectedMonth}-${this.selectedYear}`;
    } else if (this.selectedfortnight === "Fortnight2") {
      this.dateFrom = `16-${this.selectedMonth}-${this.selectedYear}`;
      this.dateTo = `${daysInMonth}-${this.selectedMonth}-${this.selectedYear}`;
    } else {
      alert('Please select a valid fortnight.');
      return;
    }

    const obj = {
      flag: 'RejectByAdmin',
      FromDate: this.dateFrom,
      ToDate: this.dateTo
    };

    if (this.selectedMonth && this.selectedfortnight) {
      this.objDbServ.ShowLoaders.emit(true);
      this.objDbServ.ExportPending(obj).subscribe(
        (resp: any) => {
          const data = JSON.parse(resp.json());
          this.objDbServ.ShowLoaders.emit(false);

          if (data.FileName) {
            if (data.errMsg === 'success') {
              window.location.href = `${this.objDbServ.apiImageAttachment}/Attachments/Excel/${data.FileName}`;
            } else {
              alert(data.errMsg);
            }
          } else {
            alert("No Data found.!");
          }
        },
        (error) => {
          alert('Something went wrong.');
          this.objDbServ.ShowLoaders.emit(false);
        }
      );
    } else {
      alert('Please Select Reporting Date.');
    }
  }
  ValidationReports() {
    this.errorFound = true;
    if (this.selectedMonth == "" || isNullOrUndefined(this.selectedMonth)) {
      alert('Please select Month.!');
      this.errorFound = false;
    }
    else if (this.selectedfortnight == "" || isNullOrUndefined(this.selectedfortnight)) {
      alert('Please select Fornight.!');
      this.errorFound = false;
    }
    return this.errorFound;
  }
}