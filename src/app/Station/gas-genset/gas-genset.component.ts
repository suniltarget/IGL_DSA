import { Component, OnInit } from '@angular/core';
import { dbService } from '../../Service/db.service';
import { CookieService } from 'ngx-cookie-service';
import { isUndefined } from 'util';
declare var $:any;
@Component({
  selector: 'app-gas-genset',
  templateUrl: './gas-genset.component.html',
  styleUrls: ['./gas-genset.component.css']
})
export class GasGensetComponent implements OnInit {
  getGenSetData:any=[];
  getGenSetDetails:any=[];
  getGenSetFormData:any=[];
  GenSetId:string="";
  PreviousReading:string="";
  meterTotaliser:string="";
  jumpReading:string="";
  jumpReadingCount:string="";
  remark:string="";
  uploadedfile:File;
  uploadedfilereset:File;
  files:File;
  filesreset:File;
  RunHrs:string='00';
  RunMins:string='00';
  SAPEquipmentNumber:string="";
  resetTypeJsonSelected:string="";
  OldMeterReading:string="";
  JReading:string="";
  isCRSentToHo:number;
  isStationSubmitted:number;
  HH:number;
  MM:number;
  Hours:any=[];
  Minutes:any=[];
  filevisible:boolean=false;
  popupfilevisible:boolean = true;
  JumpVisible:boolean=true;
  stationName:string="";
  constructor(private objDbServ: dbService, private objCook: CookieService) {
    this.objDbServ.HeaderDisplay.emit(true);
    this.objDbServ.LeftMenu.emit(true);
  }
  ngOnInit() {
    this.stationName = JSON.parse(sessionStorage.getItem("globalDetail"))[0].UserName;
    this.GetStationGenSet('-999');
  }
  GetStationGenSet(GenSetId){
    try{
      this.GenSetId = GenSetId;
      this.objDbServ.ShowLoaders.emit(true);
      this.objDbServ.GetStationGenSet({StationCode:this.objCook.get('stationCode'),LoginId:this.objCook.get('stationCode'),GenSetId:GenSetId}).subscribe(
        (response: any)=>{
          const data = JSON.parse(response._body);
          this.getGenSetData = JSON.parse(data);
          if(this.getGenSetData[0].length != 0 && this.getGenSetData[1].length != 0) {
          this.getGenSetDetails = JSON.parse(data)[0];
          this.getGenSetFormData = JSON.parse(data)[1];
          this.PreviousReading = this.getGenSetFormData[0].FlowMeterReadingPrv;
          this.SAPEquipmentNumber = this.getGenSetFormData[0].GasGenSetCode;
          this.meterTotaliser = this.getGenSetFormData[0].FlowMeterReading;
          this.jumpReading = this.getGenSetFormData[0].JumpReadingFMR;
          this.jumpReadingCount = this.getGenSetFormData[0].JumpReadingFMRCount;
          this.remark = this.getGenSetFormData[0].Remark;
          this.RunHrs = this.getGenSetFormData[0].RunninInHours;
          this.RunMins = this.getGenSetFormData[0].RunningInMinutes;
          this.isCRSentToHo = this.getGenSetFormData[0].isCRSentToHo;
          this.isStationSubmitted = this.getGenSetFormData[0].isStationSubmitted;
          if(parseFloat(this.jumpReading) > 0.000) {
             this.filevisible = false;
             $("#Ischeckbox").prop("checked", true);
             this.JumpVisible =false;
           }else {
             this.filevisible =true;
             $("#Ischeckbox").prop("checked", false);
             this.JumpVisible =true;
          }
          this.Hours=[];
          this.Minutes=[];
          for(var i=0;i<=24;i++) {              
              if(i<=9){
                  var a = '0';
                this.Hours.push(a+i);      
              }else if(i >= 10){
                  var a='';
                this.Hours.push(''+i);
              }
          }
          for(var i=0;i<=59;i++) {              
            if(i<=9){
                var a = '0';
              this.Minutes.push(a+i);      
            }else if(i >= 10){
                var a='';
              this.Minutes.push(''+i);
            }
         }
          if(JSON.parse(data)[0].length > 0){
            if(GenSetId=='-999') {
              this.GenSetId = this.getGenSetDetails[0].GenSetId;
            }
            this.objDbServ.ShowLoaders.emit(false);
          }
          else{
            this.objDbServ.ShowLoaders.emit(false);
          }   
        }
        else {
            alert('No Gas Genset data available. Please try another station.')
            this.objDbServ.ShowLoaders.emit(false);
        }          
        },
        (error)=>{
          this.objDbServ.ShowLoaders.emit(false);
        }  
      );
    }
    catch(err){
      this.objDbServ.ShowLoaders.emit(false);
    }
  }
  uploadJumpReadingImg(file: FileList, event: any) {
    this.uploadedfile = file.item(0);
  }
  fileuploadreset(file: FileList, event: any) {
    this.uploadedfilereset = file.item(0);
  }
  selecthrsmnts(value,flag) {
    if(flag == 'HH') {
      this.RunHrs = value;
    }else {
      this.RunMins = value;
    }
  }
  jumpreadingValue(value) {
    this.jumpReading = value;
    if(this.jumpReading != '') {
        this.filevisible = false;
    }else {
        this.filevisible = true;
    }
  }
  OnCheckboxChange(evt) {
    if(evt.target.checked==true) 
      this.JumpVisible = false;
    else if(evt.target.checked==false)
      this.JumpVisible = true;     
  }
  InsertGenSetDetails() {
      var MyJson = {
        LoginId: localStorage.getItem('LoginId'),
        GenSetId: this.GenSetId,
        RunningHours: this.RunHrs + ":" + this.RunMins,
        FlowMeterReading: this.meterTotaliser,
        JumpReadingFMR: ((this.jumpReading == '') ? '0' : this.jumpReading),
        JumpReadingFMRCount: this.jumpReadingCount,
        JumpCeritificateFMR: ((this.uploadedfile == undefined) ? '' : this.uploadedfile.name),
        Remark: this.remark,
        StationCode: localStorage.getItem('LoginId'),
        FilePath: localStorage.getItem('LoginId') + "/genset/",
      };
    this.files = $('#fileInput');
    var frmData = new FormData();
    var fileInput = this.files[0];
    frmData.append("genSetDetail", JSON.stringify(MyJson));
    if(this.uploadedfile != undefined) {
      frmData.append('JumpCeritificateFMR', this.uploadedfile, this.uploadedfile.name);
    }
    var ErrorMsg = this.checkGensetvalidations(MyJson, fileInput);
    if(ErrorMsg == '' || ErrorMsg == undefined) {
      if(Number(this.meterTotaliser) <= Number(this.PreviousReading)) {
          if(confirm("Suspected Flow Meter Reading, Do you want to continue?")) {
            this.objDbServ.InsertGenSetDetails(frmData).subscribe(
                (resp : any) => {
                    const data = JSON.parse(resp._body);
                    alert(data.Status);
                    if(data != '') {
                        this.GetStationGenSet(this.GenSetId);
                    }
                },
                (error) =>{alert('Something went wrong.');
                this.objDbServ.ShowLoaders.emit(false);
              }
              )
          }
      }
      else if(Number(this.meterTotaliser) >= 2*Number(this.PreviousReading)) {
        if(confirm("Suspected Flow Meter Reading, Do you want to continue?")) {
            this.objDbServ.InsertGenSetDetails(frmData).subscribe(
                (resp : any) => {
                    const data = JSON.parse(resp._body);
                    alert(data.Status);
                    if(data != '') {
                        this.GetStationGenSet(this.GenSetId);
                    }
                },
                (error) =>{alert('Something went wrong.');
                this.objDbServ.ShowLoaders.emit(false);
              }
              )
            }
        }
      else  {
        this.objDbServ.InsertGenSetDetails(frmData).subscribe(
          (resp : any) => {
             const data = JSON.parse(resp._body);
              alert(data.Status);
              if(data != '') {
                  this.GetStationGenSet(this.GenSetId);
              }
          },
          (error) =>{alert('Something went wrong.');
          this.objDbServ.ShowLoaders.emit(false);
        }
        )
      }
    }else {
      alert(ErrorMsg);
    }
  }
  checkGensetvalidations(genSetDetailJson, fileInput) {
      var regexNumeric = /^[+-]?[0-9]{1,1000}(?:\.[0-9]{1,1000})?$/;
      var regexDecimalThree = /^[+-]?[0-9]{1,10}(?:\.[0-9]{1,3})?$/;
      var regexDecimalThreeNegative = /^[+]?[0-9]{1,10}(?:\.[0-9]{1,3})?$/;
      var imgShow = 'assets/images/attachment.gif';
      var foundError = '';
      var TotalHrs = parseInt(this.RunHrs);
      var TotalMins = parseInt(this.RunMins);
        if (parseFloat(genSetDetailJson.FlowMeterReading) > parseFloat(this.PreviousReading) && (genSetDetailJson.FlowMeterReading != undefined)) {
          if (this.RunHrs + ":" + this.RunMins == '00:00') {
              foundError = 'Running hours are required.';
              return foundError;
          }
        }
      if ((TotalHrs == 24 && TotalMins > 0)) {
          foundError = 'Total Hours must be less/equal than 24.';
          return foundError;
      }
      if (genSetDetailJson.FlowMeterReading == '') {
          foundError = 'Flow Meter Reading is required.';
          return foundError;
      }
      if((genSetDetailJson.JumpReadingFMR == '' || genSetDetailJson.JumpReadingFMR == undefined || parseFloat(genSetDetailJson.JumpReadingFMR) == parseFloat("0")) && parseFloat(genSetDetailJson.FlowMeterReading) == parseFloat("0")) {
        foundError = 'Invalid Flow Meter Reading';
        return foundError;
      }
      if (genSetDetailJson.FlowMeterReading != "") {
          if (regexNumeric.test(genSetDetailJson.FlowMeterReading) == false) {
              foundError = 'Only numeric value allowed for reading.';
              return foundError;
          }
          if (regexDecimalThree.test(genSetDetailJson.FlowMeterReading) == false) {
              foundError = 'Three decimal with Max 10 Precision values allowed';
              return foundError;
          }
          if (parseFloat(genSetDetailJson.FlowMeterReading) < 0) {
              foundError = 'Flow Meter Reading must be Positive.';
              return foundError;
          }
      }
      if (genSetDetailJson.JumpReadingFMR != '') {
              if (fileInput.files.length > 0) {
                  var validExtension = 'jpeg,jpg,png,gif';
                  for (var i = 0; i < fileInput.files.length; i++) {
                      var fileExtension = fileInput.files[i].name.split('.')[1];
                      if (validExtension.indexOf(fileExtension) < 0) {
                          foundError = 'Attachment allowed only for [' + validExtension + '].'; return foundError;
                      }
                  }
              }
          if (regexNumeric.test(genSetDetailJson.JumpReadingFMR) == false) {
              foundError = 'Only numeric value allowed for reading.'; return foundError;
          }
          if (regexDecimalThree.test(genSetDetailJson.JumpReadingFMR) == false) {
              foundError = 'Three decimal with Max 10 Precision values allowed'; return foundError;
          }
      }
      var JumpReadingFMTCnt = genSetDetailJson.JumpFMRCnt;
      if (JumpReadingFMTCnt != '' && parseFloat(JumpReadingFMTCnt) != 0 && (JumpReadingFMTCnt === undefined) == false) {
          if (regexNumeric.test(JumpReadingFMTCnt) == false) {
              foundError = 'Only numeric value allowed for Jump reading count.';
              return foundError;
          }
          if (JumpReadingFMTCnt.indexOf('.') > -1) {
              foundError = 'Decimal value not allowed for Jump reading count.';
              return foundError;
          }
          if (parseFloat(JumpReadingFMTCnt) < 0) {
              foundError = 'Gas GenSet Reading count must be Positive.';
              return foundError;
          }
          if (genSetDetailJson.JumpReadingFMR == '' || (genSetDetailJson.JumpReadingFMR == undefined)) {
            foundError = 'Please enter the Jump reading.';
            return foundError;
          }
      }
      return foundError;
}
   resetchange(value) {
      this.resetTypeJsonSelected = value;
 }
  JReadingvalue(value) {
    this.JReading = value;
    if(this.JReading!='') {
        this.popupfilevisible = false;
    }else {
        this.popupfilevisible = true;
    }
}
  changeresetpopup() {
    var MyJsonreset = {
        StationCode: localStorage.getItem('LoginId'),
        MeterOf: 'GSET',
        MeterOfId: this.GenSetId,
        MeterType: 'MR',
        FlagRead: 0,
        FlagReadingType: this.resetTypeJsonSelected,
        Id: this.getGenSetFormData[0].MeterResetId,
        LoginId: localStorage.getItem('LoginId'),
        PrvReading: this.OldMeterReading,
        JumpReading: ((this.JReading == '') ? '0' : this.JReading),
        ReadingOnSwitch: ((this.getGenSetFormData[0].ReadingOnSwitch == '') ? '0' : this.getGenSetFormData[0].ReadingOnSwitch),
        FilePath: localStorage.getItem('LoginId') + "/Genset/"
      };
      this.filesreset = $('#fileInputreset');
      var frmData = new FormData();
      var fileInputreset = this.filesreset[0];
      frmData.append("jsonDetail", JSON.stringify(MyJsonreset));
      if(this.uploadedfilereset != undefined) {
          frmData.append('JumpReadingFile', this.uploadedfilereset, this.uploadedfilereset.name);
        }
      var ErrorMsg = this.changeresetValidations(MyJsonreset);
      if(ErrorMsg == '' || ErrorMsg == undefined) {
          this.objDbServ.HoldResetReading(frmData).subscribe(
              (resp: any) => {
              },
              (error) =>{alert('Something went wrong.');
              this.objDbServ.ShowLoaders.emit(false);
          }
          )
      }else {
          alert(ErrorMsg);
      }
}
changeresetValidations(LcvDetailJsonreset) {
    var regexNumeric = /^[+-]?[0-9]{1,1000}(?:\.[0-9]{1,1000})?$/;
    var regexDecimalThree = /^[+-]?[0-9]{1,10}(?:\.[0-9]{1,3})?$/;
    var regexDecimalThreeNegative = /^[+]?[0-9]{1,10}(?:\.[0-9]{1,3})?$/;
    var imgShow = 'assets/images/attachment.gif';
    var errorMsg = '' ;
    if ((LcvDetailJsonreset.PrvReading === undefined) || LcvDetailJsonreset.PrvReading == '') {
        errorMsg = 'Please enter the Old Meter Reading.'
        return errorMsg;
    }
    if (regexNumeric.test(LcvDetailJsonreset.PrvReading) == false) {
        errorMsg = 'Only numeric value allowed for reading.' ;
        return errorMsg;
    }
    if (parseFloat(LcvDetailJsonreset.PrvReading) < 0) {
        errorMsg = 'Old Meter Reading must be Positive.';
        return errorMsg;
    }
    if (regexNumeric.test(LcvDetailJsonreset.JumpReading) == false) {
        errorMsg = 'Only numeric value allowed for Jump reading.';
        return errorMsg;
    }
    return errorMsg;
}
}
