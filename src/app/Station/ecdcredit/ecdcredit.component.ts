import { Component, OnInit } from '@angular/core';
import { Http, Response} from '@angular/http';
import { dbService } from '../../Service/db.service';
import { CookieService } from 'ngx-cookie-service';
import { DecimalPipe } from '@angular/common';
import { Router } from '@angular/router';
import { OnChanges } from '@angular/core/src/metadata/lifecycle_hooks';
import { isNullOrUndefined } from 'util';
import { DatePipe } from '@angular/common';
import { tick } from '@angular/core/testing';
import { Conditional } from '@angular/compiler';
declare var $;
@Component({
  selector: 'app-ecdcredit',
  templateUrl: './ecdcredit.component.html',
  styleUrls: ['./ecdcredit.component.css']
})
export class ECDCreditComponent implements OnInit {
  detailsStation:{StationId:string,SummeryDate:string,UserId:string}
  StationShift:{ShiftId:string,SubShiftId:string,ActiveTab:string}
  StationCode:string=this.objCook.get('LoginId');
  selectedStation: number = 0;
  showNext:boolean = true;
  showPrevious:boolean = true;
  submitButton:boolean = true;
  ECDInfo : Array<{ECDDevice: string, Amount: any}>;
  array=[];
  values=[];
  ECDDevicename:any;
  Amount:any;
  Amountqunatity:any;
  device=[];
  amt=[];
  values1=[];
  error:boolean= true;
  ListECD: any;
  values11=[];
  fiterBox:boolean = false;
  filterBoxFlag:number = 0;
  listECD1: any;
  cmbShiftData: any;
  selectedShiftId:any='4';
  selectedSubShiftId='4';
  constructor(private objDbServ: dbService, private objCook: CookieService, private objRoute: Router, private dp: DatePipe) { 
    this.objDbServ.MasterCompDisplay.emit(true);
    this.objDbServ.ShiftDetails.subscribe(
      (test1: {ShiftId:string,SubShiftId:string,ActiveTab:string}) => 
      {
        this.StationShift =test1;
        this.StationShift.ActiveTab =='ECD' 
      }
    );
    this.objDbServ.ShiftDetails.subscribe(
      (test1: {ShiftId:string,SubShiftId:string,ActiveTab:string}) => 
      {
        if(this.StationShift.ActiveTab=='ECD'){
          setTimeout(() => {this.getlist11('4');this.ECDData();this.getData();});
          this.StationShift.ShiftId = '1';
        }
      }
    );
    this.objDbServ.StationDetails.subscribe(
      (test: {StationId:string,SummeryDate:string,UserId:string}) => 
      {
        this.detailsStation =test;
      }
    );
  }
  ngOnInit() {
     this.selectedStation = Number(this.objCook.get('stationId'));
     this.showNext = true;
     this.showPrevious = true;
  }
  onClickPrevious(){
    this.objDbServ.ShiftDetails.emit({
      ActiveTab:"Payment"
    });
    $('.nav-tabs > .active').prev('li').find('a').trigger('click');   
  }
  onClickNext(){
      this.SaveSale();
  }
  SaveSale(){
    {
         const obj = {
         list:this.values,
         StationId:this.objCook.get('stationId'),
         StationCode:this.objCook.get('LoginId'),
         ShiftId:this.selectedShiftId,
         Date:this.detailsStation.SummeryDate,
      };
      this.objDbServ.ShowLoaders.emit(true);
      this.objDbServ.ECDEntry(obj).subscribe(
        (resp: Response) =>{
          const data = JSON.parse(resp.json());
          if(data.Table[0].MESSAGE == '1'){
              if(this.selectedShiftId < '4'){
                  this.showPrevious = true;
                  this.values=[];
                  this.selectedShiftId = parseInt(this.selectedShiftId) + 1;
                  this.getlist11(this.selectedShiftId);
                  }
             else{
                this.submitButton = true;
                this.objDbServ.ShiftDetails.emit({
                ActiveTab:"Other"
                });
                $('.nav-tabs > .active').next('li').find('a').trigger('click'); 
              }
          }
        else if(data.Table[0].MESSAGE == '2'){
          alert('Please Check Amount Details');
           this.showPrevious = true;
        }
          this.objDbServ.ShowLoaders.emit(false);
      },
        (error) =>{alert('Something went wrong.');
          this.objDbServ.ShowLoaders.emit(false);
        }
      )
    }
  }
  addform(){
    this.array.push(this.ECDInfo);
  }
  remove(i){
    this.values.splice(i,1);
  }
  addvalue(){
  this.values.push({ECDDevice:this.ECDDevicename, Amount:''});
  }
  getlist11(shiftid){
    var obj={
      StationId:this.objCook.get('stationId'),
      ShiftId: shiftid,
      Date:this.detailsStation.SummeryDate
    }
    this.objDbServ.ECDCreditList(obj).subscribe(
      (resp: Response) => {
        const data =JSON.parse(resp.json()).Table;
        if(data.length > 0){
          this.values=JSON.parse(resp.json()).Table;
        }
        else{
          this.values = [];
          this.values.push({ECDDevice:this.ECDDevicename, Amount:''});
        }
      },
      (error) => {alert("Something went wrong.");
      this.objDbServ.ShowLoaders.emit(false);
      }
    )
  }
validation(){
  this.error = true;
  if(this.values.length <= 0){
   alert('Atleast One Entry Is Required');
   this.error = false;
   return this.error;
  }
  if(( this.values[0].ECDDevice == ''|| this.values[0].ECDDevice == '')){
    alert('Atleast One Entry Is Required');
    this.error = false;
    return this.error;
  }
  return this.error;
}
filterBoxShow(itm,i) {
  if(this.filterBoxFlag == 0) {
    this.fiterBox = true;
    this.filterBoxFlag = 1;
  }   
  else {
    this.fiterBox = false;
    this.filterBoxFlag = 0;
    this.ECDDevicename = itm.ECDDevice;
    this.values[i].ECDDevice=this.ECDDevicename;
  }
}
ECDData(){
  this.objDbServ.GetECDMaster({Flag: 'GetList',StationCode:this.objCook.get('LoginId')}).subscribe(
    (resp: Response) => {
      this.listECD1=JSON.parse(resp.json()).Table
    },
    (error) => {alert("Something went wrong.");
    this.objDbServ.ShowLoaders.emit(false);
    }
  )
}
getData(){
  this.objDbServ.ShowLoaders.emit(true);
  this.objDbServ.CommonGetData({Flag: 'StationDispenserData', Id: this.detailsStation.StationId}).subscribe(
    (resp: Response) => {
      this.objDbServ.ShowLoaders.emit(false);
      this.cmbShiftData = JSON.parse(resp.json()).Table1
    },
    (error) => {
      alert("Something went wrong.");
      this.objDbServ.ShowLoaders.emit(false);
    }
  )
}
onSelectShift(shiftId:string){
  this.selectedShiftId = shiftId;
  this.getlist11(shiftId);
}
}
