import { Component, OnInit } from '@angular/core';
import { dbService } from '../../Service/db.service';
import { CookieService } from 'ngx-cookie-service';
import { ngxCsv } from 'ngx-csv';
declare var $:any;
@Component({
  selector: 'app-entry-threshhold',
  templateUrl: './entry-threshhold.component.html',
  styleUrls: ['./entry-threshhold.component.css']
})
export class EntryThreshholdComponent implements OnInit {
  flag:string = '';
  listEntryThreshold:any =[];
  EntryThresholdId:string='';
  DaysForAverage:string='';
  MeterType:string="LCV"
  ThresholdValue:string='';
  errorFound = true;
  title:string='';
  EntryThresholdPopup: boolean = false;
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
  metervisible:boolean = false;
  constructor(private objDbServ: dbService, private objCook: CookieService) {
    this.objDbServ.HeaderDisplay.emit(true);
    this.objDbServ.LeftMenu.emit(true);
   }
  ngOnInit() {
    setTimeout(() => {
      this.getEntryThreshold();
    });
    $("#ab").click(function(){
      $("#tgt_div").animate({left: "0px"});
    });
    $("#ThresholdCheck").click(function(){
      $("#tgt_div").animate({left:"55px"});
    });
    $("#ef").click(function(){
      $("#tgt_div").animate({left: "110px"});
      });
  }
  metertypevalue(value){
    this.MeterType = value;
  }
  openPopupForUpdate(itm) {
    this.metervisible = true;
    this.uId = itm.Id;
    this.title = 'Update';
    this.EntryThresholdPopup= true;
    this.flag = 'U';
    this.EntryThresholdId = itm.Id; 
    this.MeterType = itm.MeterType;
    this.ThresholdValue = itm.ThresholdValue;
    this.DaysForAverage = itm.DaysForAverage;  
    this.Status = (itm.status=='Active') ? true : false;
 }
openAddDisp() {
  this.metervisible = false;
    this.title = 'Add';
    this.flag = 'I';
    this.EntryThresholdPopup = true;
    this.EntryThresholdId='';
    this.MeterType = "LCV"
    this.DaysForAverage = '';  
    this.ThresholdValue='';
    this.Status = true;
}
  save() {
    if (this.flag == 'I')
        this.InsertEntryThreshold();
    else if (this.flag == 'U')
        this.UpdateEntryThreshold();
  }
  InsertEntryThreshold() {
    this.errorFound = true;
   if(this.ValidationThreshold()) {
    const obj = {
      Id:(this.flag == 'U') ? this.EntryThresholdId : '0',
      MeterType:this.MeterType,
      ThresholdValue:this.ThresholdValue,
      DaysForAverage:this.DaysForAverage,  
      status: (this.Status==true) ? '0' : '1'
     };
     this.objDbServ.ShowLoaders.emit(true);
     this.objDbServ.InsertUpdateEntryThreshold(obj).subscribe(
       (resp: any) =>{
         const data = JSON.parse(resp.json());
         if(data.Table[0].Msg.indexOf('Successfully') > -1)
         {
           this.EntryThresholdPopup = false;
           this.getEntryThreshold();
           this.EntryThresholdId='';
           this.MeterType='';
           this.ThresholdValue='';
           this.DaysForAverage='';
           this.Status=true;
           $('.modal').modal('hide');
           $("#ThresholdCheck").prop("checked", true);
           this.ActiveStatus = '';
           $("#tgt_div").animate({left:"55px"});
           this.getEntryThreshold();
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
  UpdateEntryThreshold() {
    this.errorFound = true;
    if(this.ValidationThreshold()) {
     const obj = {
        Id:(this.flag == 'U') ? this.EntryThresholdId : '0',
        MeterType:this.MeterType,
        ThresholdValue:this.ThresholdValue,
        DaysForAverage:this.DaysForAverage,  
        status: (this.Status==true) ? '0' : '1'
      };
      this.objDbServ.ShowLoaders.emit(true);
      this.objDbServ.InsertUpdateEntryThreshold(obj).subscribe(
        (resp: any) =>{
          const data = JSON.parse(resp.json());
          if(data.Table[0].Msg.indexOf('Successfully') > -1)
          {
            this.EntryThresholdPopup = false;
            this.getEntryThreshold();
            this.EntryThresholdId='';
            this.MeterType='';
            this.DaysForAverage='';
            this.Status=true;
            $('.modal').modal('hide');
            $("#ThresholdCheck").prop("checked", true);
            this.ActiveStatus = '';
            $("#tgt_div").animate({left:"55px"});
            this.getEntryThreshold();
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
  ValidationThreshold(){
    var re = new RegExp(/^[0-9]*$/);
    if(!re.test(this.ThresholdValue)){
      alert('Invalid Thres Hold Valve');
      this.errorFound=false;
    }
    var re = new RegExp(/^[0-9]*$/);
    if(!re.test(this.DaysForAverage)){
      alert('Invalid Days Valve');
      this.errorFound=false;
    }
    if(this.MeterType == ''){
      alert('Please select Meter Type.');
      this.errorFound = false;
     }
     else if(this.ThresholdValue == ''){
      alert('Please enter the Thresh Hold value.');
      this.errorFound = false;
    }
    else if(this.DaysForAverage == ''){
      alert('Please enter the Days For Average.');
      this.errorFound = false;
     }
    return this.errorFound;
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
    this.getEntryThreshold();
  }
  getEntryThreshold() {
      this.objDbServ.getEntryThreshold({status:this.ActiveStatus}).subscribe(
      (resp: any) => {
        this.listEntryThreshold=JSON.parse(resp.json()).Table
      },
      (error) => {
        alert("Something went wrong.");
       this.objDbServ.ShowLoaders.emit(false);
      }
    )
  }
  sortCol(key:string){
    this.sortingColumn = key;
    this.key = key;
    this.reverse = !this.reverse;
  }
   exportFile() {
    this.exportList = [];
    if(this.listEntryThreshold.length > 0)
    {
      this.listEntryThreshold.forEach((element,i)=>{
        this.exportList.push({'SrNo':i+1,'MeterType':element.MeterType == null ? '' : element.MeterType,'ThresholdValue':element.ThresholdValue == null ? '' : element.ThresholdValue,'DaysForAverage':element.DaysForAverage == null ? '' : element.DaysForAverage,'Status':element.status == null ? '' : element.status})
      })
      var head = ['Sr. No.', 'Meter Type', 'Threshold Value', 'Days For Average','Status'];  
      var filename = 'EntryThreshold';
      new ngxCsv(this.exportList, filename, {headers: (head)});
    }
    else{
      alert('No Data available to export.!');
    }
 }
}
