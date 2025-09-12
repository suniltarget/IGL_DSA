import { Component, OnInit } from '@angular/core';
import { dbService } from '../../Service/db.service';
import { Response } from '@angular/http';
import { CookieService } from 'ngx-cookie-service';
import { ngxCsv } from 'ngx-csv/ngx-csv';
import { isNullOrUndefined, isNumber } from 'util';
import { NumberFormatStyle } from '@angular/common';
declare var $:any;
@Component({
  selector: 'app-dsa-mail-escalation',
  templateUrl: './dsa-mail-escalation.component.html',
  styleUrls: ['./dsa-mail-escalation.component.css']
})
export class DSAMailEscalationComponent implements OnInit {
  listMailEscalation:any=[];
  listPermision:any=[];
  StationList:any=[];
  exportList:any=[];
  errorFound: boolean;
  key: string = 'Name';
  reverse: boolean = true;
  filter:string='';
  uId:string="";
  Id:string="";
  sortingColumn:string="";
  flag:string = '';
  DS:boolean=true;
  Status:string ='';
  title: string; 
  CDate:string;
  UsersPopup:boolean=false;
  MailBody :string ='';
  selectedStamp:string ='';
  EscTypeFlag:string ='DSA';
  HierarcheyJson = [
    { Name: '1', value: '1' }, { Name: '2', value: '2' }, { Name: '3', value: '3' },
    { Name: '4', value: '4' }, { Name: '5', value: '5' }, { Name: '6', value: '6' },
    { Name: '7', value: '7' }, { Name: '8', value: '8' }, { Name: '9', value: '9' },{ Name: '10', value: '10' },
  ];
  TimeStamp = [
    { Name: 'AM', value: 'AM' }, { Name: 'PM', value: 'PM' }
  ];
  getTimeStats() {
    var minutes = [
                { min: '00' }, { min: '01' }, { min: '02' }, { min: '03' }, { min: '04' }, { min: '05' }, { min: '06' }, { min: '07' }, { min: '08' }, { min: '09' }, { min: '10' }, { min: '11' }, { min: '12' },
                { min: '13' }, { min: '14' }, { min: '15' }, { min: '16' }, { min: '17' }, { min: '18' }, { min: '19' }, { min: '20' }, { min: '21' }, { min: '22' }, { min: '23' }, { min: '24' },
                { min: '25' }, { min: '26' }, { min: '27' }, { min: '28' }, { min: '29' }, { min: '30' }, { min: '31' }, { min: '32' }, { min: '33' }, { min: '34' }, { min: '35' }, { min: '36' },
                { min: '37' }, { min: '38' }, { min: '39' }, { min: '40' }, { min: '41' }, { min: '42' }, { min: '43' }, { min: '44' }, { min: '45' }, { min: '46' }, { min: '47' }, { min: '48' },
                { min: '49' }, { min: '50' }, { min: '51' }, { min: '52' }, { min: '53' }, { min: '54' }, { min: '55' }, { min: '56' }, { min: '57' }, { min: '58' }, { min: '59' }
    ];
    var hours = [
        { hrs: '00' }, { hrs: '01' }, { hrs: '02' }, { hrs: '03' },{ hrs: '04' }, { hrs: '05' }, { hrs: '06' }, { hrs: '07' },
        { hrs: '08' }, { hrs: '09' }, { hrs: '10' }, { hrs: '11' },{ hrs: '12' }  
    ];
    var timeStats = {
        minutes: minutes,
        hours: hours
    };
    return timeStats;
  }
  RunHrs:any=[];
  RunMin:any=[];
  selectedRhHr:string='';
  selectedRhMin:string='';
  selectedDeptId:string='';
  SelectedHierarchey:string='';
  StatusIsfalse:boolean=false;
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
      this.getData();
      this.getPermision();
    });
    $(document).ready(function(){
      $("#ab").click(function(){
        $("#tgt_div").animate({left: "0px"});
      });
      $("#UsersCheck").click(function(){
        $("#tgt_div").animate({left:"55px"});
      });
      $("#ef").click(function(){
        $("#tgt_div").animate({left: "110px"});
        });
    });
    var timeStats = this.getTimeStats();
    this.RunHrs = timeStats.hours; 
    this.RunMin = timeStats.minutes;
    this.selectedRhHr = this.RunHrs[0]; 
    this.selectedRhMin = this.RunMin[0];
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
    this.getData();
  }
  getData() {
    this.objDbServ.getPermision({Flag: 'MailEscaltionData', Id: 0, Status:this.Status}).subscribe(
      (resp: Response) => {
        this.listMailEscalation=JSON.parse(resp.json()).Table
      },
      (error) => {alert("Something went wrong.");
       this.objDbServ.ShowLoaders.emit(false);
      }
    )
  }
  getPermision() {
    this.objDbServ.getPermision({Flag: 'PermisionType', Id: 0, Status:this.Status}).subscribe(
      (resp: Response) => {
        this.listPermision=JSON.parse(resp.json()).Table
        this.StationList= JSON.parse(resp.json()).Table1
      },
      (error) => {alert("Something went wrong.");
       this.objDbServ.ShowLoaders.emit(false);
      }
    )
  }
 openAdd() {
    this.getPermision(); 
    this.title = 'Add';
    this.UsersPopup = true;
    this.flag = 'I';
    this.EscTypeFlag = 'DSA';
    this.selectedDeptId = "";
    this.SelectedHierarchey = "";
    this.MailBody = "";
    var timeStats = this.getTimeStats();
    this.RunHrs = timeStats.hours; 
    this.RunMin = timeStats.minutes;
    this.selectedRhHr = "00";
    this.selectedRhMin = "00";
    this.selectedStamp = 'AM'; 
    this.DS = true;
 }
  openUpdatePopup(itm, Popup:string) {
    this.getPermision(); 
    this.Id = itm.ID;
    this.title = 'Update';
    this.UsersPopup= true;
    this.flag = 'U';
    this.EscTypeFlag = itm.Flag;
    this.selectedDeptId = itm.DepartmentId;
    this.SelectedHierarchey = itm.EscalationOrder
    var time  = itm.Time;
    var array = [];
    var array2 = [];
    array = time.split(':');
    this.selectedRhHr = array[0];
    var min = array[1]
    array2 = min.split(' ');
    this.selectedRhMin = array2[0];
    this.selectedStamp = array2[1];
    this.MailBody = itm.MailBody;
    this.DS = (itm.Status == 'Active')? true: false;
  }
  onPermisionSelect(val){
    this.selectedDeptId = val;     
  }
