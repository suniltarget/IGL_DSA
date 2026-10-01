import { Component, OnInit } from '@angular/core';
import { dbService } from '../../Service/db.service';
import { Response } from '@angular/http';
import {Router} from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { DatepickerOptions } from 'ng2-datepicker';
import * as enLocale from 'date-fns/locale/en';
import { isNullOrUndefined } from 'util';
declare var $:any;
@Component({
  selector: 'app-jmr-co',
  templateUrl: './jmr-co.component.html',
  styleUrls: ['./jmr-co.component.css']
})
export class JMRCOComponent implements OnInit {
hostPath:string="";
arrReviewData:any=[];
filter:string="";
LoginPass:string="";
reviewpoup:boolean = false;
rejectpopup:boolean = false;
stationToSubmit:any = [];
selectedAll: any;
apiURL:string="";
glovalJson:any = JSON.parse(sessionStorage.getItem('globalDetail'));
outerCheck:number=0;
key: string = 'Name';
reverse: boolean = true;
sortingColumn:string="";
DPREntryDate:string;
itmArray:any = [];
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
selectedYear: any;
years: number[] = [];
selectedMonth:string='';
selectedfortnight: string='';
dateFrom: string='';
dateTo: string='';
errorFound: boolean = true;
pendingDownloadFn: ((skipSignature: boolean) => void) | null = null;
pendingSignatureFile: File | null = null;
signaturePreviewUrl: string = '';
listMO:{Email}[];
UserId:string= this.objCook.get('loginId');
  emailid: any;
  DPREmail:string = '';
  IndEmail:any[];
  StationAttachmentList: any;
  constructor(private objRoute: Router,private objDbServ: dbService, private objCook: CookieService) { 
    this.objDbServ.MasterCompDisplay.emit(true);
    this.objDbServ.HeaderDisplay.emit(true);
    this.objDbServ.LeftMenu.emit(true);
    this.selectedYear = new Date().getFullYear();
     for ( let year = this.selectedYear; year >= 2020; year--) {
    this.years.push(year);
  }
  }
  ngOnInit() {
    this.apiURL = this.objDbServ.apiImageAttachment + '/Attachments/Excel/';
    this.DPREntryDate = this.objCook.get('CurrentDate');
    this.selectedYear = new Date().getFullYear();
  }
    onyearselect(val){
    this.selectedYear=val;
    this.getReviewData();
    }
    OnMonthChange(evt) {
      this.selectedMonth = evt.target.value;
      this.getReviewData();
    }
    OnFortChnage(evt){
      this.selectedfortnight=evt.target.value;
      this.getReviewData();
    }
  getReviewData(){
    const dt = new Date();
    if(this.selectedMonth =="Jan"){
      var month = 0;
      var d = new Date(dt.getFullYear(), month + 1, 0).getDate();
    }
   else if(this.selectedMonth =="Feb"){
      var month = 1;
      var d = new Date(dt.getFullYear(), month + 1, 0).getDate();
    }
    else if(this.selectedMonth =="Mar"){
      var month = 2;
      var d = new Date(dt.getFullYear(), month + 1, 0).getDate();
    }
    else if(this.selectedMonth =="Apr"){
      var month = 3;
      var d = new Date(dt.getFullYear(), month + 1, 0).getDate();
    }
    else  if(this.selectedMonth =="May"){
      var month = 4;
      var d = new Date(dt.getFullYear(), month + 1, 0).getDate();
    }
    else   if(this.selectedMonth =="June"){
      var month = 5;
      var d = new Date(dt.getFullYear(), month + 1, 0).getDate();
    }
    if(this.selectedMonth =="July"){
      var month = 6;
      var d = new Date(dt.getFullYear(), month + 1, 0).getDate();
    }
    else  if(this.selectedMonth =="Aug"){
      var month = 7;
      var d = new Date(dt.getFullYear(), month + 1, 0).getDate();
    }
    else if(this.selectedMonth =="Sep"){
      var month = 8;
      var d = new Date(dt.getFullYear(), month + 1, 0).getDate();
    }
    else if(this.selectedMonth =="Oct"){
      var month = 9;
      var d = new Date(dt.getFullYear(), month + 1, 0).getDate();
    }
    else   if(this.selectedMonth =="Nov"){
      var month = 10;
      var d = new Date(dt.getFullYear(), month + 1, 0).getDate();
    }
    else if (this.selectedMonth == "Dec"){
      var month = 11;
      var d = new Date(dt.getFullYear(), month + 1, 0).getDate();
    }
    {
      if(this.selectedfortnight == "Fortnight1"){
        this.dateFrom ="01-"+this.selectedMonth + "-"+ this.selectedYear;
        this.dateTo="15-"+this.selectedMonth + "-"+this.selectedYear;
      }
      else{
        var date = new Date();
        this.dateFrom ="16-"+this.selectedMonth + "-"+ this.selectedYear;
        this.dateTo=d+"-"+this.selectedMonth + "-"+ this.selectedYear;
      }
    }
    if (this.ValidationReports()){
      this.objDbServ.ShowLoaders.emit(true);
    this.objDbServ.getReviewDataCR({ControlRoomCode:localStorage.getItem('LoginId'), FromDate:this.dateFrom,ToDate:this.dateTo,flag:'CO'}).subscribe(
      (resp: any) => {
        const data = JSON.parse(resp._body);
        if(data) {
          this.arrReviewData = JSON.parse(resp._body);
          this.stationToSubmit = this.arrReviewData.filter(
            arrayobj => arrayobj.SubmitStatus == "true" 
          ); 
          for(let i=0; i<this.arrReviewData.length;i++){
            if (this.arrReviewData[i].isSentToMO == 1 && this.arrReviewData[i].SubmitStatusCR == true )
                      this.outerCheck = 1;
          else
                     this.outerCheck = 0;
          this.objDbServ.ShowLoaders.emit(false);
          }
        }
        else {
           alert('Data not found.!')
           this.objDbServ.ShowLoaders.emit(false);
        }
      },
      (error) =>{alert('Something went wrong.');
      this.objDbServ.ShowLoaders.emit(false);
    }
    )
    }
  }
  selectAll() {
    for (var i = 0; i < this.arrReviewData.length; i++) {
      this.arrReviewData[i].selected = this.selectedAll;
    }
  }
  checkIfAllSelected() {
    this.selectedAll = this.arrReviewData.every(function(item:any) {
        return item.selected == true;
      })
  }
  makeFinalApprove(){
    var temparray:any=[];
    temparray = this.arrReviewData.filter(arrayobj => arrayobj.selected == true);
          if (temparray.length == 0) {
            alert('Please Select Station(s) to Approve.');
            return false;
          }
        if (!confirm('Do you want to Approve?'))
            return false;
        var stJson = [];
        temparray.forEach(element => {
            stJson.push({
                ControlRoomCode: this.glovalJson[0].LoginId,
                StationCode: element.StationCode,
                FromDate:this.dateFrom,
                ToDate:this.dateTo,
                Flag:'SubmitByControlRoom',
            });
        });
        this.objDbServ.FinalSubmitCOJMR(stJson).subscribe(
          (resp: any) => {
            const data = JSON.parse(resp._body);
            if (data.Status == '2') {
              alert('Data is already Approved.');
          }
         else {
            alert('Data is Approved.');
        }                  
            this.getReviewData();
          },
          (error) =>{alert('Something went wrong.');
          this.objDbServ.ShowLoaders.emit(false);
        }
        )        
  }
  rejectionPopup(flag, itm){
    this.itmArray=itm;
    this.rejectpopup = flag;
  }
  getMktOffice() {
    this.objDbServ.ShowLoaders.emit(true);
    this.objDbServ.getMktOffice({Flag: 'MOListForCO', Id: '0', Status: '1',CompanyId:localStorage.getItem('LoginId')}).subscribe(
      (resp: Response) => {
        this.listMO = JSON.parse(resp.json()).Table;
        this.objDbServ.ShowLoaders.emit(false);
      },
      (error) =>{alert('Something went wrong.')}
    )
  }
  finalRejection(remark) {
    this.itmArray.Reject = true;
        if (!confirm('Do you want to Reject?'))
            return false;
        if (remark == '') {
            alert('Please enter the Remark.');
            return false;
        }
        var myJson = {  
                ControlRoomCode: this.glovalJson[0].LoginId,
                StationCode: this.itmArray.StationCode,
                FromDate:this.dateFrom,
                ToDate:this.dateTo,
                Remark: remark,
                flag:'RejectbyCR'
        };
        this.objDbServ.FinalRejection(myJson).subscribe(
          (resp: any) => {
            this.objDbServ.ShowLoaders.emit(false);
            $('.modal').modal('hide');
            this.getReviewData();
          },
          (error) =>{alert('Something went wrong.');
          this.objDbServ.ShowLoaders.emit(false);
        }
        )  
  }
  showRemarkPopupSendToMO(flag){
    this.reviewpoup = flag;
 }
  SendToMO(remark) {
    var temparray:any=[];
    temparray = this.arrReviewData.filter(arrayobj => arrayobj.SubmitStatusCR == true);
    this.getMktOffice();
    var myJson = { 
                ControlRoomCode: this.glovalJson[0].LoginId,
                FromDate:this.dateFrom,
                ToDate:this.dateTo,
                Remark: remark,
                Email:'',
                flag:'SendToMo'
      }
        if (myJson.Remark == '') {
          alert('Please enter the remarks.')
          return false;
         }
         if (!confirm('Do you want to Send Mail to H.O ?'))
          return false;
          this.objDbServ.SubmitForMo(myJson).subscribe(
            (resp: any) => {
              const data = JSON.parse(JSON.parse(resp._body));
              this.reviewpoup = false;
              if(data.Status == '3' || data.Status == '2')
              {
                alert('Please Approve All Stations');
                $('.modal').modal('hide');
                this.getReviewData();
                this.getMktOffice();
                return false;
              }
              else{
                alert('Mail Has Been Sent To H.O');
                this.ExportJMRReportForMail();
                $('.modal').modal('hide');
                this.getReviewData();
                this.getMktOffice();
              }
            },
            (error) =>{alert('Something went wrong.');
            this.objDbServ.ShowLoaders.emit(false);
          }
        )
  }
  GetExportJMRreports() {
    const dt = new Date();
    if(this.selectedMonth =="Jan"){
      var month = 0;
      var d = new Date(dt.getFullYear(), month + 1, 0).getDate();
    }
   else if(this.selectedMonth =="Feb"){
      var month = 1;
      var d = new Date(dt.getFullYear(), month + 1, 0).getDate();
    }
    else if(this.selectedMonth =="Mar"){
      var month = 2;
      var d = new Date(dt.getFullYear(), month + 1, 0).getDate();
    }
    else if(this.selectedMonth =="Apr"){
      var month = 3;
      var d = new Date(dt.getFullYear(), month + 1, 0).getDate();
    }
    else  if(this.selectedMonth =="May"){
      var month = 4;
      var d = new Date(dt.getFullYear(), month + 1, 0).getDate();
    }
    else   if(this.selectedMonth =="June"){
      var month = 5;
      var d = new Date(dt.getFullYear(), month + 1, 0).getDate();
    }
    if(this.selectedMonth =="July"){
      var month = 6;
      var d = new Date(dt.getFullYear(), month + 1, 0).getDate();
    }
    else  if(this.selectedMonth =="Aug"){
      var month = 7;
      var d = new Date(dt.getFullYear(), month + 1, 0).getDate();
    }
    else if(this.selectedMonth =="Sep"){
      var month = 8;
      var d = new Date(dt.getFullYear(), month + 1, 0).getDate();
    }
    else if(this.selectedMonth =="Oct"){
      var month = 9;
      var d = new Date(dt.getFullYear(), month + 1, 0).getDate();
    }
    else   if(this.selectedMonth =="Nov"){
      var month = 10;
      var d = new Date(dt.getFullYear(), month + 1, 0).getDate();
    }
    else if (this.selectedMonth == "Dec"){
      var month = 11;
      var d = new Date(dt.getFullYear(), month + 1, 0).getDate();
    }
    {
      if(this.selectedfortnight == "Fortnight1"){
        this.dateFrom ="01-"+this.selectedMonth + "-"+ this.selectedYear;
        this.dateTo="15-"+this.selectedMonth + "-"+this.selectedYear;
      }
      else{
        var date = new Date();
        this.dateFrom ="16-"+this.selectedMonth + "-"+ this.selectedYear;
        this.dateTo=d+"-"+this.selectedMonth + "-"+ this.selectedYear;
      }
    }
    if (this.ValidationReports()) {
      const obj = {
        ControlRoomCode: this.glovalJson[0].LoginId,
        flag: 'Export',
        FromDate: this.dateFrom,
        ToDate: this.dateTo,
      }
      {
        if (this.selectedMonth != null && this.selectedfortnight != null ) {
          this.objDbServ.ShowLoaders.emit(true);
          this.objDbServ.ExportJMRReportfordownload(obj).subscribe(
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
  ExportJMRReportForMail() {
    const dt = new Date();
    if(this.selectedMonth =="Jan"){
      var month = 0;
      var d = new Date(dt.getFullYear(), month + 1, 0).getDate();
    }
   else if(this.selectedMonth =="Feb"){
      var month = 1;
      var d = new Date(dt.getFullYear(), month + 1, 0).getDate();
    }
    else if(this.selectedMonth =="Mar"){
      var month = 2;
      var d = new Date(dt.getFullYear(), month + 1, 0).getDate();
    }
    else if(this.selectedMonth =="Apr"){
      var month = 3;
      var d = new Date(dt.getFullYear(), month + 1, 0).getDate();
    }
    else  if(this.selectedMonth =="May"){
      var month = 4;
      var d = new Date(dt.getFullYear(), month + 1, 0).getDate();
    }
    else   if(this.selectedMonth =="June"){
      var month = 5;
      var d = new Date(dt.getFullYear(), month + 1, 0).getDate();
    }
    if(this.selectedMonth =="July"){
      var month = 6;
      var d = new Date(dt.getFullYear(), month + 1, 0).getDate();
    }
    else  if(this.selectedMonth =="Aug"){
      var month = 7;
      var d = new Date(dt.getFullYear(), month + 1, 0).getDate();
    }
    else if(this.selectedMonth =="Sep"){
      var month = 8;
      var d = new Date(dt.getFullYear(), month + 1, 0).getDate();
    }
    else if(this.selectedMonth =="Oct"){
      var month = 9;
      var d = new Date(dt.getFullYear(), month + 1, 0).getDate();
    }
    else   if(this.selectedMonth =="Nov"){
      var month = 10;
      var d = new Date(dt.getFullYear(), month + 1, 0).getDate();
    }
    else if (this.selectedMonth == "Dec"){
      var month = 11;
      var d = new Date(dt.getFullYear(), month + 1, 0).getDate();
    }
    {
      if(this.selectedfortnight == "Fortnight1"){
        this.dateFrom ="01-"+this.selectedMonth + "-"+ this.selectedYear;
        this.dateTo="15-"+this.selectedMonth + "-"+this.selectedYear;
      }
      else{
        var date = new Date();
        this.dateFrom ="16-"+this.selectedMonth + "-"+ this.selectedYear;
        this.dateTo=d+"-"+this.selectedMonth + "-"+ this.selectedYear;
      }
    }
  var frmData = new FormData();
  if (this.ValidationReports()) {
    const obj = {
      ControlRoomCode: this.glovalJson[0].LoginId,
      flag: 'Export',
      FromDate: this.dateFrom,
      ToDate: this.dateTo,
    }
  frmData.append("jsonDetail", JSON.stringify(obj));
  this.objDbServ.ShowLoaders.emit(true);
      this.objDbServ.ExportJMRReportForMail(frmData).subscribe(
          (resp: any) => {
              const data= (resp.json());
              if(data.MailResponse)
              {
                alert('Mail Send Successfully To H.O.');
              }
              else
              {
                alert('Mail Send Successfully To H.O.');
              }
                this.objDbServ.ShowLoaders.emit(false);
          },
          (error) =>{alert('Something went wrong.');
          this.objDbServ.ShowLoaders.emit(false);
      }
      )
    }
  }
  GetPdfForStation(itm: any) {
    if (!this.ValidationReports()) return;
    this.pendingDownloadFn = (skipSignature: boolean) => this.downloadStationPdf(itm, skipSignature);
    this.openSignatureModal();
  }
  downloadStationPdf(itm: any, skipSignature: boolean = false) {
    const obj = {
      ControlRoomCode: itm.StationCode,
      flag: 'Export',
      FromDate: this.dateFrom,
      ToDate: this.dateTo,
      SkipSignature: skipSignature,
      LoginId: localStorage.getItem('LoginId') || ''
    };
    this.objDbServ.ShowLoaders.emit(true);
    this.objDbServ.GetPdFReport(obj).subscribe(
      (resp: any) => {
        this.objDbServ.ShowLoaders.emit(false);
        const PdfUrl = this.objDbServ.apiUrl.substring(0, this.objDbServ.apiUrl.length - 4) + JSON.parse(resp.json());
        const FileSaver = require('file-saver');
        FileSaver.saveAs(PdfUrl);
      },
      () => {
        alert('Something went wrong.');
        this.objDbServ.ShowLoaders.emit(false);
      }
    );
  }
  openSignatureModal() {
    this.pendingSignatureFile = null;
    this.signaturePreviewUrl = '';
    const loginId = localStorage.getItem('LoginId') || '';
    this.objDbServ.getMOSignature({ LoginId: loginId }).subscribe(
      (resp: any) => {
        const path = JSON.parse(resp.json());
        this.signaturePreviewUrl = path ? (this.objDbServ.apiImageAttachment + path) : '';
      },
      () => { this.signaturePreviewUrl = ''; }
    );
    $('#signaturepopup').modal('show');
  }
  onSignatureFileSelected(event: any) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    this.pendingSignatureFile = file;
    const reader = new FileReader();
    reader.onload = (e: any) => { this.signaturePreviewUrl = e.target.result; };
    reader.readAsDataURL(file);
  }
  applySignature() {
    if (this.pendingSignatureFile) {
      const formData = new FormData();
      formData.append('SignatureImage', this.pendingSignatureFile, this.pendingSignatureFile.name);
      formData.append('LoginId', localStorage.getItem('LoginId') || '');
      this.objDbServ.ShowLoaders.emit(true);
      this.objDbServ.uploadMOSignature(formData).subscribe(
        () => { this.objDbServ.ShowLoaders.emit(false); this.proceedWithDownload(false); },
        () => { this.objDbServ.ShowLoaders.emit(false); alert('Something went wrong uploading the signature.'); }
      );
    } else {
      this.proceedWithDownload(false);
    }
  }
  downloadWithoutSignature() {
    this.pendingSignatureFile = null;
    this.proceedWithDownload(true);
  }
  proceedWithDownload(skipSignature: boolean) {
    $('#signaturepopup').modal('hide');
    if (this.pendingDownloadFn) {
      this.pendingDownloadFn(skipSignature);
      this.pendingDownloadFn = null;
    }
  }
  uploadSignature(event: any) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('SignatureImage', file, file.name);
    formData.append('LoginId', localStorage.getItem('LoginId') || '');
    this.objDbServ.ShowLoaders.emit(true);
    this.objDbServ.uploadMOSignature(formData).subscribe(
      (resp: any) => {
        this.objDbServ.ShowLoaders.emit(false);
        alert('Signature uploaded successfully.');
      },
      (error) => {
        this.objDbServ.ShowLoaders.emit(false);
        alert('Something went wrong.');
      }
    );
  }
  GetPDF() {
    const dt = new Date();
    if(this.selectedMonth =="Jan"){
      var month = 0;
      var d = new Date(dt.getFullYear(), month + 1, 0).getDate();
    }
   else if(this.selectedMonth =="Feb"){
      var month = 1;
      var d = new Date(dt.getFullYear(), month + 1, 0).getDate();
    }
    else if(this.selectedMonth =="Mar"){
      var month = 2;
      var d = new Date(dt.getFullYear(), month + 1, 0).getDate();
    }
    else if(this.selectedMonth =="Apr"){
      var month = 3;
      var d = new Date(dt.getFullYear(), month + 1, 0).getDate();
    }
    else  if(this.selectedMonth =="May"){
      var month = 4;
      var d = new Date(dt.getFullYear(), month + 1, 0).getDate();
    }
    else   if(this.selectedMonth =="June"){
      var month = 5;
      var d = new Date(dt.getFullYear(), month + 1, 0).getDate();
    }
    if(this.selectedMonth =="July"){
      var month = 6;
      var d = new Date(dt.getFullYear(), month + 1, 0).getDate();
    }
    else  if(this.selectedMonth =="Aug"){
      var month = 7;
      var d = new Date(dt.getFullYear(), month + 1, 0).getDate();
    }
    else if(this.selectedMonth =="Sep"){
      var month = 8;
      var d = new Date(dt.getFullYear(), month + 1, 0).getDate();
    }
    else if(this.selectedMonth =="Oct"){
      var month = 9;
      var d = new Date(dt.getFullYear(), month + 1, 0).getDate();
    }
    else   if(this.selectedMonth =="Nov"){
      var month = 10;
      var d = new Date(dt.getFullYear(), month + 1, 0).getDate();
    }
    else if (this.selectedMonth == "Dec"){
      var month = 11;
      var d = new Date(dt.getFullYear(), month + 1, 0).getDate();
    }
    {
      if(this.selectedfortnight == "Fortnight1"){
        this.dateFrom ="01-"+this.selectedMonth + "-"+ this.selectedYear;
        this.dateTo="15-"+this.selectedMonth + "-"+this.selectedYear;
      }
      else{
        var date = new Date();
        this.dateFrom ="16-"+this.selectedMonth + "-"+ this.selectedYear;
        this.dateTo=d+"-"+this.selectedMonth + "-"+ this.selectedYear;
      }
    }
    if (this.ValidationReports()) {
      const obj = {
        ControlRoomCode: this.glovalJson[0].LoginId,
        flag: 'Export',
        FromDate: this.dateFrom,
        ToDate: this.dateTo,
      }
      {
        if (this.selectedMonth != null && this.selectedfortnight != null ) {
          this.pendingDownloadFn = (skipSignature: boolean) => this.downloadAllStationsPdf(obj, skipSignature);
          this.openSignatureModal();
        }
        else {
          alert('Please Select Reporting Date.');
        }
      }
    }
  }
  downloadAllStationsPdf(obj: any, skipSignature: boolean = false) {
    obj = { ...obj, SkipSignature: skipSignature, LoginId: localStorage.getItem('LoginId') || '' };
    this.objDbServ.ShowLoaders.emit(true);
    this.objDbServ.GetPdFReportCR_MO(obj).subscribe(
      (resp: any) => {
        this.objDbServ.ShowLoaders.emit(false);
        var PdfUrl: string = "";
        PdfUrl = this.objDbServ.apiUrl.substring(0, this.objDbServ.apiUrl.length - 4) + JSON.parse(resp.json());
        const FileSaver = require('file-saver');
        FileSaver.saveAs(PdfUrl);
      },
      (error) => {
        alert('Something went wrong.');
        this.objDbServ.ShowLoaders.emit(false);
      }
    )
  }
}
