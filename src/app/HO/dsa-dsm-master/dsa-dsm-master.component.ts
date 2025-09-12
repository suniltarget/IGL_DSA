import { Component, OnInit } from '@angular/core';
import { dbService } from '../../Service/db.service';
import { Response } from '@angular/http';
import { CookieService } from 'ngx-cookie-service';
import { ngxCsv } from 'ngx-csv/ngx-csv';
declare var $:any;
@Component({
  selector: 'app-dsa-dsm-master',
  templateUrl: './dsa-dsm-master.component.html',
  styleUrls: ['./dsa-dsm-master.component.css']
})
export class DSADSMMasterComponent implements OnInit {
  listDSM:any=[];
  exportList:any=[];
  StationList:any=[];
  flag:string = '';
  DSMCode: string = '';
  DSMName: string= '';
  errorFound: boolean;
  selectedDSMnameId:string='';
  errMsg:string='';
  title: string;
  DSMPopup:boolean = false;
  StatusIsfalse:boolean=false;
  sortingColumn:string="";
  key: string = 'Name';
  reverse: boolean = true;
  filter:string='';
  uId:string="";
  DSMId:string="";
  DS:boolean=true;
  Status:string ='';
  CDate:string;
  selectedStation:string='';
  StationId:string='';
  fiterBox:boolean = false;
  filterBoxFlag:number = 0;
  stCodeMy:"";
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
      this.getDSM();
    });
    $(document).ready(function(){
      $("#ab").click(function(){
        $("#tgt_div").animate({left: "0px"});
      });
      $("#DSMCheck").click(function(){
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
      this.selectedStation = itm.StationId;
    }
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
    this.getDSM();
  }
  getDSM() {
    this.objDbServ.getDSMMaster({Flag: 'DSMForMO', Id: this.objCook.get('UID'), Status:this.Status}).subscribe(
      (resp: Response) => {
        this.listDSM=JSON.parse(resp.json()).Table
      },
      (error) => {alert("Something went wrong.");
       this.objDbServ.ShowLoaders.emit(false);
      }
    )
  }
  getStation() {
    this.objDbServ.getStation({Flag: 'StationListDSM', Id: this.objCook.get('UID'), Status:1}).subscribe(
      (resp: Response) => {
        this.StationList=JSON.parse(resp.json()).Table
      },
      (error) => {alert("Something went wrong.");
       this.objDbServ.ShowLoaders.emit(false);
      }
    )
  }
  onStationSelect(val){
    this.selectedStation = val;  
  }
  openAddDisp() {
    this.getStation();
     this.title = 'Add';
     this.DSMPopup = true;
     this.flag = 'I';
     this.DSMCode = '';
     this.DSMName = '';  
     this.DS = true; 
     this.stCodeMy='';  
     this.fiterBox = false;
  }
  openUpdatePopup(itm, Popup:string) {
    this.getStation();
     this.uId = itm.DSMId;
     this.title = 'Update';
     this.DSMPopup= true;
     this.flag = 'U';
     this.DSMCode = itm.DSMCode;
     this.DSMName = itm.DSMName;
     this.selectedDSMnameId = itm.DSMId; 
     this.selectedStation = itm.StationId;
     this.stCodeMy = itm.StationName;
     this.fiterBox = false;
     this.DS = (itm.Status == 'Active')? true: false;
  }
 save() {
   if (this.flag == 'I')
       this.insertCR();
   else if (this.flag == 'U')
       this.updateCR();
 }
 insertCR(){
   this.errorFound = true;
   if(this.ValidationDSM()) {
     const obj = {
       Id:(this.flag == 'U') ? this.selectedDSMnameId : '0',
       DSMCode:this.DSMCode,
       DSMName:this.DSMName,    
       UserId:this.objCook.get('UID'),
       Status: (this.DS==true) ? 1 : 2,
       StationId: this.selectedStation
      };
      this.objDbServ.ShowLoaders.emit(true);
      this.objDbServ.InsertUpdateDSM(obj).subscribe(
        (resp: Response) =>{
          const data = JSON.parse(resp.json());
          if(data.Table[0].Mesage.indexOf('successfully') > -1)
          {
            this.DSMPopup = false;
            this.getDSM();
            this.DSMCode='';
            this.DSMName='';
            this.selectedDSMnameId='';
            $("#DSMCheck").prop("checked", true);
            this.Status = '';
            $("#tgt_div").animate({left:"55px"});
            $('.modal').modal('hide');
          }
          alert(data.Table[0].Mesage);
          this.getDSM();
          this.objDbServ.ShowLoaders.emit(false);
      },
        (error) =>{
          alert('Something went wrong.');
          this.objDbServ.ShowLoaders.emit(false);
        }
      )
   }
 }
 updateCR(){
   this.errorFound = true;
   if(this.ValidationDSM()) { 
     const obj = {
       DSMId:(this.flag == 'U') ? this.selectedDSMnameId : '0',
       DSMcode:this.DSMCode,
       DSMname:this.DSMName,    
       UserId:this.objCook.get('UID'),
       Status: (this.DS==true) ? 1 : 2,
       StationId: this.selectedStation
      };
      this.objDbServ.ShowLoaders.emit(true);
      this.objDbServ.InsertUpdateDSM(obj).subscribe(
        (resp: Response) =>{
          const data = JSON.parse(resp.json());
          if(data.Table[0].Mesage.indexOf('successfully') > -1)
          {
             this.DSMPopup = false;
             this.listDSM=[];
             this.getDSM();
             this.DSMCode='';
             this.DSMName='';
             this.selectedDSMnameId='';
             $("#DSMCheck").prop("checked", true);
             this.Status = '';
             $("#tgt_div").animate({left:"55px"});
             $('.modal').modal('hide');
           }           
           alert(data.Table[0].Mesage);
           this.getDSM();        
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
  ValidationDSM(){
    var re = new RegExp(/^[a-zA-Z-. ]*$/);
    var re1 = new RegExp(/^[0-9]*$/);
    if (!re1.test(this.DSMCode)) {
        alert('Invalid DSM Code');
        this.errorFound = false;
    }
    else if (!re.test(this.DSMName)) {
        alert('Invalid DSM Name.');
        this.errorFound = false;
    }
    var re =new RegExp(/^[0-9]*$/);
    if(!re.test(this.DSMCode)){
      alert('p Code.');
      this.errorFound = false;
    }
    else if(this.DSMCode == ''){
      alert('DSM code must be entered.');
      this.errorFound = false;
    }
    else if(this.DSMName == ''){
      alert('DSM name be entered.');
      this.errorFound = false;
    }
    else if(this.stCodeMy == ''){
      alert('Station must be selected.');
      this.errorFound = false;
    }
    return this.errorFound;
  }
exportFile() {
    this.exportList = [];
    if(this.listDSM.length > 0) {
      this.listDSM.forEach((element,i)=>{
        this.exportList.push({'SrNo':i+1,'DSMCode':element.DSMCode,'DSMName':element.DSMName, 'Status': element.Status})
      })
      var head = ['Sr. No.', 'DSM Code', 'DSM Name', 'Status'];  
      var filename = 'DSM_Management_'+this.CDate;
      new ngxCsv(this.exportList, filename, {headers: (head)});
  }
  else {
    alert('No Data available to export.!');
  }
}
}
