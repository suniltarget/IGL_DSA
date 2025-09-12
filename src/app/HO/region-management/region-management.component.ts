import { Component, OnInit } from '@angular/core';
import { dbService } from '../../Service/db.service';
import { Response } from '@angular/http';
import { FilterSearchPipe } from '../../Filters/filter-search.pipe';
import { CookieService } from 'ngx-cookie-service';
import { ngxCsv } from 'ngx-csv/ngx-csv';
import { getDate } from 'date-fns';
declare var $:any;
@Component({
  selector: 'app-region-management',
  templateUrl: './region-management.component.html',
  styleUrls: ['./region-management.component.css']
})
export class RegionManagementComponent implements OnInit {
  listRegion:any = [];
  RegionPopup:boolean = false;
  searchText:string = '';
  MinDate:string = '';
  SelectedRegionId:string='';
  RegionId:string='';
  RegionName:string='';
  UserId:string='';
  errorFound: boolean;
  actionFlag: string;
  title: string;
  key: string = 'RegionName';
  DS:boolean=true;
  reverse: boolean = true;
  StatusIsfalse:boolean=false;
  Status:string ='';
  exportList:any=[];
  uniquePopupId:any = '';
  sortingColumn:string="";
  CurrentDate:string="";
 constructor(private objDbServ: dbService, private objCook: CookieService) { 
   this.objDbServ.MasterCompDisplay.emit(true);
   this.objDbServ.HeaderDisplay.emit(true);
   this.objDbServ.LeftMenu.emit(true);
 }
ngOnInit() {
    const dt = new Date();
    this.CurrentDate = dt.getDate() + "/" + this.monthNames[dt.getMonth()] + "/" + dt.getFullYear();
  	setTimeout(() => {this.RegionData();});    
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
}
 OnChangeStatus(evt, flag:string) {
  this.StatusIsfalse = evt.target.checked;
  if(flag=='swthActive') {
    this.Status = '1';
  }
  else if(flag=='swthAll') {
    this.Status = '';
  }
  else if(flag=='swthInActive') {
    this.Status = '2';
  } 
  this.RegionData();
}
 RegionData(){
   this.objDbServ.CommonGetData({Flag: 'Region', Id: 0, Status:this.Status}).subscribe(
     (resp: Response) => {
       this.listRegion=JSON.parse(resp.json()).Table
     },
     (error) => {alert("Something went wrong.");
     this.objDbServ.ShowLoaders.emit(false);
     }
   )
  }
 addRegion(){
   this.title = 'Add Region';
   this.actionFlag = 'Add';
   this.RegionPopup = true;
   this.SelectedRegionId = '0';
   this.RegionName =  '';
   this.DS = true;
   this.GetRegionById('0');
 }
 GetRegionById(RegionId:string){
   this.objDbServ.ShowLoaders.emit(true);
   this.objDbServ.getRateMaster({Flag: 'RegionById', Id: RegionId}).subscribe(
     (resp: Response) => {
       if(JSON.parse(resp.json()).Table.length > 0){
         const retData = JSON.parse(resp.json()).Table[0];
         this.RegionId = retData.RegionId;
         this.SelectedRegionId= retData.RegionId;
         this.RegionName = retData.RegionName;
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
 openPopupForUpdate(RegionId:string, Popup:string){
	 this.uniquePopupId = RegionId;
   if(Popup=='0'){
     alert('You cannot modify this rate.');
   }
   else 
   {
     this.title = 'Update Region';
     this.actionFlag = 'Update';
     this.RegionPopup = true;
     this.RegionId = '';
     this.RegionName =  '';
     this.GetRegionById(RegionId);
   }
 }
 saveRegion(){  
   this.errorFound = true;
   if(this.ValidationRate()){
     const obj = {
      RegionId:(this.actionFlag == 'Update') ? this.SelectedRegionId : '0',
      RegionName:this.RegionName.toUpperCase(),
      Status: ((this.DS == true) ?'1':'2'),
      UserId:this.objCook.get('UID')
     };
     this.objDbServ.ShowLoaders.emit(true);
     this.objDbServ.RegionInsertUpdate(obj).subscribe(
       (resp: Response) =>{
         const data = JSON.parse(resp.json());
         this.GetRegionById('0');
         if(data.Table[0].Meaasge.indexOf('Successfully') > -1)
         {
           this.RegionPopup = false;
           this.RegionData();
           this.DS = true;
           this.RegionName='';
           this.SelectedRegionId='';
           $("#regionCheck").prop("checked", true);
           this.Status = '';
           $("#tgt_div").animate({left:"55px"});
           this.RegionData();
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
   if(this.RegionName == ''){
     alert('Region must be entered.');
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
  if(this.listRegion.length > 0)
  {
    this.listRegion.forEach((element,i)=>{
      this.exportList.push({'SrNo':i+1,'RegionName':element.RegionName,'Status':element.Status})
    })
    var head = ['Sr. No.', 'Region Name', 'Status'];
    var filename = 'Region_Management_'+ this.CurrentDate;
    new ngxCsv(this.exportList, filename, {headers: (head)});
  }
  else{
    alert('No Data available to export.!');
  }
 }
}