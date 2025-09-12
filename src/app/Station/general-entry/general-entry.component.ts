import { Component, OnInit } from '@angular/core';
import { dbService } from '../../Service/db.service';
import { Response } from '@angular/http';
import { CookieService } from 'ngx-cookie-service';
import { isUndefined } from 'util';
@Component({
  selector: 'app-general-entry',
  templateUrl: './general-entry.component.html',
  styleUrls: ['./general-entry.component.css']
})
export class GeneralEntryComponent implements OnInit {
  generalEntryList:any[];
  globalJson:any[];
  isCRSentToHo:number;
  isStationSubmitted:number;
  NOB:string;
  NOL:string;
  LoginId:string= localStorage.getItem('LoginId');
  StationCode:string= localStorage.getItem('LoginId');
  GEId:number;
  stationName:string="";
   constructor(private objDbServ: dbService, private objCook: CookieService) { 
     this.objDbServ.HeaderDisplay.emit(true);
     this.objDbServ.LeftMenu.emit(true);
   }
  ngOnInit() {
    this.stationName = JSON.parse(sessionStorage.getItem("globalDetail"))[0].UserName;
    setTimeout(() => {this.GetGeneralEntry();});
  }
  GetGeneralEntry(){
    this.objDbServ.GetGeneralEntry({StationCode:this.StationCode, LoginId:this.LoginId}).subscribe(
      (resp: Response) => {
          const data = JSON.parse(resp.json()).Table;
        if(data.length > 0) {
            this.generalEntryList=JSON.parse(resp.json()).Table;
            this.GEId = JSON.parse(resp.json()).Table[0].GEID;
            this.NOB = JSON.parse(resp.json()).Table[0].NOB;
            this.NOL = JSON.parse(resp.json()).Table[0].NOL;
        }
        this.isCRSentToHo = JSON.parse(resp.json()).Table1[0].isCRSentToHo;
        this.isStationSubmitted = JSON.parse(resp.json()).Table2[0].isStationSubmitted; 
      },
      (error) => {alert("Something went wrong.");
       this.objDbServ.ShowLoaders.emit(false);
      }
    )
  }
  InsertGeneralEntry() {
    this.objDbServ.ShowLoaders.emit(true);
    var getJson = this.GetValidation(this.globalJson, this.generalEntryList);
    if (getJson.error != '') {
        alert(getJson.error)
        return false;
    }
    if (getJson.skipSave == true) {
        return false;
    }
    this.objDbServ.InsertGeneralEntry(getJson.retJson).subscribe(
        (resp: Response) => {
            this.objDbServ.ShowLoaders.emit(false);
            if (JSON.parse(resp.json())[0]  != null)
                var retJson = JSON.parse(resp.json())[0];
            if (retJson.status == '1') {
                this.generalEntryList = retJson;
                alert('Data Inserted Successfully.');
            }
            else if (retJson.status == '2')
                alert('Couldn\'t insert the record.');
            else if (retJson.status == '3')
                alert('Data updated Successfully');
            else if (retJson.status == '4')
                alert('Data for today is already Submitted.');
            this.GetGeneralEntry();
        },
        (error) => {alert("Something went wrong.");
         this.objDbServ.ShowLoaders.emit(false);
        }
      )
  }
  GetValidation(globalJson, generalEntryList) {
    var re = new RegExp(/^[a-zA-Z ]*$/);
    var regexNumeric = /^[+-]?[0-9]{1,1000}(?:\.[0-9]{1,1000})?$/;
    var regexDecimalThree = /^[+-]?[0-9]{1,10}(?:\.[0-9]{1,3})?$/;
    var regIntegers= /^[1-9]\d*$/;
    var ErrorMsg = '', flagSS = false;
    if (this.NOB != "" && isUndefined(this.NOB) == false) {
        if (regexNumeric.test(this.NOB) == false) {
            ErrorMsg = 'Only numeric value allowed for Buses.';
        }
        else
        {
            var re = new RegExp(/^[0-9]*$/gm);
            if (!re.test(this.NOB)) {
                ErrorMsg = 'Decimal is not allowed.';
            }
        }
    }
    else {
        ErrorMsg = 'Please enter  value.!';
    }
    if (this.NOL != "" && isUndefined(this.NOL) == false) {
        if (regexNumeric.test(this.NOL) == false) {
            ErrorMsg = 'Only numeric value allowed for LCV.';
        }
        else {
            var re = new RegExp(/^[0-9]*$/gm);
            if (!re.test(this.NOL)) {
                ErrorMsg = 'Decimal is not allowed.';
            }
        }
    }
    else {
        ErrorMsg = 'Please enter value.!';   
    }
    var retJson = {
        GEID: this.GEId,
        LoginId: this.LoginId,
        StationCode: this.StationCode,
        NOB: this.NOB,
        NOL: this.NOL
    };
    return {
        error: ErrorMsg,
        retJson: retJson,
        skipSave: false
    };
}
}
