import { Component, OnInit } from '@angular/core';
import { dbService } from '../../Service/db.service';
import { Response } from '@angular/http';
import { CookieService } from 'ngx-cookie-service';
import { isUndefined } from 'util';
import { MAX_LENGTH_VALIDATOR } from '@angular/forms/src/directives/validators';
import { tick } from '@angular/core/testing';
declare var $:any;
@Component({
  selector: 'app-package',
  templateUrl: './package.component.html',
  styleUrls: ['./package.component.css']
})
export class PackageComponent implements OnInit {
  TablesPkgs:any[];
  PackageDetailJson:any = [];
  resetMeterJSON:any[];
  globalDetail:any = JSON.parse(sessionStorage.getItem('globalDetail'));
  summary:any = { 
    prm_id: (this.globalDetail[0].prm_id == null || this.globalDetail[0].prm_id === undefined) ? 0 : this.globalDetail[0].prm_id
   };
  filesSFM:File;
  filesDFM:File;
  filesEFM:File;
  JumpfilesSFM:File;
  JumpfilesDFM:File;
  JumpfilesEFM:File;
  ActionTypeSFM:string="";
  ActionTypeDFM:string="";
  ActionTypeEFM:string="";
  flag:string="";
  arrPath:string="";
  SelectedPkgId = {PkgId:"0"};
  mdlResetPopup:boolean=false;
  LoginId:string= localStorage.getItem('LoginId');
  StationCode:string= localStorage.getItem('LoginId');
  MeterSkidCode:string="";
  isCRSentToHo:number;
  isStationSubmitted:number;
  glovalJson:any = JSON.parse(sessionStorage.getItem('globalDetail'));
  PackageId:string="0";
  PackageCode:string="";
  SuctionPressure:string="";
  PrimeMover:string="";
  Remark:string="";
  mdlSelectedRemark:string="";
  mdlRemarkTextShow:boolean=true;
  mdlRemark:string="";
  JumpReadingEFMCount:string="";
  JumpCertificateEFM:string="";
  JumpReadingEFM:string="";
  mdlShowCertificates:boolean=false;
  mdlResetPopupDFM:boolean=false;
  JumpReadingDFM:string="";
  JumpReadingDFMCount:string="";
  JumpCertificateDFM:string="";
  DischargeFlowMeterReading:string="";
  DischargeFlowMeterReadingPrv:string="";
  EngineFlowMeterReading:string="";
  EngineFlowMeterReadingPrv:string="";
  JumpReadingSFMCount:string="";
  JumpCertificateSFM:string="";
  JumpReadingSFM:string="";
  SuctionFlowMeterReading:string="";
  SuctionFlowMeterReadingPrv:string="";
  SelectedRegion:string='';
resetTypeJsonSelectedSFM:any= '0';
resetTypeJsonSelectedDFM:any= '0';
resetTypeJsonSelectedEFM:any= '0';
  resetTypeJsonSFM = [{ Text: 'Reset' }, { Text: 'Change'}];
  resetTypeJsonDFM = [{ Text: 'Reset' }, { Text: 'Change'}];
  resetTypeJsonEFM = [{ Text: 'Reset' }, { Text: 'Change'}];
  jsonRemarks = [
    { text: 'Breakdown due to Leakage', value: 'Breakdown due to Leakage' },
    { text: 'Mechanical breakdown', value: 'Mechanical breakdown' },
    { text: 'Instrumentation breakdown', value: 'Instrumentation breakdown' },
    { text: 'Powercut', value: 'Powercut' },
    { text: 'Voltage problem', value: 'Voltage problem' },
    { text: 'Other', value: 'Other' }
];
RunHrs:any=[];
RunMin:any=[];
selectedRhHr:string='';
selectedRhMin:string='';
selectedSHr:string='';
selectedSMin:string='';
selectedUsHr:string='';
selectedUsMin:string='';
selectedBdHr:string='';
selectedBdMin:string='';
ShowEngineMeter:boolean=false;
mdlImgShowDFM:boolean=false;
mdlImgShowSFM:boolean=false;
mdlImgShowEFM:boolean=false;
mdlResetPopupSFM:boolean=false;
imgPathDFM:string="";
imgPathSFM:string="";
imgPathEFM:string="";
mdlReadingOnSwitchSFM:string='0.000';
mdlShowResetImageSFM:boolean= false;
mdlShowResetReadingSFM:boolean= false;
ResetMeterReadingOfTodaySFM:string='';
meterResetIdSFM:string="";
imgSFM:string='';
imgPathResetSFM:string='';
mdlResetJumpReadingSFM:string='0.000';
mdlShowResetImageDFM:boolean= false;
meterResetIdDFM:string='';
ResetMeterReadingOfTodayDFM:string='';
mdlResetJumpReadingDFM:string='0.000';
imgDFM:string='';
imgPathResetDFM:string='';
mdlShowResetReadingDFM:boolean= false;
mdlReadingOnSwitchDFM:string= "";
mdlReadingOnSwitchEFM:string="";
meterResetIdEFM:string="";
ResetMeterReadingOfTodayEFM:string='';
mdlResetJumpReadingEFM:string='0.000';
imgEFM:string='';
imgPathResetEFM:string='';
mdlShowResetImageEFM:boolean=false;
mdlShowResetReadingEFM:boolean=false;
mdlResetPopupEFM:boolean=false;
JumpVisibleSFS:boolean=true;
JumpVisibleDFS:boolean=true;
JumpVisibleEFS:boolean=true;
stationName:string="";
getTimeStats() {
  var minutes = [
              { min: '00' }, { min: '01' }, { min: '02' }, { min: '03' }, { min: '04' }, { min: '05' }, { min: '06' }, { min: '07' }, { min: '08' }, { min: '09' }, { min: '10' }, { min: '11' }, { min: '12' },
              { min: '13' }, { min: '14' }, { min: '15' }, { min: '16' }, { min: '17' }, { min: '18' }, { min: '19' }, { min: '20' }, { min: '21' }, { min: '22' }, { min: '23' }, { min: '24' },
              { min: '25' }, { min: '26' }, { min: '27' }, { min: '28' }, { min: '29' }, { min: '30' }, { min: '31' }, { min: '32' }, { min: '33' }, { min: '34' }, { min: '35' }, { min: '36' },
              { min: '37' }, { min: '38' }, { min: '39' }, { min: '40' }, { min: '41' }, { min: '42' }, { min: '43' }, { min: '44' }, { min: '45' }, { min: '46' }, { min: '47' }, { min: '48' },
              { min: '49' }, { min: '50' }, { min: '51' }, { min: '52' }, { min: '53' }, { min: '54' }, { min: '55' }, { min: '56' }, { min: '57' }, { min: '58' }, { min: '59' }
  ];
  var hours = [
      { hrs: '00' }, { hrs: '01' }, { hrs: '02' }, { hrs: '03' },{ hrs: '04' }, { hrs: '05' }, { hrs: '06' }, { hrs: '07' },
      { hrs: '08' }, { hrs: '09' }, { hrs: '10' }, { hrs: '11' },{ hrs: '12' }, { hrs: '13' }, { hrs: '14' }, { hrs: '15' },
      { hrs: '16' }, { hrs: '17' }, { hrs: '18' }, { hrs: '19' },{ hrs: '20' }, { hrs: '21' }, { hrs: '22' }, { hrs: '23' }, { hrs: '24' }   
  ];
  var timeStats = {
      minutes: minutes,
      hours: hours
  };
  return timeStats;
}
SHrs:any=[];
SMin:any=[];
UsHrs:any=[];
UsMin:any=[];
BdHrs:any=[];
BdMin:any=[];
glovalList:any=[];
IscheckboxSFS:boolean=false;
IscheckboxDFS:boolean=false;
IscheckboxEFS:boolean=false;
  constructor(private objDbServ: dbService, private objCook: CookieService) {
     this.objDbServ.HeaderDisplay.emit(true);
     this.objDbServ.LeftMenu.emit(true);
  }
  ngOnInit() { 
    this.stationName = JSON.parse(sessionStorage.getItem("globalDetail"))[0].UserName;
    this.glovalList = this.objDbServ.GlovalValues();
    var timeStats = this.getTimeStats();
    this.RunHrs = timeStats.hours; 
    this.RunMin = timeStats.minutes;
    this.selectedRhHr = this.RunHrs[0]; 
    this.selectedRhMin = this.RunMin[0];
    this.SHrs = timeStats.hours; 
    this.SMin = timeStats.minutes;
    this.selectedSHr = this.SHrs[0]; 
    this.selectedSMin = this.SMin[0];
    this.UsHrs = timeStats.hours; 
    this.UsMin = timeStats.minutes;
    this.selectedUsHr = this.UsHrs[0]; 
    this.selectedUsMin = this.UsMin[0];
    this.BdHrs = timeStats.hours; 
    this.BdMin = timeStats.minutes;
    this.selectedBdHr = this.BdHrs[0]; 
    this.selectedBdMin = this.BdMin[0];
    this.GetPackageDetail('-999');
  }
  GetPackageDetail(PackageId){
    this.PackageId = PackageId;
    const obj = {
        StationCode: this.StationCode,
        LoginId: this.LoginId,
        PackageId: (this.PackageId=='') ? '-999' : this.PackageId
     };
    this.objDbServ.GetPackageDetail(obj).subscribe(
      (resp: Response) => {
          const data = JSON.parse(resp.json());
         if(data[0].length > 0) {
             this.TablesPkgs = data[0];
             this.PackageDetailJson = data[1];
             this.PackageCode = this.PackageDetailJson[0].PackageCode;
             this.SelectedPkgId = { PkgId:this.PackageDetailJson[0].PackageId };
             this.PackageId = this.PackageDetailJson[0].PackageId;
             this.isCRSentToHo = this.PackageDetailJson[0].isCRSentToHo;
             this.isStationSubmitted = this.PackageDetailJson[0].isStationSubmitted;
             if (!isUndefined(this.PackageDetailJson)) {
                if (data[0].length > 0)
                    this.SelectedPkgId = { PkgId: this.PackageDetailJson[0].PackageId };
                if (this.PackageDetailJson[0].PrimeMover == 'E')
                    this.ShowEngineMeter = true;
                else
                    this.ShowEngineMeter = false;
             var pathSFM = this.PackageDetailJson[0].JumpCertificateSFM;
             if (pathSFM != '' && isUndefined(pathSFM) == false) {
                 this.mdlImgShowSFM = true;
                 this.imgPathSFM =this.glovalList.imgBaseUrl + pathSFM; 
             }
             var pathDFM = this.PackageDetailJson[0].JumpCertificateDFM;
             if (pathDFM != '' && isUndefined(pathDFM) == false) {
                 this.mdlImgShowDFM = true;
                 this.imgPathDFM = this.glovalList.imgBaseUrl + pathDFM; 
             }
             var patheEFM = this.PackageDetailJson[0].JumpCertificateEFM;
             if (patheEFM != '' && isUndefined(patheEFM) == false) {
                 this.mdlImgShowEFM = true;
                 this.imgPathEFM = this.glovalList.imgBaseUrl + patheEFM; 
             }
             this.SuctionFlowMeterReading=this.PackageDetailJson[0].SuctionFlowMeterReading;
             this.SuctionFlowMeterReadingPrv=this.PackageDetailJson[0].SuctionFlowMeterReadingPrv;
             this.DischargeFlowMeterReading=this.PackageDetailJson[0].DischargeFlowMeterReading;
             this.DischargeFlowMeterReadingPrv=this.PackageDetailJson[0].DischargeFlowMeterReadingPrv;
             this.EngineFlowMeterReading=this.PackageDetailJson[0].EngineFlowMeterReading;
             this.EngineFlowMeterReadingPrv=this.PackageDetailJson[0].EngineFlowMeterReadingPrv;
             this.JumpReadingSFM = this.PackageDetailJson[0].JumpReadingSFM;
             if(parseFloat(this.JumpReadingSFM) > 0.000) {
                $("#IscheckboxSFS").prop("checked", true);
                this.JumpVisibleSFS =false;
             }
             else  {
                $("#IscheckboxSFS").prop("checked", false);
                this.JumpVisibleSFS =true;
             }
             this.JumpReadingSFMCount = this.PackageDetailJson[0].JumpReadingSFMCount;
             this.JumpCertificateSFM = this.PackageDetailJson[0].JumpCertificateSFM;
             this.JumpReadingDFM = this.PackageDetailJson[0].JumpReadingDFM;
             if(parseFloat(this.JumpReadingDFM) > 0.000) {
                $("#IscheckboxDFS").prop("checked", true);
                this.JumpVisibleDFS =false;
             }
             else  {
                $("#IscheckboxDFM").prop("checked", false);
                this.JumpVisibleDFS =true;
             }
             this.JumpReadingDFMCount = this.PackageDetailJson[0].JumpReadingDFMCount;
             this.JumpCertificateDFM = this.PackageDetailJson[0].JumpCertificateDFM;
             this.JumpReadingEFM = this.PackageDetailJson[0].JumpReadingEFM;
             if(parseFloat(this.JumpReadingEFM) > 0.000) {
                $("#IscheckboxEFS").prop("checked", true);
                this.JumpVisibleEFS =false;
             }
             else  {
                $("#IscheckboxEFS").prop("checked", false);
                this.JumpVisibleEFS =true;
             }
             this.JumpReadingEFMCount = this.PackageDetailJson[0].JumpReadingEFMCount;
             this.JumpCertificateEFM = this.PackageDetailJson[0].JumpCertificateEFM;
             this.PrimeMover = this.PackageDetailJson[0].PrimeMover;
             this.SuctionPressure = this.PackageDetailJson[0].SuctionPressure;           
             this.selectedRhHr= this.PackageDetailJson[0].RunninInHours;
             this.selectedRhMin= this.PackageDetailJson[0].RunningInMinutes
             var runInHrs = this.PackageDetailJson[0].RunninInHours, runInMins = this.PackageDetailJson[0].RunningInMinutes;
             this.selectedRhHr = this.PackageDetailJson[0].RunninInHours; 
             this.selectedRhMin = this.PackageDetailJson[0].RunningInMinutes; 
             this.selectedUsHr= this.PackageDetailJson[0].UnscheduledShutdownInHours;
             this.selectedUsMin= this.PackageDetailJson[0].UnscheduledShutdownInMinutes;
             this.selectedSHr = this.PackageDetailJson[0].ScheduleShutdownInHours;
             this.selectedSMin= this.PackageDetailJson[0].ScheduleShutdownInMinutes;
             this.selectedBdHr =  this.PackageDetailJson[0].BreakdownInHours
             this.selectedBdMin = this.PackageDetailJson[0].BreakdownInMinutes
             this.Remark = this.PackageDetailJson[0].Remark;
             var pkgRemark = this.PackageDetailJson[0].Remark;
            if(this.Remark == "Breakdown due to Leakage" || this.Remark == "Instrumentation breakdown" || this.Remark == "Mechanical breakdown" || this.Remark == "Instrumentation breakdown" || this.Remark == "Powercut" || this.Remark == "Voltage problem"){
                this.mdlSelectedRemark = this.Remark;
                this.mdlRemarkTextShow = true;
             }
             else if(this.Remark != "") {
                this.mdlSelectedRemark = "Other";
                this.mdlRemarkTextShow = false;
                this.mdlRemark = this.PackageDetailJson[0].Remark;
             }
             else {
                this.mdlSelectedRemark="";
                this.mdlRemark="";
             }
             this.resetMeterJSON = data[2];
             var resetMeterJSON = data[2];
             this.mdlShowResetImageSFM = false;
             this.mdlShowResetImageEFM = false;
             this.mdlShowResetImageDFM = false;
             this.mdlShowResetReadingSFM = false;
             if (!isUndefined(resetMeterJSON) && resetMeterJSON.length > 0) {
              var resetSFM = this.resetMeterJSON[0];
              resetSFM.MeterType = "SFM";
              if (!isUndefined(resetSFM))
                  if (resetSFM.ReadingOnSwitch == -999)
                      this.mdlShowResetReadingSFM = false;
                  else {
                      this.mdlShowResetReadingSFM = true;
                      this.mdlReadingOnSwitchSFM = resetSFM.ReadingOnSwitch;
                      this.ResetMeterReadingOfTodaySFM = resetSFM.ResetMeterReadingOfToday;
                      this.meterResetIdSFM = resetSFM.MeterResetId;
                      this.mdlResetJumpReadingSFM = resetSFM.JumpReading;
                      if (resetSFM.JumpCertificateReset != '-999' && resetSFM.JumpCertificateReset != '') {
                          this.imgSFM = resetSFM.JumpCertificateReset;
                          this.imgPathResetSFM = this.glovalList.imgBaseUrl + resetSFM.JumpCertificateReset;
                          this.mdlShowResetImageSFM = true;
                      }
                  }
                    var resetDFM = this.resetMeterJSON[0];
                    resetDFM.MeterType = "DFM";
                   if (!isUndefined(resetDFM))
                    if (resetDFM.ReadingOnSwitch == -999)
                        this.mdlShowResetReadingDFM = false;
                    else {
                        this.mdlShowResetReadingDFM = true;
                        this.mdlReadingOnSwitchDFM = resetDFM.ReadingOnSwitch;
                        this.meterResetIdDFM = resetDFM.MeterResetId;
                        this.ResetMeterReadingOfTodayDFM = resetDFM.ResetMeterReadingOfToday;
                        this.mdlResetJumpReadingDFM = resetDFM.JumpReading;
                        if (resetDFM.JumpCertificateReset != '-999' && resetDFM.JumpCertificateReset != '') {
                            this.imgDFM = resetDFM.JumpCertificateReset;
                            this.imgPathResetDFM = this.glovalList.imgBaseUrl + resetDFM.JumpCertificateReset;
                            this.mdlShowResetImageDFM = true;
                        }
                    }
                    var resetEFM = this.resetMeterJSON[0];
                    resetDFM.MeterType = "EFM";
                    if (!isUndefined(resetEFM))
                        if (resetEFM.ReadingOnSwitch == -999)
                            this.mdlShowResetReadingEFM = false;
                        else {
                            this.mdlShowResetReadingEFM = true;
                            this.mdlReadingOnSwitchEFM = resetEFM.ReadingOnSwitch;
                            this.meterResetIdEFM = resetEFM.MeterResetId;
                            this.ResetMeterReadingOfTodayEFM = resetEFM.ResetMeterReadingOfToday;
                            this.mdlResetJumpReadingEFM = resetEFM.JumpReading;
                            if (resetEFM.JumpCertificateReset != '-999' && resetEFM.JumpCertificateReset != '') {
                                this.imgEFM = resetEFM.JumpCertificateReset;
                                this.imgPathResetEFM =  this.glovalList.imgBaseUrl + resetEFM.JumpCertificateReset;
                                this.mdlShowResetImageEFM = true;
                            }
                        }     
                  }
            }
         }         
            else {
                this.objDbServ.ShowLoaders.emit(false);
                alert('There is no package available.')
            }
      },
      (error) => {alert("Something went wrong.");
       this.objDbServ.ShowLoaders.emit(false);
      }
    )
  }
  OnCheckboxChange(evt, flag : any) {
    if(flag == "SFS") { 
        if(evt.target.checked==true) 
        this.JumpVisibleSFS = false;
        else if(evt.target.checked==false)
        this.JumpVisibleSFS = true;  
    } 
    else if (flag == "DFS") {
        if(evt.target.checked==true) 
        this.JumpVisibleDFS = false;
        else if(evt.target.checked==false)
        this.JumpVisibleDFS = true;  
    }
    else {
        if(evt.target.checked==true) 
        this.JumpVisibleEFS = false;
        else if(evt.target.checked==false)
        this.JumpVisibleEFS = true;  
    }
  }
  InsertPackageInfo(){
    const hrsJson = {
      RunHrs: this.selectedRhHr,
      RunMins: this.selectedRhMin,
      SHrs: this.selectedSHr,
      SMins: this.selectedSMin,
      UsHrs: this.selectedUsHr,
      UsMins: this.selectedUsMin,
      BdHrs: this.selectedBdHr,
      BdMin: this.selectedBdMin
     };
   var pkgRemark = ((this.mdlSelectedRemark == 'Other') ? this.mdlRemark : this.mdlSelectedRemark);
   var remarkJson =
    {
       otherSelected: this.mdlSelectedRemark,
       pkgRemark: pkgRemark
    };
    var getAllFData = this.getPackageFD(this.PackageDetailJson, this.globalDetail, this.SelectedPkgId.PkgId, hrsJson, remarkJson);
    if (getAllFData.Error != '') {
        alert(getAllFData.Error)
        return false;
    }
    if (getAllFData.PromptErrorS != "") {
      if (confirm(getAllFData.PromptErrorS) == false) {
          return false;
      }
      else {
          var jumpReading = this.PackageDetailJson[0].JumpReadingSFM;
          if (jumpReading == '' && parseFloat(jumpReading) == 0) {
              alert('Please enter the jump reading for Suction Flow Meter.');
              return false;
          }
      }
    }
    if (getAllFData.PromptErrorD != "") {
      if (confirm(getAllFData.PromptErrorD) == false) {
          return false;
      }
      else {
          var jumpReading = this.PackageDetailJson[0].JumpReadingDFM;
          if (jumpReading == '' && parseFloat(jumpReading) == 0) {
              alert('Please enter the jump reading for Discharge Flow Meter.');
              return false;
          }
      }
     }
      if (getAllFData.PromptErrorE != "") {
        if (confirm(getAllFData.PromptErrorE) == false) {
            return false;
        }
        else {
            var jumpReading = this.PackageDetailJson[0].JumpReadingEFM;
            if (jumpReading == '' && parseFloat(jumpReading) == 0) {
                alert('Please enter the jump reading for Engine Flow Meter.');
                return false;
            }
        }
      }
    this.objDbServ.ShowLoaders.emit(true);
    var BoundJson = this.PackageDetailJson;
    this.objDbServ.InsertPackageInfo(getAllFData.frmData).subscribe(
      (resp: any) => { 
        this.objDbServ.ShowLoaders.emit(false);
        const data = JSON.parse(resp._body);
        this.JumpfilesSFM = $('#JumpCertificateSFM');
        this.JumpfilesDFM = $('#JumpCertificateDFM');
        this.JumpfilesEFM = $('#JumpCertificateEFM');
        var JumpfileInputSFM =  this.filesSFM;
        var JumpfileInputDFM =  this.filesDFM;
        var JumpfileInputEFM =  this.filesEFM;
        $('#JumpCertificateSFM').val(null);
        $('#JumpCertificateDFM').val(null);
        $('#JumpCertificateEFM').val(null);
        alert(data.Status);    
        if (data.Status.indexOf('successfully') > -1) {
            var MyJson = {
                StationCode: this.StationCode,
                LoginID: this.LoginId,
                PackageId: ((isUndefined(this.SelectedPkgId.PkgId) == true || this.SelectedPkgId.PkgId == '') ? '-999' : this.SelectedPkgId.PkgId)
            };
            this.GetPackageDetail(MyJson);
        }
      },
      (error) => {alert("Something went wrong.");
        this.objDbServ.ShowLoaders.emit(false);
      }
    )
}
  resetPopupSFM(flag) { 
    this.mdlResetPopupSFM = flag; 
  }
  resetPopupDFM(flag) { 
    this.mdlResetPopupDFM = flag;
  }
  resetPopupEFM(flag) { 
    this.mdlResetPopupEFM = flag; 
  }
  uploadJumpReadingImgSFM(file: File, event: any) {
    this.JumpfilesSFM = file;
  }
  uploadJumpReadingImgDFM(file: File, event: any) {
    this.JumpfilesDFM = file;
  }
  uploadJumpReadingImgEFM(file: File, event: any) {
    this.JumpfilesEFM= file;
  }
  uploadJumpReadingImgSFMPopUp(file: File, event: any) {
    this.filesSFM = file;
  }
  uploadJumpReadingImgDFMPopUp(file: File, event: any) {
    this.filesDFM = file;
  }
  uploadJumpReadingImgEFMPopUp(file: File, event: any) {
    this.filesEFM  = file;
  }
  resetchange(evt, flag:string) {
     if(flag == 'SFM')
       this.ActionTypeSFM = evt;
     else if(flag == 'DFM')
       this.ActionTypeDFM = evt;
     else if(flag == 'EFM')
       this.ActionTypeEFM = evt;      
  }
  HoldResetReading(flag) {
    var FlagReadingType = '', fileInput, file;
    var PrvReading, JumpReading,MeterResetId,ReadingOnSwitch;
    if (flag == 'SFM') {
        file = (isUndefined(this.filesSFM)) ? null : this.filesSFM[0];
        var jsonValidation = {
            ActionType : this.ActionTypeSFM,
            oldMeterReading: this.mdlReadingOnSwitchSFM,
            oldJumpReading: this.mdlResetJumpReadingSFM,
            fileObject: file
        };
        var retJson = this.validationMeterReset(jsonValidation);
        if (retJson.errorMsg != '') {
            alert(retJson.errorMsg);
            return false;
        };
        FlagReadingType = (this.ActionTypeSFM == "Reset") ? 'R' : 'C';
        PrvReading = this.PackageDetailJson[0].SuctionFlowMeterReadingPrv;
        JumpReading = this.mdlResetJumpReadingSFM;
        MeterResetId = this.meterResetIdSFM;
        ReadingOnSwitch = this.mdlReadingOnSwitchSFM;
    }
    else if (flag == 'DFM') {
        file = (isUndefined(this.filesDFM)) ? null : this.filesDFM[0];
        var jsonValidation = {
            ActionType : this.ActionTypeDFM,
            oldMeterReading: this.mdlReadingOnSwitchDFM,
            oldJumpReading: this.mdlResetJumpReadingDFM,
            fileObject: fileInput
        };
        var retJson = this.validationMeterReset(jsonValidation);
        if (retJson.errorMsg != '') {
            alert(retJson.errorMsg);
            return false;
        };
        FlagReadingType = (this.ActionTypeDFM == "Reset") ? 'R' : 'C';
        PrvReading = this.PackageDetailJson[0].DischargeFlowMeterReadingPrv;
        JumpReading = this.mdlResetJumpReadingDFM;
        MeterResetId =  this.meterResetIdDFM;
        ReadingOnSwitch = this.mdlReadingOnSwitchDFM;
    }
    else if (flag == 'EFM') {
        file = (isUndefined(this.filesEFM)) ? null : this.filesDFM[0];
        var jsonValidation = {
            ActionType : this.ActionTypeEFM,
            oldMeterReading: this.mdlReadingOnSwitchEFM,
            oldJumpReading: this.mdlResetJumpReadingEFM,
            fileObject: file
        };
        var retJson = this.validationMeterReset(jsonValidation);
        if (retJson.errorMsg != '') {
            alert(retJson.errorMsg);
            return false;
        };
        FlagReadingType = (this.ActionTypeEFM == "Reset") ? 'R' : 'C';
        PrvReading = this.PackageDetailJson[0].EngineFlowMeterReadingPrv;
        JumpReading = this.mdlResetJumpReadingEFM;
        MeterResetId = this.meterResetIdEFM;
        ReadingOnSwitch = this.mdlReadingOnSwitchEFM;
    }
    var globalDetail = JSON.parse(sessionStorage.getItem('globalDetail'));
    var sendJosn = {
        StationCode: this.StationCode,
        MeterOf: 'PKG',
        MeterOfId: this.PackageDetailJson[0].PackageId,
        MeterType: flag,
        FlagRead: 0,
        FlagReadingType: FlagReadingType,
        Id: MeterResetId,
        LoginId: this.LoginId,
        PrvReading: PrvReading,
        JumpReading: ((JumpReading == '') ? '0' : JumpReading),
        ReadingOnSwitch: ReadingOnSwitch,
        FilePath: localStorage.getItem('LoginId') + "/Package/"
    };
   var formData = new FormData();
   if(file != undefined || file != null) {
       formData.append("file", file);
    }
    formData.append("jsonDetail", JSON.stringify(sendJosn));
    this.objDbServ.showLoader.value = true;
    this.objDbServ.PackageHoldResetReading(formData).subscribe(
        (resp: any) => {
            this.objDbServ.showLoader.value = false;
            const data = JSON.parse(resp._body);
            if (flag == 'SFM') {
                this.mdlResetPopupSFM = false;
                this.mdlShowResetReadingSFM = true; 
            }
            else if (flag == 'EFM') {
                this.mdlResetPopupEFM = false;
                this.mdlShowResetReadingEFM = true;  
            }
            else if (flag == 'DFM') {
                this.mdlResetPopupDFM = false;
                this.mdlShowResetReadingDFM = true; 
            }
            var MyJson = {
                StationCode: this.StationCode,
                LoginID: this.LoginId,
                PackageId: ((isUndefined(this.SelectedPkgId.PkgId) == true || this.SelectedPkgId.PkgId == '') ? '-999' : this.SelectedPkgId.PkgId)
            };
            alert("Record saved Successfully.!");
            this.GetPackageDetail(MyJson);        
        },
        (error) => {alert("Something went wrong.");
         this.objDbServ.ShowLoaders.emit(false);
        }
      )
}
 getPackageFD(pkgDetJson, GlobalDetail, SelectedPkgId, hrsJson, remarkJson) {
    var MyJson = {
        LoginId: this.LoginId,
        MeterSkidCode: this.MeterSkidCode,
        RunningHours: hrsJson.RunHrs + ":" + hrsJson.RunMins,
        ScheduleShutdownHours: hrsJson.SHrs + ":" + hrsJson.SMins,
        UnscheduledShutdownHours: hrsJson.UsHrs + ":" + hrsJson.UsMins,
        BreakdownHours: hrsJson.BdHrs + ":" + hrsJson.BdMin,
        SuctionFlowMeterReading: pkgDetJson[0].SuctionFlowMeterReading,
        JumpReadingSFM: ((pkgDetJson[0].JumpReadingSFM == '') ? '0' : pkgDetJson[0].JumpReadingSFM),
        JumpReadingSFMCount: pkgDetJson[0].JumpReadingSFMCount,
        JumpCertificateSFM: pkgDetJson[0].JumpCertificateSFM,
        DischargeFlowMeterReading: pkgDetJson[0].DischargeFlowMeterReading,
        JumpReadingDFM: ((pkgDetJson[0].JumpReadingDFM == '') ? '0' : pkgDetJson[0].JumpReadingDFM),
        JumpReadingDFMCount: pkgDetJson[0].JumpReadingDFMCount,
        JumpCertificateDFM: pkgDetJson[0].JumpCertificateDFM,
        EngineFlowMeterReading: ((pkgDetJson[0].EngineFlowMeterReading == '') ? '0' : pkgDetJson[0].EngineFlowMeterReading),
        JumpReadingEFM: ((pkgDetJson[0].JumpReadingEFM == '') ? '0' : pkgDetJson[0].JumpReadingEFM),
        JumpReadingEFMCount: pkgDetJson[0].JumpReadingEFMCount,
        JumpCertificateEFM: pkgDetJson[0].JumpCertificateEFM,
        SuctionPressure: pkgDetJson[0].SuctionPressure,
        Remark: remarkJson.pkgRemark,
        StationCode: this.StationCode,
        FilePath: GlobalDetail.LoginId + "/Package/",
        PackageId: SelectedPkgId
    };
    var fileInputSFM =  this.JumpfilesSFM
    var fileInputEFM =  this.JumpfilesEFM
    var fileInputDFM =  this.JumpfilesDFM
    if (pkgDetJson[0].JumpReadingSFM == '' || pkgDetJson[0].JumpReadingSFM == 0)
       $('#JumpCertificateSFM').val(null);
    if (pkgDetJson[0].JumpReadingDFM == '' || pkgDetJson[0].JumpReadingDFM == 0)
       $('#JumpCertificateDFM').val(null);
    if (pkgDetJson[0].JumpReadingEFM == '' || pkgDetJson[0].JumpReadingEFM == 0)
       $('#JumpCertificateEFM').val(null);
    var formData = new FormData();
    if(this.JumpfilesSFM != undefined) {
        formData.append("JumpCertificateSFM", this.JumpfilesSFM[0]);
    }
    if(this.JumpfilesDFM != undefined) {
        formData.append("JumpCertificateDFM", this.JumpfilesDFM[0]);
     }
    if(this.JumpfilesEFM != undefined) {
        formData.append("JumpCertificateEFM", this.JumpfilesEFM[0]);
     }
    formData.append("packageDetail", JSON.stringify(MyJson));
    var ErrorMsg = '', PromptErrorS = '', PromptErrorE = '', PromptErrorD = '', self = this;
    ErrorMsg = this.getError(pkgDetJson, fileInputEFM==null?fileInputEFM:fileInputEFM[0], fileInputDFM==null?fileInputEFM:fileInputDFM[0], fileInputSFM==null?fileInputSFM:fileInputSFM[0], hrsJson, remarkJson);
    if (parseFloat(pkgDetJson[0].SuctionFlowMeterReading) <= parseFloat(pkgDetJson[0].SuctionFlowMeterReadingPrv))
        PromptErrorS = 'Suspected Suction Flow Meter Reading, Do you want to continue?';
    if (parseFloat(pkgDetJson[0].DischargeFlowMeterReading) <= parseFloat(pkgDetJson[0].DischargeFlowMeterReadingPrv))
        PromptErrorD = 'Suspected Discharge Flow Meter Reading, Do you want to continue?';
    if (pkgDetJson[0].PrimeMover == 'E' && parseFloat(pkgDetJson[0].EngineFlowMeterReading) <= parseFloat(pkgDetJson[0].EngineFlowMeterReadingPrv))
        PromptErrorE = 'Suspected Engine Flow Meter Reading, Do you want to continue?';
    if (parseFloat(pkgDetJson[0].SuctionFlowMeterReading) >= 2*parseFloat(pkgDetJson[0].SuctionFlowMeterReadingPrv))
        PromptErrorS = 'Suspected Suction Flow Meter Reading, Do you want to continue?';
    if (parseFloat(pkgDetJson[0].DischargeFlowMeterReading) >= 2*parseFloat(pkgDetJson[0].DischargeFlowMeterReadingPrv))
        PromptErrorD = 'Suspected Discharge Flow Meter Reading, Do you want to continue?';
    if (pkgDetJson[0].PrimeMover == 'E' && parseFloat(pkgDetJson[0].EngineFlowMeterReading) >= 2*parseFloat(pkgDetJson[0].EngineFlowMeterReadingPrv))
        PromptErrorE = 'Suspected Engine Flow Meter Reading, Do you want to continue?';
    return {
        Error: ErrorMsg,
        PromptErrorS: PromptErrorS,
        PromptErrorD: PromptErrorD,
        PromptErrorE: PromptErrorE,
        frmData: formData
    };
}
 getError(pkgDetJson, fileInputEFM, fileInputDFM, fileInputSFM, hrsJson, remarkJson) {
  var regexNumeric = /^[+-]?[0-9]{1,1000}(?:\.[0-9]{1,1000})?$/;
  var foundError = '';
  var SFMRead = pkgDetJson[0].SuctionFlowMeterReading;
  var DFMRead = pkgDetJson[0].DischargeFlowMeterReading;
  var EFMRead = pkgDetJson[0].EngineFlowMeterReading;
  if (SFMRead == "" || isUndefined(SFMRead)) {
      foundError = 'Suction Flow Meter Reading is required.';
      return foundError;
  }
  if((pkgDetJson[0].JumpReadingSFM == '' || pkgDetJson[0].JumpReadingSFM == undefined || parseFloat(pkgDetJson[0].JumpReadingSFM) == parseFloat("0")) && parseFloat(SFMRead) == parseFloat("0")) {
    foundError = 'Invalid Suction Flow Meter Reading';
    return foundError;
  }
  if (SFMRead != "") {
      if (regexNumeric.test(SFMRead) == false) {
          foundError = 'Only numeric value allowed for reading.';
          return foundError;
      }
      if (parseFloat(SFMRead) < 0) {
          foundError = 'Suction Flow Meter Reading must be Positive.';
          return foundError;
      }
  }
  var JumpSFMCnt = pkgDetJson[0].JumpReadingSFMCount;
  if (pkgDetJson[0].JumpReadingSFM != '') {
      if(!isUndefined(fileInputSFM)){
       if (fileInputSFM.size > 0) {         
          var validExtension = 'jpeg,jpg,png,gif';
              var fileExtension = fileInputSFM.name.split('.')[1]; 
              if (validExtension.indexOf(fileExtension) < 0 &&  !isUndefined(fileExtension)) {
                  foundError = 'Attachment (SFM) allowed only for [' + validExtension + '].'; 
                  return foundError;
              }
         }
      }
      if (regexNumeric.test(pkgDetJson[0].JumpReadingSFM) == false) {
          foundError = 'Only numeric value allowed for reading.';
          return foundError;
      }
  }
  if (JumpSFMCnt != '' && parseFloat(JumpSFMCnt) != 0 && isUndefined(JumpSFMCnt) == false) {
      if (regexNumeric.test(JumpSFMCnt) == false) {
          foundError = 'Only numeric value allowed for SFM Jump reading count.'; 
          return foundError;
      }
      if (JumpSFMCnt.indexOf('.') > -1) {
          foundError = 'Decimal value not allowed for SFM Jump reading count.'; 
          return foundError;
      }
      if (parseFloat(JumpSFMCnt) < 0) {
          foundError = 'SFM Jump Reading count must be Positive.';
          return foundError;
      }
      if (pkgDetJson[0].JumpReadingSFM == "" || isUndefined(pkgDetJson[0].JumpReadingSFM)) {
          foundError = 'Please enter the SFM Jump reading.';
          return foundError;
      }
      if (pkgDetJson[0].JumpReadingSFM == "" || parseFloat(pkgDetJson[0].JumpReadingSFM) == 0) {
          foundError = 'Plese enter the Jump Reading'; 
          return foundError;
      }
  }
  else {
      if (pkgDetJson[0].JumpReadingSFM != '' && parseFloat(pkgDetJson[0].JumpReadingSFM) != 0) {
          foundError = 'Plese enter the SFM Jump Reading count.'; 
          return foundError;
      }
  }
  if (pkgDetJson[0].PrimeMover == 'E' && EFMRead == "") {
      foundError = 'Engine Flow Meter Reading is required.';
      return foundError;
  }
  if(pkgDetJson[0].PrimeMover == 'E' && (pkgDetJson[0].JumpReadingEFM == '' || pkgDetJson[0].JumpReadingEFM == undefined || parseFloat(pkgDetJson[0].JumpReadingEFM) == parseFloat("0")) && parseFloat(EFMRead) == parseFloat("0")) {
    foundError = 'Invalid Engine Flow Meter Reading';
    return foundError;
  }
  if (pkgDetJson[0].PrimeMover == 'E' && EFMRead != "")
      if (regexNumeric.test(EFMRead) == false) {
          foundError = 'Only numeric value allowed for reading.';
          return foundError;
      }
  var JumpEFMCnt = pkgDetJson[0].JumpReadingEFMCount;
  if (pkgDetJson[0].JumpReadingEFM != '') {
      if(!isUndefined(fileInputEFM)) {
      if (fileInputEFM.size > 0) { 
          var validExtension = 'jpeg,jpg,png,gif';
              var fileExtension = fileInputEFM.name.split('.')[1];
              if (validExtension.indexOf(fileExtension) < 0 && !isUndefined(fileExtension)) {
                  foundError = 'Attachment (EFM) allowed only for [' + validExtension + '].'; 
                  return foundError;
              }
        }
      }
      if (regexNumeric.test(pkgDetJson[0].JumpReadingEFM) == false) {
          foundError = 'Only numeric value allowed for reading.';
          return foundError;
      }
  }
  if (JumpEFMCnt != '' && parseFloat(JumpEFMCnt) != 0 && isUndefined(JumpEFMCnt) == false) {
      if (regexNumeric.test(JumpEFMCnt) == false) {
          foundError = 'Only numeric value allowed for EFM Jump reading count.'; 
          return foundError;
      }
      if (JumpEFMCnt.indexOf('.') > -1) {
          foundError = 'Decimal value not allowed for EFM Jump reading count.'; 
          return foundError;
      }
      if (parseFloat(JumpEFMCnt) < 0) {
          foundError = 'EFM Jump reading count must be Positive.';
          return foundError;
      }
      if (pkgDetJson[0].JumpReadingEFM == '' || isUndefined(pkgDetJson[0].JumpReadingEFM)) {
          foundError = 'Please enter the EFM Jump reading.';
          return foundError;
      }
      if (pkgDetJson[0].JumpReadingEFM == '' || parseFloat(pkgDetJson[0].JumpReadingEFM) == 0) {
          foundError = 'Plese enter the Jump Reading'; 
          return foundError;
      }
   }
  else {
      if (pkgDetJson[0].JumpReadingEFM != '' && parseFloat(pkgDetJson[0].JumpReadingEFM) != 0) {
          foundError = 'Plese enter the EFM Jump Reading count.'; 
          return foundError;
      }
  }
  if (DFMRead == "" || isUndefined(DFMRead)) {
      foundError = 'Discharge Flow Meter Reading is required.';
      return foundError;
  }
  if((pkgDetJson[0].JumpReadingDFM == '' || pkgDetJson[0].JumpReadingDFM == undefined || parseFloat(pkgDetJson[0].JumpReadingDFM) == parseFloat("0")) && parseFloat(DFMRead) == parseFloat("0")) {
    foundError = 'Invalid Discharge Flow Meter Reading';
    return foundError;
  }
  if (DFMRead != "") {
      if (regexNumeric.test(DFMRead) == false) {
          foundError = 'Only numeric value allowed for DFM reading.';
          return foundError;
      }
      if (parseFloat(DFMRead) < 0) {
          foundError = 'Discharge Flow Meter Reading must be Positive.';
          return foundError;
      }
  }
  var JumpDFMCnt = pkgDetJson[0].JumpReadingDFMCount;
  if (pkgDetJson[0].JumpReadingDFM != '') {
      if(!isUndefined(fileInputDFM)) {
      if (fileInputDFM.size > 0) { 
          var validExtension = 'jpeg,jpg,png,gif';
              var fileExtension = fileInputDFM.name.split('.')[1];
              if (validExtension.indexOf(fileExtension) < 0 && !isUndefined(fileExtension)) {
                  foundError = 'Attachment (DFM) allowed only for [' + validExtension + '].'; 
                  return foundError;
              }
        }
      }
      if (regexNumeric.test(pkgDetJson[0].JumpReadingDFM) == false) {
          foundError = 'Only numeric value allowed for DFM reading.';
          return foundError;
      }
  }
  if (JumpDFMCnt != '' && parseFloat(JumpDFMCnt) != 0 && isUndefined(JumpDFMCnt) == false) {
      if (regexNumeric.test(JumpDFMCnt) == false) {
          foundError = 'Only numeric value allowed for DFM Jump reading count.'; 
          return foundError;
      }
      if (JumpDFMCnt.indexOf('.') > -1) {
          foundError = 'Decimal value not allowed for DFM Jump reading count.'; 
          return foundError;
      }
      if (parseFloat(JumpDFMCnt) < 0) {
          foundError = 'DFM Jump reading count must be Positive.';
          return foundError;
      }
      if (pkgDetJson[0].JumpReadingDFM == '' || isUndefined(pkgDetJson[0].JumpReadingDFM)) {
          foundError = 'Please enter the DFM Jump reading.';
          return foundError;
      }
      if (pkgDetJson[0].JumpReadingDFM == '' || parseFloat(pkgDetJson[0].JumpReadingDFM) == 0) {
          foundError = 'Plese enter the Jump Reading'; 
          return foundError;
      }
  }
  else {
      if (pkgDetJson[0].JumpReadingDFM != '' && parseFloat(pkgDetJson[0].JumpReadingDFM) != 0) {
          foundError = 'Plese enter the DFM Jump Reading count.'; 
          return foundError;
      }
  }
  var TotalOtherHrs = parseInt(hrsJson.BdHrs) + parseInt(hrsJson.SHrs) + parseInt(hrsJson.UsHrs);
  var TotalOtherMins = parseInt(hrsJson.BdMin) + parseInt(hrsJson.SMins) + parseInt(hrsJson.UsMins);
  var accurateOtherMinsQuotient = Math.floor(TotalOtherMins / 60); 
  TotalOtherHrs = TotalOtherHrs + accurateOtherMinsQuotient;       
  var TotalHrs = parseInt(hrsJson.RunHrs) + parseInt(hrsJson.BdHrs) + parseInt(hrsJson.SHrs) + parseInt(hrsJson.UsHrs);
  var TotalMins = parseInt(hrsJson.RunMins) + parseInt(hrsJson.BdMin) + parseInt(hrsJson.SMins) + parseInt(hrsJson.UsMins);
  var accurateMinsQuotient = Math.floor(TotalMins / 60);  
  var remaiingMins = Math.floor(TotalMins % 60);          
  TotalHrs = TotalHrs + accurateMinsQuotient;
  if ((TotalHrs == 24 && remaiingMins > 0) || (TotalHrs > 24)) {
      foundError = 'Total Hours must be less/equal than 24.'; 
      return foundError;
  }
  if (pkgDetJson[0].SuctionPressure == '' || isUndefined(pkgDetJson[0].SuctionPressure)) {
      foundError = 'Suction pressure is required.'; 
      return foundError;
  }
  if (pkgDetJson[0].SuctionPressure != "") {
      if (regexNumeric.test(pkgDetJson[0].SuctionPressure) == false) {
          foundError = 'Only numeric value allowed for SuctionPressure.';
          return foundError;
      }
      if (parseFloat(pkgDetJson[0].SuctionPressure) < 0) {
          foundError = 'Suction Pressure must be Positive.';
          return foundError;
      }
  }
  if (remarkJson.otherSelected == 'Other' && (isUndefined(remarkJson.pkgRemark) || remarkJson.pkgRemark == '')) {
      foundError = 'Please enter the other remarks.';
      return foundError;
  }
  return foundError;
}
 validationMeterReset(jsonValidation) {
    var regexNumeric = /^[+-]?[0-9]{1,1000}(?:\.[0-9]{1,1000})?$/;
    var jsonErrorMsg = { errorMsg: '' };
    if (isUndefined(jsonValidation.ActionType) || jsonValidation.ActionType == "--Select--" || jsonValidation.ActionType == "") {
        jsonErrorMsg = { errorMsg: 'Please select Action Type.' };
        return jsonErrorMsg;
    }
    if (isUndefined(jsonValidation.oldMeterReading) || jsonValidation.oldMeterReading == '') {
        jsonErrorMsg = { errorMsg: 'Please enter the Old Meter Reading.' };
        return jsonErrorMsg;
    }
    if (regexNumeric.test(jsonValidation.oldMeterReading) == false) {
        jsonErrorMsg = { errorMsg: 'Only numeric value allowed for reading.' };
        return jsonErrorMsg;
    }
    if (parseFloat(jsonValidation.oldMeterReading) < 0) {
        jsonErrorMsg = { errorMsg: 'Old Meter Reading must be Positive.' };
        return jsonErrorMsg;
    }
    if ((parseInt(jsonValidation.oldJumpReading) == 0 || jsonValidation.oldJumpReading == '') && !isUndefined(jsonValidation.fileObject) && (jsonValidation.fileObject != null) && (jsonValidation.fileObject.files.length > 0 || jsonValidation.formarJRImage == true)) {
        jsonErrorMsg = { errorMsg: 'Please enter the Jump Reading.' };
        return jsonErrorMsg;
    }
    if (regexNumeric.test(jsonValidation.oldJumpReading) == false) {
        jsonErrorMsg = { errorMsg: 'Only numeric value allowed for Jump reading.' };
        return jsonErrorMsg;
    }
    return jsonErrorMsg;
}
deleteResetMeterReading(flag) {
    if (!confirm('Do you want to delete Meter Reset Reading?'))
        return false;
    this.objDbServ.ShowLoaders.emit(true);
    var sendJson = {
        MeterResetId: "",
        LoginId: this.LoginId
    };
    this.objDbServ.deleteResetMeterReading(sendJson).subscribe(
        (resp: Response) => {
          this.objDbServ.ShowLoaders.emit(false);
          this.mdlResetPopup = false;
          if (flag == 'SFM')
              this.mdlShowResetReadingSFM = false;
          else if (flag == 'DFM')
              this.mdlShowResetReadingDFM = false;
          else
              this.mdlShowResetReadingEFM = false;
          var MyJson = {
              StationCode: this.StationCode,
              LoginID: this.LoginId,
              PackageId: ((isUndefined(this.SelectedPkgId.PkgId) == true || this.SelectedPkgId.PkgId == '') ? '-999' : this.SelectedPkgId.PkgId)
          };
          this.GetPackageDetail(MyJson);
          this.refereshReset();     
        },
        (error) => {alert("Something went wrong.");
          this.objDbServ.ShowLoaders.emit(false);
        }
    )
 }
refereshReset() {
      this.mdlResetPopupSFM = false;
      this.mdlShowResetReadingSFM = false;
      this.mdlReadingOnSwitchSFM ="";
      this.ResetMeterReadingOfTodaySFM = '';
      this.meterResetIdSFM = '-999';
      this.resetTypeJsonSelectedSFM = "";
      this.mdlResetJumpReadingSFM = '0.000';
      $('#jcMeterResetSFM').val(null);
      this.mdlResetPopupDFM = false;
      this.mdlShowResetReadingDFM = false;
      this.mdlReadingOnSwitchDFM = "";
      this.ResetMeterReadingOfTodayDFM = '';
      this.meterResetIdDFM = '-999';
      this.resetTypeJsonSelectedDFM = "";
      this.mdlResetJumpReadingDFM = '0.000';
      $('#jcMeterResetDFM').val(null);
      this.mdlResetPopupEFM = false;
      this.mdlShowResetReadingEFM = false;
      this.mdlReadingOnSwitchEFM = "";
      this.ResetMeterReadingOfTodayEFM = '';
      this.meterResetIdEFM = '-999';
      this.resetTypeJsonSelectedEFM = "";
      this.mdlResetJumpReadingEFM = '0.000';
      $('#jcMeterResetEFM').val(null);
 }
 showCertificates(flag) {
   var arrPath = {};
    if (this.flag == 'SFM') {
        var SFM = this.JumpCertificateSFM.replace(/^,|,$/g, '');
        arrPath = SFM.split(",");
    }
    if (this.flag == 'DFM') {
        var DFM = this.JumpCertificateDFM.replace(/^,|,$/g, '');
        arrPath = DFM.split(",");
    }
    if (this.flag == 'EFM') {
        var EFM = this.JumpCertificateEFM.replace(/^,|,$/g, '');
        arrPath = EFM.split(",");
    }
    this.mdlShowCertificates = true;
 }
 showCertificatesReset(flag) {
    var arrPath = {};
    if (this.flag == 'SFM') {
        var SFM = this.imgSFM.replace(/^,|,$/g, '');
        arrPath = SFM.split(",");
    }
    if (this.flag == 'DFM') {
        var DFM = this.imgDFM.replace(/^,|,$/g, '');
        arrPath = DFM.split(",");
    }
    if (this.flag == 'EFM') {
        var EFM = this.imgEFM.replace(/^,|,$/g, '');
        arrPath = EFM.split(",");
    }
    this.mdlShowCertificates = true;
}
showHideRemark() {
    if (this.mdlSelectedRemark == 'Other')
        this.mdlRemarkTextShow = false;
    else
        this.mdlRemarkTextShow = true;
}
}
