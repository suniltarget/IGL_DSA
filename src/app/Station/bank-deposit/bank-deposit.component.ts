import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { dbService } from '../../Service/db.service';
import { Response } from '@angular/http';
import { FilterSearchPipe } from '../../Filters/filter-search.pipe';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { CookieService } from 'ngx-cookie-service';
import { isNullOrUndefined } from 'util';
import { DatepickerOptions } from 'ng2-datepicker';
import * as enLocale from 'date-fns/locale/en';
import { parseDate } from 'ngx-bootstrap/chronos';
import { TabHeadingDirective } from 'ngx-bootstrap';
declare var $:any;
@Component({
  selector: 'app-bank-deposit',
  templateUrl: './bank-deposit.component.html',
  styleUrls: ['./bank-deposit.component.css']
})
export class BankDepositComponent implements OnInit {
  Cdate='';
  detailsStation:{StationId:string,SummeryDate:string,UserId:string}
  StationShift:{ShiftId:string,SubShiftId:string,ActiveTab:string}
  AddDenominationsType:{DenominationsId,DenominationsName,DenominationsCount ,DenominationsAmount}[];
  CashPayment:{RowNo,PaymentModeId,PaymentMode,PaymentAmount}[];
  OpeningCashBalance='0.00';
  TotalSale='0.00';
  CashDeposit='0.00';
  ClosingCashBalance='0.00';
  CurrentCash='0.00';
  DepositDate='';
  oldvalue:string='';
  paymentpoup:boolean=false;
  RemarkIsfalse:boolean=false;
  remark: string;
  dCompany:boolean = false;
  IsPopUpFlag:boolean=false;
  searchValue:string = '';
  IsBankSubmitted:boolean=false;
  SlipNo: string='';
  CompanyName:string='';
  selectedStation:number = 0;
  submittedflag:boolean = false;
  SubmitBy :string='';
  selectedShiftId:string='-1';
  selectedSubShiftId:string='';
  SubmissionDate:any;
  submitButton:boolean = true;
  DepartmentCode :string= this.objCook.get('DepartmentCode');
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
  @ViewChild('searchInput') searchInput: ElementRef;
 constructor(private objDbServ: dbService, private objCook: CookieService) { 
   this.objDbServ.MasterCompDisplay.emit(true);
   this.objDbServ.ShiftDetails.subscribe(
    (test1: {ShiftId:string,SubShiftId:string,ActiveTab:string}) => 
    {
      this.StationShift =test1;
      this.selectedShiftId=this.StationShift.ShiftId;
      this.selectedSubShiftId=this.StationShift.SubShiftId;
      if(this.StationShift.ActiveTab=='Bank'){
        setTimeout(() => {
          this.GetDenominationsType();
          this.GetStationCompany();});
          this.FetchDSASubmittedData();
      }
    }
  );
  this.objDbServ.StationDetails.subscribe(
    (test: {StationId:string,SummeryDate:string,UserId:string}) => 
    {
      this.detailsStation =test;
    }
  );
  this.objDbServ.lockUnlock.subscribe(value => {
  })
 }
 ngOnInit() {
  this.selectedStation = Number(this.objCook.get('stationId'));
  this.SubmissionDate = this.detailsStation.SummeryDate;
 }
 GetDenominationsType(){
  this.objDbServ.ShowLoaders.emit(true);
  this.objDbServ.GetDenominationsData({StationId: this.detailsStation.StationId, DepositDate: this.detailsStation.SummeryDate}).subscribe(
    (resp: any) => {
      this.AddDenominationsType=JSON.parse(resp.json()).Table;
      this.CashPayment=JSON.parse(resp.json()).Table1;
      this.OpeningCashBalance=parseFloat(JSON.parse(resp.json()).Table2[0].OpeningCashBalance.toFixed(2)).toString();
      this.CurrentCash=parseFloat(JSON.parse(resp.json()).Table2[0].CurrentCash.toFixed(2)).toString();
      this.ClosingCashBalance=parseFloat(JSON.parse(resp.json()).Table2[0].ClosingCashBalance.toFixed(2)).toString();
      this.CalculateClosingBalanace();
      var Ischek = JSON.parse(resp.json()).Table2[0].IsSubmited;
      if(Ischek==1)
      {
         $("#IsSubmitcheck").prop("checked", true);
         this.IsBankSubmitted = true; 
      }
      else
      {
         $("#IsSubmitcheck").prop("checked", false);
         this.SlipNo='';
        this.SubmitBy='';
        this.IsBankSubmitted = false;
      }
      this.SlipNo = JSON.parse(resp.json()).Table2[0].SlipNo;
      this.SubmitBy = JSON.parse(resp.json()).Table2[0].SubmittedBy;
      this.remark = JSON.parse(resp.json()).Table2[0].Remark;
      this.SubmissionDate = isNullOrUndefined(JSON.parse(resp.json()).Table2[0].SubmissionDate) ? this.detailsStation.SummeryDate : JSON.parse(resp.json()).Table2[0].SubmissionDate;
      this.objDbServ.ShowLoaders.emit(false);
    },
    (error) => {alert("Something went wrong.");
    this.objDbServ.ShowLoaders.emit(false);
    }
  )
}
  check(evt){
    var charCode = (evt.which) ? evt.which : evt.keyCode
    if (charCode > 31 && (charCode < 48 || charCode > 57))
      return false;
    return true;
  }
  Onchange(val,DenominationsName){
    if(val.value==''){
      const Value = this.AddDenominationsType.find(pm => pm.DenominationsName === DenominationsName);
      if(DenominationsName=='Other Notes'){
        Value.DenominationsAmount = 0;
        Value.DenominationsCount = (parseFloat(val.value)).toString();
      }
      else if(DenominationsName=='Coins'){
        Value.DenominationsAmount = 0;
        Value.DenominationsCount = (parseFloat(val.value)).toString();
      }
      else{
        Value.DenominationsCount = val.value;
        Value.DenominationsAmount = (0*parseFloat(DenominationsName)).toString();
      }
    }
    else{
      const Value = this.AddDenominationsType.find(pm => pm.DenominationsName === DenominationsName);
      if(DenominationsName=='Other Notes'){
        Value.DenominationsAmount = (parseFloat(val.value)).toString();
        Value.DenominationsCount = (parseFloat(val.value)).toString();
      }
      else if(DenominationsName=='Coins'){
        Value.DenominationsAmount = (parseFloat(val.value)).toString();
        Value.DenominationsCount = (parseFloat(val.value)).toString();
      }
      else{
        Value.DenominationsCount = val.value;
        Value.DenominationsAmount = (parseFloat(val.value)*parseFloat(DenominationsName)).toString();
      }
    }
    this.CalculateClosingBalanace();
  }
  a:number;
  CalculateClosingBalanace(){
    this.CashDeposit='0.00';
    for (var i = 0; i < this.AddDenominationsType.length; i++) {
      this.CashDeposit=(parseFloat(this.CashDeposit)+ parseFloat(this.AddDenominationsType[i].DenominationsAmount)).toFixed(2).toString();
    }
    const Value = this.CashPayment.find(pm => pm.PaymentMode === 'Closing Cash Balance');
     this.ClosingCashBalance=((parseFloat(this.OpeningCashBalance)+parseFloat(this.CurrentCash)-parseFloat(this.CashDeposit)).toFixed(2)).toString();
       Value.PaymentAmount = this.ClosingCashBalance;
  }
  OnDateChnagefrom(val){
    this.SubmissionDate=new Date(val)
  }
  FetchDSASubmittedData() {
    var objson= {
      StationId : Number(this.objCook.get('stationId')), 
      StationCode : this.objCook.get('stationCode'),
      CDate: this.detailsStation.SummeryDate,
      Flag : this.DepartmentCode,
      SOPId : this.DepartmentCode == 'SOP' ? this.objCook.get('UID') : 0 
    };
    this.objDbServ.FetchDSASubmittedData(objson).subscribe(
      (resp: any) => {
        var arr:any=[];
        const data1 = JSON.parse(resp.json());
        try 
        {
         if(data1.Table1.length > 0 || data1.Table2.length > 0) {
            if(JSON.parse(resp.json()).Table[0].IsStationSubmitted == 1 || JSON.parse(resp.json()).Table[0].IsSubmittedBySOP == 1)
             this.submitButton = false;
            else
             this.submitButton = true;         
       }      
      }
      catch{
        this.submitButton = true;
      }
      },
      (error) =>{
        alert('Something went wrong.');
      }
    )
  }
 saveBankDeposit(){
   if(this.detailsStation.SummeryDate != '') {
    this.GetStationCompany();
    var v = (this.IsBankSubmitted==true) ? 1 : 2;
      if(parseFloat(this.CashDeposit) <= (parseFloat(this.CurrentCash) + parseFloat(this.OpeningCashBalance)) ){
      if(this.IsBankSubmitted==true) {
         if(this.SlipNo == '') { 
            alert('Slip/reference no. must be fill.');
            return false;
         }
         if(this.SubmitBy == '') { 
          alert('SubmitBy must be fill.');
          return false;
         }
         if(Date.parse(this.SubmissionDate) < Date.parse(this.detailsStation.SummeryDate))
         {
           alert('Submission Date must be Greater than Entry Date.');
           return false;
         }
       }
       if(this.remark == null || this.remark == '')
       {
        alert('Remark must be fill ');
        return false;
       }
      this.objDbServ.ShowLoaders.emit(true);     
      this.objDbServ.BankDepositPaymentCollection({StationId: this.detailsStation.StationId, UserId: this.detailsStation.UserId, Remark: this.remark, DepositDate:this.detailsStation.SummeryDate, DispanserPayment:this.AddDenominationsType,SlipNo:this.SlipNo,IsSubmited:v,SubmitBy:this.SubmitBy,EntryDate:this.SubmissionDate}).subscribe
      (
        (resp: Response) => 
        {
          const data = JSON.parse(resp.json());
          alert(data.Table[0].Meaasge);
          this.objDbServ.ShowLoaders.emit(false);
          if(data.Table[0].Meaasge.indexOf('transfer') > -1)
          {
          }
          else if(data.Table[0].Meaasge.indexOf('successfully') > -1)
          {           
                this.objDbServ.ShiftDetails.emit({
                ShiftId:this.selectedShiftId,
                SubShiftId: this.selectedSubShiftId,
                ActiveTab:"Summary"
              });
                $('.nav-tabs > .active').next('li').find('a').trigger('click'); 
          }
          else{
            alert(data.Table[0].Meaasge);
          }
          this.objDbServ.ShowLoaders.emit(false);
        },
        (error) => 
        {
          alert("Something went wrong.");
          this.objDbServ.ShowLoaders.emit(false);
        }
    )
 }
  else{
        if(this.IsPopUpFlag == false){
          this.paymentpoup = true;         
       }
      else{
        this.RemarkIsfalse = false;
        if(this.IsBankSubmitted==true) {
          if(this.SlipNo == '') { 
             alert('Slip/reference no. must be fill.');
             return false;
          }
          if(this.SubmitBy == '') { 
           alert('SubmitBy must be fill.');
           return false;
          }
        }
            if(this.remark != '' && this.remark != undefined){
                this.objDbServ.ShowLoaders.emit(true);
                this.objDbServ.BankDepositPaymentCollection({StationId: this.detailsStation.StationId,UserId: this.detailsStation.UserId, Remark: this.remark, DepositDate:this.detailsStation.SummeryDate,DispanserPayment:this.AddDenominationsType,SlipNo:this.SlipNo,IsSubmited:v,SubmitBy:this.SubmitBy,EntryDate:this.SubmissionDate}).subscribe
                (
                (resp: Response) => 
                {
                  const data = JSON.parse(resp.json());
                  alert(data.Table[0].Meaasge);
                  this.objDbServ.ShowLoaders.emit(false);
                  if(data.Table[0].Meaasge.indexOf('transfer') > -1)
                  {
                  }
                  else if(data.Table[0].Meaasge.indexOf('successfully') > -1)
                  {           
                        this.objDbServ.ShiftDetails.emit({
                        ShiftId:this.selectedShiftId,
                        SubShiftId: this.selectedSubShiftId,
                        ActiveTab:"Summary"
                      });
                        $('.nav-tabs > .active').next('li').find('a').trigger('click');                     
                  }
                  else{
                    alert(data.Table[0].Meaasge);
                  }
                  this.objDbServ.ShowLoaders.emit(false);
                  this.searchInput.nativeElement.value = '';
                  this.remark = '';
                  this.RemarkIsfalse = false;                  
                  this.IsPopUpFlag = false;
                },
                (error) => 
                {
                  alert("Something went wrong.");
                  this.objDbServ.ShowLoaders.emit(false);
                }
              )
            }
          else{
            alert("Remark Can't be blank.!");
          }
      }
}
}
 else{
  alert("Deposit date must be.");
 }
}
saveBankDepositOnOkClick(val){
  if(val == "yes"){
      this.RemarkIsfalse = true;
      this.paymentpoup = false;
      this.IsPopUpFlag = true;
  }
  else{
    this.RemarkIsfalse = false;
    this.paymentpoup = false;
  }
}
OnCheckboxChange(evt) {
  if(evt.target.checked==true) {
    this.SlipNo='';
    this.SubmitBy='';
    this.IsBankSubmitted = true;
  }
  else if(evt.target.checked==false) {
    this.SlipNo='';
    this.SubmitBy='';
    this.IsBankSubmitted = false; 
    for (let i = 0; i <= this.AddDenominationsType.length; i++) {
      this.AddDenominationsType[i]['DenominationsCount'] = 0;  
      this.AddDenominationsType[i]['DenominationsAmount'] = 0;  
      this.CashDeposit = '0';
      this.CalculateClosingBalanace();
    }
  }     
}
unlockpayment(){
  alert("Please unlock this from payment collection tab");
}
GetStationCompany() {
  this.objDbServ.GetStationCompany({Flag: 'CompanyByStation', Id: this.selectedStation, Status:1}).subscribe(
    (resp: any) => {
      this.CompanyName=JSON.parse(resp.json()).Table[0].CompanyName;
      this.CheckCompany();      
    },
    (error) => {alert("Something went wrong.");
     this.objDbServ.ShowLoaders.emit(false);
    }
  )
}
CheckCompany() {
  if(this.CompanyName == 'DODO') {
    this.dCompany = true;
    this.IsBankSubmitted=true;
    this.objDbServ.IsBankDepositValid.emit(true);
  }
  else {
     this.objDbServ.IsBankDepositValid.emit(false);
 }     
}
}
