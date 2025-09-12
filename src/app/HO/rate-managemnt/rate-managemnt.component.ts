import { Component, OnInit } from '@angular/core';
import { dbService } from '../../Service/db.service';
import { Response } from '@angular/http';
import { FilterSearchPipe } from '../../Filters/filter-search.pipe';
import { CookieService } from 'ngx-cookie-service';
import { DatepickerOptions } from 'ng2-datepicker';
import * as enLocale from 'date-fns/locale/en';
import { ngxCsv } from 'ngx-csv';
declare var $:any;
@Component({
  selector: 'app-rate-managemnt',
  templateUrl: './rate-managemnt.component.html',
  styleUrls: ['./rate-managemnt.component.css']
})
export class RateManagemntComponent implements OnInit {
   date:Date;
   listRate:any=[];
   listRatePrevious:any=[];
   RatePopup:boolean = false;
   searchText:string = '';
   MinDate:string = '';
   SelectedRateId:string='';
   RateId:string='';
   RateRegionId:string='';
   UserId:string='';
   NormalRate:string='0.00';
   DisountedRate:string='0.00';
   EffectiveDate:string;
   Cdate='';
   dataRegionMaster:{}[];
   errorFound:boolean;
   actionFlag:string;
   RateTime:string='';
   DS:boolean=true;
   ActiveStatus:string ='';
   PreTableIsfalse:boolean=true;
   PrevBtnText:string ='Show Previous';
   Status=true;
   tableHeight:boolean = true;
   title:string;
   key:string= 'Name';
   reverse:boolean = true;
   filter:string='';
   exportList:any=[];
   uId:string="";
   sortingColumn:string="";
   CDate:string= this.objCook.get('CurrentDate');
   monthNames = [
     "Jan", "Feb", "Mar",
     "Apr", "May", "Jun", "Jul",
     "Aug", "Sep", "Oct",
     "Nov", "Dec"
   ];
   editmode:boolean = true;
  constructor(private objDbServ: dbService, private objCook: CookieService) { 
    this.objDbServ.MasterCompDisplay.emit(true);
    this.objDbServ.HeaderDisplay.emit(true);
    this.objDbServ.LeftMenu.emit(true);   
  }
  options:DatepickerOptions = {
    minYear: 2018,
    locale: enLocale,
    displayFormat: 'DD-MMM-YYYY',
    minDate:new Date(this.CDate)
  };
  ngOnInit() {
    const dt = new Date();
    this.CDate = dt.getDate() + "/" + this.monthNames[dt.getMonth()] + "/" + dt.getFullYear();  
    this.GetCdate()   
  }
  OnDateChnage(val){
    this.EffectiveDate=new Date(val).toLocaleDateString()
  }
  GetCdate(){
    this.objDbServ.CommonGetData({Flag: 'Cdate', Id: 0}).subscribe(
      (resp: Response) => {
        this.Cdate=JSON.parse(resp.json()).Table[0].Cdate;
        setTimeout(() => {
          this.getRateMaster();
        });
      },
      (error) => {alert("Something went wrong.");
      this.objDbServ.ShowLoaders.emit(false);
      }
    )
  }
  getRateMaster(){
    this.objDbServ.ShowLoaders.emit(true);
    this.objDbServ.getRateMaster({Flag: 'RateList', Id: '0'}).subscribe(
      (resp: Response) => {
        this.listRate = JSON.parse(resp.json()).Table;
        this.listRatePrevious = JSON.parse(resp.json()).Table1;
        this.objDbServ.ShowLoaders.emit(false);
      },
      (error) =>{
        alert('Something went wrong.');
        this.objDbServ.ShowLoaders.emit(false);
      }
    )
  }
  OnChangePrevious(evt, flag:string) {
     if(this.PrevBtnText == 'Show Previous'){
       this.PrevBtnText = 'Hide Previous';
       this.PreTableIsfalse = false;
       this.tableHeight = false;
       this.getRateMaster();
       return;
     } 
     else if (this.PrevBtnText == 'Hide Previous'){
        this.PrevBtnText = 'Show Previous'
        this.PreTableIsfalse = true;
        this.tableHeight = true;
        return;
     }      
  }
  addRate(){
    this.title = 'Add Rate';
    this.actionFlag = 'Add';
    this.RatePopup = true;
    this.SelectedRateId = '0';
    this.date=new Date();
    this.EffectiveDate=new Date().toLocaleDateString();
    this.RateId = '';
    this.RateRegionId =  '';
    this.NormalRate =  '';
    this.DisountedRate =  '';
    this.getRateById('0');
    this.RateTime = '';
  }
  getRateById(RateId:string){
    this.objDbServ.ShowLoaders.emit(true);
    this.objDbServ.getRateMaster({Flag: 'RateListById', Id: RateId}).subscribe(
      (resp: Response) => {
        if(JSON.parse(resp.json()).Table.length > 0){
          const retData = JSON.parse(resp.json()).Table[0];
          this.RateId = retData.RateId;
          this.RateRegionId = retData.RegionId;
          this.NormalRate = retData.NormalRate;
          this.DisountedRate = retData.DisountedRate;
          this.EffectiveDate = retData.EffectiveDate1;
          this.date=new Date(this.EffectiveDate);
          this.RateTime = retData.EffectiveTime; 
        }
        this.dataRegionMaster = JSON.parse(resp.json()).Table1;
        this.MinDate = JSON.parse(resp.json()).Table2[0].FMinDate;
        this.objDbServ.ShowLoaders.emit(false);
      },
      (error) =>{
        alert('Something went wrong.');
        this.objDbServ.ShowLoaders.emit(false);
      }
    )
  }
  openPopupForUpdate(RateId:string, Popup:string){
    if(Popup=='0'){
      alert('You cannot modify this rate.');
    }
    else {
      this.uId = RateId;
      this.title = 'Update Station';
      this.actionFlag = 'Update';
      this.RatePopup = true;
      this.RateId = '';
      this.RateRegionId =  '';
      this.NormalRate =  '';
      this.DisountedRate =  '';
      this.SelectedRateId = RateId;
      this.getRateById(RateId);
    }
  }
  onTimeSelect(eve){
    this.RateTime = eve.target.value;
  }
  saveRate(rateId,regionId,effectiveDate,normalRate,discountRate,displayRate){
    this.errorFound = true;
    if(this.ValidationRate()){
      const obj = {
        RateId:rateId,
        RegionId:regionId,
        NormalRate:this.NormalRate,
        DisountedRate:this.DisountedRate,
        EffectiveDate:effectiveDate,
        UserId:this.objCook.get('UID'),
        EffectiveTime : this.RateTime != '' ? this.RateTime : displayRate
      };
      this.objDbServ.ShowLoaders.emit(true);
      this.objDbServ.addRateMaster(obj).subscribe(
        (resp: Response) =>{
          const data = JSON.parse(resp.json());
          this.getRateMaster();
          if(data.Table[0].Meaasge.indexOf('successfully') > -1)
          {
            this.RatePopup = false;
            this.date=new Date(this.Cdate);
          }
          alert(data.Table[0].Meaasge);
          this.objDbServ.ShowLoaders.emit(false);
       },
        (error) =>{
          alert('Something went wrong.');
          this.objDbServ.ShowLoaders.emit(false);
        }
      )
    }
  }
  ValidationRate(){
    const decimal=  /^[-+]?[0-9]+\.[0-9]+$/; 
    if(this.NormalRate != '' || Number(this.NormalRate) == 0)
    {
      if(!isNaN(parseFloat(this.NormalRate)))
      {
       if(parseFloat(this.NormalRate) <=0)
       {
         alert('Rate must be greater then zero');
         this.errorFound = false;
       }
      }
      else
      {
        alert('Please enter valid Normal Rate.');
        this.errorFound = false;
      }
    }
    if(this.DisountedRate != '' || Number(this.DisountedRate) == 0){
      if(!isNaN(parseFloat(this.DisountedRate)))
      {
       if(parseFloat(this.DisountedRate) <=0)
       {
         alert('Disounted Rate must be greater then zero');
         this.errorFound = false;
       }
      }
      else
      {
        alert('Please enter valid Discounted Rate.');
        this.errorFound = false;
      }
    }
    if(this.DisountedRate != '' && this.NormalRate != ''){
      if(parseFloat(this.NormalRate)<parseFloat(this.DisountedRate))
      {
        alert('Normal Rate must be greater/equal than discounted rate');
        this.errorFound = false;
       }
    }
    if(this.RateTime == '' || this.RateTime == null){
      alert('Effective Time must be Selected.');
        this.errorFound = false;      
    }
    return this.errorFound;
  }
  sortCol(key:string){
    if(key == 'EntryDate') {
      this.sortingColumn = key;
      this.key = '';
      this.listRate.sort(function(a,b){
        return new Date(b.EffectiveDate).getTime() - new Date(a.EffectiveDate).getTime() 
        });
        this.reverse = !this.reverse;
    }
    else {
      this.sortingColumn = key;
      this.key = key;
      this.reverse = !this.reverse; 
    }  
  }
  exportFile() {
    this.exportList = [];
    if(this.listRate.length > 0)
    {
      this.listRate.forEach((element,i)=>{
        this.exportList.push({'SrNo':i+1,'RegionName':element.RegionName,'NormalRate':element.NormalRate,'DisountedRate':element.DisountedRate,'EffectiveDate':element.EffectiveDate,'EffectiveTime':element.EffectiveTime != null ? element.EffectiveTime : '' })
      })
      var head = ['Sr. No.', 'Region', 'Normal Rate ₹ / K.G.','Discounted Rate ₹ / K.G.','Effective Date','Effective Time'];  
      var filename = 'Rate_Management_'+this.CDate;
      new ngxCsv(this.exportList, filename, {headers: (head)});
    }
    else{
      alert('No Data available to export.!');
    }
 }
  editmodefun(itm){
    this.listRate.forEach(element => {
      if(element.RegionName == itm.RegionName){
        element.IsDisable = false;
      }
      else{
        element.IsDisable = true;
      }
    });
    this.NormalRate = itm.NormalRate;
    this.DisountedRate = itm.DisountedRate;
    this.RateTime = itm.DisplayTime;
  }
}
