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
  selector: 'app-cluster-company',
  templateUrl: './cluster-company.component.html',
  styleUrls: ['./cluster-company.component.css']
})
export class ClusterCompanyComponent implements OnInit {
  constructor(private objDbServ: dbService, private objCook: CookieService) {
    this.objDbServ.MasterCompDisplay.emit(true);
    this.objDbServ.HeaderDisplay.emit(true);
    this.objDbServ.LeftMenu.emit(true);   
  }
  Status:boolean=true;
  CompanyClusterId:string = '0';
  CompanyClusterList:any = [];
  CompanyName:string="";
  SAPCode:string="";
  flag='CREATE';
  options:DatepickerOptions = {
    minYear: 2018,
    locale: enLocale,
    displayFormat: 'DD-MMM-YYYY'
  };
  ngOnInit() {
    this.GetCompanyClusterList();
    this.Status = true;
  }
  DeleteCompanyCluster(Id:string, itm:any){
    if(confirm("Are you sure to delete this record..?")) {
      var Json = {
        Id: Id
       }
      this.objDbServ.DeleteCompanyClusterById(Json).subscribe(
        (resp: any) => {
          const data = JSON.parse(resp.json());
          alert(data.Table[0].Status);
          setTimeout(() => {
            this.GetCompanyClusterList();
          });
          this.Clear();
          this.objDbServ.ShowLoaders.emit(false);
        },
        (error) => {alert("Something went wrong.");
        this.objDbServ.ShowLoaders.emit(false);}
      )
    }
    this.GetCompanyClusterList();
  }
  GetCompanyClusterList(){
    const obj = {
      flag:'GetAll'
    };
    this.objDbServ.ShowLoaders.emit(true);
    this.objDbServ.GetCompanyClusterList(obj).subscribe(
      (resp: any) => {
          this.CompanyClusterList = JSON.parse(resp.json()).Table;
          this.objDbServ.ShowLoaders.emit(false);
      },
      (error) => {alert("Something went wrong.");
      this.objDbServ.ShowLoaders.emit(false);}
    )
  }
  UpdateCompanyCluster(Id:string, itm:any){
    this.CompanyClusterId = Id;
    this.CompanyName = itm.name;
    this.flag='UPDATE';
    this.SAPCode = itm.SAPCode;
    this.Status = (itm.Status=='Active') ? true : false;
  }
  OnSubmit() {
    var MyJsonreset = {
      Id: this.CompanyClusterId,
      flag: this.flag,
      name: this.CompanyName,
      DS: (this.Status==true) ? '0' : '1',
      SAPCode:this.SAPCode
   };
  var frmData = new FormData();
  frmData.append("jsonDetail", JSON.stringify(MyJsonreset));
  var ErrorMsg = this.changeresetValidation(MyJsonreset);
  if(ErrorMsg == '' || ErrorMsg == undefined) {
      this.objDbServ.CompanyCluster(frmData).subscribe(
          (resp: any) => {
              const data= (resp.json());
              if(data.Status=="Inserted") {
                alert('Record Saved Successfully.!');
                this.GetCompanyClusterList();
              }
              else if(data.Status=="Updated") {
                alert('Record Updated Successfully.!');
                this.GetCompanyClusterList();
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
     this.CompanyClusterId='0';
     this.CompanyName='';
     this.Status = true;
     this.SAPCode='';
  }
  changeresetValidation(StationAttachment) {
    var regexNumeric = /^[+-]?[0-9]{1,1000}(?:\.[0-9]{1,1000})?$/;
    var regexDecimalThree = /^[+-]?[0-9]{1,10}(?:\.[0-9]{1,3})?$/;
    var regexDecimalThreeNegative = /^[+]?[0-9]{1,10}(?:\.[0-9]{1,3})?$/;
    var imgShow = 'assets/images/attachment.gif';
    var errorMsg = '' ;
        if ((StationAttachment.name === undefined) || StationAttachment.name == '') {
            errorMsg = 'Please enter the Company Name.'
            return errorMsg;
        }
        if (this.SAPCode == '') {
          errorMsg = 'Please enter SAP Code.'
          return errorMsg;
      }
        return errorMsg;
  }
}
