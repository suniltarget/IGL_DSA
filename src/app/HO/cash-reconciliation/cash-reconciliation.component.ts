import { Component, OnInit } from '@angular/core';
import { dbService } from '../../Service/db.service';
import { CookieService } from 'ngx-cookie-service';
import { isUndefined, isNullOrUndefined } from 'util';
import { MAX_LENGTH_VALIDATOR } from '@angular/forms/src/directives/validators';
import { tick } from '@angular/core/testing';
import { NULL_EXPR } from '@angular/compiler/src/output/output_ast';
import { DatepickerOptions } from 'ng2-datepicker';
import * as enLocale from 'date-fns/locale/en';
import { DomSanitizer} from '@angular/platform-browser';
import { DatePipe } from '@angular/common';
import { parse } from 'path';
declare var $:any;
@Component({
  selector: 'app-cash-reconciliation',
  templateUrl: './cash-reconciliation.component.html',
  styleUrls: ['./cash-reconciliation.component.css']
})
export class CashReconciliationComponent implements OnInit {
  constructor(private objDbServ: dbService, private objCook: CookieService) {
    this.objDbServ.MasterCompDisplay.emit(true);
    this.objDbServ.HeaderDisplay.emit(true);
    this.objDbServ.LeftMenu.emit(true);
  }
  isSheetSelected: boolean = true;
  isPrepaidSelected: boolean = false;
  ResponseList: any[];
  ResponseListNew: any[];
  uploadedfilereset:File;
  AttachmentFile:File;
  SheetType:string="Bank";
  columns: string[] = [];
  TransactionDate:any;
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
  options:DatepickerOptions = {
    minYear: 2018,
    locale: enLocale,
    displayFormat: 'DD-MMM-YYYY',
    maxDate:new Date(Date.now())
  };
  selectedAll: any;
  itmArray:any = [];
  IsColumDisable:boolean=true;
  IsOldFile : string = "1";
  IsDateHide:boolean=true;
  Flag :string = 'New';
  ngOnInit() {
    this.TransactionDate = this.objCook.get('CurrentDate');
  }
  GetValue(e) {
    if(e.target.value == 1) {
      this.IsDateHide = true;
      this.Flag ="New";
    }
  else{
     this.IsDateHide = false;
      this.Flag ="Old";
   }
}
  OnDateChnagefrom(val){
    const dt = new Date(val);
    this.TransactionDate = dt.getDate() + "/" + this.monthNames[dt.getMonth()] + "/" + dt.getFullYear();   
  }
  fileuploadreset(file: FileList, event: any) {
    this.uploadedfilereset = file.item(0);
  }
  OnSubmit() {
    var MyJsonreset = {
      FilePath: localStorage.getItem('LoginId') + "/CashReconciliation/",
      SheetType: this.SheetType,
      TranDate : this.TransactionDate,
      Flag : this.Flag
     }  
    this.AttachmentFile = $('#CashReconInput'); 
    var frmData = new FormData();
    var fileInputreset = this.AttachmentFile[0];
    frmData.append("jsonDetail", JSON.stringify(MyJsonreset));
    if(this.uploadedfilereset != undefined) {
        frmData.append('CashReconFile', this.uploadedfilereset, this.uploadedfilereset.name);
      }
      var ErrorMsg = this.changeresetValidation(MyJsonreset);
      if(ErrorMsg == '' || ErrorMsg == undefined) {
          this.objDbServ.CashReconciliation(frmData).subscribe(
            (resp: any) => {
              const data = JSON.parse(resp.json());
              this.objDbServ.ShowLoaders.emit(false);
              if(data.FileName != '') {
                  if(JSON.parse(resp.json()).errMsg=='success'){
                    window.location.href = this.objDbServ.apiImageAttachment+"/Attachments/Excel/"+JSON.parse(resp.json()).FileName
                    this.objDbServ.ShowLoaders.emit(false);
                  }
                  else{
                    alert(JSON.parse(resp.json()).errMsg)
                    this.objDbServ.ShowLoaders.emit(false);
                  }
              } 
              else {
                alert("No Data found.!");
                this.objDbServ.ShowLoaders.emit(false);
              }      
            },
            (error) =>{
              alert(error);
              this.objDbServ.ShowLoaders.emit(false);
            }
          )
      }
      else {
        alert(ErrorMsg);
       }   
  }
  InserCashRecon() {
    const obj = {
      CashRecoEntryData :this.ResponseListNew,
      SheetType : this.SheetType,
      Flag : this.Flag
    };
    if (this.ResponseListNew.length != 0) { 
        this.objDbServ.ShowLoaders.emit(true);   
        this.objDbServ.InsertCashReconciliation(obj).subscribe(
          (resp: any) => {
              const data= JSON.parse(resp.json()).Table;
              if(data[0].Mesage=="Inserted") {
                alert('Record Saved Successfully.!');               
              }
              else if(data[0].Mesage=="Updated") {
                alert('Record Updated Successfully.!');               
              }
              else {
                alert(data.Mesage);
                this.objDbServ.ShowLoaders.emit(false);
              }
              this.objDbServ.ShowLoaders.emit(false);
          },
          (error) =>{alert('Something went wrong.');
          this.objDbServ.ShowLoaders.emit(false);
         }
      )
   }
  }
  OnSubmitView() {
    var MyJsonreset = {
      FilePath: localStorage.getItem('LoginId') + "/CashReconciliation/",
      SheetType: this.SheetType,
      TranDate : this.TransactionDate,
      Flag : this.Flag
     }
    this.AttachmentFile = $('#CashReconInput'); 
    var frmData = new FormData();
    var fileInputreset = this.AttachmentFile[0];
    frmData.append("jsonDetail", JSON.stringify(MyJsonreset));
    if(this.uploadedfilereset != undefined) {
        frmData.append('CashReconFile', this.uploadedfilereset, this.uploadedfilereset.name);
      }
      var ErrorMsg = this.changeresetValidation(MyJsonreset);
      if(ErrorMsg == '' || ErrorMsg == undefined) {
        this.objDbServ.ShowLoaders.emit(true);
          this.objDbServ.CashReconciliationForHTML(frmData).subscribe(
            (resp: any) => {
              this.ResponseList = JSON.parse(resp.json()).Table;
              this.ResponseListNew = JSON.parse(resp.json()).Table1;
              if (this.ResponseList.length != 0) {
                this.columns = Object.keys(this.ResponseList[0]);
              } 
              else {
                this.columns = [];
                alert('No Data found');
              }
              this.objDbServ.ShowLoaders.emit(false);
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
  onSampleDownload() {
      window.location.href = this.objDbServ.apiImageAttachment+"/Attachments/admin/PaymentReconciliationSample/"+this.SheetType+".csv";
    }
  changeresetValidation(CashRecon) {
    var regexNumeric = /^[+-]?[0-9]{1,1000}(?:\.[0-9]{1,1000})?$/;
    var regexDecimalThree = /^[+-]?[0-9]{1,10}(?:\.[0-9]{1,3})?$/;
    var regexDecimalThreeNegative = /^[+]?[0-9]{1,10}(?:\.[0-9]{1,3})?$/;
    var imgShow = 'assets/images/attachment.gif';
    var errorMsg = '' ;
       if(this.uploadedfilereset == undefined || this.uploadedfilereset == null) {
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
  resetchange(value, flag) {
    this.SheetType = value;
    if(this.SheetType == "Prepaid Card")
    {
      this.isPrepaidSelected = true;
    }
    else
    {
      this.isPrepaidSelected = false;
    }
  }
  sortCol(key: string) {
    this.sortingColumn = key;
    this.key = key;
    this.reverse = !this.reverse;
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
        alert('Please Select altleast one Entry.');
        return false;
      }
      var stJson = [];
      temparray.forEach(element => {
        stJson.push({
              StationName: element.StationName,
              StationId: element.StationId,
          });
      });
      const obj = {
        CashRecoEntryData :stJson,
        SheetType : this.SheetType
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
}
