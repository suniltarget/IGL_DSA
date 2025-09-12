import { Component, OnInit } from '@angular/core';
import { dbService } from '../../Service/db.service';
import { Response } from '@angular/http';
import { CookieService } from 'ngx-cookie-service';
import { ngxCsv } from 'ngx-csv';
declare var $:any;
@Component({
  selector: 'app-dpr-meter-skid',
  templateUrl: './dpr-meter-skid.component.html',
  styleUrls: ['./dpr-meter-skid.component.css']
})
export class DPRMeterSkidComponent implements OnInit {
  listMeterSkid:any=[];
  listStation: any[];
  StationId:string='';
  MSkidId:string='';
  MSCode:string='';
  MSName:string='';
  MSDescription:string='';
  errorFound = true;
  title:string='';
  MSkidPopup:boolean = false;
  flag:string = '';
  SelectedStationCode:string='';
  Status:boolean;
  key: string = 'Name';
  reverse:boolean = true;
  StatusIsfalse:boolean=false;
  ActiveStatus:string='';
  filter:string='';
  exportList:any=[];
  uId:string="";
  sortingColumn:string="";
  fiterBox:boolean = false;
  filterBoxFlag:number = 0;
  stCodeMy:"";
  CDate:string;
  monthNames = [
    "Jan", "Feb", "Mar",
    "Apr", "May", "Jun", "Jul",
    "Aug", "Sep", "Oct",
    "Nov", "Dec"
  ];
  constructor(private objDbServ: dbService, private objCook: CookieService) {
     this.objDbServ.MasterCompDisplay.emit(true);
     this.objDbServ.HeaderDisplay.emit(true);
     this.objDbServ.LeftMenu.emit(true);
   }
  ngOnInit() {
    const dt = new Date();
    this.CDate = dt.getDate() + "/" + this.monthNames[dt.getMonth()] + "/" + dt.getFullYear();
    setTimeout(() => {
      this.getMeterSkid();
    });
    $(document).ready(function(){
      $("#ab").click(function(){
        $("#tgt_div").animate({left: "0px"});
      });
      $("#MSkidCheck").click(function(){
        $("#tgt_div").animate({left:"55px"});
      });
      $("#ef").click(function(){
        $("#tgt_div").animate({left: "110px"});
      });
    });
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
      this.SelectedStationCode=itm.StationCode;
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
    this.getMeterSkid();
  }
  getMeterSkid() {
    this.objDbServ.getMeterSkid({status:this.ActiveStatus}).subscribe(
      (resp: Response) => {
        this.listMeterSkid=JSON.parse(resp.json()).Table
        this.listStation = JSON.parse(resp.json()).Table1
      },
      (error) => {alert("Something went wrong.");
      this.objDbServ.ShowLoaders.emit(false);
      }
    )
  }
openPopupForUpdate(itm, Popup:string) {
    this.uId = itm.MeterSkidId;
    this.title = 'Update';
    this.MSkidPopup= true;
    this.flag = 'U';
    this.StationId=itm.StationId;  
    this.MSkidId = itm.MeterSkidId; 
    this.MSCode = itm.MeterSkidCode;
    this.MSName = itm.MeterSkidName;  
    this.MSDescription=itm.Description;
    this.SelectedStationCode=itm.StationCode;
    this.stCodeMy=itm.StationName;
    this.Status = (itm.Status=='Active') ? true : false;
    this.fiterBox=false
}
openAddDisp() {
    this.title = 'Add';
    this.MSkidPopup = true;
    this.flag = 'I';
    this.MSCode = '';
    this.MSName = '';  
    this.MSDescription='';
    this.SelectedStationCode =  '';
    this.Status = true;
    this.stCodeMy='';
    this.fiterBox=false
}
save() {
  if (this.flag == 'I')
      this.InsertMSkid();
  else if (this.flag == 'U')
      this.updateMSkid();
}
InsertMSkid(){
  this.errorFound = true;
  if(this.ValidationMeterSkid()) {
    const obj = {
      MeterSkidId:(this.flag == 'U') ? this.MSkidId : '0',
      StationCode:this.SelectedStationCode,
      MeterSkidCode:this.MSCode,
      MeterSkidName:this.MSName.toUpperCase(),  
      Description : this.MSDescription,
      LoginId:this.objCook.get('UID'),
      status:(this.Status==true) ? '0' : '1'
     };
     this.objDbServ.ShowLoaders.emit(true);
     this.objDbServ.InsertMeterSkid(obj).subscribe(
       (resp: Response) =>{
         const data = JSON.parse(resp.json());
         if(data.Status.indexOf('successfully') > -1)
         {
           this.MSkidPopup = false;
           this.getMeterSkid();
           this.MSCode='';
           this.MSName='';
           this.MSkidId='';
           this.MSDescription='';
           this.SelectedStationCode='';
           this.Status=true;
           this.stCodeMy='';
           $('.modal').modal('hide');
           $("#MSkidCheck").prop("checked", true);
           this.ActiveStatus = '';
           $("#tgt_div").animate({left:"55px"});
           this.getMeterSkid();
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
updateMSkid(){
  this.errorFound = true;
  if(this.ValidationMeterSkid()) {
    const obj = {
        MeterSkidId:(this.flag == 'U') ? this.MSkidId : '0',
        StationCode:this.SelectedStationCode,
        MeterSkidCode:this.MSCode,
        MeterSkidName:this.MSName.toUpperCase(),  
        Description : this.MSDescription,
        LoginId:this.objCook.get('UID'),
        status:(this.Status==true) ? '0' : '1'
     };
     this.objDbServ.ShowLoaders.emit(true);
     this.objDbServ.UpdateMeterSkid(obj).subscribe(
       (resp: Response) =>{
         const data = JSON.parse(resp.json());
        if(data.Status.indexOf('Successfully') > -1)
         {
           this.MSkidPopup = false;
           this.getMeterSkid();
           this.MSCode='';
           this.MSName='';
           this.MSkidId='';
           this.MSDescription='';
           this.SelectedStationCode='';
           this.Status=true;
           this.stCodeMy='';
           $('.modal').modal('hide');
           $("#MSkidCheck").prop("checked", true);
           this.ActiveStatus = '';
           $("#tgt_div").animate({left:"55px"});
           this.getMeterSkid();
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
ValidationMeterSkid(){
    var re = new RegExp(/^[0-9]*$/gm);
    if(this.stCodeMy == ''){
      alert('Station must be selected.');
      this.errorFound = false;
     }
    else if(this.MSCode == ''){
      alert('Meter Skid code must be entered.');
      this.errorFound = false;
     }
    else if(this.MSName == ''){
      alert('Meter Skid name must be entered.');
      this.errorFound = false;
    }
    else if (re.test(this.MSName)) {
      alert('Invalid Meter Skid name.');
      this.errorFound = false;
     }
    return this.errorFound;
}
exportFile() {
    this.exportList = [];
    if(this.listMeterSkid.length > 0)
    {
      this.listMeterSkid.forEach((element,i)=>{
        this.exportList.push({'SrNo':i+1,'MeterSkidName':element.MeterSkidName,'MeterSkidCode':element.MeterSkidCode,'StationCode':element.StationCode,'StationName':element.StationName,'Status':element.Status })
      })
      var head = ['Sr. No.', 'Meter Skid Name', 'Meter Skid Code','Station Code','Station Name','Status'];  
      var filename = 'Meter_Skid_'+this.CDate;
      new ngxCsv(this.exportList, filename, {headers: (head)});
    }
    else{
      alert('No Data available to export.!');
    }
}
}
