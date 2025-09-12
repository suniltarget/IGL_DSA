import { Component, OnInit } from '@angular/core';
import { Http, Response} from '@angular/http';
import { dbService } from '../../Service/db.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { parse } from 'path';
declare var $:any;
@Component({
  selector: 'app-dipenser-reading',
  templateUrl: './dipenser-reading.component.html',
  styleUrls: ['./dipenser-reading.component.css']
})
export class DipenserReadingComponent implements OnInit {
detailsStation:{StationId:string,SummeryDate:string,UserId:string}
StationShift:{ShiftId:string,SubShiftId:string,ActiveTab:string}
 cnt=0;
 armA:string='';
 armAPrevReading:string='';
 armB:string='';
 armBPrevReading:string='';
 UpdateArmA:string='';
 UpdateArmB:string='';
 remark:string='';
 prevReadingA:string='';
 prevReadingB:string='';
 jumpReadingA:string='';
 jumpReadingB:string='';
 ArmASale='0.00';
 ArmBSale='0.00';
 TArmSale='0.00';
 oldvalueA:string='';
 oldvalueB:string='';
 errorFlag:boolean = false;
 before:string='';
 after:string='';
 popupFlag:boolean = false;
 UpdateFlag:boolean = false;
 popupFor:string = "ArmA";
 StationId:string = '';
 JumpSide = '';
 CashCollection=0.0;
 IsJumpSelected:boolean= false;
 uploadedfile:File;
 JumpType:string='';
 FileName:string='';
 IsFileSelected:boolean=false;
 allDispenserData:any=[];
 listJumpedReading:any = [];
 armSide:string="armA";
 dispId:number = 0;
 jumppopup:boolean=true;
 constructor(private objDbServ: dbService, private objCook: CookieService, private objRoute: Router) { 
    this.objDbServ.MasterCompDisplay.emit(true);
    this.objDbServ.ShiftDetails.subscribe(
      (test1: {ShiftId:string,SubShiftId:string,ActiveTab:string}) => 
      {
        this.StationShift =test1;
        if(this.StationShift.ActiveTab=='Dispenser'){
          this.selectedDispId=0;
          this.selectedShiftId=this.StationShift.ShiftId;
          this.selectedSubShiftId=this.StationShift.SubShiftId;
          this.dispCounterIndex = 0;
          setTimeout(() => {this.GetReadingbyShift();});
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
  showNext:boolean = true;
  showPrevious:boolean = true;
  totalDispenser:number=0;
  dispCounterIndex:number=0;
  FlagJumpType = 'Jump';
  DispencerCount=0;
  listDispensers:{DispenserName,DispenserId,StationId}[];
  selectedDispId=0;
  cmbShiftData:{}[];
  selectedShiftId='-1'
  cmbSubShiftData:{SubShiftId,SubShiftDetails}[];
  selectedSubShiftId='-1'
  SubShiftCount=0;
  SubShiftCurrentCount=0;
  CurrentRate='0.00';
  NormalRate='0.00';
  DiscountedRate='0.00';
  StationCode:string= localStorage.getItem('LoginId');
  DispanserJumpId:string = '';
  ngOnInit() {
    this.showNext = true;
    this.showPrevious = false;
    this.dispCounterIndex = 0;
    this.FlagJumpType = 'Jump';
  }
  onChangeImage(file: FileList, event: any) {
    this.uploadedfile = file.item(0);
    if(this.uploadedfile.size > 0)
       this.IsFileSelected=true;
    else
       this.IsFileSelected=false;       
  }
  GetReadingbyShift(){
    const obj = {
      StationId:this.detailsStation.StationId,
      EntryDate:this.detailsStation.SummeryDate,
      DispenserId: this.selectedDispId,
      ShiftId: this.selectedShiftId,
      SubShiftId: this.selectedSubShiftId
    };
    this.objDbServ.ShowLoaders.emit(true);
    this.objDbServ.GetReadingbyShift(obj).subscribe(
      (resp: Response) => {
        if(this.selectedDispId==0)
          this.selectedDispId = JSON.parse(resp.json()).Table4[0].DispenserId;
        this.DispencerCount=JSON.parse(resp.json()).Table4.length;
        this.listDispensers = JSON.parse(resp.json()).Table4;
        this.allDispenserData = JSON.parse(resp.json()).Table;
        this.totalDispenser = JSON.parse(resp.json()).Table4.length;
        this.cmbShiftData = JSON.parse(resp.json()).Table1;
        this.cmbSubShiftData = JSON.parse(resp.json()).Table2;
        this.selectedShiftId = JSON.parse(resp.json()).Table3[0].ShiftId;
        this.selectedSubShiftId = JSON.parse(resp.json()).Table3[0].SubShiftId;
        this.DiscountedRate=(parseFloat(JSON.parse(resp.json()).Table3[0].DisountedRate).toFixed(2)).toString();
        this.NormalRate=(parseFloat(JSON.parse(resp.json()).Table3[0].CurrentRate).toFixed(2)).toString();
        if(this.selectedShiftId=='-1')
          this.CurrentRate='0.00';
        else if(this.selectedSubShiftId=='6')
          this.CurrentRate=this.DiscountedRate;
        else
          this.CurrentRate=this.NormalRate;
        this.SubShiftCount=JSON.parse(resp.json()).Table2.length;
        var element =0;
        if(this.selectedShiftId == '-1' || this.selectedSubShiftId == '-1')
          this.jumppopup = true;
        else
          this.jumppopup = false;
        this.ArmASale=(parseFloat(JSON.parse(resp.json()).Table[0].TotA).toFixed(2)).toString()
        this.ArmBSale=(parseFloat(JSON.parse(resp.json()).Table[0].TotB).toFixed(2)).toString()
        this.TArmSale=(parseFloat(JSON.parse(resp.json()).Table[0].FinalTot).toFixed(2)).toString()
        for (let index = 0; index < this.cmbSubShiftData.length; index++) {
          if(this.cmbSubShiftData[index].SubShiftId ==this.selectedSubShiftId)  
              element=index;  
        }
        this.SubShiftCurrentCount=(element+1)
        this.objDbServ.ShowLoaders.emit(false);
      },
      (error) => {alert("Something went wrong.");this.objDbServ.ShowLoaders.emit(false);}
    )
  }
    onSelectShift(shiftId:string){
        this.selectedShiftId = shiftId;
        setTimeout(() => {this.GetReadingbyShift();});
    }
    onSelectSubShift(SubShiftId:string){
      this.selectedSubShiftId = SubShiftId;
      if(SubShiftId =='-1')
        this.SubShiftCurrentCount=-1  
      else{
        var element =0;
        for (let index = 0; index < this.cmbSubShiftData.length; index++) {
          if(this.cmbSubShiftData[index].SubShiftId ==SubShiftId)  
              element=index;  
        }
        this.SubShiftCurrentCount=(element+1)
      }
      setTimeout(() => {this.GetReadingbyShift();});
    }
    OnchangeA(itm){ 
      if(itm.ArmReadingA<0){
        alert('Reading must be positive');
        itm.ArmReadingA=0;
      }
      if(itm.ArmReadingA!='')
      {
        var rx = /^\d+(?:\.\d{1,3})?$/ 
        if(rx.test(itm.ArmReadingA)){
          this.oldvalueA=itm.ArmReadingA;
        }
        else{
          itm.ArmReadingA=this.oldvalueA;
        }
      }
      else{
        itm.ArmReadingA = '';
      }
        const ArmASaleCal = ((parseFloat(itm.ArmReadingA)-parseFloat(itm.PreArmReadingA)-parseFloat(itm.JumpArmA)).toFixed(2)).toString();
        itm.TotA = Number(isNaN(parseFloat(ArmASaleCal))?'0.00':ArmASaleCal);
        const TArmSaleCal = ((parseFloat(itm.TotA)+parseFloat(itm.TotB)).toFixed(2)).toString();
        itm.FinalTot = Number((isNaN(parseFloat(TArmSaleCal))?'0.00':TArmSaleCal));
    }
    OnchangeB(itm){
      if(itm.ArmReadingB<0){
        alert('Reading must be positive')
        itm.ArmReadingB=0;
      }
      if(itm.ArmReadingB!='')
      {
        var rx = /^\d+(?:\.\d{1,3})?$/ 
        if(rx.test(itm.ArmReadingB)){
          this.oldvalueB=itm.ArmReadingB;
        }
        else{
          itm.ArmReadingB=this.oldvalueB;
        }
      }
      else{
        itm.ArmReadingB='';
      }
      const ArmBSaleCal = ((parseFloat(itm.ArmReadingB)-parseFloat(itm.PreArmReadingB)-parseFloat(itm.JumpArmB)).toFixed(2)).toString();
      itm.TotB = Number(isNaN(parseFloat(ArmBSaleCal))?'0.00':ArmBSaleCal);
      const TArmSaleCal = ((parseFloat(itm.TotB)+parseFloat(itm.TotA)).toFixed(2)).toString();
      itm.FinalTot = Number((isNaN(parseFloat(TArmSaleCal))?'0.00':TArmSaleCal));
    }
    saveAll() {
      var arr:any=[];
      arr = this.allDispenserData.filter(element => element.ArmReadingA != 0 )
      if(this.selectedShiftId == "-1" || this.selectedSubShiftId == "-1") {
        alert('Please select Both Shift.');
      }
      else if(arr.length == 0) {
        alert('Please Enter Arm Reading.');
      }
      else {
          var array:any=[];
          this.allDispenserData.forEach(element => {
              array.push({DispenserId:element.DispenserId, ArmReadingA:element.ArmReadingA, ArmReadingB:element.ArmReadingB});
          });
          const obj = {
            UserId:this.detailsStation.UserId,
            EntryDate:this.detailsStation.SummeryDate,
            StationId: this.detailsStation.StationId,
            shiftId: this.selectedShiftId,
            SubShiftId: this.selectedSubShiftId,
            StationCode: this.StationCode,
            CurrentRate: this.CurrentRate,
            DispanserEntryData:array
          };
          this.objDbServ.ShowLoaders.emit(true);
          this.objDbServ.DispenserEntryMaster(obj).subscribe(
            (resp: Response) => {
              const data = JSON.parse(resp.json());
              if(data.Table[0].Meaasge.indexOf('successfully') > -1)
              {
                  alert(data.Table[0].Meaasge);
                  if(this.SubShiftCurrentCount==this.SubShiftCount){
                    this.objDbServ.ShiftDetails.emit({
                    ShiftId:this.selectedShiftId,
                    SubShiftId:this.selectedSubShiftId,
                    ActiveTab:"Payment"
                    });
                    $('.nav-tabs > .active').next('li').find('a').trigger('click');                            
                  }                                 
              }
              else
                alert(data.Table[0].Meaasge);
              this.objDbServ.ShowLoaders.emit(false);
            },
            (error) => {alert("Something went wrong.");this.objDbServ.ShowLoaders.emit(false);}
          )
      }
    }
    validation(itm,flag:string){
        if(flag == 'ArmA') {
          if(String(Number(itm.ArmReadingA)) ==  'NaN'){
            alert('Please enter the numeric value for Arm A.');
            this.errorFlag = true;
          }
          else if(parseFloat(itm.ArmReadingA) == 0 && parseFloat(itm.PreArmReadingA) > 0){
            alert('Zero is not allowed for Arm A.');
            this.errorFlag = true;
          }
          else if(parseFloat(itm.ArmReadingA) <= parseFloat(itm.PreArmReadingA)){
            const ret = confirm('There is a suspecious entry in Arm A. Do you want to continue?')
            this.errorFlag = (ret == true)?false:true; 
          }
        }
          else if (flag == 'ArmB') {
          if(String(Number(itm.ArmReadingB)) ==  'NaN'){
            alert('Please enter the numeric value for Arm B.');
            this.errorFlag = true;
          }
          else if(parseFloat(itm.ArmReadingB) == 0 && parseFloat(itm.PreArmReadingB) > 0){
            alert('Zero is not allowed for Arm B.');
            this.errorFlag = true;
          }
          else if(parseFloat(itm.ArmReadingB) <= parseFloat(itm.PreArmReadingB)){
            const ret = confirm('There is a suspecious entry in Arm B. Do you want to continue?')
            this.errorFlag = (ret == true)?false:true;  
          }
        }
      return this.errorFlag;
    }
    ArmSelection(value) {
      this.popupFor = value;
    }
    getvalues(itm) {
      this.dispId = itm.DispenserId;
      this.armAPrevReading = itm.PreArmReadingA;
      this.armBPrevReading = itm.PreArmReadingB;
      this.getJumpReadingList(this.dispId);
      this.refreshPopup();
    }
    getJumpReadingList(itm){
      const obj = {
        EntryDate:this.detailsStation.SummeryDate,
        ShiftId: this.selectedShiftId,
        SubShiftId: this.selectedSubShiftId,
        DispenserId: this.dispId
      };
      this.objDbServ.ShowLoaders.emit(true);
      this.objDbServ.GetJumpReadingByShift(obj).subscribe(
        (resp: Response) => {
          this.listJumpedReading = JSON.parse(resp.json()).Table;
          this.objDbServ.ShowLoaders.emit(false);
        },
        (error) => {alert("Something went wrong.");
        this.objDbServ.ShowLoaders.emit(false);}
      )
    }
  DeleteJumpReading(DispanserJumpId:string, itm:any){
    if(confirm("Are you sure to delete this record..?")) {
      this.objDbServ.DeleteJumpReading({DispanserJumpId: DispanserJumpId, StationId : this.detailsStation.StationId, EntryDate:this.detailsStation.SummeryDate, DispanserSide : this.popupFor}).subscribe(
        (resp: Response) => {
          const data = JSON.parse(resp.json());
          alert(data.Table[0].Meaasge);
          this.openPopup(this.popupFor);
          setTimeout(() => {this.GetReadingbyShift();});
          this.objDbServ.ShowLoaders.emit(false);
        },
        (error) => {alert("Something went wrong.");
        this.objDbServ.ShowLoaders.emit(false);}
      )
    }
  }
  openPopup(flag:string){
    this.popupFor = flag;
    this.DispanserJumpId = '';
    this.listJumpedReading = [];
    this.getJumpReadingList(this.dispId);
    this.refreshPopup();
  }
  refreshPopup(){
    this.armSide = "ArmA";
    this.before = '';
    this.after = '';
    this.remark = '';
    this.DispanserJumpId='';
    this.FlagJumpType = 'Jump';
    $('#fileInput').val(null);
    this.uploadedfile = null;
    this.FileName='';
 }
  UpdateJumpReading(DispanserJumpId:string, itm:any){
    this.DispanserJumpId = DispanserJumpId;
    this.before = itm.DispanserBeforeJump;
    this.after = itm.DispanserAfterJump;
    this.remark = itm.DispanserJumpRemark;
    this.FlagJumpType = itm.FlagJumpType;
    var ImagePath = itm.DispanserJumpCeritificate;
    this.armSide = itm.DispanserSide;
    this.FileName = ImagePath.substring(1, ImagePath.length);
    if(this.FileName.length > 0){
      this.IsFileSelected = false;
      this.uploadedfile = null;
    }   
    else
      this.IsFileSelected = true;
  }
  saveJumpReading(){
  this.errorFlag = false;
  if(this.validationPopup('JumpReading') == true)
    return false;
    var obj = {
    EntryDate:this.detailsStation.SummeryDate,
    DispanserJumpId:  (this.DispanserJumpId == "") ? '0' : this.DispanserJumpId,
    DispenserId: this.dispId,
    StationId: this.detailsStation.StationId,
    ShiftId: this.selectedShiftId,
    SubShiftId: this.selectedSubShiftId,
    DispanserBeforeJump: this.before,
    DispanserAfterJump: this.after,
    DispanserJumpRemark: this.remark,
    DispanserSide: this.popupFor,
    JumpTypeFlag: this.FlagJumpType,
    RequestFrom: this.objCook.get('UID')
  };
  this.objDbServ.ShowLoaders.emit(true);
  var frmData = new FormData();
  var fileInput = this.uploadedfile;
  frmData.append("DispJumpDetail", JSON.stringify(obj));
  if(this.uploadedfile != undefined) {
     frmData.append('DipsanserJumpfile', this.uploadedfile, this.uploadedfile.name);
   }
  this.objDbServ.SaveJumpReading(frmData).subscribe(
    (resp: any) => {
      const data = JSON.parse(resp._body);
      alert(data);
      if(data.indexOf('Error:') == -1) 
      {
        if(data.indexOf('Error') > -1) 
        {
          this.objCook.set('UID', '');
          this.objRoute.navigate(['']);
        }
        this.refreshPopup();
        this.getJumpReadingList(this.dispId);
        setTimeout(() => {this.GetReadingbyShift();});
      }
      this.uploadedfile = null;
      this.FileName='';
      this.objDbServ.ShowLoaders.emit(false);
    },
    (error) => {
      alert("Something went wrong.");
      this.objDbServ.ShowLoaders.emit(false);
    }
  )
}
validationPopup(flag:string){
  if(this.before ==  '' && flag == 'JumpReading'){
    alert('Please enter the value for before reading.');
    this.errorFlag = true;
  }
  else if(String(Number(this.before)) ==  'NaN' && flag == 'JumpReading'){
    alert('Please enter the numeric value for before reading.');
    this.errorFlag = true;
  }
  else if((Number(this.before) <  0 || Number(this.before) <  0) && flag == 'JumpReading'){
    alert('Jump Reading can not be negative.');
    this.errorFlag = true;
  }
  else if(this.after ==  '' && flag == 'JumpReading'){
    alert('Please enter the value for after reading.');
    this.errorFlag = true;
  }
  else if(String(Number(this.after)) ==  'NaN' && flag == 'JumpReading'){
    alert('Please enter the numeric value for after reading.');
    this.errorFlag = true;
  }
  else if((Number(this.after) <  0 || Number(this.after) <  0) && flag == 'JumpReading'){
    alert('Jump Reading can not be negative.');
    this.errorFlag = true;
  }
  else if(this.popupFor.toLowerCase() == 'arma' &&  Number(this.armAPrevReading) <= 0 && flag == 'JumpReading'){
    alert('Before entry can not allowed if previous entry is zero.');
    this.errorFlag = true;
  }
  else if(this.popupFor.toLowerCase() == 'armb' &&  Number(this.armBPrevReading) <= 0 && flag == 'JumpReading'){
    alert('Before entry can not allowed if previous entry is zero.');
    this.errorFlag = true;
  }
  return this.errorFlag;
}
  ChangeJumpType(val) {
    this.JumpType = val;
    if(this.JumpType=='Jump')
      this.IsJumpSelected = false;
    else
      this.IsJumpSelected = true;
  }
}