import { Component, OnInit } from '@angular/core';
import { dbService } from '../../Service/db.service';
import { CookieService } from 'ngx-cookie-service';
declare var $:any;
@Component({
  selector: 'app-meter-skid',
  templateUrl: './meter-skid.component.html',
  styleUrls: ['./meter-skid.component.css']
})
export class MeterSkidComponent implements OnInit {
  meterStationSkidData:any = [];
  loginId:string = this.objCook.get('UID');
  meterTotaliser:string = '';
  jumpReading:string = '';
  jumpReadingFile:File = null;
  jumpReadingCount:string = '';
  MeterSkidDetailJson:any = [];
  GlobalDetail:any = [];
  uploadedfile:File;
  uploadedfilereset:File;
  files:File;
  filesreset:File;
  remark:string="";
  OldMeterReading:string="";
  JReading:string="";
  resetTypeJsonSelected:string="";
  isCRSentToHo:number;
  isStationSubmitted:number;
  filevisible:boolean=false;
  popupfilevisible:boolean = true;
  JumpVisible:boolean = true;
  stationName:string="";
  checkbox:boolean=false;
  constructor(private objDbServ: dbService, private objCook: CookieService) { 
    this.objDbServ.HeaderDisplay.emit(true);
    this.objDbServ.LeftMenu.emit(true);
  }
  ngOnInit() {
    this.stationName = JSON.parse(sessionStorage.getItem("globalDetail"))[0].UserName;
    this.getStationMeterSkidData();
  }
  getStationMeterSkidData(){
    try{
        this.objDbServ.ShowLoaders.emit(true);
        this.objDbServ.getStationMeterSkidApi({StationCode:this.objCook.get('stationCode'),LoginId:this.objCook.get('stationCode')}).subscribe(
        (response: any)=>{
          const data = JSON.parse(response._body);
          if(JSON.parse(data)[0].length > 0){
            this.meterStationSkidData = JSON.parse(data)[0][0]; 
            this.meterTotaliser = this.meterStationSkidData.FlowMeterTotaliser;
            this.jumpReading = this.meterStationSkidData.JumpReadingFMT;
            this.jumpReadingCount = this.meterStationSkidData.JumpReadingFMTCount;
            this.remark = this.meterStationSkidData.Remark;
            this.isCRSentToHo = this.meterStationSkidData.isCRSentToHo;
            this.isStationSubmitted = this.meterStationSkidData.isStationSubmitted;
            this.objDbServ.ShowLoaders.emit(false);
            if(parseFloat(this.jumpReading) > 0.000) {
                this.filevisible = false;
                $("#Ischeckbox").prop("checked", true);
                this.JumpVisible=false;
            }else  {
                this.filevisible= true;
                $("#Ischeckbox").prop("checked", false);
                this.JumpVisible =true;
            }
          }
          else{
            alert('No Meter Skid data available. Please try another station.')
            this.objDbServ.ShowLoaders.emit(false);
          }             
        },
        (error)=>{
          this.objDbServ.ShowLoaders.emit(false);
        }  
      );
    }
    catch(err){
    }
  }
  uploadJumpReadingImg(file: FileList, event: any) {
    this.uploadedfile = file.item(0);
  }
  fileuploadreset(file: FileList, event: any) {
    this.uploadedfilereset = file.item(0);
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
  insertStationSkid() {
      var MyJson = {
        LoginId: localStorage.getItem('LoginId'),
        MeterSkidCode: this.meterStationSkidData.MeterSkidCode,
        FlowMeterTotaliser: this.meterTotaliser,
        JumpReadingFMT: ((this.jumpReading == '') ? '0' : this.jumpReading),
        JumpReadingFMTCount: this.jumpReadingCount,
        Jumpcertificate: ((this.uploadedfile == undefined) ? '' : this.uploadedfile.name),
        Remark: this.remark,
        StationCode: localStorage.getItem('LoginId'),
        FilePath: localStorage.getItem('LoginId') + "/MeterSkid/",
        MeterSkidId: this.meterStationSkidData.MeterSkidId,
    };
    this.files = $('#fileInput');
    var frmData = new FormData();
    var fileInput = this.files[0];
    frmData.append("meterSkidDetail", JSON.stringify(MyJson));
    if(this.uploadedfile != undefined) {
      frmData.append('file', this.uploadedfile, this.uploadedfile.name);
    }
    var ErrorMsg = this.checkStationSkidvalidations(MyJson, fileInput);
    if(ErrorMsg == '' || ErrorMsg == undefined) {
      if(Number(this.meterTotaliser) <= Number(this.meterStationSkidData.FlowMeterTotaliserPrv)) {
          if(confirm("Suspected Meter Skid Reading, Do you want to continue?")) {
            this.objDbServ.insertStationSkidApi(frmData).subscribe(
                (resp : any) => {
                    const data = JSON.parse(resp._body);
                    alert(data.Status);
                    if(data != '') {
                        this.getStationMeterSkidData();
                    }
                },
                (error) =>{alert('Something went wrong.');
                this.objDbServ.ShowLoaders.emit(false);
              }
              )
          }
    }
    else if(Number(this.meterTotaliser) >= 2*Number(this.meterStationSkidData.FlowMeterTotaliserPrv)) {
        if(confirm("Suspected Meter Skid Reading, Do you want to continue?")) {
            this.objDbServ.insertStationSkidApi(frmData).subscribe(
                (resp : any) => {
                    const data = JSON.parse(resp._body);
                    alert(data.Status);
                    if(data != '') {
                        this.getStationMeterSkidData();
                    }
                },
                (error) =>{alert('Something went wrong.');
                this.objDbServ.ShowLoaders.emit(false);
              }
              )
            }
        }
    else {
      this.objDbServ.insertStationSkidApi(frmData).subscribe(
        (resp : any) => {
            const data = JSON.parse(resp._body);
              alert(data.Status);
            if(data != '') {
                this.getStationMeterSkidData();
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
  checkStationSkidvalidations(MeterSkidDetailJson, fileInput) {
      var regexNumeric = /^[+-]?[0-9]{1,1000}(?:\.[0-9]{1,1000})?$/;
      var regexDecimalThree = /^[+-]?[0-9]{1,10}(?:\.[0-9]{1,3})?$/;
      var regexDecimalThreeNegative = /^[+]?[0-9]{1,10}(?:\.[0-9]{1,3})?$/;
      var imgShow = 'assets/images/attachment.gif';
      var foundError = '';
      var foundError = '';
      if (MeterSkidDetailJson.FlowMeterTotaliser == '') {
          foundError = 'Flow Meter Totaliser is required.';
          return foundError;
      }
      if((MeterSkidDetailJson.JumpReadingFMT == '' || MeterSkidDetailJson.JumpReadingFMT == undefined || parseFloat(MeterSkidDetailJson.JumpReadingFMT) == parseFloat("0")) && parseFloat(MeterSkidDetailJson.FlowMeterTotaliser) == parseFloat("0")) {
        foundError = 'Invalid Meter Skid Reading';
        return foundError;
    }
      if (MeterSkidDetailJson.FlowMeterTotaliser != "") {
          if (regexNumeric.test(MeterSkidDetailJson.FlowMeterTotaliser) == false) {
              foundError = 'Only numeric value allowed for reading.';
              return foundError;
          }
          if (regexDecimalThree.test(MeterSkidDetailJson.FlowMeterTotaliser) == false) {
              foundError = 'Three decimal with Max 10 Precision values allowed';
              return foundError;
          }
          if (parseFloat(MeterSkidDetailJson.FlowMeterTotaliser) < 0) {
              foundError = 'Flow Meter Totaliser must be Positive.';
              return foundError;
          }
      }
      if (MeterSkidDetailJson.JumpReadingFMT != '') {
              if (fileInput.files.length > 0) {
                  var validExtension = 'jpeg,jpg,png,gif,pdf';
                  for (var i = 0; i < fileInput.files.length; i++) {
                      var fileExtension = fileInput.files[i].name.split('.')[1];
                      if (validExtension.indexOf(fileExtension) < 0) {
                          foundError = 'Attachment allowed only for [' + validExtension + '].'; return foundError;
                      }
                  }
              }
          if (regexNumeric.test(MeterSkidDetailJson.JumpReadingFMT) == false) {
              foundError = 'Only numeric value allowed for Jump reading.'; return foundError;
          }
          if (regexDecimalThree.test(MeterSkidDetailJson.JumpReadingFMT) == false) {
              foundError = 'Three decimal with Max 10 Precision values allowed'; return foundError;
          }
      }
      var JumpReadingFMTCnt = MeterSkidDetailJson.JumpReadingFMTCount;
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
              foundError = 'FMT Jump Reading count must be Positive.';
              return foundError;
          }
          if (MeterSkidDetailJson.JumpReadingFMT == '' || (MeterSkidDetailJson.JumpReadingFMT == undefined)) {
            foundError = 'Please enter the Jump reading.';
            return foundError;
          }
          if (MeterSkidDetailJson.JumpReadingFMT == '' || parseFloat(MeterSkidDetailJson.JumpReadingFMT) == 0) {
            foundError = 'Plese enter the Jump Reading';
            return foundError;
          }
      }
      else {
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
            MeterOf: 'MS',
            MeterOfId: this.meterStationSkidData.MeterSkidId,
            MeterType: 'FMT',
            FlagRead: 0,
            FlagReadingType: this.resetTypeJsonSelected,
            Id: this.meterStationSkidData.MeterResetId,
            LoginId: localStorage.getItem('LoginId'),
            PrvReading: this.OldMeterReading,
            JumpReading: ((this.JReading == '') ? '0' : this.JReading),
            ReadingOnSwitch: ((this.meterStationSkidData.ReadingOnSwitch == '') ? '0' : this.meterStationSkidData.ReadingOnSwitch),
            FilePath: localStorage.getItem('LoginId') + "/MeterSkid/"
     };
      this.filesreset = $('#fileInputreset');
      var frmData = new FormData();
      var fileInputreset = this.filesreset[0];
      frmData.append("jsonDetail", JSON.stringify(MyJsonreset));
      if(this.uploadedfilereset != undefined) {
          frmData.append('JumpReadingFile', this.uploadedfilereset, this.uploadedfilereset.name);
         }
      var ErrorMsg = this.changeresetValidation(MyJsonreset);
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
   changeresetValidation(LcvDetailJsonreset) {
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
