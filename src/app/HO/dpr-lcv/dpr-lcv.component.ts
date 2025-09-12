import { Component, OnInit } from '@angular/core';
import { dbService } from '../../Service/db.service';
import { Response } from '@angular/http';
import { FilterSearchPipe } from '../../Filters/filter-search.pipe';
import { CookieService } from 'ngx-cookie-service';
import { ngxCsv } from 'ngx-csv';
declare var $:any;
@Component({
  selector: 'app-dpr-lcv',
  templateUrl: './dpr-lcv.component.html',
  styleUrls: ['./dpr-lcv.component.css']
})
export class DPRLCVComponent implements OnInit {
  listLCV:any=[];
  listStation: any[];
  StationId:string='';
  LCVId:string='';
  LCVCode:string='';
  LCVName:string='';
  LCVDescription:string='';
  errorFound = true;
  title:string='';
  LCVPopup:boolean = false;
  flag:string = '';
  SelectedStationCode:string='';
  Status:boolean;
  key: string = 'Name';
  reverse: boolean = true;
  StatusIsfalse:boolean=false;
  ActiveStatus:string = '';
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
      this.getLCV();
    });
    $(document).ready(function(){
      $("#ab").click(function(){
        $("#tgt_div").animate({left: "0px"});
      });
      $("#LCVCheck").click(function(){
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
    this.getLCV();
  }
  getLCV() {
    this.objDbServ.getLCV({status:this.ActiveStatus}).subscribe(
      (resp: Response) => {
        this.listLCV=JSON.parse(resp.json()).Table
        this.listStation = JSON.parse(resp.json()).Table1
      },
      (error) => {alert("Something went wrong.");
       this.objDbServ.ShowLoaders.emit(false);
      }
    )
  }
openPopupForUpdate(itm, Popup:string) {
    this.uId = itm.LcvId;
    this.title = 'Update';
    this.LCVPopup= true;
    this.flag = 'U';
    this.StationId= itm.StationId;  
    this.stCodeMy=itm.StationName;
    this.fiterBox=false
    this.LCVId = itm.LcvId; 
    this.LCVCode = itm.LcvCode;
    this.LCVName = itm.LcvName;  
    this.LCVDescription= itm.Description;
    this.SelectedStationCode= itm.StationCode;
    this.Status = (itm.status=='Active') ? true : false;
 }
openAddDisp() {
    this.title = 'Add';
    this.flag = 'I';
    this.LCVPopup = true;
    this.StationId='';
    this.stCodeMy='';
    this.fiterBox=false
    this.LCVId='';
    this.LCVCode = '';
    this.LCVName = '';  
    this.LCVDescription='';
    this.SelectedStationCode =  '';
    this.Status = true;
}
  save() {
    if (this.flag == 'I')
        this.InsertLCV();
    else if (this.flag == 'U')
        this.UpdateLCV();
  }
  InsertLCV() {
    this.errorFound = true;
   if(this.ValidationLCV()) {
    const obj = {
      LcvId:(this.flag == 'U') ? this.LCVId : '0',
      StationCode:this.SelectedStationCode,
      LcvCode:this.LCVCode,
      LcvName:this.LCVName.toUpperCase(),  
      Description : this.LCVDescription,
      LoginId:this.objCook.get('UID'),
      status: (this.Status==true) ? '0' : '1'
     };
     this.objDbServ.ShowLoaders.emit(true);
     this.objDbServ.InsertLCV(obj).subscribe(
       (resp: Response) =>{
         const data = JSON.parse(resp.json());
         if(data.Status.indexOf('successfully') > -1)
         {
           this.LCVPopup = false;
           this.getLCV();
           this.LCVId='';
           this.StationId='';
           this.LCVCode='';
           this.LCVName='';
           this.LCVDescription='';
           this.SelectedStationCode='';
           this.Status=true;
           this.stCodeMy='';
           $('.modal').modal('hide');
           $("#LCVCheck").prop("checked", true);
           this.ActiveStatus = '';
           $("#tgt_div").animate({left:"55px"});
           this.getLCV();
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
  UpdateLCV() {
    this.errorFound = true;
    if(this.ValidationLCV()) {
     const obj = {
        LcvId:(this.flag == 'U') ? this.LCVId : '0',
        StationCode:this.SelectedStationCode,
        LcvCode:this.LCVCode,
        LcvName:this.LCVName.toUpperCase(),  
        Description : this.LCVDescription,
        LoginId:this.objCook.get('UID'),
        status: (this.Status==true) ? '0' : '1'
      };
      this.objDbServ.ShowLoaders.emit(true);
      this.objDbServ.UpdateLCV(obj).subscribe(
        (resp: Response) =>{
          const data = JSON.parse(resp.json());
          if(data.Status.indexOf('Successfully') > -1)
          {
            this.LCVPopup = false;
            this.getLCV();
            this.LCVId='';
            this.StationId='';
            this.LCVCode='';
            this.LCVName='';
            this.LCVDescription='';
            this.SelectedStationCode='';
            this.Status=true;
            this.stCodeMy='';
            $('.modal').modal('hide');
            $("#LCVCheck").prop("checked", true);
            this.ActiveStatus = '';
            $("#tgt_div").animate({left:"55px"});
            this.getLCV();
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
  ValidationLCV(){
    if(this.stCodeMy == ''){
      alert('Station must be selected.');
      this.errorFound = false;
     }
    else if(this.LCVCode == ''){
      alert('Please enter the Lcv Code.');
      this.errorFound = false;
     }
    else if(this.LCVName == ''){
      alert('Please enter the Lcv Name.');
      this.errorFound = false;
    }
    return this.errorFound;
  } 
  exportFile() {
    this.exportList = [];
    if(this.listLCV.length > 0)
    {
      this.listLCV.forEach((element,i)=>{
        this.exportList.push({'SrNo':i+1,'LcvName':element.LcvName == null ? '' : element.LcvName,'LcvCode':element.LcvCode == null ? '' : element.LcvCode,'Description':element.Description == null ? '' : element.Description,'StationName':element.StationName,'StationCode':element.StationCode == null ? '' : element.StationCode,'Status':element.status == null ? '' : element.status})
      })
      var head = ['Sr. No.', 'LCV Name', 'LCV Code','LCV Description','Station Name','Station Code','Status'];  
      var filename = 'LCV_'+this.CDate;
      new ngxCsv(this.exportList, filename, {headers: (head)});
    }
    else{
      alert('No Data available to export.!');
    }
 }
}
