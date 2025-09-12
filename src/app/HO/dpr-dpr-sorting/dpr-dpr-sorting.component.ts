import { Component, OnInit } from '@angular/core';
import { dbService } from '../../Service/db.service';
import { Response } from '@angular/http';
import { CookieService } from 'ngx-cookie-service';
import { isUndefined } from 'util';
declare var $:any;
@Component({
  selector: 'app-dpr-dpr-sorting',
  templateUrl: './dpr-dpr-sorting.component.html',
  styleUrls: ['./dpr-dpr-sorting.component.css']
})
export class DPRDprSortingComponent implements OnInit {
  listRegions:any=[];
  listCompanies:any=[];
  listStations:any=[];
  sortingJson:any=[];
  error:any=[];
  flag:string= 'R';
  code:string= '';
  IsRegionDisable:boolean=false;
  IsCompanyDisable:boolean=true;
  IsStationDisable:boolean=true;
  RegionName:string="";
  CompanyId:string="";
  constructor(private objDbServ: dbService, private objCook: CookieService) {
    this.objDbServ.MasterCompDisplay.emit(true);
    this.objDbServ.HeaderDisplay.emit(true);
    this.objDbServ.LeftMenu.emit(true);
  }
  ngOnInit() {
    setTimeout(() => {
      this.getSortingData();
    });
  }
  getSortingData(){
    this.objDbServ.getSortingData({Code:this.code, flag: this.flag}).subscribe(
      (resp: Response) => {
        if(this.flag=='R'){
          this.listRegions=JSON.parse(resp.json()).Table 
        }
        else if(this.flag=='C'){
          this.listCompanies=JSON.parse(resp.json()).Table  
        } 
        else if(this.flag=='S'){
          this.listStations=JSON.parse(resp.json()).Table  
        }
      },
      (error) => {alert("Something went wrong.");
      this.objDbServ.ShowLoaders.emit(false);
      }
    )
  }
  saveSorting(Saveflag){
    if (Saveflag == 'R') {
      this.RegionName = '';
       this.sortingJson = this.listRegions;
       this.flag = 'R'
       this.SaveDPRSorting(); 
    }    
    else if (Saveflag == 'C') {
      this.CompanyId = '';
      this.flag = 'C'
      this.sortingJson = this.listCompanies;
      this.SaveDPRSorting(); 
    }   
    else if(Saveflag == 'S') { 
      this.flag = 'S'
      this.sortingJson = this.listStations;
      this.SaveDPRSorting(); 
    }     
  }
  GetCompanies(flag:string, itm) {
    this.RegionName = itm;
    this.CompanyId = '';
    this.IsCompanyDisable=false;
    this.IsStationDisable=true;
    this.flag=flag;
    this.code=itm;
    this.getSortingData();
  }
  GetStations(flag:string, itm) {
    this.CompanyId = itm;
    this.IsStationDisable=false;
    this.flag=flag;
    this.code=itm;
    this.getSortingData();
  }
  SaveDPRSorting() {
     this.error = this.dprSortingValidation(this.sortingJson, this.flag);
     if(this.error.msg != '') {
        alert(this.error.msg);
        return;
     }
     else {
        const obj = {
        flag: this.flag,
        Sorting: this.sortingJson,    
        UserId: this.objCook.get('UID')
       };
       this.objDbServ.ShowLoaders.emit(true);
       this.objDbServ.SaveDPRSorting(obj).subscribe(
         (resp: Response) =>{
           const data = JSON.parse(resp.json());
           if(data.Status.indexOf('successfully') > -1)
           {
              if(this.flag=='R'){
                this.IsCompanyDisable = true;
                this.IsStationDisable = true;
              }
             else if(this.flag == 'C'){
                this.IsCompanyDisable = false;
                this.IsStationDisable=true;
              }
             this.flag='R'
             this.code='';
             this.sortingJson=[]; 
             this.getSortingData();
           }
            alert(this.pascal(data.Status.toString()));
            this.objDbServ.ShowLoaders.emit(false);
       },
         (error) =>{
           alert('Something went wrong.');
           this.objDbServ.ShowLoaders.emit(false);
         }
       )
    }   
  }
  dprSortingValidation(sortingJson, flag) {
      var err = { msg: '' };
      for (var i = 0; i < sortingJson.length; i++) {
          var sortingNumber = '', Name = 'Unknown', nextName = '';
          if (flag == 'R') {
              sortingNumber = sortingJson[i].RegionSort;
              Name = sortingJson[i].RegionName;
          }
          if (flag == 'C') {
              sortingNumber = sortingJson[i].CompanySort;
              Name = sortingJson[i].CompanyName;
          }
          if (flag == 'S') {
              sortingNumber = sortingJson[i].StationSort
              Name = sortingJson[i].StationName;
          }
          if (sortingNumber == "0")
              return err = { msg: 'Sorting can not be 0 for ' + Name + '.' };
          else if (sortingNumber == '') {
              return err = { msg: 'Sorting can not be blank for ' + Name + '.' };
          }
          else {
              if (!isNaN(parseInt(sortingNumber) ) == false) {
                  return err = { msg: 'Invalid sorting for ' + Name + ', sorting only can be positive integer.' };
              }
              if (sortingNumber.toString().indexOf('.') > -1) {
                  return err = { msg: 'Invalid sorting for ' + Name + ', decimal value not allowed for sorting.' };
              }
          }
      }
      if (flag == 'R')
      sortingJson = this.sortBy(sortingJson,'RegionSort'); 
      if (flag == 'C')
      sortingJson = this.sortBy(sortingJson,'CompanySort'); 
      if (flag == 'S')
      sortingJson = this.sortBy(sortingJson,'StationSort'); 
      for (var i = 0; i < sortingJson.length; i++) {
          var Name = 'Unknown', nextName = 'Unknown';
          if (i < sortingJson.length - 1) {
              if (flag == 'R') {
                  if (sortingJson[i].RegionSort == sortingJson[i + 1].RegionSort) {
                      Name = sortingJson[i].RegionName;
                      nextName = sortingJson[i + 1].RegionName;
                      return err = { msg: 'Duplicate Sorting Found Between ' + Name + ' And ' + nextName + '.' };
                  }
              }
              if (flag == 'C') {
                  if (sortingJson[i].CompanySort == sortingJson[i + 1].CompanySort) {
                      Name = sortingJson[i].CompanyName;
                      nextName = sortingJson[i + 1].CompanyName;
                      return err = { msg: 'Duplicate Sorting Found Between ' + Name + ' And ' + nextName + '.' };
                  }
              }
              if (flag == 'S') {
                  if (sortingJson[i].StationSort == sortingJson[i + 1].StationSort) {
                      Name = sortingJson[i].StationName;
                      nextName = sortingJson[i + 1].StationName;
                      return err = { msg: 'Duplicate Sorting Found Between ' + Name + ' And ' + nextName + '.' };
                  }
              }
          }
      }
      return err;
  }
  sortBy(arr:any=[], field:string) {
    arr.sort((a: any, b: any) => {
    if (a[field] < b[field]) {
      return -1;
    } 
    else if(a[field] > b[field]) {
      return 1;
    }
    else {
      return 0;
    }
  });
    return arr;
 }
 pascal(str:string) {
  return str.replace(/\w+/g,
  function(w){return w[0].toUpperCase() + w.slice(1).toLowerCase();});
}
}
