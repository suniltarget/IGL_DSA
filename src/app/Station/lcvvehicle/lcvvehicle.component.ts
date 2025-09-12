import { Component, OnInit } from '@angular/core';
import { dbService } from '../../Service/db.service';
import { CookieService } from 'ngx-cookie-service';
import { DatepickerOptions } from 'ng2-datepicker';
import * as enLocale from 'date-fns/locale/en';
import { FilterSearchPipe } from '../../Filters/filter-search.pipe';
import { DomSanitizer} from '@angular/platform-browser';
import { Response } from '@angular/http';
import { AlertComponent, idLocale } from 'ngx-bootstrap';
import { isUndefined } from 'util';
@Component({
  selector: 'app-lcvvehicle',
  templateUrl: './lcvvehicle.component.html',
  styleUrls: ['./lcvvehicle.component.css']
})
export class LCVvehicleComponent implements OnInit {
  LCVEntryDate:any= this.objCook.get('CurrentDate');
  isstationfrom:boolean=true;
  Stationfrom:string=this.objCook.get('stationname');
  stationCode:string=this.objCook.get('stationCode');
  monthNames = [
    "Jan", "Feb", "Mar",
    "Apr", "May", "Jun", "Jul",
    "Aug", "Sep", "Oct",
    "Nov", "Dec"
  ];
  date: Date;
  options:DatepickerOptions = {
    minYear: 2018,
    locale: enLocale,
    displayFormat: 'DD-MMM-YYYY',
    maxDate:new Date(Date.now())
  };
  listStation: any;
  fiterBox:boolean = false;
  filterBoxFlag:number = 0;
  stCodeMy:"";
  SelectedStationCode:string='';
  lcvlist: any;
  errorFound = true;
  StationName:string="";
  LCVKG :any;
  Trips :any;
  Remark:string="";
  SelectedlcvId:string='';
  flag: string;
  LCVNO:String;
  constructor(private objDbServ: dbService, private objCook: CookieService, private sanitizer: DomSanitizer) 
  {
    this.objDbServ.MasterCompDisplay.emit(true);
  }
  ngOnInit() {
    this.getstationlist();
    this.getlcvlist();
  }
  OnDateChnagefrom(date){
    this.LCVEntryDate=date;
    this.getlcvlist();
  }
  getstationlist() {
    this.objDbServ.CommonGetData({Flag:'Stationforlcvvehicle'}).subscribe(
      (resp: Response) => 
      { 
        this.listStation=JSON.parse(resp.json()).Table
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
      this.stCodeMy = itm.StationName;
      this.SelectedStationCode=itm.StationCode;
    }
  }
  Deletelcv(Id:string,){
    if(confirm("Are you sure to delete this record..?")) {
      var Json = 
      {
        id: Id
      }
      this.objDbServ.Deletelcv(Json).subscribe(
        (resp: any) => {
          const data = JSON.parse(resp.json());
          alert(data.Table[0].msg);
          setTimeout(() => 
          {
            this.getlcvlist();
          });
          this.objDbServ.ShowLoaders.emit(false);
        },
        (error) => {alert("Something went wrong.");
        this.objDbServ.ShowLoaders.emit(false);}
      )
    }
    this.getlcvlist();
  }
  getlcvlist() {
    this.objDbServ.getlcvlist({flag:'get',Fromstation:this.stationCode,Entrydate:this.LCVEntryDate}).subscribe(
      (resp: Response) => { 
        this.lcvlist=JSON.parse(resp.json()).Table
        const retData = JSON.parse(resp.json()).Table[0];
      },
      (error) => {alert("Something went wrong.");
       this.objDbServ.ShowLoaders.emit(false);
      }
    )
  }
Edit(itm)
{ 
  this.stCodeMy= '';
  this.SelectedlcvId = itm.id;
  this.Stationfrom= itm.Fromstation;
  this.stCodeMy= itm.Tostation;
  this.LCVKG=itm.LCVKG;
  this.Trips=itm.Trips;
  this.Remark=itm.Remarks;
  this.LCVNO=itm.LCVNO;
  this.SelectedStationCode = itm.FromStationCode
  this.flag = 'Update'
}
  InsertLCVVehicl(){  
    this.errorFound = true;
    if(this.flag  == '' || this.flag == undefined){
      this.flag = 'Insert'
    }
    if(this.Validationlcv()) {  
      const obj = {
        Id:(this.flag == 'Update') ? this.SelectedlcvId : '0',
        Tostation:this.SelectedStationCode,
        EntryDate:this.LCVEntryDate,
        Fromstation:this.stationCode,
        LCVKG:this.LCVKG,
        Tripsoflcv:this.Trips,
        Remarks:this.Remark,
        LCVNO:this.LCVNO,
        flag:this.flag,
       };
       this.objDbServ.ShowLoaders.emit(true);
       this.objDbServ.InsertLCVdata(obj).subscribe(
         (resp: any) =>{
          this.objDbServ.ShowLoaders.emit(false);
           if(JSON.parse(resp.json())[0].msg.indexOf('successfully') > -1)
           {
             this.SelectedStationCode='';
             this.stCodeMy='';
             this.LCVKG='';
             this.flag='';
             this.Trips='';
             this.Remark='';
             this.LCVNO='';
             this.getlcvlist();
           }
           alert(JSON.parse(resp.json())[0].msg);
       },
         (error) =>{
           alert('Something went wrong.');
           this.objDbServ.ShowLoaders.emit(false);
         }
       )
    }
  }
  Validationlcv(){
    var re = new RegExp(/^[a-zA-Z ]*$/);
    var regexNumeric = /^[+-]?[0-9]{1,1000}(?:\.[0-9]{1,1000})?$/;
    var regexDecimalThree = /^[+-]?[0-9]{1,10}(?:\.[0-9]{1,3})?$/;
    if(this.SelectedStationCode == '' || this.SelectedStationCode==undefined){
      alert('To Station Name must be selected.');
      this.errorFound = false;
      }
    else if (this.LCVKG == '' || this.LCVKG==undefined) {
      alert('LCV KG must be entered.');
      this.errorFound = false;
    }
    else if(regexNumeric.test(this.LCVKG) == false){
      alert('only Number allowed in LCVKG.');
      this.errorFound = false; 
    }
    else if (this.Trips == '' || this.Trips==undefined) {
      alert('NO.of trips must be entered.');
      this.errorFound = false;
    }
    else if(regexNumeric.test(this.Trips) == false){
      alert('only Number allowed in Trips.');
      this.errorFound = false;
    }
    else if (this.LCVNO == '' || this.LCVNO==undefined) {
      alert('LCV NO must be entered.');
      this.errorFound = false;
    }
  return this.errorFound;
  }
}