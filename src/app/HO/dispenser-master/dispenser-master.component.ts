import { Component, OnInit} from '@angular/core';
import { dbService } from '../../Service/db.service';
import { Response } from '@angular/http';
import { FilterSearchPipe } from '../../Filters/filter-search.pipe';
import { DatepickerOptions } from 'ng2-datepicker';
import * as enLocale from 'date-fns/locale/en';
import { ngxCsv } from 'ngx-csv';
import { log, isUndefined, isNullOrUndefined } from 'util';
import { CookieService } from 'ngx-cookie-service';
import { NumberValueAccessor } from '@angular/forms/src/directives';
declare var $:any;
@Component({
  selector: 'app-dispenser-master',
  templateUrl: './dispenser-master.component.html',
  styleUrls: ['./dispenser-master.component.css']
})
export class DispenserMasterComponent 
{
  date:Date;
  listDisp:any=[];
  listDispHistory:any=[];
  searchText:string = '';
   DispenserId:string='';
   DispenserName:string='';
   DispenserCode:string='';
   DispenserCodeA:string='';
   DispenserCodeB:string='';
   Status:boolean;
   EffectiveDate:string;
   Cdate='';
   IsDateVisible: boolean = false;
   CurrentReadingA:string='';
   CurrentReadingB:string='';
   IsCReadingVisible: boolean = false;
   StatusIsfalse:boolean=false;
   DS:boolean=true;
   DSStatus =""
   exportList:any=[];
   sortingColumn:string="";
   sortingColumn1:string="";
   key: string = 'Name';
   key1: string = 'Name';
   reverse: boolean = true;
   reverse1: boolean = true;
   dataStationMaster:{}[];
   StationId:string='';
   dataStationTypeMaster:{}[];
   DispenserTypeId:string='';
   dataDispTypesA:{}[];
   DispenserTypeIdA:string='';
   dataDispTypesB:any=[];
   FinalDispTypesB:any=[];
   DispenserTypeIdB:string='';
   SelectedOrder:string='';
   SelectedStationId:string= '';
   historyPopup:boolean = false;
   actionFlag:string='';
   errorFound: boolean;
   SelectedDispenserId:string='';
   title: string;  
   fiterBox:boolean = false;
   filterBoxFlag:number = 0;
   stCodeMy:"";
   filter:string='';
   IsIconUp: boolean = true;
   IsIconDown: boolean = false;
   DisTypeOption:string='';
   IsDispenserCodeB:boolean = false;
   IsCReadingVisibleTypeB:boolean = false;
   uId:string="";
   jsonOrder = [
    { text: '1', value: '1' },  
    { text: '2', value: '2' },  
    { text: '3', value: '3' },  
    { text: '4', value: '4' },  
    { text: '5', value: '5' },  
    { text: '6', value: '6' },  
    { text: '7', value: '7' },  
    { text: '8', value: '8' },  
    { text: '9', value: '9' },   
    { text: '10', value: '10'},
    { text: '11', value: '11' },
    { text: '12', value: '12' },
    { text: '13', value: '13' },
    { text: '14', value: '14' },
    { text: '15', value: '15' },
    { text: '16', value: '16' },
    { text: '17', value: '17' },
    { text: '18', value: '18' },
    { text: '19', value: '19' },
    { text: '20', value: '20' }  
   ];
   monthNames = [
    "Jan", "Feb", "Mar",
    "Apr", "May", "Jun", "Jul",
    "Aug", "Sep", "Oct",
    "Nov", "Dec"
  ];
  constructor(private objDbServ: dbService,private objCook: CookieService) { 
    this.objDbServ.MasterCompDisplay.emit(true);
    this.objDbServ.HeaderDisplay.emit(true);
    this.objDbServ.LeftMenu.emit(true);    
  }
  options:DatepickerOptions = {
    minYear: 2018,
    locale: enLocale,
    displayFormat: 'DD-MMM-YYYY'
  };
  ngOnInit() {
     const dt = new Date();
     this.EffectiveDate = dt.getDate() + "/" + this.monthNames[dt.getMonth()] + "/" + dt.getFullYear();
    setTimeout(() => {this.getDispList();});
        $("#ab").click(function(){
            $("#tgt_div").animate({left: "0px"});
        });
        $("#DispenserCheck").click(function(){
            $("#tgt_div").animate({left:"55px"});
        });
        $("#ef").click(function(){
            $("#tgt_div").animate({left: "110px"});
        });
        $("#filter_input").click(function(){
          $("#filter_box").toggleClass("filter_box_show_hide");
        });        
        $("#myInput").on("keyup", function() {
          var value = $(this).val().toLowerCase();
          $("#myList li").filter(function() {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
          });
        });       
        $("#myList li").click(function(){
          var a = $(this).text();
          $("#filter_input").val(a);
          $("#filter_box").removeClass("filter_box_show_hide");
        });
    this.FinalDispTypesB=[];  
  }
  filterBoxShow(itm) {
    if(this.filterBoxFlag == 0) {
      this.fiterBox = true;
      this.filterBoxFlag = 1;
    }   
    else {
      this.fiterBox = false;
      this.filterBoxFlag = 0;
      this.stCodeMy = itm.StationCode;
      this.StationId = itm.StationId;
    }
  }
  OnDateChnage(val){
    const dt = new Date(val);
    this.EffectiveDate = dt.getDate() + "/" + this.monthNames[dt.getMonth()] + "/" + dt.getFullYear();   
  }
  filterCondition(search) {
    return search.toLowerCase().indexOf(this.searchText.toLowerCase()) != -1;
  }
  OnChangeStatus(evt, flag:string) {
    this.StatusIsfalse = evt.target.checked;
    if(flag=='swthActive') {
      this.DSStatus = '1';
    }
    else if(flag=='swthAll') {
      this.DSStatus = '';
    }
    else if(flag=='swthInActive') {
      this.DSStatus = '2';
    }
    this.getDispList();
  }
  OnChangeDisTypeB (evt) {
    this.DisTypeOption = evt;
    if(this.DisTypeOption == '0') {
      this.IsDispenserCodeB = true;
    }
    else {          
      this.IsDispenserCodeB= false;
    }
  }
  getDispList(){
    this.objDbServ.ShowLoaders.emit(true);
    this.objDbServ.getDispList({Flag: 'DispenserList', Status:this.DSStatus}).subscribe(
      (resp: Response) => {
        this.listDisp = JSON.parse(resp.json()).Table;
        this.objDbServ.ShowLoaders.emit(false);
      },
      (error) =>{alert('Something went wrong.');
      this.objDbServ.ShowLoaders.emit(false);
     }
    )
  }
  openPopupForUpdate(DispId:string){
    this.uId = DispId;
    this.actionFlag = 'Update';
    this.SelectedDispenserId = DispId;
    this.IsDateVisible  = true;
    this.IsDispenserCodeB= false;
    this.IsCReadingVisible= false;
    this.IsCReadingVisibleTypeB=false;
    this.FinalDispTypesB=[];
    this.SelectedOrder ='';
    this.getDisp(DispId);
  }
  addDisp(){
    this.title = 'Add Dispenser';
    this.actionFlag = 'Add';
    this.SelectedDispenserId = '0';
    this.StationId='';
    this.stCodeMy='';
    this.DispenserId = '';
    this.DispenserName = '';
    this.DispenserCode = '';
    this.DispenserCodeA =  '';
    this.DispenserCodeB =  '';
    this.DispenserTypeIdA = '';
    this.DispenserTypeIdB = '';
    this.IsDateVisible  = false;
    this.date=new Date();
    this.EffectiveDate=new Date().toLocaleDateString();
    this.Status = true;
    this.CurrentReadingA='0';
    this.CurrentReadingB='0';
    this.IsDispenserCodeB= false;
    this.IsCReadingVisible= false;
    this.FinalDispTypesB=[];
    this.getDisp('0');
  }
  getDisp(DispId:string){
    this.objDbServ.ShowLoaders.emit(true);
    this.objDbServ.getDispList({Flag: 'DispenserById', Id: DispId}).subscribe(
      (resp: Response) => {
        if(JSON.parse(resp.json()).Table.length > 0){
          const retData = JSON.parse(resp.json()).Table[0];
          this.DispenserId = retData.DispenserId;
          this.DispenserName = retData.DispenserName;
          this.DispenserCode = retData.DispenserCode;
          this.DispenserCodeA =  retData.DispenserCodeA;
          this.DispenserCodeB =  retData.DispenserCodeB;
          this.DispenserTypeIdA = retData.DispenserTypeIdA;
          this.DispenserTypeIdB = retData.DispenserTypeIdB;
          this.StationId = retData.StationId;
          this.stCodeMy = retData.StationCode;
          this.Status = (retData.DS == '2') ? false: true;
          this.date = (retData.DS == '2') ? new Date(): retData.EffectiveDate;
          this.EffectiveDate = retData.EffectiveDate;
          this.CurrentReadingA= retData.CurrentReadingA;
          this.CurrentReadingB= retData.CurrentReadingB;
          this.IsCReadingVisible = true;
          this.title = 'Update Dispenser';
        }
        this.dataStationMaster = JSON.parse(resp.json()).Table1;
        this.dataDispTypesA = JSON.parse(resp.json()).Table2;
        this.dataDispTypesB = JSON.parse(resp.json()).Table2;
        this.FinalDispTypesB.push({'DispanserTypeId': 0, 'DispanserTypeCode': 'None'});
        this.dataDispTypesB.forEach((element,i)=>{
          this.FinalDispTypesB.push({'DispanserTypeId':element.DispanserTypeId,'DispanserTypeCode':element.DispanserTypeCode})
        })
        this.objDbServ.ShowLoaders.emit(false);
      },
      (error) =>{alert('Something went wrong.')}
    )
  }
  saveDisp(){
    this.errorFound = true;
    if(this.validationDisp()){
      const obj = {
        DispenserId:(this.actionFlag == 'Update') ? this.SelectedDispenserId : '0',
        DispenserName:this.DispenserName.toUpperCase(),
        DispenserCode:this.DispenserCode,
        DispenserCodeA:this.DispenserCodeA,
        DispenserCodeB:this.DispenserCodeB,
        DispenserTypeIdA:this.DispenserTypeIdA,
        DispenserTypeIdB:this.DispenserTypeIdB,
        StationId:this.StationId,
        DispenserTypeId:this.DispenserTypeId,
        EffectiveDate : ((this.EffectiveDate == null) ? new Date().toLocaleDateString() : this.EffectiveDate),
        Status: ((this.Status == true) ?'1':'2'),
        CurrentReadingA : this.CurrentReadingA,
        CurrentReadingB : this.CurrentReadingB,
        OrderBy : 0
      };
    this.objDbServ.ShowLoaders.emit(true);
    this.objDbServ.addDispenser(obj).subscribe(
        (resp: Response) =>{
          const data = JSON.parse(resp.json());
          this.getDispList();
          if(data.Table[0].Meaasge.indexOf('successfully') > -1)
          {
            this.DispenserId = '';
            this.DispenserName = '';
            this.DispenserCode = '';
            this.DispenserCodeA =  '';
            this.DispenserCodeB =  '';
            this.DispenserTypeIdA = '';
            this.DispenserTypeIdB = '';
            this.StationId='';
            this.EffectiveDate=new Date().toLocaleDateString();
            this.Status = true;
            this.CurrentReadingA='0';
            this.CurrentReadingB='0';
            this.IsCReadingVisible = true;
            this.stCodeMy='';
            $("#DispenserCheck").prop("checked", true);
            this.DSStatus = '';
            $("#tgt_div").animate({left:"55px"});
            this.getDispList();
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
  GetDispHistory(DispId:string) {
    this.objDbServ.ShowLoaders.emit(true);
    this.historyPopup = true;
    this.objDbServ.GetDispHistory({Flag: 'DispenserHistory', Id: DispId, Status:0}).subscribe(
      (resp: Response) => {
        this.listDispHistory = JSON.parse(resp.json()).Table;
        this.objDbServ.ShowLoaders.emit(false);
      },
      (error) =>{alert('Something went wrong.');
      this.objDbServ.ShowLoaders.emit(false);
     }
    )
  }
  closeHistoryPop() {
    this.historyPopup = false;
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
  validationDisp(){
    var specials=/[*|\":<>[\]{}`\\()';@&$~!]/;
    var re = new RegExp(/^[a-zA-Z0-9_]*$/);
    var rn = new RegExp(/^[0-9_]*$/);
    if(this.DispenserName == ''){
      alert('Dispenser name must be filled.');
      this.errorFound = false;
      return this.errorFound;
    }
    else if (specials.test(this.DispenserName)){
      alert('Invalid Dispenser Name.');
      this.errorFound = false;
      return this.errorFound;
    }
    else if (re.test(this.DispenserName)){
        alert('Invalid Dispenser Name.');
        this.errorFound = false;
        return this.errorFound;
    }
    if(this.DispenserCode == ''){
      alert('Equipment Number must be filled.');
      this.errorFound = false;
      return this.errorFound;
    }
    else if (!rn.test(this.DispenserCode)){
        alert('Invalid Equipment Number.');
        this.errorFound = false;
        return this.errorFound;
    }
    else if (this.DispenserTypeIdA == ''){
      alert('Please select Dispenser Type Code A.');
      this.errorFound = false;
      return this.errorFound;
    } 
    else if (this.DispenserCodeA == ''){
      alert('Dispenser Code A must be filled.');
      this.errorFound = false;
      return this.errorFound;
    }    
    else if (this.DispenserTypeIdB == '' && Number(this.DispenserTypeIdB) < 0){
      alert('Please select Dispenser Type Code B.');
      this.errorFound = false;
      return this.errorFound;
    } 
    else if(Number(this.DisTypeOption) != 0) {
      if (this.DispenserCodeB == ''){
       alert('Dispenser Code B must be filled.');
       this.errorFound = false;
       return this.errorFound;
     }
   }
    else if (isNullOrUndefined(this.stCodeMy) || this.stCodeMy == '' || this.StationId=='0' || isNullOrUndefined(this.StationId)){
      alert('Please select station.');
      this.errorFound = false;
      return this.errorFound;
    }   
    return this.errorFound;
  }
  exportFile() {
    this.exportList = [];
    if(this.listDisp.length > 0)
    {
      this.listDisp.forEach((element,i)=>{
        this.exportList.push({'SrNo':i+1,'DispenserName':element.DispenserName,'DispenserCodeA':element.DispenserCodeA,'DispenserCodeB':element.DispenserCodeB,'DispanserTypeCodeADisp':element.DispanserTypeCodeADisp,'DispanserTypeCodeBDisp':element.DispanserTypeCodeBDisp,'StationName':element.StationName,'StationCode':element.StationCode,'Status':element.StatusSort,'Dispenser Equipment Number':element.DispenserCode })
      })
      var head = ['Sr. No.', 'Dispenser Name', 'Dispenser Code A','Dispenser Code B','Dispenser Type Code A','Dispenser Type Code B','Station Name',' Station Code','Status','Dispenser Equipment Number'];  
      var filename = 'Dispenser_Management_'+this.objCook.get('CurrentDate');
      new ngxCsv(this.exportList, filename, {headers: (head)});
   }
   else{
    alert('No Data available to export.!');
   }
 }
}