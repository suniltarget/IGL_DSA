import { Component, OnInit } from '@angular/core';
import { dbService } from '../../Service/db.service';
import { Response } from '@angular/http';
import { CookieService } from 'ngx-cookie-service';
import { ngxCsv } from 'ngx-csv';
import { DatepickerOptions } from 'ng2-datepicker';
import * as enLocale from 'date-fns/locale/en';
declare var $:any;
@Component({
  selector: 'app-dpr-package',
  templateUrl: './dpr-package.component.html',
  styleUrls: ['./dpr-package.component.css']
})
export class DPRPackageComponent implements OnInit {
  date:Date;
  listPackages:any=[];
  listStation:any[];
  StationId:string='';
  PackageId:string='';
  PackageCode:string='';
  PackageName:string='';
  PackageMaker:string='';
  PackageMover:string='';
  PackageCapacity:string='';
  DesignSuctionPressure:number=0;
  PKDescription:string='';
  EffectiveDate:string;
  errorFound = true;
  title:string='';
  PackagePopup:boolean = false;
  flag:string = '';
  SelectedStationCode:string='';
  IsDateVisible: boolean = false;
  SelectedPrimeMoverValue:string='';
  SPrimeMover:string='';
  Status:boolean;
  StatusIsfalse:boolean=false;
  ActiveStatus:string='';
  filter:string='';
  key: string = 'Name';
  reverse: boolean = true;
   fiterBox:boolean = false;
   filterBoxFlag:number = 0;
   stCodeMy:"";
   CDate:string;
   IsVentFlow:string="1";
   monthNames = [
     "Jan", "Feb", "Mar",
     "Apr", "May", "Jun", "Jul",
     "Aug", "Sep", "Oct",
     "Nov", "Dec"
   ];
  SelectedPrimeMover:string='';
  ownerShip:string='';
  PrimeMover = [
    { PMName: 'CAT 3306 NA', value: 'CNA36' },
    { PMName: 'CAT 3406 NA', value: ' CNA46' },
    { PMName: 'CAT 3408 NA', value: 'CNA48' },
    { PMName: 'CAT 3406 TA', value: 'CTA' },
    { PMName: 'CUMMINS G-855', value: 'G-855' },
    { PMName: 'CUMMINS GTA 855', value: 'GTA8' },
    { PMName: 'CUMMINS GTA855', value: 'GTA85' },
    { PMName: 'CUMMINS GTA855G', value: 'GTA5G' },
    { PMName: 'CUMMINS GTA855C', value: 'GTA5C' },
    { PMName: 'ELECTRIC MOTOR', value: 'M' },
    { PMName: 'WAUKESHA F11 GSI', value: 'WFG' },
  ];
  exportList:any=[];
  uId:string="";
  sortingColumn:string="";
  constructor(private objDbServ: dbService, private objCook: CookieService) {
    this.objDbServ.MasterCompDisplay.emit(true);
    this.objDbServ.HeaderDisplay.emit(true);
    this.objDbServ.LeftMenu.emit(true);
  }
  options: DatepickerOptions = {
    minYear: 2018,
    locale: enLocale,
    displayFormat: 'DD-MMM-YYYY'
  };
  ngOnInit() {
    const dt = new Date();
    this.CDate = dt.getDate() + "/" + this.monthNames[dt.getMonth()] + "/" + dt.getFullYear();
      setTimeout(() => {
        this.getPackages();
      });
      $(document).ready(function(){
        $("#ab").click(function(){
          $("#tgt_div").animate({left: "0px"});
        });
        $("#PackageCheck").click(function(){
          $("#tgt_div").animate({left:"55px"});
        });
        $("#ef").click(function(){
          $("#tgt_div").animate({left: "110px"});
        });
      });
  }
  OnDateChnage(val){
    const dt = new Date(val);
    this.EffectiveDate = dt.getDate() + "/" + this.monthNames[dt.getMonth()] + "/" + dt.getFullYear();   
  }
  filterBoxShow(itm) {
    if(this.filterBoxFlag == 0) {
      this.fiterBox = true;
      this.filterBoxFlag = 1;
    }   
    else {
      this.fiterBox = false;
      this.filterBoxFlag = 0;
      this.stCodeMy = itm.StationName;
      this.SelectedStationCode=itm.StationCode
    }
  }
  OnChangeStatus(evt, flag:string) {
    this.StatusIsfalse = evt.target.checked;
    if(flag=='swthActive') {
      this.ActiveStatus = '0';
    }
    else if(flag=='swthAll') {
      this.ActiveStatus = '';
    }
    else if(flag=='swthInActive') {
      this.ActiveStatus = '1';
    }
    this.getPackages();
  }
  getPackages() {
    this.objDbServ.getPackages({status:this.ActiveStatus}).subscribe(
      (resp: Response) => {
        this.listPackages=JSON.parse(resp.json()).Table;
        this.listStation = JSON.parse(resp.json()).Table1;
      },
      (error) => {alert("Something went wrong.");
      this.objDbServ.ShowLoaders.emit(false);
      }
    )
  }
 openPopupForUpdate(itm, Popup:string) {
    this.uId = itm.PackageId;
    this.title = 'Update';
    this.PackagePopup= true;
    this.flag = 'U';
    this.StationId=itm.StationId; 
    this.stCodeMy=itm.StationName; 
    this.PackageId = itm.PackageId;
    this.PackageCode = itm.PackageCode;
    this.PackageName = itm.PackageName;    
    this.PackageMaker=itm.PackageMake;
    this.PackageCapacity=itm.PackageCapacity;
    this.DesignSuctionPressure = itm.DesignSuctionPressure;
    this.PKDescription =itm.Description;
    this.SelectedStationCode= itm.StationCode;
    this.SelectedPrimeMover = itm.PrimeMover;
    this.Status = (itm.status=='Active') ? true : false;
    this.IsVentFlow = (itm.IsVentFlow=='Yes') ?  "1" : "0";
    this.date = itm.EffectiveDate;
    this.ownerShip=itm.PkgOwnership;
    this.IsDateVisible  = true;
  }
 openAddDisp() {
  this.title = 'Add';
  this.PackagePopup = true;
  this.flag = 'I';
  this.stCodeMy='';
  this.PackageCode = '';
  this.PackageName = ''; 
  this.PackageMaker='';
  this.PackageCapacity='';
  this.DesignSuctionPressure=0;
  this.date=new Date();
  this.EffectiveDate=new Date().toLocaleDateString();
  this.PKDescription='';
  this.SelectedStationCode =  '';
  this.SelectedPrimeMover = '';
  this.ownerShip='';
  this.Status = true;
  this.IsVentFlow="1";
  this.IsDateVisible  = false;
 }
save() {
  if (this.flag == 'I')
      this.InsertPackages();
  else if (this.flag == 'U')
      this.UpdatePackages();
}
InsertPackages(){
  this.errorFound = true;
  if(this.ValidationCRoom()) {
    const obj = {
      PackageId:(this.flag == 'U') ? this.PackageId : '0',
      StationCode:this.SelectedStationCode,
      PackageCode:this.PackageCode,
      PackageName:this.PackageName.toUpperCase(),
      PackageMake:this.PackageMaker,
      PackageCapacity:this.PackageCapacity,
      DesignSuctionPressure:this.DesignSuctionPressure,
      PrimeMover : this.SelectedPrimeMover,
      Ownershipvalue : this.ownerShip,
      Description : this.PKDescription,
      LoginId:this.objCook.get('UID'),
      status:(this.Status==true) ? '0' : '1',
      IsVentFlow : this.IsVentFlow,
      EffectiveDate : ((this.EffectiveDate == null) ? new Date().toLocaleDateString() : this.EffectiveDate)
     };
     this.objDbServ.ShowLoaders.emit(true);
     this.objDbServ.InsertPackages(obj).subscribe(
       (resp: Response) =>{
         const data = JSON.parse(resp.json());
         if(data.Status.indexOf('successfully') > -1)
         {
           this.PackagePopup = false;
           this.PackageId='';
           this.getPackages();
           this.PackageCode='';
           this.PackageName='';
           this.PackageMaker='';
           this.PackageCapacity='';
           this.DesignSuctionPressure=0;
           this.PKDescription='';
           this.SelectedStationCode='';
           this.SelectedPrimeMover='';
           this.ownerShip='';
           this.stCodeMy='';
           $('.modal').modal('hide');
           $("#PackageCheck").prop("checked", true);
           this.ActiveStatus = '';
           $("#tgt_div").animate({left:"55px"});
           this.getPackages();
         }
         alert(data.Status);
         this.objDbServ.ShowLoaders.emit(false);
     },
       (error) =>{
         alert('Something went wrong.');
         this.objDbServ.ShowLoaders.emit(false);
       }
     )
  }
}
UpdatePackages(){
  this.errorFound = true;
  if(this.ValidationCRoom()) {
    const obj = {
      PackageId:(this.flag == 'U') ? this.PackageId : '0',
      StationCode:this.SelectedStationCode,      
      PackageName:this.PackageName.toUpperCase(), 
      PackageCode:this.PackageCode,
      PackageMake: this.PackageMaker,
      PackageCapacity: this.PackageCapacity,
      DesignSuctionPressure: this.DesignSuctionPressure,
      PrimeMover: this.SelectedPrimeMover,
      Ownershipvalue : this.ownerShip,
      Description : this.PKDescription,
      LoginId:this.objCook.get('UID'),
      status:(this.Status==true) ? '0' : '1',
      IsVentFlow : this.IsVentFlow,
      EffectiveDate : ((this.date == null) ? new Date().toLocaleDateString() : this.date),      
     };
     this.objDbServ.ShowLoaders.emit(true);
     this.objDbServ.UpdatePackages(obj).subscribe(
       (resp: Response) =>{
         const data = JSON.parse(resp.json());
         if(data.Status.indexOf('Successfully') > -1)
         {
           this.PackagePopup = false;
           this.PackageId='';
           this.getPackages();
           this.PackageCode='';
           this.PackageName='';
           this.PackageMaker='';
           this.PackageCapacity='';
           this.DesignSuctionPressure = 0;
           this.PKDescription='';
           this.SelectedStationCode='';
           this.SelectedPrimeMover='';
           this.ownerShip='';
           this.stCodeMy='';
           $('.modal').modal('hide');
           $("#PackageCheck").prop("checked", true);
           this.ActiveStatus = '';
           $("#tgt_div").animate({left:"55px"});
           this.getPackages();
         }
         alert(data.Status);
         this.objDbServ.ShowLoaders.emit(false);
     },
       (error) =>{
         alert('Something went wrong.');
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
ValidationCRoom(){
  var re = new RegExp(/^[a-zA-Z ]*$/);
  var regexNumeric = /^[+-]?[0-9]{1,1000}(?:\.[0-9]{1,1000})?$/;
  var regexDecimalThree = /^[+-]?[0-9]{1,10}(?:\.[0-9]{1,3})?$/;
  var regIntegers= /^[1-9]\d*$/;
  var regIntegerss= /^[0-9]\d*$/;
  if(this.stCodeMy == ''){
    alert('Station Name must be selected.');
    this.errorFound = false;
    }
  else if(this.PackageCode == ''){
    alert('Package code must be entered.');
    this.errorFound = false;
    }
  else if (this.PackageName == '') {
    alert('Please enter Package Name.');
    this.errorFound = false;
    } 
  else if (this.PackageMaker=='') {
    alert('Please enter Package Maker.');
    this.errorFound = false;
    }
  else if(this.PackageCapacity == ''){
    alert('Please enter the Package Capacity.');
    this.errorFound = false;
  }
  else if (parseFloat(this.PackageCapacity) < 0) {
    alert('Package Capacity must be Positive.');
    this.errorFound = false;
  }
  else if (regexNumeric.test(this.PackageCapacity) == false) {
    alert('Only numeric value allowed for reading.');
    this.errorFound = false;
  }  
   
  else if (this.SelectedPrimeMover == '' || this.SelectedPrimeMover == '--Select--') {
    alert('Please select the Prime Mover.');
    this.errorFound = false;
  }
  else if (this.ownerShip == '' || this.ownerShip == '--Select--') {
    alert('Please select the Ownership.');
    this.errorFound = false;
  }
return this.errorFound;
}
exportFile() {
  this.exportList = [];
  if(this.listPackages.length > 0)
  {
    this.listPackages.forEach((element,i)=>{
    this.exportList.push({'SrNo':i+1,'PackageName':element.PackageName,'PackageCode':element.PackageCode,'StationName':element.StationName,'StationCode':element.StationCode,'PackageMake':element.PackageMake,'PackageCapacity':element.PackageCapacity,'PrimeMover':element.PrimeMover, 'VentFlow':element.IsVentFlow, 'Status':element.status })
    })
    var head = ['Sr. No.', 'Package Name', 'Package Code','Station Name','Station Code','Package Maker','Package Capacity','Prime Mover', 'Vent Flow','Status'];  
    var filename = 'Package_'+this.CDate;
    new ngxCsv(this.exportList, filename, {headers: (head)});
  }
  else{
    alert('No Data available to export.!');
  }
}
prime(val){
this.SelectedPrimeMover=val.target.value;
}
}
