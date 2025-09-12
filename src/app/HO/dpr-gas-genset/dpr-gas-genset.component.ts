import { Component, OnInit } from '@angular/core';
import { dbService } from '../../Service/db.service';
import { Response } from '@angular/http';
import { CookieService } from 'ngx-cookie-service';
import { ngxCsv } from 'ngx-csv';
declare var $:any;
@Component({
  selector: 'app-dpr-gas-genset',
  templateUrl: './dpr-gas-genset.component.html',
  styleUrls: ['./dpr-gas-genset.component.css']
})
export class DPRGasGensetComponent implements OnInit {
  listGenSet:any=[];
  listStation: any[];
  StationId:string='';
  GenSetId:string='';
  GenSetCode:string='';
  GenSetName:string='';
  GenSetDescription:string='';
  errorFound = true;
  title:string='';
  GenSetPopup:boolean = false;
  flag:string = '';
  SelectedStationCode:string='';
  Status:boolean;
  key: string = 'Name';
  reverse: boolean = true;
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
      this.getGenSet();
    });
    $(document).ready(function(){
        $("#ab").click(function(){
            $("#tgt_div").animate({left: "0px"});
        });
        $("#CheckGenset").click(function(){
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
    this.getGenSet();
  }
  getGenSet() {
    this.objDbServ.getGenSet({status:this.ActiveStatus}).subscribe(
      (resp: Response) => {
        this.listGenSet=JSON.parse(resp.json()).Table
        this.listStation = JSON.parse(resp.json()).Table1
      },
      (error) => {alert("Something went wrong.");
       this.objDbServ.ShowLoaders.emit(false);
      }
    )
  }
 openPopupForUpdate(itm, Popup:string) {
    this.uId = itm.GenSetId;
    this.title = 'Update';
    this.GenSetPopup= true;
    this.flag = 'U';
    this.StationId= itm.StationId;  
    this.stCodeMy=itm.StationName;
    this.fiterBox=false
    this.GenSetId = itm.GenSetId; 
    this.GenSetCode = itm.GenSetCode;
    this.GenSetName = itm.GasGenSetName;  
    this.GenSetDescription= itm.Description;
    this.SelectedStationCode= itm.StationCode;
    this.Status = (itm.status=='Active') ? true : false;
 }
 openAddDisp() {
    this.title = 'Add';
    this.flag = 'I';
    this.GenSetPopup = true;
    this.StationId='';
    this.stCodeMy='';
    this.GenSetId='';
    this.GenSetCode = '';
    this.GenSetName = '';  
    this.GenSetDescription='';
    this.SelectedStationCode =  '';
    this.Status = true;
    this.fiterBox=false
 }
save() {
  if (this.flag == 'I')
      this.InsertGenSet();
  else if (this.flag == 'U')
      this.UpdateGenSet();
}
InsertGenSet(){
  this.errorFound = true;
  if(this.ValidationGenSet()) {
   const obj = {
     GenSetId:(this.flag == 'U') ? this.GenSetId : '0',
     StationCode:this.SelectedStationCode,
     StationId:this.StationId,
     GenSetCode:this.GenSetCode,
     GenSetName:this.GenSetName.toUpperCase(),  
     Description : this.GenSetDescription,
     LoginId:this.objCook.get('UID'),
     status: (this.Status==true) ? '0' : '1'
    };
    this.objDbServ.ShowLoaders.emit(true);
    this.objDbServ.InsertGenSet(obj).subscribe(
      (resp: Response) =>{
        const data = JSON.parse(resp.json());
        if(data.Status.indexOf('successfully') > -1)
        {
            this.GenSetPopup = false;
            this.getGenSet();
            this.GenSetId='';
            this.StationId='';
            this.GenSetCode='';
            this.GenSetName='';
            this.GenSetDescription='';
            this.SelectedStationCode='';
            this.Status=true;
            this.stCodeMy='';
            $('.modal').modal('hide');
            $("#CheckGenset").prop("checked", true);
            this.ActiveStatus = '';
            $("#tgt_div").animate({left:"55px"});
            this.getGenSet();
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
UpdateGenSet(){
  this.errorFound = true;
    if(this.ValidationGenSet()) {
     const obj = {
        GenSetId:(this.flag == 'U') ? this.GenSetId : '0',
        StationCode:this.SelectedStationCode,
        StationId:this.StationId,
        GenSetCode:this.GenSetCode,
        GenSetName:this.GenSetName.toUpperCase(),  
        Description : this.GenSetDescription,
        LoginId:this.objCook.get('UID'),
        status: (this.Status==true) ? '0' : '1'
      };
      this.objDbServ.ShowLoaders.emit(true);
      this.objDbServ.UpdateGenSet(obj).subscribe(
        (resp: Response) =>{
          const data = JSON.parse(resp.json());
          if(data.Status.indexOf('Successfully') > -1)
          {
            this.GenSetPopup = false;
            this.getGenSet();
            this.GenSetId='';
            this.StationId='';
            this.GenSetCode='';
            this.GenSetName='';
            this.GenSetDescription='';
            this.SelectedStationCode='';
            this.Status=true;
            $('.modal').modal('hide');
            $("#CheckGenset").prop("checked", true);
            this.ActiveStatus = '';
            $("#tgt_div").animate({left:"55px"});
            this.getGenSet();
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
ValidationGenSet(){
  var Numreg = new RegExp(/^[0-9]*$/gm);
  var Streg = new RegExp(/^[a-zA-Z ]*$/);
  if(this.stCodeMy == ''){
    alert('Station must be selected.');
    this.errorFound = false;
   }
  else if(this.GenSetCode == ''){
    alert('Please enter the GenSet Code.');
    this.errorFound = false;
   }
  else if(!Streg.test(this.GenSetName)) {
      alert('Invalid Genset Name.');
      this.errorFound = false;
   }
  else if(this.GenSetName == ''){
    alert('Please enter the GenSet Name.');
    this.errorFound = false;
  } 
  return this.errorFound;
} 
exportFile() {
  this.exportList = [];
  if(this.listGenSet.length > 0)
  {
    this.listGenSet.forEach((element,i)=>{
      this.exportList.push({'SrNo':i+1,'GasGenSetName':element.GasGenSetName == null ? '' : element.GasGenSetName,'GenSetCode':element.GenSetCode == null ? '' : element.GenSetCode,'Description':element.Description == null ? '' : element.Description,'StationName':element.StationName == null ? '' : element.StationName,'StationCode':element.StationCode == null ? '' : element.StationCode,'Status':element.status == null ? '' : element.status})
    })
    var head = ['Sr. No.', 'Gas Genset Name', 'Gas Genset Code','Description','Station Name','Station Code','Status'];  
    var filename = 'Gas_Genset_'+this.CDate;
    new ngxCsv(this.exportList, filename, {headers: (head)});
  }
  else{
    alert('No Data available to export.!');
  }
}
}
