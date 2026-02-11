import { Component, OnInit } from '@angular/core';
import { dbService } from '../../Service/db.service';
import { CookieService } from 'ngx-cookie-service';
import { DatepickerOptions } from 'ng2-datepicker';
import * as enLocale from 'date-fns/locale/en';

@Component({
  selector: 'app-avg-disp-pressure',
  templateUrl: './avg-disp-pressure.component.html',
  styleUrls: ['./avg-disp-pressure.component.css']
})
export class AvgDispPressureComponent implements OnInit {

  sortingColumn: string = "";
  key: string = 'Name';
  reverse: boolean = true;
  Loginid: string = this.objCook.get('LoginId');
  AvgDispencePressureList: any = [];
  EntryDate: Date;
  options: DatepickerOptions = {
    minYear: 2018,
    locale: enLocale,
    displayFormat: 'DD-MMM-YYYY',
    maxDate: new Date(Date.now())
  };

  constructor(private objDbServ: dbService, private objCook: CookieService) {
    this.objDbServ.MasterCompDisplay.emit(true);
    this.objDbServ.HeaderDisplay.emit(true);
    this.objDbServ.LeftMenu.emit(true);
    const currentDate = new Date(this.objCook.get('CurrentDate'));
    currentDate.setDate(currentDate.getDate() - 1);
    this.EntryDate = currentDate;
  }
  ngOnInit() {
    this.GetAvgDispencePressureList();
  }



  OnEntryDateChnage(val: any) {
    if (val) {
      // val is: Fri Feb 06 2026 00:00:00 GMT+0530...
      const d = new Date(val);

      this.EntryDate = d;   //

      console.log("Date saved to variable:", this.EntryDate);

      this.GetAvgDispencePressureList();
    }
  }

  GetAvgDispencePressureList() {
    const d = this.EntryDate;

    const formattedDate =
      d.getFullYear() + '-' +
      String(d.getMonth() + 1).padStart(2, '0') + '-' +
      String(d.getDate()).padStart(2, '0');
    const obj = {
      ControlRoomCode: this.Loginid,
      EntryDate: formattedDate,
      Flag: "OnLoad"
    };
    this.objDbServ.ShowLoaders.emit(true);
    this.objDbServ.GetAvgDispencePressureList(obj).subscribe(
      (resp: any) => {
        this.AvgDispencePressureList = JSON.parse(resp.json()).Table;
        this.objDbServ.ShowLoaders.emit(false);
      },
      (error) => {
        alert("Something went wrong.");
        this.objDbServ.ShowLoaders.emit(false);
      }
    )
  }
  OnSubmit() {
    const d = this.EntryDate;

    const formattedDate =
      d.getFullYear() + '-' +
      String(d.getMonth() + 1).padStart(2, '0') + '-' +
      String(d.getDate()).padStart(2, '0');
    const obj = {
      ControlRoomCode: this.Loginid,
      Flag: "Update",
      AvgDispPressureArr: this.AvgDispencePressureList,
      EntryDate: formattedDate,
    };
    var ErrorMsg = "";
    if (ErrorMsg == '' || ErrorMsg == undefined) {
      this.objDbServ.InsertUpdateAvgDispencePressure(obj).subscribe(
        (resp: any) => {
          const data = (resp.json());
          alert('Record Saved Successfully.!');
          this.GetAvgDispencePressureList();
        },
        (error) => {
          alert('Something went wrong.');
          this.objDbServ.ShowLoaders.emit(false);
        }
      )
    }
    else {
      alert(ErrorMsg);
    }
  }
}
