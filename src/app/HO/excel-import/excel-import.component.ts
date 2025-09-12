import { Component, OnInit } from '@angular/core';
import { dbService } from '../../Service/db.service';
import { CookieService } from 'ngx-cookie-service';
import { isUndefined, isNullOrUndefined } from 'util';
import { MAX_LENGTH_VALIDATOR } from '@angular/forms/src/directives/validators';
import { tick } from '@angular/core/testing';
import { NULL_EXPR } from '@angular/compiler/src/output/output_ast';
import { DatepickerOptions } from 'ng2-datepicker';
import * as enLocale from 'date-fns/locale/en';
import { DomSanitizer } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';
import { parse } from 'path';
declare var $: any;
@Component({
  selector: 'app-excel-import',
  templateUrl: './excel-import.component.html',
  styleUrls: ['./excel-import.component.css']
})
export class ExcelImportComponent implements OnInit {
  constructor(private objDbServ: dbService, private objCook: CookieService) {
    this.objDbServ.MasterCompDisplay.emit(true);
    this.objDbServ.HeaderDisplay.emit(true);
    this.objDbServ.LeftMenu.emit(true);
  }
  isSheetSelected: boolean = true;
  isPrepaidSelected: boolean = false;
  ResponseList: any[];
  ResponseListNew: any[];
  uploadedfilereset_All: File;
  AttachmentFile: File;
  SheetType: string = "Bank";
  columns: string[] = [];
  TransactionDate: string;
  sortingColumn: string = "";
  key: string = 'Name';
  reverse: boolean = true;
  monthNames = [
    "Jan", "Feb", "Mar",
    "Apr", "May", "Jun", "Jul",
    "Aug", "Sep", "Oct",
    "Nov", "Dec"
  ];
  date: Date;
  options: DatepickerOptions = {
    minYear: 2018,
    locale: enLocale,
    displayFormat: 'DD-MMM-YYYY',
    maxDate: new Date(Date.now())
  };
  selectedAll: any;
  itmArray: any = [];
  IsColumDisable: boolean = true;
  IsOldFile: string = "1";
  IsDateHide: boolean = true;
  Flag: string = 'New';
  ngOnInit() {
    this.SheetType = "Station_Import";
  }
  OnAll_Submit() {
    var MyJsonreset = {
      FilePath: localStorage.getItem('LoginId') + "/Import_Components/",
      SheetType: this.SheetType,
    }
    this.AttachmentFile = $('#All_Input');
    var frmData = new FormData();
    var fileInputreset = this.AttachmentFile[0];
    frmData.append("jsonDetail", JSON.stringify(MyJsonreset));
    if (this.uploadedfilereset_All != undefined) {
      frmData.append('All_Input', this.uploadedfilereset_All, this.uploadedfilereset_All.name);
    }
    var ErrorMsg = this.changeresetValidation(MyJsonreset);
    if (ErrorMsg == '' || ErrorMsg == undefined) {
      this.objDbServ.All_Import(frmData).subscribe(
        (resp: any) => {
          const data = JSON.parse(resp.json());
          this.objDbServ.ShowLoaders.emit(true);
          if (data.errMsg != null || data.errMsg != '') {
            alert(data.errMsg);
            this.objDbServ.ShowLoaders.emit(false);
          }
          else {
            alert("No Data found.!");
            this.objDbServ.ShowLoaders.emit(false);
          }
        },
        (error) => {
          alert(error);
          this.objDbServ.ShowLoaders.emit(false);
        }
      )
    }
    else {
      alert(ErrorMsg);
    }
  }
  UploadImportEquipment(file: FileList, event: any) {
    this.uploadedfilereset_All = file.item(0);
  }
  changeresetValidation(CashRecon) {
    var regexNumeric = /^[+-]?[0-9]{1,1000}(?:\.[0-9]{1,1000})?$/;
    var regexDecimalThree = /^[+-]?[0-9]{1,10}(?:\.[0-9]{1,3})?$/;
    var regexDecimalThreeNegative = /^[+]?[0-9]{1,10}(?:\.[0-9]{1,3})?$/;
    var imgShow = 'assets/images/attachment.gif';
    var errorMsg = '';
    if (this.uploadedfilereset_All == undefined || this.uploadedfilereset_All == null) {
      errorMsg = 'Please select csv file'
      return errorMsg;
    }
    var fileInput = this.AttachmentFile[0];
    var validExtension = 'csv';
    var fileExtension = fileInput.files[0].name.split(/[. ]+/).pop();;
    if (validExtension.indexOf(fileExtension) < 0) {
      errorMsg = 'Attachment allowed only for [' + validExtension + '].';
    }
    return errorMsg;
  }
  EquipmentsChange(value,flag) {
    this.SheetType = value;
  }
  SampleDownload() {
    window.location.href = this.objDbServ.apiImageAttachment + "/Attachments/admin/Components/" + this.SheetType + ".csv";
  }
}
