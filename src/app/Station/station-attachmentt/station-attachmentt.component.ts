import { Component, OnInit } from '@angular/core';
import { dbService } from '../../Service/db.service';
import { CookieService } from 'ngx-cookie-service';
import { DatepickerOptions } from 'ng2-datepicker';
import { isUndefined, isNullOrUndefined } from 'util';
import { MAX_LENGTH_VALIDATOR } from '@angular/forms/src/directives/validators';
import { tick } from '@angular/core/testing';
import { NULL_EXPR } from '@angular/compiler/src/output/output_ast';
import * as enLocale from 'date-fns/locale/en';
import { DomSanitizer} from '@angular/platform-browser';
import { DatePipe } from '@angular/common';
import { parse } from 'path';
declare var $:any;
@Component({
  selector: 'app-station-attachmentt',
  templateUrl: './station-attachmentt.component.html',
  styleUrls: ['./station-attachmentt.component.css']
})
export class StationAttachmenttComponent implements OnInit {
  constructor(private objDbServ: dbService, private objCook: CookieService) {
    this.objDbServ.MasterCompDisplay.emit(true);
    this.objDbServ.HeaderDisplay.emit(true);
    this.objDbServ.LeftMenu.emit(true);   
  }
  ModalName:string = '';
  ListImagePath:string='';
  DocResetPopup:boolean=false;
  DocumentImagePath:string = '';
  StationAttachmentId:string = '0';
  StationAttachmentList:any = [];
  uploadedfilereset:File;
  AttachmentFile:File;
  DocumentName:string="";
  Remark:string="";
  StationId:string=this.objCook.get('stationId');
  Reading:string="";
  filevisible:boolean = true;
  date:Date;
  ExpiryDate:any;
  flag='CREATE';
  options:DatepickerOptions = {
    minYear: 2018,
    locale: enLocale,
    displayFormat: 'DD-MMM-YYYY'
  };
  ngOnInit() {
    this.GetStationAttachmentList();
    this.ExpiryDate=this.objCook.get('CurrentDate'); 
  }
  fileuploadreset(file: FileList, event: any) {
    this.uploadedfilereset = file.item(0);
  }
  OnDateChnage(val){
    this.ExpiryDate=new Date(val)
  }
  Readingvalue(value) {
    this.Reading = value;
    if(this.Reading!='') {
        this.filevisible = false;
    }
    else {
        this.filevisible = true;
    }
  }
  DeleteStationAttachment(Id:string, itm:any){
    if(confirm("Are you sure to delete this record..?")) {
      var Json = {
        Id: Id
       }
      this.objDbServ.DeleteStationAttachment(Json).subscribe(
        (resp: any) => {
          const data = JSON.parse(resp.json());
          alert(data.Table[0].Status);
          setTimeout(() => {
            this.GetStationAttachmentList();
          });
          this.Clear();
          this.objDbServ.ShowLoaders.emit(false);
        },
        (error) => {alert("Something went wrong.");
        this.objDbServ.ShowLoaders.emit(false);}
      )
    }
    this.GetStationAttachmentList();
  }
  ViewStationAttachment(Path:string, itm:any){
    if(Path.split('.').pop() == "pdf") {
      this.ModalName = "#none";
      window.open(this.objDbServ.apiImageAttachment+"/Attachments/"+Path, '_blank');
    }
    else {
      this.ModalName = "#myModal";
      this.DocumentImagePath = this.objDbServ.apiImageAttachment+"/Attachments/"+Path;
    }
  }
  resetPopup(flag) { 
    this.DocResetPopup = flag; 
  }
  CheckExtn(Path:string, itm:any) {
    if(Path.split('.').pop() == "pdf")
    {
      this.ListImagePath = this.objDbServ.apiImageAttachment+"/Attachments/pdfIcon.png";
    }
    else
    {
      this.ListImagePath = this.objDbServ.apiImageAttachment+"/Attachments/"+Path;
    }
  }
  GetStationAttachmentList(){
    const obj = {
      StationId:this.StationId
    };
    this.objDbServ.ShowLoaders.emit(true);
    this.objDbServ.GetStationAttachment(obj).subscribe(
      (resp: any) => {
          this.StationAttachmentList = JSON.parse(resp.json()).Table;
          this.objDbServ.ShowLoaders.emit(false);
      },
      (error) => {alert("Something went wrong.");
      this.objDbServ.ShowLoaders.emit(false);}
    )
  }
  UpdateStationAttachment(Id:string, itm:any){
    this.filevisible=false;
    this.StationAttachmentId = Id;
    this.DocumentName = itm.DocumentName;
    this.Remark = itm.Remark;
    this.flag='UPDATE';
    this.ExpiryDate = itm.ExpiryDate;
  }
  OnSubmit() {
    var MyJsonreset = {
      StationId: this.StationId,
      flag: this.flag,
      Id: (this.StationAttachmentId=="" || isNullOrUndefined(this.StationAttachmentId)) ? 0 : this.StationAttachmentId,
      DocumentName: this.DocumentName,
      Remark:this.Remark,
      FilePath: localStorage.getItem('LoginId') + "/StationAttachment/",
      ExpiryDate: this.ExpiryDate
   };
  this.AttachmentFile = $('#StationAttachmentInput');  
  var frmData = new FormData();
  var fileInputreset = this.AttachmentFile[0];
  frmData.append("jsonDetail", JSON.stringify(MyJsonreset));
  if(this.uploadedfilereset != undefined) {
      frmData.append('StationAttachmentFile', this.uploadedfilereset, this.uploadedfilereset.name);
     }
  var ErrorMsg = this.changeresetValidation(MyJsonreset);
  if(ErrorMsg == '' || ErrorMsg == undefined) {
      this.objDbServ.StationAttachment(frmData).subscribe(
          (resp: any) => {
              const data= (resp.json());
              if(data.Status=="Inserted") {
                alert('Record Saved Successfully.!');
                this.GetStationAttachmentList();
              }
              else if(data.Status=="Updated") {
                alert('Record Updated Successfully.!');
                this.GetStationAttachmentList();
              }
              else {
                alert(data.Status);
              }
             this.Clear();
          },
          (error) =>{alert('Something went wrong.');
          this.objDbServ.ShowLoaders.emit(false);
      }
      )
   }
   else {
      alert(ErrorMsg);
    }   
  }
  Clear(){
    this.flag='CREATE'
     this.StationAttachmentId='0';
     this.Reading='';
     this.ExpiryDate=new Date()
     this.DocumentName ='';
     this.Remark=''
     $('#StationAttachmentInput').val('');
  }
  changeresetValidation(StationAttachment) {
    var regexNumeric = /^[+-]?[0-9]{1,1000}(?:\.[0-9]{1,1000})?$/;
    var regexDecimalThree = /^[+-]?[0-9]{1,10}(?:\.[0-9]{1,3})?$/;
    var regexDecimalThreeNegative = /^[+]?[0-9]{1,10}(?:\.[0-9]{1,3})?$/;
    var imgShow = 'assets/images/attachment.gif';
    var errorMsg = '' ;
     if ((StationAttachment.DocumentName === undefined) || StationAttachment.DocumentName == '') {
            errorMsg = 'Please enter the Document Name.'
            return errorMsg;
        }
        else if(this.uploadedfilereset == undefined || this.uploadedfilereset == null)
        {
            errorMsg = 'Please select image/Pdf'
            return errorMsg;
        }
       else if(this.Remark == ''){
          errorMsg='Please Fill Remark';
          return errorMsg;
        }
        return errorMsg;
  }
}
