import { Component, OnInit } from '@angular/core';
import { dbService } from '../../Service/db.service';
import { Response } from '@angular/http';
import { CookieService } from 'ngx-cookie-service';
import { ngxCsv } from 'ngx-csv/ngx-csv';
declare var $:any;
@Component({
  selector: 'app-dpr-control-office',
  templateUrl: './dpr-control-office.component.html',
  styleUrls: ['./dpr-control-office.component.css']
})
export class DPRControlOfficeComponent implements OnInit {
  listCRRooms:any=[];
  flag:string = '';
  CRcode: string = '';
  CRname: string= '';
  errorFound: boolean;
  selectedCRoomId:string='';
  errMsg:string='';
  title: string;
  CRoomPopup:boolean = false;
  StatusIsfalse:boolean=false;
  key: string = 'Name';
  reverse: boolean = true;
  filter:string='';
  exportList:any=[];
  uId:string="";
  sortingColumn:string="";
  Latitude:string="";
  Longitude:string="";
  constructor(private objDbServ: dbService, private objCook: CookieService) {
    this.objDbServ.MasterCompDisplay.emit(true);
    this.objDbServ.HeaderDisplay.emit(true);
    this.objDbServ.LeftMenu.emit(true);
   }
  ngOnInit() {
    setTimeout(() => {
      this.getCRooms();
    });
  }
  OnChangeStatus(evt) {
    this.StatusIsfalse = evt.target.checked;
  }
  getCRooms() {
    this.objDbServ.getCRooms({}).subscribe(
      (resp: Response) => {
        this.listCRRooms=JSON.parse(resp.json()).Table
      },
      (error) => {alert("Something went wrong.");
       this.objDbServ.ShowLoaders.emit(false);
      }
    )
  }
 openUpdatePopup(itm, Popup:string) {
   this.uId = itm.Id;
    this.title = 'Update';
    this.CRoomPopup= true;
    this.flag = 'U';
    this.CRcode = itm.ControlRoomCode;
    this.CRname = itm.ControlRoomName;
    this.selectedCRoomId = itm.Id;  
    this.Latitude = itm.Latitude;
    this.Longitude = itm.Longitude;
 };
 openAddDisp() {
    this.title = 'Add';
    this.CRoomPopup = true;
    this.flag = 'I';
    this.CRcode = '';
    this.CRname = '';
  };
save () {
  if (this.flag == 'I')
      this.insertCR();
  else if (this.flag == 'U')
      this.updateCR();
}
insertCR(){
  this.errorFound = true;
  if(this.ValidationCRoom()) {
    const obj = {
      Id:(this.flag == 'U') ? this.selectedCRoomId : '0',
      CRCode:this.CRcode,
      CRname:this.CRname.toUpperCase(),    
      LoginId:this.objCook.get('UID'),
      Latitude:this.Latitude,
      Longitude:this.Longitude
     };
     this.objDbServ.ShowLoaders.emit(true);
     this.objDbServ.InsertCRoom(obj).subscribe(
       (resp: Response) =>{
         const data = JSON.parse(resp.json());
         if(data.Status.indexOf('successfully') > -1)
         {
           this.CRoomPopup = false;
           this.getCRooms();
           this.CRcode='';
           this.CRname='';
           this.Latitude='';
           this.Longitude='';
           this.selectedCRoomId='';
           $('.modal').modal('hide');
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
updateCR(){
  this.errorFound = true;
  if(this.ValidationCRoom()) {
    const obj = {
      Id:(this.flag == 'U') ? this.selectedCRoomId : '0',
      CRCode:this.CRcode,
      CRname:this.CRname.toUpperCase(),    
      LoginId:this.objCook.get('UID'),
      Latitude:this.Latitude,
      Longitude:this.Longitude
     };
     this.objDbServ.ShowLoaders.emit(true);
     this.objDbServ.UnsertCRoom(obj).subscribe(
       (resp: Response) =>{
         const data = JSON.parse(resp.json());
         if(data.Status.indexOf('successfully') > -1)
         {
            this.CRoomPopup = false;
            this.listCRRooms=[];
            this.getCRooms();
            this.CRcode='';
            this.CRname='';
            this.Latitude='';
           this.Longitude='';
            this.selectedCRoomId='';
            $('.modal').modal('hide');
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
  ValidationCRoom(){
    var re = new RegExp(/^[a-zA-Z ]*$/);
    if (!re.test(this.CRname)) {
        alert('Invalid Control Office Name.');
        this.errorFound = false;
    }
    var re = new RegExp(/^[0.0-9.9 ]*$/);
    if (!re.test(this.Latitude)) {
        alert('Invalid Latitude.');
        this.errorFound = false;
    }
    var re = new RegExp(/^[0.0-9.9 ]*$/);
    if (!re.test(this.Longitude)) {
        alert('Invalid Longitude.');
        this.errorFound = false;
    }
    else if(this.CRcode == ''){
      alert('Control Office Code must be entered.');
      this.errorFound = false;
    }
    else if(this.CRname == ''){
      alert('Control Office Name must be entered.');
      this.errorFound = false;
    }
    else if(this.Latitude == ''){
      alert('Latitude must be entered.');
      this.errorFound = false;
    }
    else if(this.Longitude == ''){
      alert('Longitude must be entered.');
      this.errorFound = false;
    }
    return this.errorFound;
  }
  exportFile() {
    this.exportList = [];
    if(this.listCRRooms.length > 0)
    {
      this.listCRRooms.forEach((element,i)=>{
        this.exportList.push({'SrNo':i+1,'ControlOfficeCode':element.ControlRoomCode,'ControlOfficeName':element.ControlRoomName})
      })
      var head = ['Sr. No.', 'Control Office Code', 'Control Office Name'];  
      var filename = 'Control_Office_'+this.objCook.get('CurrentDate');
      new ngxCsv(this.exportList, filename, {headers: (head)});
    }
   else {
    alert('No Data available to export.!');
   }
 }
}