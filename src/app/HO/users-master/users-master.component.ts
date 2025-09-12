import { Component, OnInit } from '@angular/core';
import { dbService } from '../../Service/db.service';
import { Response } from '@angular/http';
import { CookieService } from 'ngx-cookie-service';
import { ngxCsv } from 'ngx-csv/ngx-csv';
import { isNullOrUndefined, isNumber } from 'util';
import { NumberFormatStyle } from '@angular/common';
declare var $:any;
@Component({
  selector: 'app-users-master',
  templateUrl: './users-master.component.html',
  styleUrls: ['./users-master.component.css']
})
export class UsersMasterComponent implements OnInit {
  listUsers:any=[];
  listPermision:any=[];
  StationList:any=[];
  exportList:any=[];
  flag:string = '';
  CDate:string;
  UserCode: string = '';
  UserName: string= '';
  errorFound: boolean;
  selectedUserId:string='';
  errMsg:string='';
  title: string;
  UsersPopup:boolean = false;
  StatusIsfalse:boolean=false;
  key: string = 'Name';
  reverse: boolean = true;
  filter:string='';
  uId:string="";
  sortingColumn:string="";
  UserId:string="";
  LoginId:string="";
  DS:boolean=true;
  Status:string ='';
  selectedPermision:string='';
  selectedStation:string='';
  ConfPassword:string='';
  Password:string='';
  IsStationDisable:boolean=true;
  EmailId:string='';
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
    this.getUsers();
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
  this.getUsers();
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
onStationSelect(val){
  this.selectedStation = val;
}
getUsers() {
  this.objDbServ.getAlluserDetsils({Flag: 'AlluserDetsils', Id: 0, Status:this.Status}).subscribe(
    (resp: Response) => {
      const data= JSON.parse(resp.json()).Table;
      if(data.length>0) {
        this.listUsers=JSON.parse(resp.json()).Table
      }
      else
        alert("No data found.!")
    },
    (error) => {alert("Something went wrong.");
      this.objDbServ.ShowLoaders.emit(false);
    }
  )
}
openAddUsers() {
    this.title = 'Add';
    this.UsersPopup = true;
    this.flag = 'I';
    this.LoginId='';
    this.UserCode = '';
    this.EmailId='';
    this.UserName = ''; 
    this.Password=''; 
    this.ConfPassword='';
    this.DS = true; 
    this.stCodeMy='';
    this.getPermision();  
}
openUpdatePopup(itm, Popup:string) {
  if(itm.Name == 'Administrator') {
    alert("Administrator login details cant be update/change.!");
    return;
  }
  if(itm.Name == 'Financial Administrator'){
    alert(" Financial Administrator login details cant be update/change.!");
    return;
  }
  else {
    this.getUsers();
    this.getPermision(); 
    this.title = 'Update';
    this.UsersPopup= true;
    this.flag = 'U';
    this.selectedUserId = itm.UserId; 
    this.LoginId=itm.LoginId;
    this.UserCode = itm.EmpCode;
    this.EmailId = itm.EmailId;
    this.UserName = itm.Name;
    this.Password= itm.UserPassword;
    this.ConfPassword=itm.UserPassword;
    this.selectedPermision = itm.DepartmentId;
    if(itm.DepartmentCode== 'SOP' || itm.DepartmentCode== 'SO')
      this.IsStationDisable = false;
    else
      this.IsStationDisable = true;
    this.selectedStation = itm.StationId;
    this.stCodeMy = itm.Name;
    this.DS = (itm.Status == 'Active')? true: false;
  }
}
onPermisionSelect(val){
  this.selectedPermision = val; 
  if(this.selectedPermision=='4' || this.selectedPermision=='5')
      this.IsStationDisable = false;
  else {
    this.IsStationDisable = true;
    this.selectedStation='';
  }     
}
save() {
  if (this.flag == 'I')
      this.insertUser();
    else if (this.flag == 'U')
      this.updateUser();
}
insertUser(){
  this.errorFound = true;
  if(this.ValidationUsers()) {
      const obj = {
      Id:(this.flag == 'U') ? this.selectedUserId : '0',
      EmployeeCode:this.UserCode,
      LoginId :this.LoginId,
      Name:this.UserName,   
      EmailId: this.EmailId,
      Password:this.ConfPassword, 
      UserId:this.objCook.get('UID'),
      PermissionId: this.selectedPermision,
      StationId: this.selectedStation,
      Status: (this.DS==true) ? 1 : 2
      };
      this.objDbServ.ShowLoaders.emit(true);
      this.objDbServ.InsertUser(obj).subscribe(
        (resp: Response) =>{
          const data = JSON.parse(resp.json());
          if(data.Table[0].Mesage.indexOf('Successfully') > -1)
          {
            this.UsersPopup = false;
            this.getUsers();
            this.LoginId = '';
            this.UserCode='';
            this.UserName='';
            this.Password='';
            this.ConfPassword='';
            this.selectedPermision='';
            this.selectedStation ='';
            $("#UsersCheck").prop("checked", true);
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
updateUser(){
  this.errorFound = true;
  if(this.ValidationUsers()) { 
    const obj = {
      Id:(this.flag == 'U') ? this.selectedUserId : '0',
      EmployeeCode:this.UserCode,
      LoginId :this.LoginId,
      Name:this.UserName,  
      EmailId: this.EmailId,
      Password:this.ConfPassword,   
      UserId:this.objCook.get('UID'),
      PermissionId: this.selectedPermision,
      StationId: this.selectedStation,
      Status: (this.DS==true) ? 1 : 2
      };
      this.objDbServ.ShowLoaders.emit(true);
      this.objDbServ.UpdateUser(obj).subscribe(
        (resp: Response) =>{
          const data = JSON.parse(resp.json());
          if(data.Table[0].Mesage.indexOf('successfully') > -1)
          {
            this.UsersPopup = false;
            this.listUsers=[];
            this.getUsers();
            this.LoginId = '';
            this.UserCode='';
            this.UserName='';
            this.Password='';
            this.ConfPassword='';
            this.selectedPermision='';
            this.selectedStation ='';
            $("#UsersCheck").prop("checked", true);
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
sortCol(key:string){
  this.sortingColumn = key;
  this.key = key;
  this.reverse = !this.reverse;
}
ValidationUsers(){
    var re = new RegExp(/^[a-zA-Z ]*$/);
  if((this.LoginId =='' || isNullOrUndefined(this.LoginId))) {
    alert('Login id must be entered..');
      this.errorFound = false;
  }
  if((this.EmailId =='' || isNullOrUndefined(this.EmailId))) {
    alert('Email Id must be entered..');
      this.errorFound = false;
    }
  else if(this.UserCode == ''){
      alert('Emp code must be entered.');
      this.errorFound = false;
    }
   else if(this.UserName == ''){
      alert('User Name Must be entered.');
      this.errorFound = false;
    }
    else if(this.Password == ''){
    alert('Password Must be entered.');
      this.errorFound = false;
    }
    else if(this.ConfPassword == ''){
    alert('Confirm Password Must be entered.');
      this.errorFound = false;
    }
    else if(this.ConfPassword != this.Password){
    alert('Password and Confirm Password must be same.');
      this.errorFound = false;
    }
    else if(this.selectedPermision == '' || isNullOrUndefined(this.selectedPermision)){
      alert('User Permission Type must be seleted.');
      this.errorFound = false;
    }  
    else if(this.selectedPermision == '5') { 
      if(this.stCodeMy=='') {
        alert('Station must be selected.');
        this.errorFound = false;
      }  
    }     
    if (this.EmailId != '' && this.EmailId != null){
      const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      const isValidated = this.EmailId.match(mailformat);
      if(isValidated==null) {
        alert('You have entered an invalid email address.');
        this.errorFound = false;
        return this.errorFound;
      } 
    }
    return this.errorFound;
}
exportFile() {
  this.exportList = [];
  if(this.listUsers.length > 0)
  {
      this.listUsers.forEach((element,i)=>{
        this.exportList.push({'SrNo':i+1, 'LoginId': element.LoginId,'EmpCode':element.EmpCode,'Name':element.Name, 'Permission':element.DepartmentCode, 'Status': element.Status})
      })
      var head = ['Sr. No.', 'Login Id', 'Emp Code', 'Name', 'Permission','Status'];  
      var filename = 'User_Management_'+this.CDate;
      new ngxCsv(this.exportList, filename, {headers: (head)});
  }
  else {
    alert('No Data available to export.!');
  }
}
}
