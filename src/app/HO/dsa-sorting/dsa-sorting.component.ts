import { Component, OnInit } from '@angular/core';
import { dbService } from '../../Service/db.service';
import { Response } from '@angular/http';
import { CookieService } from 'ngx-cookie-service';
import { isUndefined } from 'util';
declare var $:any;
@Component({
  selector: 'app-dsa-sorting',
  templateUrl: './dsa-sorting.component.html',
  styleUrls: ['./dsa-sorting.component.css']
})
export class DSASortingComponent implements OnInit {
  listDispenser:any=[];
  listStations:any=[];
  sortingJson:any=[];
  error:any=[];
  flag:string= 'S';
  code:string= '';
  IsStationDisable:boolean=true;
  IsDispenserDisable:boolean=false;
  DispId:string="";
  StationName :string="";
  filter:string='';
  UserId:string= this.objCook.get('UID');
  DepartmentCode:string= this.objCook.get('DepartmentCode');
  LoginStationId:string= this.objCook.get('stationId');
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
    var json = {
      Code:this.code, 
      flag: this.flag,
      DepartmentCode :this.DepartmentCode,  
      LoginId : this.UserId      
    }
    this.objDbServ.getDSASortingData(json).subscribe(
      (resp: Response) => {
        if(this.flag=='S'){
          this.listStations=JSON.parse(resp.json()).Table 
        }
        else if(this.flag=='D'){
          this.listDispenser=JSON.parse(resp.json()).Table  
        }                
      },
      (error) => {alert("Something went wrong.");
      this.objDbServ.ShowLoaders.emit(false);
      }
    )
  }
  GetDispenser(flag:string, itm) {
    this.StationName = itm;
    this.DispId = '';
    this.IsDispenserDisable=false;
    this.IsStationDisable=true;
    this.flag=flag;
    this.code=itm;
    this.getSortingData();
  }
  saveSorting(Saveflag){
    if (Saveflag == 'S') {
      this.StationName = '';
       this.sortingJson = this.listStations;
       this.flag = 'S'
       this.SaveDPRSorting(); 
    }    
    else if (Saveflag == 'D') {
      this.DispId = '';
      this.flag = 'D'
      this.sortingJson = this.listDispenser;
      this.SaveDPRSorting(); 
    }        
  }
  SaveDPRSorting() {
    this.error = this.DSASortingValidation(this.sortingJson, this.flag);
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
      this.objDbServ.SaveDSASorting(obj).subscribe(
        (resp: Response) =>{
          const data = JSON.parse(resp.json());
          if(data.Status.indexOf('successfully') > -1)
          {
             if(this.flag=='S'){
               this.IsDispenserDisable = true;
             }
            else if(this.flag == 'D'){
               this.IsDispenserDisable = false;
               this.IsStationDisable=true;
             }
            this.flag='S'
            this.code='';
            this.sortingJson=[]; 
            this.getSortingData();
          }
           alert(this.camelize(data.Status.toString()));
           this.objDbServ.ShowLoaders.emit(false);
      },
        (error) =>{
          alert('Something went wrong.');
          this.objDbServ.ShowLoaders.emit(false);
        }
      )
   }   
 }
 DSASortingValidation(sortingJson, flag) {
     var err = { msg: '' };
     for (var i = 0; i < sortingJson.length; i++) {
         var sortingNumber = '', Name = 'Unknown', nextName = '';
         if (flag == 'S') {
            sortingNumber = sortingJson[i].StationSort
            Name = sortingJson[i].StationName;
         }
         if (flag == 'D') {
             sortingNumber = sortingJson[i].DispenserSort;
             Name = sortingJson[i].DispenserName;
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
     if (flag == 'S')
     sortingJson = this.sortBy(sortingJson,'StationSort');
     if (flag == 'D')
     sortingJson = this.sortBy(sortingJson,'DispSort');  
     for (var i = 0; i < sortingJson.length; i++) {
         var Name = 'Unknown', nextName = 'Unknown';
         if (i < sortingJson.length - 1) {            
             if (flag == 'S') {
                 if (sortingJson[i].StationSort == sortingJson[i + 1].StationSort) {
                     Name = sortingJson[i].StationName;
                     nextName = sortingJson[i + 1].StationName;
                     return err = { msg: 'Duplicate Sorting Found Between ' + Name + ' And ' + nextName + '.' };
                 }
             }
             if (flag == 'D') {
              if (sortingJson[i].DispenserSort == sortingJson[i + 1].DispenserSort) {
                  Name = sortingJson[i].DispenserName;
                  nextName = sortingJson[i + 1].DispenserName;
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
camelize(str:string) {
  return str.replace(/\w+/g,
  function(w){return w[0].toUpperCase() + w.slice(1).toLowerCase();});
}
}
