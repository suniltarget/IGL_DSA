import { Component, OnInit } from '@angular/core';
import {Response} from '@angular/http';
import { dbService } from '../Service/db.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
declare var $:any;
@Component({
  selector: 'app-left-pane',
  templateUrl: './left-pane.component.html',
  styleUrls: ['./left-pane.component.css']
})
export class LeftPaneComponent implements OnInit {
  selectedMenuUrl='';
  arrMenus: any[] ;
  UserIdCook: string;
  dashboardSubMenu:boolean = false;
  menuId:number = 0;
  togglemenu:boolean=false;
  cssclass:string ="";
  Mid:string="";
  constructor(private objDbServ: dbService, private objRoute: Router, 
    private objCook: CookieService) { }
  ngOnInit() {
    this.selectedMenuUrl = "DashBoard";
    this.UserIdCook = this.objCook.get('UID');
    if(this.UserIdCook=='0'){
      this.objRoute.navigate(['']);
      return false;
    }
    this.getMenus();
    this.objDbServ.SelectMenu.subscribe(
      (goToURL: string)  => {this.selectedMenuUrl = goToURL;}
    )
  }
  getMenus(){
    var LoginId = localStorage.getItem('LoginId');
    this.objDbServ.getMenus({UserID: this.UserIdCook}).subscribe(
        (response: Response)=>{
          if(this.selectedMenuUrl=='') 
            this.selectedMenuUrl=JSON.parse(response.json()).Table[0].URL
            this.arrMenus = JSON.parse(response.json()).Table;
            if(JSON.parse(response.json()).Table3 != undefined){
              this.objCook.set('StationId',JSON.parse(response.json()).Table3[0].StationId);
            }
            this.arrMenus.forEach((element, index) => {
              if((LoginId == 'admin'  || LoginId == 'Admin' ) && element.MenuName == 'Entry DSA') {
                this.arrMenus.splice(this.arrMenus.indexOf(element), 1);
              }
              if((LoginId == 'finadmin'  || LoginId == 'FinAdmin' ) && element.MenuName == 'Entry DSA') {
                this.arrMenus.splice(this.arrMenus.indexOf(element), 1);
              }
              if((LoginId.toLowerCase().indexOf('cr') > -1) && element.MenuName == 'Other Jump') {
                element = element.ParentId = 0;
              }
              if((LoginId.toLowerCase().indexOf('cr') > -1) && element.MenuName == 'Report DPR') {
                element = element.ParentId = 0;
              }
              if((LoginId.toLowerCase().indexOf('cr') > -1) && element.MenuName == 'Activity Log DPR') {
                element = element.ParentId = 0;
              }
              if((LoginId.toLowerCase().indexOf('mo') > -1) && element.MenuName == 'Dashboard AMO') {
                element = element.ParentId = 0;
              }
              if((LoginId.toLowerCase().indexOf('mo') > -1) && element.MenuName == 'Activity Log DSA') {
                element = element.ParentId = 0;
              }
              if((LoginId.toLowerCase().indexOf('mo') > -1) && element.MenuName == 'Report DSA') {
                element = element.ParentId = 0;
              }
              if((LoginId.toLowerCase().indexOf('mo') > -1) && element.MenuName == 'Dispenser Jump') {
                element = element.ParentId = 0;
              }
              if(LoginId.substring(0,4)== '1001' && element.URL == 'DashboardCO') {
                this.arrMenus.splice(this.arrMenus.indexOf(element), 1);
              }
            });
          if( this.arrMenus.length == 0){
            alert('Something wrong went while getting menus.');
          }
        },
        (error)=>{alert('something went wrong.');}
    );
  }
  logoff(){
    if (confirm("Do You Want To Logout ?") == true) {
      this.objDbServ.MasterCompDisplay.emit(false);
      this.objCook.set('UID', '');
      this.objRoute.navigate(['']);
    }
  }
  showContentPage(componentToOpen:any){    
    if(componentToOpen.URL != '' && componentToOpen.URL != null){
      this.objRoute.navigate([componentToOpen.URL]);    
      this.objDbServ.SelectMenu.emit(componentToOpen.URL);
    }else{
      this.menuId = componentToOpen.MenuId;
    }
  }
  showhide(id) {
    this.Mid = id;
    this.arrMenus.forEach(element => {
      if(element.ParentId == id) {
        $(document.getElementById(element.MenuId)).slideToggle();
      }
    })
    if(this.togglemenu) {
      this.togglemenu = false;
    }else {
      this.togglemenu = true;
    }
  }
  Getfunct() {
    return this.objDbServ.highlight;
  }
}
