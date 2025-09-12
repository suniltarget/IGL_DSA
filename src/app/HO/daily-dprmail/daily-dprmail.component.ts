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
@Component({
  selector: 'app-daily-dprmail',
  templateUrl: './daily-dprmail.component.html',
  styleUrls: ['./daily-dprmail.component.css']
})
export class DailyDPRMailComponent implements OnInit {
  constructor(private objDbServ: dbService, private objCook: CookieService) {
    this.objDbServ.MasterCompDisplay.emit(true);
    this.objDbServ.HeaderDisplay.emit(true);
    this.objDbServ.LeftMenu.emit(true);   
  }
  DPREmail:string = '';
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
  ExpiryDate:string;
  flag='CREATE';
  IndEmail:any = [];
  options:DatepickerOptions = {
    minYear: 2018,
    locale: enLocale,
    displayFormat: 'DD-MMM-YYYY'
  };
  ngOnInit() {
    this.GetDPRMails();
  }
  resetPopup(flag) { 
    this.DocResetPopup = flag; 
  }
  OnSubmit() {
    var ErrorMsg = this.ValidationMail();
    if (ErrorMsg == '' || ErrorMsg == undefined) {
    var MyJsonreset = {
      Emails: this.DPREmail
   };
  var frmData = new FormData();
  frmData.append("jsonDetail", JSON.stringify(MyJsonreset));
      this.objDbServ.UpdateDPREmail(frmData).subscribe(
          (resp: any) => {
              const data= (resp.json());
            if(data.Status=="Updated") {
                alert('Record Updated Successfully.!');
                this.GetDPRMails();
              }
              else {
                alert(data.Status);
              }
              this.GetDPRMails();
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
  MailSend() {
    var MyJsonreset = {
      Emails: this.DPREmail
   };
  var frmData = new FormData();
  frmData.append("jsonDetail", JSON.stringify(MyJsonreset));
  this.objDbServ.ShowLoaders.emit(true);
      this.objDbServ.SendDailyDPRMail(frmData).subscribe(
          (resp: any) => {
              const data= (resp.json());
              if(data.MailResponse)
              {
                alert('Mail Send Successfully');
              }
              else
              {
                alert('Mail Send Failed');
              }
                this.GetDPRMails();
                this.objDbServ.ShowLoaders.emit(false);
          },
          (error) =>{alert('Something went wrong.');
          this.objDbServ.ShowLoaders.emit(false);
      }
      )
  }
  GetDPRMails(){
    const obj = {
      Flag:"Get"
    };
    this.objDbServ.GetDPRMails(obj).subscribe(
      (resp: any) => {
          this.StationAttachmentList = JSON.parse(resp.json()).Table;
          this.DPREmail = this.StationAttachmentList[0].Email;
      },
      (error) => {alert("Something went wrong.");
      this.objDbServ.ShowLoaders.emit(false);}
    )
  }
  ValidationMail(){
    var errorMsg = '';
    var re = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);
    this.IndEmail = this.DPREmail.split(',')
    for (let i = 0; i < this.IndEmail.length; i++) {
      if (!re.test((this.IndEmail[i]).toString().trim())) {
        errorMsg = 'Invalid Email - ' + this.IndEmail[i];
      return errorMsg;
    }
    }
    return errorMsg;
  }
}
