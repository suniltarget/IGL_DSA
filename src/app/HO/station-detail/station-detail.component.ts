import { Component, OnInit } from '@angular/core';
import { dbService } from '../../Service/db.service';
import { Response } from '@angular/http';
import { CookieService } from 'ngx-cookie-service';
import { ngxCsv } from 'ngx-csv/ngx-csv';
import { FilterSearchPipe } from '../../Filters/filter-search.pipe';
declare var $:any;
@Component({
  selector: 'app-station-detail',
  templateUrl: './station-detail.component.html',
  styleUrls: ['./station-detail.component.css']
})
export class StationDetailComponent implements OnInit {
  listMOStation:any=[];
  exportList:any=[];
  listDisp:{}[];
  UserIdCook:string = '';
  title: string
  soPopup:boolean = false;
  Status:string;
  searchText:string = '';
  filter:string='';
  filter1:string='';
  SelectedStationId:string = '0';
  key: string = 'Name';
  reverse: boolean = true;
  sortingColumn:string="";
  CDate:string;
  DeptCode:string= this.objCook.get('DepartmentCode');
  Loginid:string= this.objCook.get('LoginId');
  key1: string = 'Name';
  reverse1: boolean = true;
  sortingColumn1:string="";
  constructor(private objDbServ: dbService,private objCook: CookieService) { 
    this.objDbServ.MasterCompDisplay.emit(true);
    this.objDbServ.HeaderDisplay.emit(true);
    this.objDbServ.LeftMenu.emit(true);
  }
ngOnInit() {
  this.UserIdCook = this.objCook.get('UID');
  const dt = new Date();
  this.CDate = dt.getDate() + "/" + this.monthNames[dt.getMonth()] + "/" + dt.getFullYear();
  setTimeout(() => {
    this.GetStationsByDepart();
  });
  this.hovertexttooltip();
}
hovertexttooltip(){
  $(document).on('mouseenter', ".overTextTip", function () {
    var $this = $(this);
    if (this.offsetWidth < this.scrollWidth && !$this.attr('title')) {
        $this.tooltip({
            title: $this.text(),
            container: 'body',
            placement: "top"
        });
        $this.tooltip('show');
    }
});
$(document).on('mouseout', ".overTextTip", function () {
    var $this = $(this);
    if (this.offsetWidth < this.scrollWidth && !$this.attr('title')) {
        $this.tooltip({
            title: $this.text(),
            container: 'body',
            placement: "top"
        });
        $this.tooltip('hide');
    }
});
function toolTip() {
$(".overTextTip").mouseover(function () {
    var $this = $(this);
    if (this.offsetWidth < this.scrollWidth && !$this.attr('title')) {
        $this.tooltip({
            title: $this.text(),
            container: 'body',
            placement: "top"
        });
        $this.tooltip('show');
    }
});
}
}
GetStationsByDepart() {
  if(this.DeptCode == 'MO')
    this.getMOStation();
  else
    this.getCOStations();
}
getMOStation(){
  this.objDbServ.ShowLoaders.emit(true);
  this.objDbServ.CommonGetData({Flag: 'SOListForMO', Id: this.UserIdCook}).subscribe(
    (resp: Response) => {
      const retData = JSON.parse(resp.json()).Table[0];
      if(retData){
        this.listMOStation = JSON.parse(resp.json()).Table;
        this.objDbServ.ShowLoaders.emit(false);
      }
      else
      {
        this.objDbServ.ShowLoaders.emit(false); 
      }         
    },
    (error) =>{
      alert('Something went wrong.');
      this.objDbServ.ShowLoaders.emit(false);
    }
  )
}
getCOStations() {
  this.objDbServ.ShowLoaders.emit(true);
  this.objDbServ.CommonGetData({Flag: 'COListForCR', Id: this.UserIdCook}).subscribe(
    (resp: Response) => {
      const retData = JSON.parse(resp.json()).Table[0];
      if(retData){
        this.listMOStation = JSON.parse(resp.json()).Table;
        this.objDbServ.ShowLoaders.emit(false);
      }
      else{
        this.objDbServ.ShowLoaders.emit(false); 
      }
    },
    (error) =>{
      alert('Something went wrong.');
      this.objDbServ.ShowLoaders.emit(false);
    }
  )
}
openPopupForUpdate(StationId:string){
  this.title = 'Dispensers';
  this.SelectedStationId = StationId;
  this.getSO(StationId);
}
getSO(StationId:string){
  this.objDbServ.ShowLoaders.emit(true);
  this.objDbServ.CommonGetData({Flag: 'DispenserListBySO', Id: StationId}).subscribe(
    (resp: Response) => {
      this.listDisp= JSON.parse(resp.json()).Table;
      if(JSON.parse(resp.json()).Table.length > 0){
        this.soPopup = true;
      }
      else{
        alert("Dispnser not found in this station.")
      }
      this.objDbServ.ShowLoaders.emit(false);
    },
    (error) =>{
      alert('Something went wrong.');
      this.objDbServ.ShowLoaders.emit(false);
    }
  )
}
openPopupForLock(StationId:String,e)
  {
    if (confirm("Do you want to change the status?")) {
    if(e.target.checked){
          this.Status = '1';
      }
    else
       this.Status = '2';
    this.objDbServ.ShowLoaders.emit(true);
    this.objDbServ.CommonGetData({Flag: 'UpdateSOStatus', Id:StationId, Status:this.Status,UserId:this.UserIdCook}).subscribe(
      (resp: Response) => {
        if(JSON.parse(resp.json()).Table.length > 0){
          const data= JSON.parse(resp.json()).Table[0];
          if(data.Column1.indexOf('successfully') > -1)
          {
            alert("Status Updated successfully");
            if(this.DeptCode == 'MO')
            this.getMOStation();
          else
            this.getCOStations();
          }
        }
        this.objDbServ.ShowLoaders.emit(false);
      },
      (error) =>{
        alert('Something went wrong.');
        this.objDbServ.ShowLoaders.emit(false);
      }
    )
}
else{
  e.target.checked=!e.target.checked;
}
}
sortCol(key:string){
  this.sortingColumn = key;
  this.key = key;
  this.reverse = !this.reverse;
}
sortColPopUp(key1:string){
  this.sortingColumn1 = key1;
  this.key1 = key1;
  this.reverse1 = !this.reverse1;
} 
monthNames = [
  "Jan", "Feb", "Mar",
  "Apr", "May", "Jun", "Jul",
  "Aug", "Sep", "Oct",
  "Nov", "Dec"
];
 exportFile() {
  this.exportList = [];
  if(this.listMOStation.length > 0)
  {
     this.listMOStation.forEach((element,i)=>{
       var status= element.Status == 1 ? 'Active' : 'InActive'
       this.exportList.push({'SrNo':i+1,'StationCode':element.StationCode,'StationName':element.StationName, 'StationAddress': element.StationAddress, 'RegionName':element.RegionName, 'CompanyName':element.CompanyName, 'StationTypeName':element.StationTypeName, 'Status':status})
     })
     var head = ['Sr. No.', 'Station Code', 'Station Name', 'Address', 'Region', 'Company', 'StationType', 'Status'];  
     var filename = 'Station_Details_'+this.CDate;
     new ngxCsv(this.exportList, filename, {headers: (head)});
  }
  else {
    alert('No Data available to export.!');
  }
}
}