save() {
  if (this.flag == 'I')
      this.insertMailEscaltion();
   else if (this.flag == 'U')
      this.updateMailEscaltion();
}
insertMailEscaltion(){
  this.errorFound = true;
  if(this.ValidationUsers()) {
     const obj = {
        Id:(this.flag == 'U') ? this.Id : '0',
        DepartmentId: this.selectedDeptId,
        EscalationOrder : this.SelectedHierarchey,  
        Time: this.selectedRhHr +':' + this.selectedRhMin +' '+ this.selectedStamp,
        MailBody : this.MailBody,
        Flag : this.EscTypeFlag,
        Status: (this.DS==true) ? 1 : 2           
     };
     this.objDbServ.ShowLoaders.emit(true);
     this.objDbServ.insertMailEscaltion(obj).subscribe(
       (resp: Response) =>{
         const data = JSON.parse(resp.json());
         if(data.Table[0].Mesage.indexOf('Successfully') > -1)
         {
          this.UsersPopup = false;
          this.listMailEscalation=[];
          this.getData();
          this.ClearAll();
           $("#MailCheck").prop("checked", true);
           this.Status = '';
           $("#tgt_div").animate({left:"55px"});
           $('.modal').modal('hide');
         }
         alert(data.Table[0].Mesage);
         this.objDbServ.ShowLoaders.emit(false);
     },
       (error) =>{
         alert('Something went wrong.');
         this.objDbServ.ShowLoaders.emit(false);
       }
     )
  }
}
updateMailEscaltion(){
  this.errorFound = true;
  if(this.ValidationUsers()) { 
    const obj = {
      Id:(this.flag == 'U') ? this.Id : '0',
      DepartmentId: this.selectedDeptId,
      EscalationOrder : this.SelectedHierarchey,
      Time: this.selectedRhHr +':' + this.selectedRhMin +' '+ this.selectedStamp,
      MailBody : this.MailBody,
      Flag : this.EscTypeFlag,
      Status: (this.DS==true) ? 1 : 2,          
   };
     this.objDbServ.ShowLoaders.emit(true);
     this.objDbServ.updateMailEscaltion(obj).subscribe(
       (resp: Response) =>{
         const data = JSON.parse(resp.json());
         if(data.Table[0].Mesage.indexOf('Successfully') > -1)
         {
            this.UsersPopup = false;
            this.listMailEscalation=[];
            this.getData();
            this.ClearAll();
            $("#MailCheck").prop("checked", true);
            this.Status = '';
            $("#tgt_div").animate({left:"55px"});
            $('.modal').modal('hide');
          }           
          alert(data.Table[0].Mesage);        
          this.objDbServ.ShowLoaders.emit(false);
      },
       (error) =>{
         alert('Something went wrong.');
         this.objDbServ.ShowLoaders.emit(false);
       }
     ) 
  }
}
ClearAll() {
  this.EscTypeFlag = 'DSA';
  this.selectedDeptId = "";
  this.SelectedHierarchey = "";
  this.MailBody = "";
  this.selectedRhHr = "00";
  this.selectedRhMin = "00";
  this.selectedStamp = 'AM'; 
  this.DS = true;
}
sortCol(key:string){
  this.sortingColumn = key;
  this.key = key;
  this.reverse = !this.reverse;
}
exportFile() {
  this.exportList = [];
  if(this.listMailEscalation.length > 0)
  {
     this.listMailEscalation.forEach((element,i)=>{
       this.exportList.push({'SrNo':i+1,'Department':element.DepartmentName,'EscalationOrder':element.EscalationOrder, 'Time': element.Time, 'MailBody': element.MailBody, 'Escalation Type':element.Flag, 'Status':element.Status})
     })
     var head = ['Sr. No.', 'Department', 'Escalation Order', 'Time', 'MailBody', 'Escalation Type', 'Status'];  
     var filename = 'MailEscalation_Management_'+this.CDate;
     new ngxCsv(this.exportList, filename, {headers: (head)});
 }
 else {
   alert('No Data available to export.!');
 }
}
ValidationUsers(){
  var re = new RegExp(/^[a-zA-Z ]*$/);
   if(this.selectedDeptId == '' || isNullOrUndefined(this.selectedDeptId)){
    alert('Department must be seleted.');
    this.errorFound = false;
  } 
   else if(this.SelectedHierarchey == '' || isNullOrUndefined(this.SelectedHierarchey)){
     alert('Hierarchey must be seleted.');
     this.errorFound = false;
   }
   else if (this.selectedRhHr == '' || this.selectedRhHr == '00') {
     alert('Hours must be seleted..');
     this.errorFound = false;
   } 
   else if (this.selectedRhMin == '' || isNullOrUndefined(this.selectedRhMin)) {
     alert('Minutes must be seleted..');
     this.errorFound = false;
   }
   else if (this.selectedStamp == '' || isNullOrUndefined(this.selectedStamp)) {
    alert('AM/PM must be seleted..');
    this.errorFound = false;
   }
   else if (this.MailBody == '' || this.MailBody == '--Select--') {
    alert('Mail Body must be entered.');
    this.errorFound = false;
  }      
  return this.errorFound;
}
}
