import { Component, OnInit } from '@angular/core';
import { Http, Response} from '@angular/http';
import { dbService } from '../../Service/db.service';
import { CookieService } from 'ngx-cookie-service';
import { DecimalPipe } from '@angular/common';
import { Router } from '@angular/router';
import { OnChanges } from '@angular/core/src/metadata/lifecycle_hooks';
import { isNullOrUndefined } from 'util';
import { DatePipe } from '@angular/common';
declare var $:any;
@Component({
  selector: 'app-add-payment',
  templateUrl: './add-payment.component.html',
  styleUrls: ['./add-payment.component.css']
})
export class AddPaymentComponent implements OnInit, OnChanges {
  detailsStation:{StationId:string,SummeryDate:string,UserId:string}
  StationShift:{ShiftId:string,SubShiftId:string,ActiveTab:string}
  dispCounterIndex:number=0;
  DispencerCount:number=0
  totalDispenser:number=0;
  cmbShiftData:{}[];
  cmbSubShiftData:{}[];
  selectedShiftId='-1'
  selectedSubShiftId='-1'
  listDispensers:{DispenserName,DispenserId,StationId}[];
  selectedDispId=0;
  cnt=0;
  showNext:boolean = true;
  showPrevious:boolean = true;  
  ValidationFlag:number
  AddPaymentMode:{PaymentModeId,PaymentMode,PaymentQuantityA,PaymentAmountA,PaymentQuantityB,PaymentAmountB}[];
  CreditPartySale='0.00';
  CreditCardSale='0.00';
  PrepaidCardSale='0.00';
  PaytmSale='0.00';
  PrepaidCardLoading='0.00';
  PrepaidCardActivations='0.00';
  OtherSale='0.00';
  CashSale='0.00';
  LubeSale='0.00';
  TotalReadingsA='0.00';
  TotalReadingsB='0.00';
  TotalSalesA='0.00';
  TotalSalesB='0.00';
  CurrentRate='0.00';
  NormalRate='0.00';
  DiscountedRate='0.00';
  TotalCurrentSalesA='0.00';
  TotalCurrentReadingsA='0.00';
  TotalCurrentSalesB='0.00';
  TotalCurrentReadingsB='0.00';
  TotalCashSalesA='0.00';
  TotalCashSalesB='0.00';
  oldvalue:string;
  SubShiftId;
  PeriousA='0.00';
  PeriousB='0.00';
  selectedPaymentModeId:string;
  selectedPaymentAmount:string;
  IsCmbDisable:boolean = false;
  listDSM:any=[];
  SelectedDSMIdArmA:string='';
  SelectedDSMIdArmB:string='';
  StationId = Number(this.objCook.get('stationId'));
  Armsflag:string='';
  ValidateDSM:boolean=true;
  DSMId:string='';
  selectedStation: number = 0;
  SubmittedBySOPFlag: boolean = false;
  enterOtpfields:boolean=false;
  enteredotp:string = "";
  validotp:string="";
  popupDate:string="";
  successMessage:boolean = false;
  IsShiftIdComplete:number;
  SaveEnable:boolean=true;
  IsTimeOverlocal:boolean=false;
  LockUnlockShiftId:number;
  CompanyName: any;
  CompanyId: any;
  company:boolean = false;
  submitButton:boolean = true;
  DepartmentCode :string= this.objCook.get('DepartmentCode');
ngOnChanges() { 
}
  constructor(private objDbServ: dbService, private objCook: CookieService, private objRoute: Router, private dp: DatePipe) {   
    this.getDSM();
    this.objDbServ.MasterCompDisplay.emit(true);
    this.objDbServ.ShiftDetails.subscribe(
      (test1: {ShiftId:string,SubShiftId:string,ActiveTab:string}) => 
      {
        this.StationShift =test1;
        if(this.StationShift.ActiveTab=='Payment'){
          this.selectedDispId=0;
          this.selectedShiftId=this.StationShift.ShiftId;
          this.selectedSubShiftId=this.StationShift.SubShiftId;
          this.dispCounterIndex = 0;
          setTimeout(() => {this.GetDataByShift();});
          this.FetchDSASubmittedData();
          this.GetStationCompany();
        }
      }
    );
    this.objDbServ.StationDetails.subscribe(
      (test: {StationId:string,SummeryDate:string,UserId:string}) => 
      {
        this.detailsStation =test;
      }
    ); 
    this.objDbServ.IsShiftIdPending.subscribe(value => {
      this.IsShiftIdComplete = value;
    }); 
    this.objDbServ.IsTimeOver.subscribe(value => {
      this.IsTimeOverlocal = value;
    });
    this.objDbServ.lockUnlockShiftId.subscribe(value => {
      this.LockUnlockShiftId = value;
    });
  }
  ngOnInit() {
    this.dispCounterIndex = 0;
    this.showNext = true;
    this.showPrevious = true;
    this.selectedStation = Number(this.objCook.get('stationId'));
  }
  onDSMSelectArmA(val){
      this.SelectedDSMIdArmA = val;
      this.Armsflag='ArmA';
      if(Number(this.SelectedDSMIdArmA) > 0) {
        this.DSMId = this.SelectedDSMIdArmA;
        this.checkDSMByDay();
      }        
  }
  onDSMSelectArmB(val){
      this.SelectedDSMIdArmB = val;
      this.Armsflag='ArmB'; 
      if(Number(this.SelectedDSMIdArmB) > 0) {
        this.DSMId = this.SelectedDSMIdArmB;
        this.checkDSMByDay();
      }    
  }
  checkDSMByDay() {
    var obj={
      Flag :  this.Armsflag,
      DSMId : this.DSMId,
      ShiftId :  this.selectedShiftId,
      EntryDate : this.detailsStation.SummeryDate
    }
    this.objDbServ.checkDSMByDay(obj).subscribe(
      (resp: any) => {
        const data =JSON.parse(resp.json()).Table
        if(data[0].Mesage != '') {
          alert(data[0].Mesage);
          this.ValidateDSM=false;
        }
        else
          this.ValidateDSM=true;
      },
      (error) => {alert("Something went wrong.");
       this.objDbServ.ShowLoaders.emit(false);
      }
    )
  }
  getDSM() {
    this.objDbServ.getDSMMaster({Flag: 'DSMByStation', Id: this.StationId, Status:0}).subscribe(
      (resp: Response) => {
        this.listDSM=JSON.parse(resp.json()).Table
      },
      (error) => {alert("Something went wrong.");
       this.objDbServ.ShowLoaders.emit(false);
      }
    )
  }
  getData(){
    this.cnt=this.cnt+1
    this.objDbServ.ShowLoaders.emit(true);
    this.objDbServ.CommonGetData({Flag: 'StationDispenserData', Id: this.detailsStation.StationId}).subscribe(
      (resp: Response) => {
        this.DispencerCount=JSON.parse(resp.json()).Table.length;
        this.objDbServ.ShowLoaders.emit(false);
        if(this.DispencerCount > 0 && JSON.parse(resp.json()).Table1.length > 0)
        {
          this.DispencerCount=this.DispencerCount-1;
          this.selectedDispId = JSON.parse(resp.json()).Table[0].DispenserId;
          this.listDispensers = JSON.parse(resp.json()).Table;
          this.totalDispenser = JSON.parse(resp.json()).Table.length;
          this.cmbShiftData = JSON.parse(resp.json()).Table1;
          this.selectedShiftId = this.StationShift.ShiftId;
          setTimeout(() => {this.GetDataByShift();});
        }
      },
      (error) => {
        alert("Something went wrong.");
        this.objDbServ.ShowLoaders.emit(false);
      }
    )
  }
  onSelectShift(shiftId:string){
    this.selectedShiftId = shiftId;
    if(this.selectedShiftId=='-1'){
      this.CurrentRate='0.00';
    }
    else if(this.selectedShiftId=='4'){
        this.CurrentRate=this.DiscountedRate;
        this.GetDataByShift();
    }
    else
    {
      this.CurrentRate=this.NormalRate;
      setTimeout(() => {this.GetDataByShift();});
    }
  }
 onSelectDispenser(dispenserId:string){
    this.dispCounterIndex =this.listDispensers.findIndex(item => item.DispenserId === Number(dispenserId));
    this.selectedDispId = Number(dispenserId);
    setTimeout(() => {this.GetDataByShift();});
  }
GetDataByShift(){
    this.objDbServ.ShowLoaders.emit(true);
    this.objDbServ.GetPaymentByShift({EntryDate:this.detailsStation.SummeryDate,ShiftId: this.selectedShiftId, DispenserId: this.selectedDispId,StationId:this.detailsStation.StationId}).subscribe(
    (resp: any) => {
      if(this.selectedDispId==0)
      this.selectedDispId = JSON.parse(resp.json()).Table3[0].DispenserId;
      this.DispencerCount=JSON.parse(resp.json()).Table3.length;
      this.listDispensers = JSON.parse(resp.json()).Table3;
      this.totalDispenser = JSON.parse(resp.json()).Table3.length;
      this.cmbShiftData = JSON.parse(resp.json()).Table1;
      this.cmbSubShiftData = JSON.parse(resp.json()).Table2;
      this.DispencerCount=this.DispencerCount-1;
      this.AddPaymentMode=JSON.parse(resp.json()).Table;
      this.TotalSalesA=(parseFloat(JSON.parse(resp.json()).Table2[0].TotalSalesA).toFixed(2)).toString();
      this.TotalSalesB=(parseFloat(JSON.parse(resp.json()).Table2[0].TotalSalesB).toFixed(2)).toString();
      this.TotalReadingsA=(parseFloat(JSON.parse(resp.json()).Table2[0].TotalReadingsA).toFixed(2)).toString();
      this.TotalReadingsB=(parseFloat(JSON.parse(resp.json()).Table2[0].TotalReadingsB).toFixed(2)).toString();
      this.DiscountedRate=(parseFloat(JSON.parse(resp.json()).Table2[0].DisountedRate).toFixed(2)).toString();
      this.NormalRate=(parseFloat(JSON.parse(resp.json()).Table2[0].CurrentRate).toFixed(2)).toString();
      this.selectedShiftId=JSON.parse(resp.json()).Table2[0].ShiftId;
      this.ValidationFlag=JSON.parse(resp.json()).Table2[0].ValidationFlag;
      this.SelectedDSMIdArmA= JSON.parse(resp.json()).Table2[0].DSMIdArmA;
      this.SelectedDSMIdArmB= JSON.parse(resp.json()).Table2[0].DSMIdArmB;
      if(this.selectedShiftId=='-1')
       this.CurrentRate='0.00';
      else if(this.selectedShiftId=='4')
        this.CurrentRate=this.DiscountedRate;
      else
       this.CurrentRate=this.NormalRate;
      this.TotalCashSalesA=this.TotalSalesA;
      this.TotalCashSalesB=this.TotalSalesB;
      this.sumup();
      this.objDbServ.ShowLoaders.emit(false);
    },
    (error) => {alert("Something went wrong.");
    this.objDbServ.ShowLoaders.emit(false);})
}
onClickNext(){
  if(this.dispCounterIndex <= (this.totalDispenser - 1)){
    this.savePayment('N');
  }
  else{
    this.objDbServ.ShiftDetails.emit({
      ShiftId:this.selectedShiftId,
      SubShiftId: this.selectedSubShiftId,
      ActiveTab:"Other"
    });
    $('.nav-tabs > .active').next('li').find('a').trigger('click'); 
  }
}
onClickPrevious(){
  if(this.dispCounterIndex >= 0){
    this.dispCounterIndex--;
    if(this.dispCounterIndex == 0){
        this.showPrevious = false;
        const dispIdToGo = this.listDispensers[this.dispCounterIndex].DispenserId;
        this.onSelectDispenser(dispIdToGo);
    }
    else
    {
      this.objDbServ.ShiftDetails.emit({
        ShiftId:this.selectedShiftId,
        SubShiftId: this.selectedSubShiftId,
        ActiveTab:"Dispenser"
      });
      $('.nav-tabs > .active').prev('li').find('a').trigger('click');      
    }
  }
}
savePayment(Flag){
  if(this.SelectedDSMIdArmA=='' || this.SelectedDSMIdArmA=='-1') {
    alert('Please select Arm "A" DSM.');
    return false;
  }
  if(this.SelectedDSMIdArmB=='' || this.SelectedDSMIdArmB=='-1') {
    alert('Please select Arm "B" DSM.');
    return false;
  }
  if(isNullOrUndefined(this.SelectedDSMIdArmA) || isNullOrUndefined(this.SelectedDSMIdArmB)) {
    alert('Both Arm,s DSM must be selected.!');
    return false;
  }
  if(this.SelectedDSMIdArmA==this.SelectedDSMIdArmB && (this.SelectedDSMIdArmA != "NA" || this.SelectedDSMIdArmB != "NA")) {
    alert('Both Arm,s DSM must be different.!');
    return false;    
  }
  if(this.ValidateDSM==false && (this.SelectedDSMIdArmA != "NA" || this.SelectedDSMIdArmB != "NA")) {
    alert('One of DSM is already exist for this shift!');
    return false;   
  }
  if(this.selectedShiftId=='' || this.selectedShiftId=='-1') {
    alert('Please select shift.');
    return false;
  }
  if(this.ValidationFlag==1){
    if(parseFloat(this.TotalCurrentSalesA) >= parseFloat(this.TotalSalesA) && parseFloat(this.TotalCurrentSalesB) >= parseFloat(this.TotalSalesB)){
      if(parseFloat(this.TotalCurrentSalesA) <= (parseFloat(this.TotalSalesA)+parseFloat("10")) && parseFloat(this.TotalCurrentSalesB) <= (parseFloat(this.TotalSalesB)+parseFloat("10"))){
      this.saveData(Flag);
    }
    else{
      alert("Your total sale amount is not matched with current details");
    }
    }
    else{
      alert("Your total sale amount is not matched with current details");
    }
  }
  else{
    this.saveData(Flag);
  }
}
saveData(Flag){
  for(var i = 0; i < this.AddPaymentMode.length; i++)
  {
    if(parseFloat(this.AddPaymentMode[i].PaymentAmountA) < 0)
    {
      this.SaveEnable=false;
      alert("All payment amount must be positive");
      break;
    }
    else if(parseFloat(this.AddPaymentMode[i].PaymentAmountB) < 0)
    {
      this.SaveEnable=false;
      alert("All payment amount must be positive");
      break;
    }
  }
  if(this.SaveEnable)
    {
      this.objDbServ.ShowLoaders.emit(true);
      this.objDbServ.PaymentCollection({UserId: this.detailsStation.UserId,EntryDate: this.detailsStation.SummeryDate,DispenserId: this.selectedDispId, StationId: this.detailsStation.StationId,ShiftId:this.selectedShiftId,DispanserPayment:this.AddPaymentMode, DSMIdArmA:this.SelectedDSMIdArmA, DSMIdArmB:this.SelectedDSMIdArmB}).subscribe(
        (resp: Response) => {
          const data = JSON.parse(resp.json());
          if(data.Table[0].Meaasge.indexOf('transfer') > -1)
          {
            alert(data.Table[0].Meaasge);
            this.objRoute.navigate(['']);
          }
          else if(data.Table[0].Meaasge.indexOf('successfully') > -1)
          {
            if(Flag!='M')
            {
              if(this.DispencerCount>this.dispCounterIndex){
                this.dispCounterIndex++;
                const dispIdToGo = this.listDispensers[this.dispCounterIndex].DispenserId;
                this.onSelectDispenser(dispIdToGo);
                this.showPrevious = true;
              }
              else{
                this.objDbServ.ShiftDetails.emit({
                  ShiftId:this.selectedShiftId,
                  SubShiftId: this.selectedSubShiftId,
                  ActiveTab:"Other"
                });
                  $('.nav-tabs > .active').next('li').find('a').trigger('click');  
              }
            }
          }
          else{
            alert(data.Table[0].Meaasge);
          }
          this.objDbServ.ShowLoaders.emit(false);
        },
        (error) => {alert("Something went wrong.");
        this.objDbServ.ShowLoaders.emit(false);
      }
      )
    }
    else
    {
      alert("all payment value quantity be positive");
    }
}
onPayemntEntry(event,PaymentModeId,Valuefor){
  if(event.value!='')
  {
    var rx = /^\d+(?:\.\d{1,3})?$/ 
    if(rx.test(event.value)){
      this.oldvalue=event.value;
    }
    else{
      event.value=this.oldvalue;
    }
}
else{
    if(Valuefor=='A') {
      for(var i = 0; i < this.AddPaymentMode.length; i++) {
            if(PaymentModeId==this.AddPaymentMode[i].PaymentModeId)
            {
              this.AddPaymentMode[i].PaymentAmountA=0;
            }
          }
    }
    if(Valuefor=='B')
    {
      for (var i = 0; i < this.AddPaymentMode.length; i++) {
            if(PaymentModeId==this.AddPaymentMode[i].PaymentModeId)
            {
              this.AddPaymentMode[i].PaymentAmountB=0;
            }
          }
    }
}
  this.selectedPaymentModeId=PaymentModeId;
  this.selectedPaymentAmount=event.value == "" ? "0" : event.value;
    if(this.selectedPaymentAmount !='')
    {
      if(parseFloat(this.selectedPaymentAmount) >= 0)
      {
        const Value = this.AddPaymentMode.find(pm => pm.PaymentModeId === this.selectedPaymentModeId);
        if(Valuefor=='A')
        {
          Value.PaymentAmountA = this.selectedPaymentAmount;
          Value.PaymentQuantityA = (parseFloat(this.selectedPaymentAmount)/parseFloat(this.CurrentRate)).toFixed(2).toString();
          this.SaveEnable=true;
        }
        else if(Valuefor=='B')
        {
          Value.PaymentAmountB = this.selectedPaymentAmount;
          Value.PaymentQuantityB = (parseFloat(this.selectedPaymentAmount)/parseFloat(this.CurrentRate)).toFixed(2).toString();
          this.SaveEnable=true;
        }
        this.sumup();
      }
      else
      {
          alert("Amount must be positive");
          event.focus();
          this.SaveEnable=false;
      }
    }
  else
    {
        this.sumup();
        alert("Amount must be entered");
        event.focus();
        this.SaveEnable=false;
    }
}
sumup(){
  this.TotalCurrentSalesB='0'; this.TotalCurrentSalesA='0';
  this.TotalCurrentReadingsA='0'; this.TotalCurrentReadingsB='0';
  for (var i = 0; i < this.AddPaymentMode.length; i++) {
    this.TotalCurrentSalesB=(parseFloat(this.TotalCurrentSalesB)+ parseFloat(this.AddPaymentMode[i].PaymentAmountB)).toFixed(2).toString();
    this.TotalCurrentSalesA=(parseFloat(this.TotalCurrentSalesA)+parseFloat(this.AddPaymentMode[i].PaymentAmountA)).toFixed(2).toString();
    this.TotalCurrentReadingsA=(parseFloat(this.TotalCurrentReadingsA)+parseFloat(this.AddPaymentMode[i].PaymentQuantityA)).toFixed(2).toString();
    this.TotalCurrentReadingsB=(parseFloat(this.TotalCurrentReadingsB)+parseFloat(this.AddPaymentMode[i].PaymentQuantityB)).toFixed(2).toString();
    this.TotalCashSalesA=(parseFloat(this.TotalSalesA) - parseFloat(this.TotalCurrentSalesA)).toFixed(2).toString();
    this.TotalCashSalesB=(parseFloat(this.TotalSalesB) - parseFloat(this.TotalCurrentSalesB)).toFixed(2).toString();
  }
}
checkout(){
  this.oldvalue='';
}
FetchDSASubmittedData() {
  var StationCode = JSON.parse(sessionStorage.getItem("globalDetail"))[0].StationCode;
  this.objDbServ.FetchDSASubmittedData({StationId: this.selectedStation, CDate: this.detailsStation.SummeryDate, StationCode: StationCode}).subscribe(
    (resp: any) => {
      var arr:any=[];
      const data1 = JSON.parse(resp.json());
      if(data1 != '') {
        arr = data1.Table;
        this.popupDate = this.dp.transform(this.detailsStation.SummeryDate,'dd-MMM-yyyy');
        if (this.IsTimeOverlocal==true) {
          return;
        }
        if(arr.length == 0) {
          this.SubmittedBySOPFlag = false;
          this.objDbServ.lockUnlock.emit(false);
          this.objDbServ.lockUnlockDispenserEntry.next(false);
        }      
        else if (arr[0].IsSubmittedBySOP == 1) {
        }
        else {
          this.SubmittedBySOPFlag = false;
          this.objDbServ.lockUnlock.emit(false);
          this.objDbServ.lockUnlockDispenserEntry.next(false);
        }
     }
    },
    (error) =>{
      alert('Something went wrong.');
    }
  )
  {
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
}
requestOTP() {
  this.enterOtpfields = true;
  var StationCode = JSON.parse(sessionStorage.getItem("globalDetail"))[0].StationCode;
  this.objDbServ.AuthenticationMail({CDate: this.detailsStation.SummeryDate, StationCode: StationCode}).subscribe(
    (resp: any) => {
      var arr:any=[];
      const data1 = JSON.parse(resp.json());
      if(data1 != '') {
        arr = data1.Table;
        this.successMessage = true;
        this.validotp = arr[0].OTP;
     }
    },
    (error) =>{
      alert('Something went wrong.');
    }
  )
}
confirmOtp() {
  if(this.enteredotp == this.validotp) {
    var obj ={
      CDate: this.detailsStation.SummeryDate, 
      StationCode: JSON.parse(sessionStorage.getItem("globalDetail"))[0].StationCode,
      IsStationSubmitted: 0,
      LockUnlockStatus:1,
      ShiftId : this.LockUnlockShiftId,
      LockUnlockDate :  this.detailsStation.SummeryDate, 
    } 
    this.objDbServ.updateDSAFlag(obj).subscribe(
      (resp: any) => {
        var arr:any=[];
        const data1 = JSON.parse(resp.json());
        this.SubmittedBySOPFlag = false;
        this.objDbServ.lockUnlock.emit(false);
        this.objDbServ.lockUnlockDispenserEntry.next(false);
        $('.modal').modal('hide');
      },
      (error) =>{
        alert('Something went wrong.');
      }
    )
  }
  else {
    alert('Please enter Valid OTP');
  }
}
requestPopup() {
  this.enteredotp = "";
  this.successMessage = false;
  this.enterOtpfields = false;
}
GetStationCompany() {
  this.objDbServ.GetStationCompany({ Flag: 'CompanyByStation', Id: this.selectedStation, Status: 1 }).subscribe(
    (resp: Response) => {
      this.CompanyName = JSON.parse(resp.json()).Table[0].CompanyName;
      this.CompanyId = JSON.parse(resp.json()).Table[0].CompanyId;
      this.checkCompany()
    },
    (error) => {
      alert("Something went wrong.");
      this.objDbServ.ShowLoaders.emit(false);
    }
  )
}
checkCompany(){
  if (this.CompanyName == 'DODO'){
      this.company = true;
    }
  else{
      this.company = false;
    }
 }
}
