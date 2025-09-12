import { Component, OnInit } from '@angular/core';
import { dbService } from '../../Service/db.service';
import { Response } from '@angular/http';
import { CookieService } from 'ngx-cookie-service';
declare var $:any;
@Component({
  selector: 'app-lcv',
  templateUrl: './lcv.component.html',
  styleUrls: ['./lcv.component.css']
})
export class LCVComponent implements OnInit {
stationLcvData:any=[];
stationLcvData1:any=[];
stationLcvData2:any=[];
LCVMeterTotaliserPrv:string="";
SAPEquipmentNumber:string="";
uploadedfile:File;
uploadedfilereset:File;
files:File;
filesreset:File;
lcvid:number=0;
lcvmeterTotaliser:string="";
jumpreading:string="";
jumpreadingcount:string="";
remark:string="";
OldMeterReading:string="";
JReading:string="";
resetTypeJsonSelected:string="";
isCRSentToHo:number;
isStationSubmitted:number;
filevisible:boolean=true;
popupfilevisible:boolean = true;
JumpVisible:boolean = true;
mdlShowResetImageLcv :boolean=false;
stationName:string="";
imgPathResetLcv:string="";
  constructor(private objDbServ: dbService, private objCook: CookieService) { 
    this.objDbServ.HeaderDisplay.emit(true);
    this.objDbServ.LeftMenu.emit(true);
  }
  ngOnInit() {
    this.stationName = JSON.parse(sessionStorage.getItem("globalDetail"))[0].UserName;
    this.GetStationLcv('-999');
  }
  GetStationLcv(id) {
    this.uploadedfile = null;
    this.lcvid = id;
    this.LCVMeterTotaliserPrv = "";
    this.SAPEquipmentNumber = "";
    var LoginId = localStorage.getItem('LoginId');
    this.objDbServ.ShowLoaders.emit(true);
    this.objDbServ.GetStationLcv({LoginId:LoginId, StationCode:LoginId, LcvId:id}).subscribe(
      (resp: any) => {
        const data = JSON.parse(resp.json());
        if(data[0].length != 0 && data[1].length != 0) {
            this.stationLcvData = JSON.parse(resp.json());
            this.stationLcvData1 = JSON.parse(resp.json())[1];
            this.stationLcvData2 = JSON.parse(resp.json())[0];
            this.lcvmeterTotaliser = this.stationLcvData1[0].LCVMeterTotaliser;
            this.jumpreading = this.stationLcvData1[0].JumpReadingLCV;
            this.jumpreadingcount = this.stationLcvData1[0].JumpReadingLCVCount;
            this.remark = this.stationLcvData1[0].Remark;
            this.isCRSentToHo = this.stationLcvData1[0].isCRSentToHo;
            this.isStationSubmitted = this.stationLcvData1[0].isStationSubmitted;
            if(parseFloat(this.jumpreading) > 0.000) {
                this.filevisible = false;
                $("#Ischeckbox").prop("checked", true);
                this.JumpVisible=false;
            } else  {
                this.filevisible= true;
                $("#Ischeckbox").prop("checked", false);
                this.JumpVisible =true;
            }
        if(id=='-999') {
            this.lcvid = this.stationLcvData2[0].LcvId;
        }
        this.stationLcvData1.forEach(element => {
          this.LCVMeterTotaliserPrv = element.LCVMeterTotaliserPrv;
          this.SAPEquipmentNumber = element.LcvCode;
        });
        this.objDbServ.ShowLoaders.emit(false);
    }
    else {
        alert('No LCV data available. Please try another station.')
        this.objDbServ.ShowLoaders.emit(false);
    }
      },
      (error) =>{alert('Something went wrong.');
      this.objDbServ.ShowLoaders.emit(false);
    }
    )
  }
  fileupload(file: FileList, event: any) {
    this.uploadedfile = file.item(0);
  }
  fileuploadreset(file: FileList, event: any) {
    this.uploadedfilereset = file.item(0);
  }
  jumpreadingValue(value) {
    this.jumpreading = value;
    if(this.jumpreading != '') {
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
  InsertStationLCV() {
    var MyJson = {
      LoginId: localStorage.getItem('LoginId'),
      LcvId: this.lcvid,
      LCVMeterTotaliser: this.lcvmeterTotaliser,
      JumpReadingLCV: ((this.jumpreading == '') ? '0' : this.jumpreading),
      JumpReadingLCVCount: this.jumpreadingcount,
      JumpCeritificateLCV: ((this.uploadedfile == undefined) ? '' : this.uploadedfile.name),
      Remark: this.remark,
      StationCode: localStorage.getItem('LoginId'),
      FilePath: localStorage.getItem('LoginId') + "/lcv/"
     };
  this.files = $('#fileInput');
  var frmData = new FormData();
  var fileInput = this.files[0];
  frmData.append("lcvDetail", JSON.stringify(MyJson));
  if(this.uploadedfile != undefined) {
    frmData.append('JumpReadingFile', this.uploadedfile, this.uploadedfile.name);
   }
  var ErrorMsg = this.checkStationValidations(MyJson, fileInput);
  if(ErrorMsg == '' || ErrorMsg == undefined) {
    if(Number(this.lcvmeterTotaliser) <= Number(this.LCVMeterTotaliserPrv)) {
        if(confirm("Suspected Meter Totaliser Reading, Do you want to continue?")) {
        this.objDbServ.InsertStationLCV(frmData).subscribe(
            (resp : any) => {
                const data = JSON.parse(resp._body);
                alert(data);
                if(data != '') {
                    this.GetStationLcv(this.lcvid);
                }
            },
            (error) =>{alert('Something went wrong.');
            this.objDbServ.ShowLoaders.emit(false);
        }
        )
    }
   } 
   else if(Number(this.lcvmeterTotaliser) >= 2*Number(this.LCVMeterTotaliserPrv)) {
    if(confirm("Suspected Meter Totaliser Reading, Do you want to continue?")) {
    this.objDbServ.InsertStationLCV(frmData).subscribe(
        (resp : any) => {
            const data = JSON.parse(resp._body);
            alert(data);
            if(data != '') {
                this.GetStationLcv(this.lcvid);
            }
        },
        (error) =>{alert('Something went wrong.');
        this.objDbServ.ShowLoaders.emit(false);
    }
    )
   }
   }  
   else {
        this.objDbServ.InsertStationLCV(frmData).subscribe(
            (resp : any) => {
                const data = JSON.parse(resp._body);
                alert(data);
                if(data != '') {
                    this.GetStationLcv(this.lcvid);
                }
            },
            (error) =>{alert('Something went wrong.');
            this.objDbServ.ShowLoaders.emit(false);
        }
        )
   }
  } 
  else {
    alert(ErrorMsg);
   }
}
  checkStationValidations(LcvDetailJson, fileInput) {
        var regexNumeric = /^[+-]?[0-9]{1,1000}(?:\.[0-9]{1,1000})?$/;
        var regexDecimalThree = /^[+-]?[0-9]{1,10}(?:\.[0-9]{1,3})?$/;
        var regexDecimalThreeNegative = /^[+]?[0-9]{1,10}(?:\.[0-9]{1,3})?$/;
        var imgShow = 'assets/images/attachment.gif';
        var foundError = '';
        var foundError = '';
        if (LcvDetailJson.LCVMeterTotaliser == '') {
            foundError = 'LCV Meter Totaliser is required.';
            return foundError;
        }
        if((LcvDetailJson.JumpReadingLCV == '' || LcvDetailJson.JumpReadingLCV == undefined || parseFloat(LcvDetailJson.JumpReadingLCV) == parseFloat("0")) && parseFloat(LcvDetailJson.LCVMeterTotaliser) == parseFloat("0")) {
            foundError = 'Invalid Meter Totaliser Reading';
            return foundError;
        }
        if (LcvDetailJson.LCVMeterTotaliser != "") {
            if (regexNumeric.test(LcvDetailJson.LCVMeterTotaliser) == false) {
                foundError = 'Only numeric value allowed for reading.';
                return foundError;
            }
            if (regexDecimalThree.test(LcvDetailJson.LCVMeterTotaliser) == false) {
                foundError = 'Three decimal with Max 10 Precision values allowed';
                return foundError;
            }
            if (parseFloat(LcvDetailJson.LCVMeterTotaliser) < 0) {
                foundError = 'LCV Meter Totaliser must be Positive.';
                return foundError;
            }
        }
        if (LcvDetailJson.JumpReadingLCV != '') {
                if (fileInput.files.length > 0) {
                    var validExtension = 'jpeg,jpg,png,gif';
                    for (var i = 0; i < fileInput.files.length; i++) {
                        var fileExtension = fileInput.files[i].name.split('.')[1];
                        if (validExtension.indexOf(fileExtension) < 0) {
                            foundError = 'Attachment allowed only for [' + validExtension + '].'; return foundError;
                        }
                    }
                }
            if (regexNumeric.test(LcvDetailJson.JumpReadingLCV) == false) {
                foundError = 'Only numeric value allowed for LCV Jump reading.'; return foundError;
            }
            if (regexDecimalThree.test(LcvDetailJson.JumpReadingLCV) == false) {
                foundError = 'Three decimal with Max 10 Precision values allowed'; return foundError;
            }
        }
        var JumpLcvCnt = LcvDetailJson.JumpReadingLCVCount;
        if (JumpLcvCnt != '' && parseFloat(JumpLcvCnt) != 0 && (JumpLcvCnt === undefined) == false) {
            if (regexNumeric.test(JumpLcvCnt) == false) {
                foundError = 'Only numeric value allowed for Lcv Jump reading count.';
                return foundError;
            }
            if (JumpLcvCnt.indexOf('.') > -1) {
                foundError = 'Decimal value not allowed for Lcv Jump reading count.';
                return foundError;
            }
            if (parseFloat(JumpLcvCnt) < 0) {
                foundError = 'Lcv Jump reading count must be Positive.';
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
                MeterOf: 'LCV',
                MeterOfId: this.lcvid,
                MeterType: 'LMT',
                FlagRead: 0,
                FlagReadingType: this.resetTypeJsonSelected,
                Id: this.stationLcvData1[0].MeterResetId,
                LoginId: localStorage.getItem('LoginId'),
                PrvReading: this.OldMeterReading,
                JumpReading: ((this.JReading == '') ? '0' : this.JReading),
                ReadingOnSwitch: ((this.stationLcvData1[0].ReadingOnSwitch == '') ? '0' : this.stationLcvData1[0].ReadingOnSwitch),
                FilePath: localStorage.getItem('LoginId') + "/lcv/"
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
                (resp: Response) => {
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
