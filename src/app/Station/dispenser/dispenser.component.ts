import { Component, OnInit } from '@angular/core';
import { dbService } from '../../Service/db.service';
import { CookieService } from 'ngx-cookie-service';
import { Response } from '@angular/http/src/static_response';
declare var $:any;
@Component({
  selector: 'app-dispenser',
  templateUrl: './dispenser.component.html',
  styleUrls: ['./dispenser.component.css']
})
export class DispenserComponent implements OnInit {
  DispenserList:any=[];
  DispenserDetails:any=[];
  DispenserId:string="";
  SAPEquipmentNumber1:string="";
  SAPEquipmentNumber2:string="";
  PreviousReadingArmA:string="";
  PreviousReadingArmB:string="";
  ArmA:string="";
  JumpReadingArmA:string="";
  JumpReadingArmACount:string="";
  ArmB:string="";
  JumpReadingArmB:string="";
  JumpReadingArmBCount:string="";
  Remark:string="";
  isStationSubmitted:string="";
  isCRSentToHo:string="";
  ArmASale:number = 0;
  ArmBSale:number = 0;
  TotalSale:number = 0;
  formFlag:boolean=false;
  JumpFileA:File;
  JumpFileB:File;
  filesA:File;
  filesB:File;
  filevisibleA:boolean=false;
  filevisibleB:boolean=false;
  JumpVisibleA:boolean=false;
  JumpVisibleB:boolean=false;
  resetTypeJsonSelected:string="";
  fileInput:File;
  file:File;
  OldMeterReadingA:string="";
  OldMeterReadingB:string="";
  JReadingA:string="";
  JReadingB:string="";
  popupfilevisibleA:boolean = true;
  popupfilevisibleB:boolean = true;
  JumpVisibleArmA:boolean = true;
  JumpVisibleArmB:boolean = true;
  stationName:string="";
  IscheckboxArmA:boolean=false;
  IscheckboxArmB:boolean=false;
  constructor(private objDbServ: dbService, private objCook: CookieService) { 
    this.objDbServ.HeaderDisplay.emit(true);
    this.objDbServ.LeftMenu.emit(true);
  }
  ngOnInit() { 
    this.stationName = JSON.parse(sessionStorage.getItem("globalDetail"))[0].UserName;
    this.GetStationDispenser('-999');
  }
  GetStationDispenser(DispId){
    try{
      this.objDbServ.ShowLoaders.emit(true);
      this.DispenserId = DispId;
      this.SAPEquipmentNumber1 = "";
      this.SAPEquipmentNumber2 = "";
      this.PreviousReadingArmA = "";
      this.PreviousReadingArmB = "";
      this.objDbServ.GetStationDispenser({StationCode:this.objCook.get('stationCode'),LoginId:this.objCook.get('stationCode'),DispenserId:DispId}).subscribe(
        (response: any)=>{
          const data = JSON.parse(response._body);  
          if(JSON.parse(data)[0].length > 0){
            this.DispenserList = JSON.parse(data)[0]; 
            this.DispenserDetails = JSON.parse(data)[1][0]; 
            if(this.DispenserDetails != undefined) {
                if(DispId=='-999') {
                    this.DispenserId = this.DispenserDetails.DispenserId;
                  }
                this.SAPEquipmentNumber1 = this.DispenserDetails.DispenserCodeA;
                this.SAPEquipmentNumber2 = this.DispenserDetails.DispenserCodeB;
                this.PreviousReadingArmA = this.DispenserDetails.ArmAPrv;
                this.PreviousReadingArmB = this.DispenserDetails.ArmBPrv;
                this.ArmA = this.DispenserDetails.ArmA;
                this.JumpReadingArmA = this.DispenserDetails.JumpReadingArmA;
                this.JumpReadingArmACount = this.DispenserDetails.JumpReadingArmACount;
                this.ArmB = this.DispenserDetails.ArmB;
                this.JumpReadingArmB = this.DispenserDetails.JumpReadingArmB;
                this.JumpReadingArmBCount = this.DispenserDetails.JumpReadingArmBCount;
                this.Remark = this.DispenserDetails.Remark;
                this.isStationSubmitted = this.DispenserDetails.isStationSubmitted;
                this.isCRSentToHo = this.DispenserDetails.isCRSentToHo;
                this.ArmASale = this.DispenserDetails.ArmASale;
                this.ArmBSale = this.DispenserDetails.ArmBSale;
                this.TotalSale = parseFloat(this.DispenserDetails.ArmASale) + parseFloat(this.DispenserDetails.ArmBSale);
                this.objDbServ.ShowLoaders.emit(false);
                if(this.DispenserDetails.isStationSubmitted == "0") {
                  this.formFlag = true;
                }else {
                  this.formFlag = false;
                }
                if(this.formFlag == true && this.JumpReadingArmA != '') {
                  this.filevisibleA = false;
                 }else  {
                  this.filevisibleA =true;
                }
                if(this.formFlag == true && this.JumpReadingArmB != '') {
                  this.filevisibleB = false;
                 }else  {
                  this.filevisibleB =true;
                }
                if(parseFloat(this.JumpReadingArmA) > 0.000) {
                    this.filevisibleA = false;
                    $("#IscheckboxArmA").prop("checked", true);
                    this.JumpVisibleArmA=false;
                }else {
                    this.filevisibleA= true;
                    $("#IscheckboxArmA").prop("checked", false);
                    this.JumpVisibleArmA =true;
                }
                if(parseFloat(this.JumpReadingArmB) > 0.000) {
                    this.filevisibleB = false;
                    $("#IscheckboxArmB").prop("checked", true);
                    this.JumpVisibleArmB=false;
                }else {
                    this.filevisibleB= true;
                    $("#IscheckboxArmB").prop("checked", false);
                    this.JumpVisibleArmB =true;
                }
            }
            else {
                alert('No Dispenser data available. Please try another station.')
                this.objDbServ.ShowLoaders.emit(false); 
            }
          }
          else{
            alert('No Dispenser data available. Please try another station.')
            this.objDbServ.ShowLoaders.emit(false);
          }             
        },
        (error)=>{
        }  
      );
    }
    catch(err){
    }
  }
  OnCheckboxChange(evt, flag : any) {
    if(flag == "ArmA") { 
        if(evt.target.checked==true) 
        this.JumpVisibleArmA = false;
        else if(evt.target.checked==false)
        this.JumpVisibleArmA = true;  
    } 
    else {
        if(evt.target.checked==true) 
        this.JumpVisibleArmB = false;
        else if(evt.target.checked==false)
        this.JumpVisibleArmB = true;  
    }  
}
  fileuploadA(file: FileList, event: any) {
    this.JumpFileA = file.item(0);
  }
  fileuploadB(file: FileList, event: any) {
    this.JumpFileB = file.item(0);
  }
  InsertDispenser() {
    var formData = new FormData();
    var MyJson = {
      LoginId: localStorage.getItem('LoginId'),
      DispenserId: this.DispenserId,
      ShiftFlag: this.DispenserDetails.ShiftFlag,
      DispenserCodeA: this.DispenserDetails.DispenserCodeA,
      DispenserCodeB: this.DispenserDetails.DispenserCodeB,
      ArmA: this.ArmA,
      JumpReadingArmA: ((this.JumpReadingArmA == '') ? '0' : this.JumpReadingArmA),
      JumpReadingArmACount: this.JumpReadingArmACount,
      JumpCeritificateArmA: ((this.JumpFileA == undefined) ? '' : this.JumpFileA.name),
      ArmB: this.ArmB,
      JumpReadingArmB: ((this.JumpReadingArmB == '') ? '0' : this.JumpReadingArmB),
      JumpReadingArmBCount: this.JumpReadingArmBCount,
      JumpCeritificateArmB: ((this.JumpFileB == undefined) ? '' : this.JumpFileB.name),
      Remark: this.Remark,
      StationCode: localStorage.getItem('LoginId'),
      FilePath: this.DispenserDetails.StationCode + "/dispenser/",
      PrvReadingA: this.DispenserDetails.ArmAPrv,
      PrvReadingB: this.DispenserDetails.ArmBPrv
     };
  this.filesA = $('#JumpCertificateArmA');
  this.filesB = $('#JumpCertificateArmB');
  var fileInputA = this.filesA[0];
  var fileInputB = this.filesB[0];
  formData.append("dispenserDetail", JSON.stringify(MyJson));
  if(this.JumpFileA != undefined) {
    formData.append('JumpCertificateA', this.JumpFileA, this.JumpFileA.name);
  }
  if(this.JumpFileB != undefined) {
    formData.append('JumpCertificateB', this.JumpFileB, this.JumpFileB.name);
  } 
  var ErrorMsg = this.checkDispenserValidations(MyJson, fileInputA, fileInputB);
  if(ErrorMsg == '' || ErrorMsg == undefined) {
    if(Number(MyJson.ArmA) <= Number(this.PreviousReadingArmA)) {
        if(confirm("Suspected Arm-A Reading, Do you want to continue?")) {
          if(Number(MyJson.ArmB) <= Number(this.PreviousReadingArmB)) {
            if(confirm("Suspected Arm-B Reading, Do you want to continue?")) {
              this.insertDispenserRequest(formData);
            }}else {
              this.insertDispenserRequest(formData);
            }
        }
    }else if(Number(MyJson.ArmA) > Number(this.PreviousReadingArmA) && Number(MyJson.ArmB) <= Number(this.PreviousReadingArmB)) {
      if(confirm("Suspected Arm-B Reading, Do you want to continue?")) {
        this.insertDispenserRequest(formData);
      }
    }
    else if(Number(MyJson.ArmA) >= 2*Number(this.PreviousReadingArmA)) {
        if(confirm("Suspected Arm-A Reading, Do you want to continue?")) {
          if(Number(MyJson.ArmB) >= 2*Number(this.PreviousReadingArmB)) {
            if(confirm("Suspected Arm-B Reading, Do you want to continue?")) {
              this.insertDispenserRequest(formData);
            }}else {
              this.insertDispenserRequest(formData);
            }
        }
    }else if(Number(MyJson.ArmA) > Number(this.PreviousReadingArmA) && Number(MyJson.ArmB) >= 2*Number(this.PreviousReadingArmB)) {
      if(confirm("Suspected Arm-A Reading, Do you want to continue?")) {
        this.insertDispenserRequest(formData);
      }
    }
    else {
      this.insertDispenserRequest(formData);
    }
  }else {
    alert(ErrorMsg);
  }
}
insertDispenserRequest(formData) {
  this.objDbServ.InsertDispenser(formData).subscribe(
    (resp : any) => {
        const data = JSON.parse(resp._body);
        alert(data.Status);
        if(data != '') {
            this.GetStationDispenser(this.DispenserId);
        }
    },
    (error) =>{alert('Something went wrong.');
    this.objDbServ.ShowLoaders.emit(false);
  }
  )
}
jumpreadingValueA(value) {
  this.JumpReadingArmA = value;
  if(this.JumpReadingArmA != '') {
      this.filevisibleA = false;
  }else {
      this.filevisibleA = true;
  }
}
jumpreadingValueB(value) {
  this.JumpReadingArmB = value;
  if(this.JumpReadingArmB != '') {
      this.filevisibleB = false;
  }else {
      this.filevisibleB = true;
  }
}
  checkDispenserValidations(DspnsrDetailJson, fileInputArmA, fileInputArmB) {
    var regexNumeric = /^[+-]?[0-9]{1,1000}(?:\.[0-9]{1,1000})?$/;
    var regexDecimalThree = /^[+-]?[0-9]{1,10}(?:\.[0-9]{1,3})?$/;
    var regexDecimalThreeNegative = /^[+]?[0-9]{1,10}(?:\.[0-9]{1,3})?$/;
    var imgShow = 'assets/images/attachment.gif';
    var foundError = '';
    if (DspnsrDetailJson.ArmA == '') {
        foundError = 'Arm-A Reading is required.';
        return foundError;
    }
    if((DspnsrDetailJson.JumpReadingArmA == '' || DspnsrDetailJson.JumpReadingArmA == undefined || parseFloat(DspnsrDetailJson.JumpReadingArmA) == parseFloat("0")) && parseFloat(DspnsrDetailJson.ArmA) == parseFloat("0")) {
        foundError = 'Invalid Arm-A Reading';
        return foundError;
    }
    if (DspnsrDetailJson.ArmA != "") {
        if (regexNumeric.test(DspnsrDetailJson.ArmA) == false) {
            foundError = 'Only numeric value allowed for reading.';
            return foundError;
        }
        if (regexDecimalThree.test(DspnsrDetailJson.ArmA) == false) {
            foundError = 'Three decimal with Max 10 Precision values allowed';
            return foundError;
        }
        if (parseFloat(DspnsrDetailJson.ArmA) < 0) {
            foundError = 'Arm A must be positive';
            return foundError;
        }
    }
    if (DspnsrDetailJson.ArmB == '') {
        foundError = 'Arm-B Reading is required.';
        return foundError;
    }
    if((DspnsrDetailJson.JumpReadingArmB == '' || DspnsrDetailJson.JumpReadingArmB == undefined || parseFloat(DspnsrDetailJson.JumpReadingArmB) == parseFloat("0")) && parseFloat(DspnsrDetailJson.ArmB) == parseFloat("0")) {
        foundError = 'Invalid Arm-B Reading';
        return foundError;
    }
    var jumpArmA = DspnsrDetailJson.JumpReadingArmA;
    var JumpArmACnt = DspnsrDetailJson.JumpReadingArmACount;
    if (jumpArmA != '') {
        if (fileInputArmA.files.length > 0) {
            var validExtension = 'jpeg,jpg,png,gif';
            for (var i = 0; i < fileInputArmA.files.length; i++) {
                var fileExtension = fileInputArmA.files[i].name.split('.')[1];
                if (validExtension.indexOf(fileExtension) < 0) {
                    foundError = 'Attachment allowed only for [' + validExtension + '].'; return foundError;
                }
            }
        }
        if (regexNumeric.test(jumpArmA) == false) {
            foundError = 'Only numeric value allowed for Jump reading.'; return foundError;
        }
        if (regexDecimalThree.test(jumpArmA) == false && jumpArmA != undefined) {
            foundError = 'Three decimal with Max 10 Precision values allowed'; return foundError;
        }
    }
    if (JumpArmACnt != '' && parseFloat(JumpArmACnt) != 0 && JumpArmACnt != undefined) {
        if (regexNumeric.test(JumpArmACnt) == false) {
            foundError = 'Only numeric value allowed for ArmA Jump reading count.'; return foundError;
        }
        if (JumpArmACnt.indexOf('.') > -1) {
            foundError = 'Decimal value not allowed for ArmA Jump reading count.'; return foundError;
        }
        if (parseFloat(JumpArmACnt) < 0) {
            foundError = 'ArmA Jump Reading count must be Positive.';
            return foundError;
        }
        if (jumpArmA == '' || jumpArmA == undefined) {
            foundError = 'Please enter the ArmA Jump reading.';
            return foundError;
        }
        if (jumpArmA == '' || parseFloat(jumpArmA) == 0) {
            foundError = 'Plese enter the Jump Reading'; return foundError;
        }
    }
    else {
        if (jumpArmA != '' && parseFloat(jumpArmA) != 0) {
            foundError = 'Plese enter the ArmA Jump Reading count.'; return foundError;
        }
    }
    if (DspnsrDetailJson.ArmB != "") {
        if (regexNumeric.test(DspnsrDetailJson.ArmB) == false) {
            foundError = 'Only numeric value allowed for reading.';
            return foundError;
        }
        if (regexDecimalThree.test(DspnsrDetailJson.ArmB) == false) {
            foundError = 'Three decimal with Max 10 Precision values allowed';
            return foundError;
        }
        if (parseFloat(DspnsrDetailJson.ArmB) < 0) {
            foundError = 'Arm B must be Positive.';
            return foundError;
        }
    }
    var jumpArmB = DspnsrDetailJson.JumpReadingArmB;
    var JumpArmBCnt = DspnsrDetailJson.JumpReadingArmBCount;
    if (jumpArmB != '') {
        if (fileInputArmB.files.length > 0) {
            var validExtension = 'jpeg,jpg,png,gif';
            for (var i = 0; i < fileInputArmB.files.length; i++) {
                var fileExtension = fileInputArmB.files[i].name.split('.')[1];
                if (validExtension.indexOf(fileExtension) < 0) {
                    foundError = 'Attachment allowed only for [' + validExtension + '].'; return foundError;
                }
            }
        }
        if (regexNumeric.test(jumpArmB) == false) {
            foundError = 'Only numeric value allowed for ArmB Jump reading.'; return foundError;
        }
        if (regexDecimalThree.test(jumpArmB) == false && jumpArmB != undefined) {
            foundError = 'Three decimal with Max 10 Precision values allowed'; return foundError;
        }
    }
    if (JumpArmBCnt != '' && parseFloat(JumpArmBCnt) != 0 && JumpArmBCnt != undefined) {
        if (regexNumeric.test(JumpArmBCnt) == false) {
            foundError = 'Only numeric value allowed for ArmB Jump reading count.'; return foundError;
        }
        if (JumpArmBCnt.indexOf('.') > -1) {
            foundError = 'Decimal value not allowed for ArmB Jump reading count.'; return foundError;
        }
        if (parseFloat(JumpArmBCnt) < 0) {
            foundError = 'ArmB Jump reading count must be Positive.';
            return foundError;
        }
        if (jumpArmB == '' || jumpArmB == undefined) {
            foundError = 'Please enter the ArmB Jump reading.';
            return foundError;
        }
        if (jumpArmB == '' || parseFloat(jumpArmB) == 0) {
            foundError = 'Plese enter the Jump Reading'; return foundError;
        }
    }
    else {
        if (jumpArmB != '' && parseFloat(jumpArmB) != 0) {
            foundError = 'Plese enter the ArmB Jump Reading count.'; return foundError;
        }
    }
    return foundError;
  }
  resetchange(value) {
    this.resetTypeJsonSelected = value;
  }
  fileuploadresetA(file: FileList, event: any) {
    this.fileInput = file.item(0);
  }
  fileuploadresetB(file: FileList, event: any) {
    this.fileInput = file.item(0);
  }
  JReadingvalueA(value) {
    this.JReadingA = value;
    if(this.JReadingA!='') {
        this.popupfilevisibleA = false;
    }else {
        this.popupfilevisibleA = true;
    }
  }
JReadingvalueB(value) {
    this.JReadingB = value;
    if(this.JReadingB!='') {
        this.popupfilevisibleB = false;
    }else {
        this.popupfilevisibleB = true;
    }
  }
changeresetpopup(flag) {
  var PrvReading = "";
  var JumpReading = "";
  var MeterResetId = "";
  var ReadingOnSwitch = "";
    if(flag == 'ArmA') {
      this.file = $('#jcMeterResetArmA');
      var fileInput = this.file[0];
      var jsonValidation = {
        PrvReading: this.OldMeterReadingA,
        JumpReading: this.JReadingA,
        fileObject: this.file
    };
    var retJson = this.changeresetValidation(jsonValidation);
      if (retJson != '') {
        alert(retJson);
        return false;
      };
      PrvReading = this.OldMeterReadingA;
      JumpReading = this.JReadingA;
      ReadingOnSwitch = this.OldMeterReadingA;
    }
    else if(flag == 'ArmB') {
      this.file = $('#jcMeterResetArmB');
      var fileInput = this.file[0];
      var jsonValidation = {
        PrvReading: this.OldMeterReadingB,
        JumpReading: this.JReadingB,
        fileObject: this.file
    };
    var retJson = this.changeresetValidation(jsonValidation);
      if (retJson != '') {
        alert(retJson);
        return false;
      };
      PrvReading = this.OldMeterReadingB;
      JumpReading = this.JReadingB;
      ReadingOnSwitch = this.OldMeterReadingB;
    }
    var MyJsonreset = {
      StationCode: localStorage.getItem('LoginId'),
      MeterOf: 'DISP',
      MeterOfId: this.DispenserId,
      MeterType: flag,
      FlagRead: 0,
      FlagReadingType: this.resetTypeJsonSelected,
      LoginId: localStorage.getItem('LoginId'),
      PrvReading: PrvReading,
      JumpReading: ((JumpReading == '') ? '0' : JumpReading),
      ReadingOnSwitch: ((ReadingOnSwitch == '') ? '0' : ReadingOnSwitch),
      FilePath: localStorage.getItem('LoginId') + "/dispenser/"
     };
    var frmData = new FormData();
    var fileInputreset = this.file[0];
    frmData.append("jsonDetail", JSON.stringify(MyJsonreset));
    if(this.fileInput != undefined) {
        frmData.append('JumpReadingFile', this.fileInput, this.fileInput.name);
       }    
        this.objDbServ.HoldResetReading(frmData).subscribe(
            (resp: Response) => {
            },
            (error) =>{alert('Something went wrong.');
            this.objDbServ.ShowLoaders.emit(false);
        }
        )   
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
ArmReadingValue (value,flag) {
    if(flag == 'ArmA') {
        this.ArmA = value;  
        if(value == 0 || value == '') {
            this.ArmASale = 0;
            this.TotalSale = this.ArmASale + this.ArmBSale;
        }else {
            this.ArmASale = parseFloat(this.ArmA) - parseFloat(this.PreviousReadingArmA);
            this.TotalSale = this.ArmASale + this.ArmBSale;
        } 
    }
    else {
        this.ArmB = value;
        if(value == 0 || value == '') {
            this.ArmBSale = 0;
            this.TotalSale = this.ArmASale + this.ArmBSale;
        }else {
            this.ArmBSale = parseFloat(this.ArmB) - parseFloat(this.PreviousReadingArmB);
            this.TotalSale = this.ArmASale + this.ArmBSale;
        }
    }
}
}
