import { Component, OnInit } from '@angular/core';
import { dbService } from '../../Service/db.service';
import { Response } from '@angular/http';
import { FilterSearchPipe } from '../../Filters/filter-search.pipe';
import { CookieService } from 'ngx-cookie-service';
import { ngxCsv } from 'ngx-csv/ngx-csv';
import { getDate } from 'date-fns';
declare var $:any;
@Component({
  selector: 'app-ecdmaster',
  templateUrl: './ecdmaster.component.html',
  styleUrls: ['./ecdmaster.component.css']
})
export class ECDMasterComponent implements OnInit {
  listECD:any = [];
  ECDPopup:boolean = false;
  searchText:string = '';
  MinDate:string = '';
  SelectedECDId:string='';
  ECDId:string='';
  ECDDevice:string='';
  DeviceBrand:string='';
  UserId:string='';
  errorFound: boolean;
  actionFlag: string;
  title: string;
  key: string = 'ECDDevice';
  DS:boolean=true;
  reverse: boolean = true;
  StatusIsfalse:boolean=false;
  Status1:string ='';
  exportList:any=[];
  uniquePopupId:any = '';
  sortingColumn:string="";
  CurrentDate:string="";
  StationList:any=[];
  StationName:string="";
  StationCode:string="";
  fiterBox:boolean = false;
  filterBoxFlag:number = 0;
  filter:string="";
 constructor(private objDbServ: dbService, private objCook: CookieService) { 
   this.objDbServ.MasterCompDisplay.emit(true);
   this.objDbServ.HeaderDisplay.emit(true);
   this.objDbServ.LeftMenu.emit(true);
 }
ngOnInit() {
    const dt = new Date();
    this.CurrentDate = dt.getDate() + "/" + this.monthNames[dt.getMonth()] + "/" + dt.getFullYear();
  	setTimeout(() => {this.ECDData();});    
	$(document).ready(function(){
		$("#ab").click(function(){
			$("#tgt_div").animate({left: "0px"});
		});
		$("#regionCheck").click(function(){
			$("#tgt_div").animate({left:"55px"});
		});
		$("#ef").click(function(){
			$("#tgt_div").animate({left: "110px"});
    	});
	});
  this.GetStation();
}
 OnChangeStatus(evt, flag:string) {
  this.StatusIsfalse = evt.target.checked;
  if(flag=='swthActive') {
    this.Status1 = '1';
  }
  else if(flag=='swthAll') {
    this.Status1 = '';
  }
  else if(flag=='swthInActive') {
    this.Status1 = '2';
  } 
  this.ECDData();
}
 ECDData(){
    this.objDbServ.GetECDMaster({Flag: 'ECD',Id: 0, Status:this.Status1}).subscribe(
      (resp: Response) => {
        this.listECD=JSON.parse(resp.json()).Table
      },
      (error) => {alert("Something went wrong.");
      this.objDbServ.ShowLoaders.emit(false);
      }
    )
  }
 addECD(){
   this.title = 'Add ECD';
   this.actionFlag = 'Add';
   this.ECDPopup = true;
   this.SelectedECDId = '0';
   this.ECDDevice =  '';
   this.DeviceBrand =  '';
   this.DS = true;
   this.StationName='';
   this.GetECDById('0');
 }
 GetECDById(ECDId:string){
   this.objDbServ.ShowLoaders.emit(true);
   this.objDbServ.GetECDMaster({Flag: 'GetECDById', Id: ECDId}).subscribe(
     (resp: Response) => {
       if(JSON.parse(resp.json()).Table.length > 0){
         const retData = JSON.parse(resp.json()).Table[0];
         this.ECDId = retData.ID;
         this.SelectedECDId= retData.ID;
         this.ECDDevice = retData.ECDDevice;
         this.DeviceBrand = retData.DeviceBrand;
         this.StationName= retData.StationCode;
         this.DS = (retData.DS == '2')? false: true;
       }
       this.objDbServ.ShowLoaders.emit(false);
     },
     (error) =>{
       alert('Something went wrong.');
       this.objDbServ.ShowLoaders.emit(false);
   }
   )
 }
 openPopupForUpdate(Id:string, Popup:string){
	 this.uniquePopupId = Id;
   if(Popup=='0'){
     alert('You cannot modify this rate.');
   }
   else 
   {
     this.title = 'Update ECD';
     this.actionFlag = 'Update';
     this.ECDPopup = true;
     this.ECDId = '';
     this.ECDDevice =  '';
     this.DeviceBrand = '';
     this.StationName='';
     this.GetECDById(Id);
   }
 }
 saveECD(){  
   this.errorFound = true;
   if(this.ValidationRate()){
     const obj = {
      Id:(this.actionFlag == 'Update') ? this.SelectedECDId : '0',
      ECDDeviceName:this.ECDDevice,
      BrandName:this.DeviceBrand,
      Status: ((this.DS == true) ?'1':'2'),
      UserId:this.objCook.get('UID'),
      Flag:'Add',
      Date:this.CurrentDate,
      StationCode:this.StationCode,
      StationName:this.StationName
     };
     this.objDbServ.ShowLoaders.emit(true);
     this.objDbServ.GetECDMaster(obj).subscribe(
       (resp: Response) =>{
         const data = JSON.parse(resp.json());
         this.GetECDById('0');
         if(data.Table[0].Meaasge.indexOf('Successfully') > -1)
         {
           this.ECDPopup = false;
           this.ECDData();
           this.DS = true;
           this.ECDDevice='';
           this.DeviceBrand='';
           this.SelectedECDId='';
           this.StationName='';
           $("#regionCheck").prop("checked", true);
           this.Status1 = '';
           $("#tgt_div").animate({left:"55px"});
           this.ECDData();
         }
         alert(data.Table[0].Meaasge);
         this.objDbServ.ShowLoaders.emit(false);
     },
       (error) =>{alert('Something went wrong.');
         this.objDbServ.ShowLoaders.emit(false);
       }
     )
   }
 }
 ValidationRate(){
   if(this.ECDDevice == ''){
     alert('ECDDevice must be entered.');
     this.errorFound = false;
   }
   else if(this.DeviceBrand == ''){
    alert('BrandName must be entered.');
    this.errorFound = false;
  }
  else if(this.StationName == undefined || this.StationName == ''){
    alert('StationName must be entered.');
    this.errorFound = false;
  }
   return this.errorFound;
 }
 sortCol(key:string){
   this.sortingColumn = key;
   this.key = key;
   this.reverse = !this.reverse;
 }
 monthNames = [
  "Jan", "Feb", "Mar",
  "Apr", "May", "Jun", "Jul",
  "Aug", "Sep", "Oct",
  "Nov", "Dec"
];
 exportFile() {
    this.exportList = [];
  if(this.listECD.length > 0)
  {
    this.listECD.forEach((element,i)=>{
      this.exportList.push({'SrNo':i+1,'ECDDeviceName':element.ECDDevice,'DeviceBrand':element.DeviceBrand,'Status':element.Status})
    })
    var head = ['Sr. No.', 'ECD Name','Device Brand', 'Status'];
    var filename = 'ECD_Management_'+ this.CurrentDate;
    new ngxCsv(this.exportList, filename, {headers: (head)});
  }
  else{
    alert('No Data available to export.!');
  }
}
GetStation() {
  this.objDbServ.getPermision({Flag: 'PermisionType'}).subscribe(
    (resp: Response) => {
      this.StationList= JSON.parse(resp.json()).Table1
    },
    (error) => {alert("Something went wrong.");
      this.objDbServ.ShowLoaders.emit(false);
    }
  )
}
filterBoxShow(itm) {
  if(this.filterBoxFlag == 0) {
    this.fiterBox = true;
    this.filterBoxFlag = 1;
  }   
  else {
    this.fiterBox = false;
    this.filterBoxFlag = 0;
    this.StationName = itm.StationName;
    this.StationCode= itm.StationCode;
  }
}
}