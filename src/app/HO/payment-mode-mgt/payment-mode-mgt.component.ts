import { Component, OnInit } from '@angular/core';
import { dbService } from '../../Service/db.service';
import { CookieService } from 'ngx-cookie-service';
import { ngxCsv } from 'ngx-csv';
declare var $:any;
@Component({
  selector: 'app-payment-mode-mgt',
  templateUrl: './payment-mode-mgt.component.html',
  styleUrls: ['./payment-mode-mgt.component.css']
})
export class PaymentModeMgtComponent implements OnInit {
  flag:string = '';
  listPaymentmode:any =[];
  PaymentModeId:string='';
  PaymentMode:string='';
  PaymentModeCode:string='';
  PaymentModeType:string='';
  errorFound = true;
  title:string='';
  PaymentmodePopup: boolean = false;
  SelectedStationCode:string='';
  Status:boolean;
  key: string = 'Name';
  reverse: boolean = true;
  StatusIsfalse:boolean=false;
  ActiveStatus:string = '';
  filter:string='';
  uId:string="";
  sortingColumn:string="";
  exportList: any=[];
  constructor(private objDbServ: dbService, private objCook: CookieService) {
    this.objDbServ.HeaderDisplay.emit(true);
    this.objDbServ.LeftMenu.emit(true);
   }
  ngOnInit() {
    setTimeout(() => {
      this.getPaymentMode();
    });
    $("#ab").click(function(){
      $("#tgt_div").animate({left: "0px"});
    });
    $("#PMCheck").click(function(){
      $("#tgt_div").animate({left:"55px"});
    });
    $("#ef").click(function(){
      $("#tgt_div").animate({left: "110px"});
      });
  }
  getPaymentMode() {
      this.objDbServ.getPaymentMode({status:this.ActiveStatus}).subscribe(
      (resp: any) => {
        this.listPaymentmode=JSON.parse(resp.json()).Table
      },
      (error) => {
        alert("Something went wrong.");
       this.objDbServ.ShowLoaders.emit(false);
      }
    )
  }
  openPopupForUpdate(itm) {
    this.uId = itm.PaymentModeId;
    this.title = 'Update';
    this.PaymentmodePopup= true;
    this.flag = 'U';
    this.PaymentModeId = itm.PaymentModeId; 
    this.PaymentModeCode = itm.PaymentModeCode;
    this.PaymentModeType = itm.PaymentModeType;
    this.PaymentMode = itm.PaymentMode;  
    this.Status = (itm.status=='Active') ? true : false;
 }
openAddDisp() {
    this.title = 'Add';
    this.flag = 'I';
    this.PaymentmodePopup = true;
    this.PaymentModeId='';
    this.PaymentModeCode = '';
    this.PaymentMode = '';  
    this.PaymentModeType='';
    this.Status = true;
}
  save() {
    if (this.flag == 'I')
        this.InsertPaymentMode();
    else if (this.flag == 'U')
        this.UpdatePaymentMode();
  }
  InsertPaymentMode() {
    this.errorFound = true;
   if(this.ValidationLCV()) {
    const obj = {
      PaymentModeId:(this.flag == 'U') ? this.PaymentModeId : '0',
      PaymentModeCode:this.PaymentModeCode,
      PaymentModeType:this.PaymentModeType,
      PaymentMode:this.PaymentMode,  
      status: (this.Status==true) ? '1' : '0'
     };
     this.objDbServ.ShowLoaders.emit(true);
     this.objDbServ.InsertUpdatePaymentMode(obj).subscribe(
       (resp: any) =>{
         const data = JSON.parse(resp.json());
         if(data.Table[0].Msg.indexOf('Successfully') > -1)
         {
           this.PaymentmodePopup = false;
           this.getPaymentMode();
           this.PaymentModeId='';
           this.PaymentModeCode='';
           this.PaymentModeType='';
           this.PaymentMode='';
           this.Status=true;
           $('.modal').modal('hide');
           $("#PMCheck").prop("checked", true);
           this.ActiveStatus = '';
           $("#tgt_div").animate({left:"55px"});
           this.getPaymentMode();
         }
         alert(data.Table[0].Msg);
         this.objDbServ.ShowLoaders.emit(false);
     },
       (error) =>{
         alert('Something went wrong.');
         this.objDbServ.ShowLoaders.emit(false);
       }
     )
  }
  }
  UpdatePaymentMode() {
    this.errorFound = true;
    if(this.ValidationLCV()) {
     const obj = {
        PaymentModeId:(this.flag == 'U') ? this.PaymentModeId : '0',
        PaymentModeCode:this.PaymentModeCode,
        PaymentModeType:this.PaymentModeType,
        PaymentMode:this.PaymentMode,  
        status: (this.Status==true) ? '1' : '0'
      };
      this.objDbServ.ShowLoaders.emit(true);
      this.objDbServ.InsertUpdatePaymentMode(obj).subscribe(
        (resp: any) =>{
          const data = JSON.parse(resp.json());
          if(data.Table[0].Msg.indexOf('Successfully') > -1)
          {
            this.PaymentmodePopup = false;
            this.getPaymentMode();
            this.PaymentModeId='';
            this.PaymentModeCode='';
            this.PaymentMode='';
            this.SelectedStationCode='';
            this.Status=true;
            $('.modal').modal('hide');
            $("#PMCheck").prop("checked", true);
            this.ActiveStatus = '';
            $("#tgt_div").animate({left:"55px"});
            this.getPaymentMode();
          }
          alert(data.Table[0].Msg);
          this.objDbServ.ShowLoaders.emit(false);
      },
        (error) =>{
          alert('Something went wrong.');
          this.objDbServ.ShowLoaders.emit(false);
        }
      )
   }
  }
  ValidationLCV(){
    if(this.PaymentMode == ''){
      alert('Please enter the Payment Mode.');
      this.errorFound = false;
     }
    else if(this.PaymentModeCode == ''){
      alert('Please enter the Payment Mode Code.');
      this.errorFound = false;
     }
    else if(this.PaymentModeType == ''){
      alert('Please enter the Payment Mode Type.');
      this.errorFound = false;
    }
    return this.errorFound;
  }
  OnChangeStatus(evt, flag:string) {
    this.StatusIsfalse = evt.target.checked;
    if(flag=='swthActive') {
      this.ActiveStatus = '1';
    }
    else if(flag=='swthAll') {
      this.ActiveStatus = '';
    }
    else if(flag=='swthInActive') {
      this.ActiveStatus = '0';
    }
    this.getPaymentMode();
  }
  DeletePaymentMode(id) {
    if(confirm("Are you sure want to delete this payment mode ? ")){
      this.objDbServ.DeletePaymentMode({PaymentModeId:id}).subscribe(
      (resp: any) => {
        const data=JSON.parse(resp.json()).Table[0]
        alert(data.Msg);
        this.getPaymentMode();
      },
      (error) => {
        alert("Something went wrong.");
       this.objDbServ.ShowLoaders.emit(false);
      }
    )
    }
  }
  sortCol(key:string){
    this.sortingColumn = key;
    this.key = key;
    this.reverse = !this.reverse;
  }
   exportFile() {
    this.exportList = [];
    if(this.listPaymentmode.length > 0)
    {
      this.listPaymentmode.forEach((element,i)=>{
        this.exportList.push({'SrNo':i+1,'PaymentMode':element.PaymentMode == null ? '' : element.PaymentMode,'PaymentModeCode':element.PaymentModeCode == null ? '' : element.PaymentModeCode,'PaymentModeType':element.PaymentModeType == null ? '' : element.PaymentModeType,'Status':element.status == null ? '' : element.status})
      })
      var head = ['Sr. No.', 'Payment Mode', 'PaymentMode Code', 'PaymentMode Type','Status'];  
      var filename = 'PaymentMode';
      new ngxCsv(this.exportList, filename, {headers: (head)});
    }
    else{
      alert('No Data available to export.!');
    }
 }
}
