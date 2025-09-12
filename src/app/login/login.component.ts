import { Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import { dbService } from '../Service/db.service';
import {Response} from '@angular/http';
import { CookieService } from 'ngx-cookie-service';
declare var $:any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  StationCode:string = '';
  EmployeeCode:string = '';
  Password:string = '';
  loginLoader: boolean = false;
  forgotPassmsg:string="";
  stationId:string="";
  empField:boolean = true;
  constructor(private objRoute: Router, private objDbServ: dbService, private objCook: CookieService) {
    this.objDbServ.MasterCompDisplay.emit(false);
    this.objDbServ.ShowBorder.emit(false);
  }
  ngOnInit() {
    $('html').keypress(function (e) {
      if (e.which == 13)  
          $('#btn-login').click();
  });
  this.objCook.set('UID', '0');
	this.showLoader();
  	$("#forgPass").click(function(){
		$("#forgPassPopup").show();
	});
	$("#ForgCloseBtn").click(function(){
		$("#forgPassPopup").hide();
	});
  }
  showLoader() {
    $('#loader').show();
    setTimeout(function () {
        $('#loader').hide();
    }, 3000)
  }
  hideEmployeeCode() {
    if(this.StationCode == 'admin' || this.StationCode =='finadmin' || this.StationCode == 'JMRAdmin') {
      this.empField = false;
    }
    else {
      this.empField = true;
    }
  }
  login(){
    if(this.StationCode=='') {
      alert('Please Enter Station Code');
      return;
    }
    if(this.EmployeeCode=='' && this.StationCode != 'admin' && this.StationCode != 'finadmin' && this.StationCode != 'JMRAdmin') {
      alert('Please Enter Employee Code');
      return;
    }
    if(this.Password=='') {
      alert('Please Enter Password');
      return;
    }
    this.objCook.set('LoginCode', this.StationCode);
    this.loginLoader = true;
    this.objDbServ.login({LoginId: this.StationCode, EmployeeCode: this.EmployeeCode, Password: this.Password}).subscribe(
        (response: Response)=>{
          const data = JSON.parse(response.json());
          if(data[0].Meaasge == undefined)
          {
              this.objCook.set('stationCode', data[0].StationCode);
              this.objCook.set('DepartmentCode', data[0].DepartmentCode);
              this.objCook.set('stationId', data[0].StationId);
              this.objCook.set('SId', data[0].StationId);
              this.objCook.set('LoginId', data[0].LoginId);
              this.objDbServ.globalUserid = data[0].UserId;
              this.objRoute.navigate([data[0].Redirect]);
              this.objCook.set('UID', data[0].UserId);
              this.objCook.set('ShiftId','-1');
              this.objCook.set('SubShiftId','-1');
              this.objCook.set('SummeryDate',data[0].SummeryDate);
              this.objCook.set('CurrentDate',data[0].CurrentDate);
              this.objCook.set('CurrentDateTime',data[0].CurrentDateTime);
              this.objDbServ.ShowBorder.emit(true);
              this.loginLoader = false;
              localStorage.setItem('LoginId',this.StationCode);
              sessionStorage.setItem('globalDetail', JSON.stringify(data[0]));
              this.GetStationDetail();
          }
          else{
            alert(data[0].Meaasge.replace('Error:', ''));
            this.loginLoader = false;
          }
        },
        (error)=>{
          this.loginLoader = false;
        }
    );
  }
  GetStationDetail () {
    var MyJson = { LoginId: this.StationCode };
    this.objDbServ.GetStationDetail(MyJson).subscribe(
      (resp: any) => {
        const data = JSON.parse(resp.json());
        sessionStorage.setItem('globalDetail', JSON.stringify(data.Table));
        sessionStorage.setItem('leftMenus', JSON.stringify(data.Table1));
        sessionStorage.setItem('StationMenus', JSON.stringify(data.Table2));
        sessionStorage.setItem('AllStation', JSON.stringify(data.Table3));
      },
      (error) => {alert("Something went wrong.");
       this.objDbServ.ShowLoaders.emit(false);
      }
    )
  }
  forgotPassword() {
    if(confirm('Are You Sure, Want to Reset Your Password ?')) {
    if(this.stationId != '') {
      this.objDbServ.forgotPassword({Id: this.stationId}).subscribe(
        (response: Response)=>{
          const data = JSON.parse(response.json());
          this.forgotPassmsg = data.Table[0].Message;
          if(this.forgotPassmsg == 'Invalid Station ID.!') {
            alert(this.forgotPassmsg);
          }else {
            alert(this.forgotPassmsg);  
            $("#forgPassPopup").hide();
          }
        },
        (error)=>{
          this.loginLoader = false;
        }
    );
  }
  else {
    alert('Please Enter Station ID');
  }
 }
}
}
