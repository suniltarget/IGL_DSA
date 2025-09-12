import { Component, OnInit } from '@angular/core';
import { Http, Response} from '@angular/http';
import { dbService } from '../../Service/db.service';
import { CookieService } from 'ngx-cookie-service';
import { DecimalPipe } from '@angular/common';
import { Router } from '@angular/router';
declare var $:any;
@Component({
  selector: 'app-other-sales',
  templateUrl: './other-sales.component.html',
  styleUrls: ['./other-sales.component.css']
})
export class OtherSalesComponent implements OnInit {
  detailsStation:{StationId:string,SummeryDate:string,UserId:string}
  StationShift:{ShiftId:string,SubShiftId:string,ActiveTab:string}
  SaveEnable:boolean=true;
  selectedShiftId:string='-1';
  selectedSubShiftId:string='';
  selectedDispenserId:string;
  selectedStationId:string;
  selectedPaymentModeId:string;
  selectedPaymentMode:string;
  selectedPaymentAmount:string;
  UserIdCook:string = '';
  listDispensers:{}[];
  cmbShiftData:{}[];
  AddPaymentMode:{PaymentModeId,PaymentMode,PaymentAmount}[];
  CreditPartySale='0.00';
  CreditCardSale='0.00';
  PrepaidCardSale='0.00';
  PaytmSale='0.00';
  PrepaidCardLoading='0.00';
  PrepaidCardActivations='0.00';
  OtherSale='0.00';
  CashSale='0.00';
  LubeSale='0.00';
  TotalReadings='0.0000';
  TotalSales='0.00';
  CurrentRate='0.00';
  showNext:boolean = true;
  showPrevious:boolean = true;   
  oldvalue:string='';
  submittedflag:boolean = false;
  CompanyClusterList = [];
  selectedItems = [];
  dropdownSettings = {};
  NoOfClusterBus:string="";
  SaleQty:string="";
  uploadedfilereset:File;
  ModalName:string = '';
  DocumentImagePath:string = '';
  DocResetPopup:boolean=false;
  submitButton:boolean = true;
  DepartmentCode :string= this.objCook.get('DepartmentCode');
  constructor(private objDbServ: dbService, private objCook: CookieService, private objRoute: Router) { 
    this.objDbServ.MasterCompDisplay.emit(true);
    this.objDbServ.ShiftDetails.subscribe(
      (test1: {ShiftId:string,SubShiftId:string,ActiveTab:string}) => 
      {
        this.StationShift =test1;
        this.selectedShiftId=this.StationShift.ShiftId;
        this.selectedSubShiftId=this.StationShift.SubShiftId;
        this.GetCompanyClusterList();
        if(this.StationShift.ActiveTab=='Other'){
          setTimeout(() => {this.GetDataByShift();});
        }
        this.SetDropDownSetting();
        this.FetchDSASubmittedData();
      }
    );
    this.objDbServ.StationDetails.subscribe(
      (test: {StationId:string,SummeryDate:string,UserId:string}) => 
      {
        this.detailsStation =test;
      }
    );
    this.objDbServ.lockUnlock.subscribe(value => {
      this.submittedflag = value;
    })
  }
  ngOnInit() {
    this.showNext = true;
    this.showPrevious = true;
    this.resizeHight();
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
   fileuploadreset(file: FileList, event: any) {
    this.uploadedfilereset = file.item(0);
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
  SetDropDownSetting(){
    this.dropdownSettings  = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
  }
  onItemSelect(item: any) {
  }
  onItemDeSelect(item: any) {
  }
  onSelectAll(items: any) {
  }
  onDeSelectAll() {
  }
  onClickNext(){
    this.savePayment();
  }
  onClickPrevious(){
    this.objDbServ.ShiftDetails.emit({
      ShiftId:this.selectedShiftId,
      SubShiftId: this.selectedSubShiftId,
      ActiveTab:"Payment"
    });
    $('.nav-tabs > .active').prev('li').find('a').trigger('click');   
  }
  resizeHight(){
    function setHeight() {
      var windowHeight = $(window).innerHeight();
      $('.othersaletab').css('height', windowHeight - 150);
      };
      setHeight();
      $(window).resize(function () {
          setHeight();
      });
  }
  onSelectShift(shiftId:string){
    this.selectedShiftId = shiftId;
      setTimeout(() => {
        this.GetDataByShift();});
  }
  GetDataByShift(){
    this.objDbServ.ShowLoaders.emit(true);
    this.objDbServ.GetOtherPaymentByShift({StationId:this.detailsStation.StationId,EntryDate:this.detailsStation.SummeryDate,ShiftId: this.selectedShiftId,UserId:this.detailsStation.UserId}).subscribe(
    (resp: Response) => {
      this.AddPaymentMode=JSON.parse(resp.json()).Table;
      this.cmbShiftData = JSON.parse(resp.json()).Table1;
      this.selectedShiftId= JSON.parse(resp.json()).Table2[0].ShiftId;
      if((JSON.parse(resp.json()).Table3).length != 0)
      {
        this.NoOfClusterBus = JSON.parse(resp.json()).Table3[0].NoOfClusterBus;
        this.SaleQty = JSON.parse(resp.json()).Table3[0].SaleQty;
        this.DocumentImagePath = this.objDbServ.apiImageAttachment+"/Attachments/"+JSON.parse(resp.json()).Table3[0].ImagePath;
      }
      else
      {
        this.NoOfClusterBus = '';
        this.SaleQty = '';
        this.DocumentImagePath = this.objDbServ.apiImageAttachment+"/Attachments/";
      }
      this.selectedItems = JSON.parse(resp.json()).Table4;
      this.objDbServ.ShowLoaders.emit(false);
    },
    (error) => {alert("Something went wrong.");
    this.objDbServ.ShowLoaders.emit(false);}
  )
}
 checkout(){
  this.oldvalue='';
}
  onPayemntEntry(event,PaymentModeId){
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
    this.selectedPaymentModeId=PaymentModeId;
    this.selectedPaymentAmount=event.value == "" ? "0" : event.value;
      if(this.selectedPaymentAmount !='')
      {
        if(parseFloat(this.selectedPaymentAmount) >= 0)
        {
          const Value = this.AddPaymentMode.find(pm => pm.PaymentModeId === this.selectedPaymentModeId);
          Value.PaymentAmount = this.selectedPaymentAmount;
          this.SaveEnable=true;
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
          alert("Amount must be entred");
          event.focus();
          this.SaveEnable=false;
      }
  }
  savePayment(){
    var ErrorMsg = this.changeresetValidation();
    if(this.selectedShiftId=='' || this.selectedShiftId=='-1') {
      alert('Please select shift.')
    }
    else if(ErrorMsg != '' && ErrorMsg != undefined) {
      alert(ErrorMsg);
    }
    else {
      if(this.SaveEnable)
      {
        for(var i = 0; i < this.AddPaymentMode.length; i++)
        {
          if( parseFloat(this.AddPaymentMode[i].PaymentAmount) < 0)
          {
            this.SaveEnable=false;
            alert("all payment amount must be positive");
            break;
          }
        }
      }
      else
      {
        alert("all payment value must be positive");
      }
      var MyJsonreset = {
        StationId: this.detailsStation.StationId,
        EntryDate: this.detailsStation.SummeryDate,
        UserId: this.detailsStation.UserId,
        ShiftId:this.selectedShiftId,
        DispanserPayment:this.AddPaymentMode,
        ClusterCompanyList:this.selectedItems,
        FilePath: localStorage.getItem('LoginId') + "/VoucherImage/",
        NoOfClusterBus:this.NoOfClusterBus,
        SaleQty:this.SaleQty == "" ? "0" : this.SaleQty
     };
      var frmData = new FormData();
      frmData.append("jsonDetail", JSON.stringify(MyJsonreset));
      if(this.uploadedfilereset != undefined) {
        frmData.append('OtherSaleFile', this.uploadedfilereset, this.uploadedfilereset.name);
       }  
      if(this.SaveEnable)
      {
        this.objDbServ.ShowLoaders.emit(true);
          this.objDbServ.OtherPaymentCollection(frmData).subscribe(
          (resp: Response) => {
            const data = JSON.parse(resp.json());
            if(data.Table[0].Meaasge.indexOf('transfer') > -1)
            {
              alert(data.Table[0].Meaasge);
              this.objRoute.navigate(['']);
            }
            else if(data.Table[0].Meaasge.indexOf('successfully') > -1)
            {
              if(this.selectedShiftId !='4')
              {
                 this.objDbServ.ShiftDetails.emit({
                  ShiftId:Number(this.selectedShiftId)+1,
                  SubShiftId: Number(this.selectedSubShiftId)+1,
                  ActiveTab:"Dispenser"
                });
                $('.nav-tabs >').first('li').find('a').trigger('click');
              }
              else
              {
                  this.objDbServ.ShiftDetails.emit({
                  ShiftId:this.selectedShiftId,
                  SubShiftId: this.selectedSubShiftId,
                  ActiveTab:"Bank"
                });
                  $('.nav-tabs > .active').next('li').find('a').trigger('click'); 
              }
              this.GetDataByShift();
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
    }
  }
  unlockpayment(){
    alert("Please unlock this from payment collection tab");
  }
  ViewVoucherImage(){
    if(this.DocumentImagePath.split('.').pop() == "pdf") {
      this.ModalName = "#none";
      window.open(this.DocumentImagePath, '_blank');
    }
    else {
      this.ModalName = "#myModalImage";
    }
  }
   changeresetValidation() {
    var regexNumeric = /^[+-]?[0-9]{1,1000}(?:\.[0-9]{1,1000})?$/;
    var regexDecimalThree = /^[+-]?[0-9]{1,10}(?:\.[0-9]{1,3})?$/;
    var regexDecimalThreeNegative = /^[+]?[0-9]{1,10}(?:\.[0-9]{1,3})?$/;
    var imgShow = 'assets/images/attachment.gif';
    var errorMsg = '' ;
    return errorMsg;
  }
}
