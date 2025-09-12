import { Component, OnInit } from '@angular/core';
import { dbService } from '../../Service/db.service';
import { CookieService } from 'ngx-cookie-service';
import { isUndefined, isNullOrUndefined } from 'util';
import { MAX_LENGTH_VALIDATOR } from '@angular/forms/src/directives/validators';
import { tick } from '@angular/core/testing';
import { NULL_EXPR } from '@angular/compiler/src/output/output_ast';
import { DatepickerOptions } from 'ng2-datepicker';
import * as enLocale from 'date-fns/locale/en';
import { DomSanitizer} from '@angular/platform-browser';
import { DatePipe } from '@angular/common';
import { parse } from 'path';
declare var $:any;
@Component({
  selector: 'app-dpr-enty',
  templateUrl: './dpr-enty.component.html',
  styleUrls: ['./dpr-enty.component.css']
})
export class DPREntyComponent implements OnInit {
   DPREntryDate:string= this.objCook.get('CurrentDate');
   DPREntryDateTime=this.objCook.get('CurrentDateTime');
   DPRDate:Date;
   IsMSkidhide:boolean=false;
   IsPackagehide:boolean=false;
   IsDisphide:boolean=false;
   IsLCVhide:boolean=false;
   IsGenSethide:boolean=false;
  MeterSkidReadingAverage:string;
  MSMeterSkidCode:string='';
  MSFlowMeterTotaliserPrv:string='';
  meterStationSkidData:any= [];
  MeterStationSkidList:any= [];
  loginId:string = this.objCook.get('UID');
  meterTotaliser:string = '';
  jumpReading:string = '';
  jumpReadingFile:File = null;
  jumpReadingCount:string = '';
  MeterSkidDetailJson:any = [];
  GlobalDetail:any = [];
  uploadedfile:File;
  uploadedfilereset:File;
  MSfiles:File;
  filesreset:File;
  remark:string="";
  OldMeterReading:string="";
  JReading:string="";
  resetTypeJsonSelected:string="J";
  MSisCRSentToHo:number=0;
  MSisStationSubmitted:number=0;
  MSfilevisible:boolean=false;
  popupfilevisible:boolean = true;
  JumpVisible:boolean = true;
  stationName:string="";
  checkbox:boolean=false;
  abc:string="Vishal";
  JumpCertificateFMT:string="";
  MSkidShowJumpImage:boolean=false;
  MeterSkidId:string="0";
  VentFlowMeterReadingPrv:string="";
  GSFlagJumpType = 'J';
  MSFlagJumpType = 'J';
  LCVFlagJumpType = 'J';
  PackageOldReading:string="";
  NewMeterReading:string="";
  MeterJumpRemark:string="";
  MSJumpListHistory:any = [];
  JumpHistoryId:string = '';
  MSJReading:string="";
  MSpopupfilevisible:boolean = true;
  SFMJumpListHistory:any = [];
  DFMJumpListHistory:any = [];
  EFMJumpListHistory:any = [];
  VFMJumpListHistory:any = [];
   VentFlowMeterReading:string="0.00";
   IsVentFlow:boolean=false;
   SuctionFlowReadingAverage:string;
   DischargeFlowReadingAverage:string;
   EngineFlowReadingAverage:string;
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
   filesVFM:File;
   JumpfilesSFM:File;
   JumpfilesDFM:File;
   JumpfilesEFM:File;
   JumpfilesVFM:File;
   ActionTypeSFM:string="";
   ActionTypeDFM:string="";
   ActionTypeEFM:string="";
   ActionTypeVFM:string="";
   flag:string="";
   arrPath:string="";
   SelectedPkgId = {PkgId:"0"};
   mdlResetPopup:boolean=false;
   LoginId:string= localStorage.getItem('LoginId');
   StationCode:string= localStorage.getItem('LoginId');
   MeterSkidCode:string="";
   PKisCRSentToHo:number=0;
   PKisStationSubmitted:number=0;
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
   resetTypeJsonSFM = [{ Text: 'Reset' }, { Text: 'Change'}, { Text: 'Jump'}];
   resetTypeJsonDFM = [{ Text: 'Reset' }, { Text: 'Change'}, { Text: 'Jump'}];
   resetTypeJsonEFM = [{ Text: 'Reset' }, { Text: 'Change'}, { Text: 'Jump'}];
   jsonRemarks = [
     { text: 'Breakdown due to Leakage', value: 'Breakdown due to Leakage' },
     { text: 'Mechanical breakdown', value: 'Mechanical breakdown' },
     { text: 'Instrumentation breakdown', value: 'Instrumentation breakdown' },
     { text: 'Powercut', value: 'Powercut' },
     { text: 'Voltage problem', value: 'Voltage problem' },
     { text: 'Maintenance Shutdown', value: 'Maintenance Shutdown'},
     { text: 'OK', value: 'OK'},
     { text: 'Other', value: 'Other' }
 ];
 RunHrs:any=[];
 RunMin:any=[];
 selectedRhHr:string='00.00';
 selectedRhMin:string='00.00';
 selectedSHr:string='00.00';
 selectedSMin:string='00.00';
 selectedUsHr:string='00.00';
 selectedUsMin:string='00.00';
 selectedBdHr:string='00.00';
 selectedBdMin:string='00.00';
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
 mdlReadingOnSwitchVFM:string="";
 mdlReadingOnSwitchEFM:string="";
 meterResetIdEFM:string="";
 ResetMeterReadingOfTodayEFM:string='';
 mdlResetJumpReadingEFM:string='0.000';
 mdlResetJumpReadingVFM:string='0.000';
 imgEFM:string='';
 imgPathResetEFM:string='';
 mdlShowResetImageEFM:boolean=false;
 mdlShowResetReadingEFM:boolean=false;
 mdlResetPopupEFM:boolean=false;
 mdlResetPopupVFM:boolean=false;
 JumpVisibleSFS:boolean=true;
 JumpVisibleDFS:boolean=true;
 JumpVisibleEFS:boolean=true;
 resetTypeOptionSFM:string="";
 LcvReadingAverage:string='';
 GasGensetReadingAverage:string=''
 isResetMS:string="0";
 isResetSFM:string="0";
 isResetEFM:string="0";
 isResetDFM:string="0";
 isResetLCV:string="0";
 isResetGG:string="0";
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
  DISRemark:string="";
  DISisStationSubmitted:number=0;
  DISisCRSentToHo:number=0;
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
  DISresetTypeJsonSelected:string="";
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
  DISstationName:string="";
  IscheckboxArmA:boolean=false;
  IscheckboxArmB:boolean=false;
stationLcvData:any=[];
stationLcvData1:any=[];
stationLcvData2:any=[];
LCVMeterTotaliserPrv:string="";
SAPEquipmentNumber:string="";
LCVuploadedfile:File;
LCVuploadedfilereset:File;
LCVfiles:File;
LCVfilesreset:File;
lcvid:number=0;
lcvmeterTotaliser:string="";
LCVjumpreading:string="";
jumpreadingcount:string="";
LCVremark:string="";
LCVOldMeterReading:string="";
LCVJReading:string="";
LCVresetTypeJsonSelected:string="";
LCVisCRSentToHo:number=0;
LCVisStationSubmitted:number=0;
LCVfilevisible:boolean=true;
LCVpopupfilevisible:boolean= true;
LCVJumpVisible:boolean= true;
JumpCertificateLCV:string="";
LCVShowJumpImage:boolean=false;
LCVJumpListHistory:any = [];
getGenSetData:any=[];
getGenSetDetails:any=[];
getGenSetFormData:any=[];
GenSetId:string="";
PreviousReading:string="";
GSmeterTotaliser:string="";
GSjumpReading:string="";
GSjumpReadingCount:string="";
GSuploadedfile:File;
GSuploadedfilereset:File;
GSfiles:File;
GSfilesreset:File;
GSRunHrs:string='00';
GSRunMins:string='00';
GSSAPEquipmentNumber:string="";
GSresetTypeJsonSelected:string="J";
GSOldMeterReading:string="";
GSJReading:string="";
GSremark:string="";
GSisCRSentToHo:number=0;
GSisStationSubmitted:number=0;
HH:number;
MM:number;
Hours:any=[];
Minutes:any=[];
GSfilevisible:boolean=false;
GSpopupfilevisible:boolean= true;
GSJumpVisible:boolean=true;
JumpCertificateGenset:string="";
GensetShowJumpImage:boolean=false;
GSIJumpListHistory:any = [];
generalEntryList:any[];
HybridEntryDetails:any[];
hoursList:any[];
minutesList:any[];
globalJson:any[];
GEisCRSentToHo:number=0;
GEisStationSubmitted:number=0;
NOB:string;
NOL:string;
EnergyMeterReading:any;
GELoginId:string= localStorage.getItem('LoginId');
GEStationCode:string= localStorage.getItem('LoginId');
GEId:number;
stationReportData:any = [];
DataTable1:any = [];
DataTable2:any = [];
DataTable3:any = [];
SummaryStationCode:string = this.objCook.get('stationCode');
 SummaryLoginId :string = this.objCook.get('stationCode');
MeterSkitdiffAVG:number=0.00;
StationGasLoss:number=0.00;
GrossSale:number=0.00;
TotalList:any = [];
SummeryDate:string= this.objCook.get('CurrentDate');
JumparrPath: any [];
key: string = 'Name';
reverse: boolean = true;
JumpmdlShowCertificates: boolean = true;
AttachmentData:any [];
AttPageVars:any [];
ScheduleShutdownHours:any;
UnscheduledShutdownHours:any;
BreakdownHours:any;
ScheduleShutdownHours_hr:String='00';
ScheduleShutdownHours_min:String='00';
UnscheduledShutdownHours_hr:String='00';
UnscheduledShutdownHours_min:String='00';
BreakdownHours_hr:String='00';
BreakdownHours_min:String='00';
HyRemark:any;
popupFlag: boolean=false;
  CertificatePath:string='';
  imgURL:any = '';
  isDataFound:boolean=false;
  imgDisplay:boolean=true;
  pathDB:string='';
  MSkidmdlShowResetImage:boolean=false;
  monthNames = [
    "Jan", "Feb", "Mar",
    "Apr", "May", "Jun", "Jul",
    "Aug", "Sep", "Oct",
    "Nov", "Dec"
  ];
  date: Date;
  options:DatepickerOptions = {
    minYear: 2018,
    locale: enLocale,
    displayFormat: 'DD-MMM-YYYY',
    maxDate:new Date(this.DPREntryDate)
  };
  MotorFrequency: any;
  constructor(private objDbServ: dbService, private objCook: CookieService, private dp:DatePipe,private sanitizer: DomSanitizer) { 
    this.objDbServ.HeaderDisplay.emit(true);
    this.objDbServ.LeftMenu.emit(true);
  }
  ngOnInit() {
      var $accord = $('.open');
      $(".new").click(function () {
      var $ans = $(this).next(".open").slideToggle();
      $accord.not($ans).filter(':visible').stop().slideUp();
      });
      $(".new").click(function(){
        if($(this).next().hasClass("maximizer") == true)
        {
          $(this).css({"pointer-events":"none"});
        }
        $(".new").not(this).find("span").removeClass("rotate");
        $(this).find("span").toggleClass("rotate");	
      });
      $(".maximize").click(function(){
        $(this).parent().parent().toggleClass("maximizer");
        $(this).siblings().toggle();
        $(".new").toggleClass("p_event");
        $(".maximize_div").toggleClass("bg_clr");
        $(this).parent().siblings(".form_wrapper").toggleClass("form_scroll");
      });
      $(".close_form").click(function(){
        $(this).parent().parent().removeClass("maximizer").hide();
        $(this).parent().parent().removeClass("maximizer").prev().find("span").removeClass("rotate");
        $(this).hide();
        $(".new").removeClass("p_event");
        $(".maximize_div").removeClass("bg_clr");
        $(this).parent().siblings(".form_wrapper").removeClass("form_scroll");
      });
      this.stationName = JSON.parse(sessionStorage.getItem("globalDetail"))[0].UserName;
      this.getStationMeterSkidData('-999');
      this.JRSValidate();
      this.SummeryDate = this.objCook.get('CurrentDate');
      this.stationName = JSON.parse(sessionStorage.getItem("globalDetail"))[0].UserName;
      this.getStationReportData();
      this.CheckAllResetEntry();
  }
  OnDateChnagefrom(val){
    const dt = new Date(val);     
    this.DPREntryDate= dt.getDate() + "-" + this.monthNames[dt.getMonth()] + "-" + dt.getFullYear();
    this.DPREntryDateTime = this.dp.transform(this.DPREntryDate,'yyyy-MM-dd hh:mm:ss');
    this.getStationMeterSkidData('-999');
     this.PackageCallOninit();
     this.GetStationDispenser('-999');
     this.GetStationLcv('-999');
     this.GetStationGenSet('-999');
     this.GetGeneralEntry();
     this.GetHybridDetails();
     this.getStationReportData();
    this.SummeryDate= this.DPREntryDate;
    this.getStationReportData();
    this.CheckAllResetEntry();
  }
  JRSValidate () {
    var json ={
      Flag: 'JRSValidate', 
      Id: this.objCook.get('stationId'),
      CDashdate:this.DPREntryDate,
      ReportFlag: 'OTHER'
    }
    this.objDbServ.CommonGetData(json).subscribe(
      (resp: any) => {
        const data = JSON.parse(resp.json());  
        if(data.Table[0].Msgs != ''){
          alert(data.Table[0].Msgs);             
        }
      },
      (error) => {alert("Something went wrong.");
       this.objDbServ.ShowLoaders.emit(false);
      }
    )
  }
  getStationMeterSkidData(MeterSkidId) {
        try{
            this.MeterSkidId = (MeterSkidId=='') ? '-999' : MeterSkidId;
            this.objDbServ.ShowLoaders.emit(true);
            this.objDbServ.getStationMeterSkidApi({StationCode:this.objCook.get('stationCode'),LoginId:this.objCook.get('stationCode'), DPREntryDate:this.DPREntryDate, MeterSkidId:this.MeterSkidId}).subscribe(
            (response: any)=>{
            const data = JSON.parse(response._body);
            if(!isNullOrUndefined(JSON.parse(data)[0])){
                this.IsMSkidhide = false;
                this.MeterStationSkidList = JSON.parse(data)[0];
                this.meterStationSkidData = JSON.parse(data)[1][0]; 
                this.MeterSkidId=this.meterStationSkidData.MeterSkidId;
                this.MSMeterSkidCode =this.meterStationSkidData.MeterSkidCode
                this.MSFlowMeterTotaliserPrv = isNullOrUndefined(this.meterStationSkidData.FlowMeterTotaliserPrv) ? '0.00' : this.meterStationSkidData.FlowMeterTotaliserPrv;
                this.meterTotaliser = isNullOrUndefined(this.meterStationSkidData.FlowMeterTotaliser) ? '0.00' : this.meterStationSkidData.FlowMeterTotaliser;
                this.jumpReadingCount = this.meterStationSkidData.JumpReadingFMTCount;
                this.jumpReading = this.meterStationSkidData.JumpReadingFMT;
                this.JumpCertificateFMT = this.meterStationSkidData.JumpCertificateFMT;
                if(this.JumpCertificateFMT != '')
                   this.MSkidShowJumpImage=true;
                else
                   this.MSkidShowJumpImage=false;
                this.remark = isNullOrUndefined(this.meterStationSkidData.Remark) ? '' : this.meterStationSkidData.Remark;
                this.MSisCRSentToHo = isNullOrUndefined(parseInt(this.meterStationSkidData.isCRSentToHo)) ? 0 : this.meterStationSkidData.isCRSentToHo;
                this.MSisStationSubmitted =  isNullOrUndefined(parseInt(this.meterStationSkidData.isStationSubmitted)) ? 0 : this.meterStationSkidData.isStationSubmitted;
                this.objDbServ.ShowLoaders.emit(false);
                if(parseFloat(this.jumpReading) > 0.000) {
                    this.MSfilevisible = false;
                    $("#Ischeckbox").prop("checked", true);
                    this.JumpVisible=false;
                }else  {
                    this.MSfilevisible= true;
                    $("#Ischeckbox").prop("checked", false);
                    this.JumpVisible =true;
                }
            }
            else{
                alert('No Meter Skid data available. Please try another station.')
                this.objDbServ.ShowLoaders.emit(false);
                this.IsMSkidhide=true;
                this.MSisCRSentToHo=0;
                this.MSisStationSubmitted=0;
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
        this.MSfilevisible = false;
    }else {
        this.MSfilevisible = true;
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
        MeterSkidCode: this.MSMeterSkidCode,
        FlowMeterTotaliser: this.meterTotaliser,
        JumpReadingFMT: 0, 
        JumpReadingFMTCount: 0, 
        Jumpcertificate: ((this.uploadedfile == undefined) ? '' : this.uploadedfile.name),
        Remark: this.remark,
        StationCode: localStorage.getItem('LoginId'),
        FilePath: localStorage.getItem('LoginId') + "/MeterSkid/",
        MeterSkidId: this.meterStationSkidData.MeterSkidId,
        DPREntryDate: this.DPREntryDateTime
      };
  this.MSfiles = $('#MSfileInput');
  var frmData = new FormData();
  var fileInput = this.MSfiles[0];
  frmData.append("meterSkidDetail", JSON.stringify(MyJson));
  if(this.uploadedfile != undefined) {
    frmData.append('file', this.uploadedfile, this.uploadedfile.name);
  }
  var ErrorMsg = this.checkStationSkidvalidations(MyJson, fileInput);
  if(ErrorMsg == '' || ErrorMsg == undefined) {
    if(Number(this.meterTotaliser) <= Number(this.MSFlowMeterTotaliserPrv)) {
        if(confirm("Suspected Meter Skid Reading, Do you want to continue?")) {
          this.objDbServ.insertStationSkidApi(frmData).subscribe(
              (resp : any) => {
                  const data = JSON.parse(resp._body);
                  alert(data.Status);
                  if(data != '') {
                      this.getStationMeterSkidData('-999');
                  }
                  this.getStationReportData();
              },
              (error) =>{alert('Something went wrong.');
              this.objDbServ.ShowLoaders.emit(false);
            }
            )
        }
  }
  else if(this.meterTotaliser > this.MeterSkidReadingAverage && Number(this.MeterSkidReadingAverage) != 0){
    if(confirm("Wrong Entry for Meter Skid Reading, Do you want to continue?")) {
      this.objDbServ.insertStationSkidApi(frmData).subscribe(
        (resp : any) => {
            const data = JSON.parse(resp._body);
            alert(data.Status);
            if(data != '') {
                this.getStationMeterSkidData('-999');
            }
        },
        (error) =>{alert('Something went wrong.');
        this.objDbServ.ShowLoaders.emit(false);
      }
      )
    }
  }
  else if(Number(this.meterTotaliser) >= 2*Number(this.MSFlowMeterTotaliserPrv)) {
      if(confirm("Suspected Meter Skid Reading, Do you want to continue?")) {
          this.objDbServ.insertStationSkidApi(frmData).subscribe(
              (resp : any) => {
                  const data = JSON.parse(resp._body);
                  alert(data.Status);
                  if(data != '') {
                      this.getStationMeterSkidData('-999');
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
              this.getStationMeterSkidData('-999');
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
  if(parseFloat(this.isResetMS)==0)
  {
    if (parseFloat(MeterSkidDetailJson.FlowMeterTotaliser) < parseFloat(this.MSFlowMeterTotaliserPrv)) {
    foundError = 'Flow Meter Totaliser should be greater than Previous Reading';
    return foundError;
    }
    if((MeterSkidDetailJson.JumpReadingFMT == '' || MeterSkidDetailJson.JumpReadingFMT == undefined || parseFloat(MeterSkidDetailJson.JumpReadingFMT) == parseFloat("0")) && parseFloat(MeterSkidDetailJson.FlowMeterTotaliser) == parseFloat("0")) {
      foundError = 'Invalid Meter Skid Reading';
      return foundError;
    }
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
        this.objDbServ.MeterSkidAvrage({LoginId:this.StationCode,DPREntryDate:this.dp.transform(this.SummeryDate,'dd-MMM-yyyy')}).subscribe(
          (resp: any) => {
            const data=JSON.parse(resp.json()).Table[0]
            this.MeterSkidReadingAverage = data.FinalAmount;
          },
          (error) => {
            alert("Something went wrong.");
           this.objDbServ.ShowLoaders.emit(false);
          }
        )
  }
  return foundError;
}
resetchange(value, flag) {
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
getMSJumpHistory(FlagType){
  this.clearMS();
  const obj = {
    FlagEntryFor:FlagType,
    MeterOf:'MS',
    Id:'',
    StationCode:'',
    MeterOfId:this.meterStationSkidData.MeterSkidId,
    MeterType:'FMT',
    EntryDate:this.DPREntryDate,
    FlagReadingType:""
  };
  this.objDbServ.ShowLoaders.emit(true);
  this.objDbServ.GetJumpListHistory(obj).subscribe(
    (resp: any) => {
      this.MSJumpListHistory = JSON.parse(resp.json()).Table;
      this.objDbServ.ShowLoaders.emit(false);
    },
    (error) => {alert("Something went wrong.");
    this.objDbServ.ShowLoaders.emit(false);}
  )
  this.CheckAllResetEntry();
}
DeleteMSJumpHistory(Id:string,FlagReading:string, itm:any){
  if(confirm("Are you sure to delete this record..?")) {
    var Json = {
      Id: Id,
      FlagEntryFor:'DELETE',
      FlagReadingType:FlagReading,
      MeterOf:'MS',
      MeterOfId:this.meterStationSkidData.MeterSkidId,
      EntryDate:this.DPREntryDate
     }
    this.objDbServ.GetJumpListHistory(Json).subscribe(
      (resp: any) => {
        this.getMSJumpHistory('GET');
        const data = JSON.parse(resp.json());
        alert(data.Table[0].Meaasge);
        setTimeout(() => {
          this.getMSJumpHistory('GET');
        });
        this.objDbServ.ShowLoaders.emit(false);
      },
      (error) => {alert("Something went wrong.");
      this.objDbServ.ShowLoaders.emit(false);}
    )
  }
  this.getMSJumpHistory('GET');
}
UpdateMSJumpHistory(Id:string, itm:any){
  this.JumpHistoryId = Id;
  this.OldMeterReading = itm.BeforeJumpReading;
  this.NewMeterReading = itm.AfterJumpReading;
  this.MeterJumpRemark = itm.Remark;
  if(itm.Action == "Jump") {this.MSFlagJumpType = "J" } 
  else if (itm.Action == "Change") {this.MSFlagJumpType = "C"}
  else {this.MSFlagJumpType = "R"}
}
MSJReadingvalue(value) {
  this.MSJReading = value;
  if(this.MSJReading!='') {
      this.MSpopupfilevisible = false;
  }
  else {
      this.MSpopupfilevisible = true;
  }
}
clearMS(){
  this.MSFlagJumpType = "J";
  this.OldMeterReading="";
  this.NewMeterReading = "";
  this.MeterJumpRemark = "";
}
MSchangeresetpopup() {
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
    MeterBeforeJump: this.OldMeterReading,
    JumpReading: ((this.JReading == '') ? '0' : this.JReading),
    ReadingOnSwitch: ((this.meterStationSkidData.ReadingOnSwitch == '') ? '0' : this.meterStationSkidData.ReadingOnSwitch),
    FilePath: localStorage.getItem('LoginId') + "/MeterSkid/",
    MeterAfterJump : this.NewMeterReading,
    MeterJumpRemark : this.MeterJumpRemark,
    JumpHistoryId : this.JumpHistoryId,
    DetailId : this.meterStationSkidData.MeterSkidId,
    EntryDate:this.DPREntryDate
 };
 this.JumpHistoryId = "";
this.filesreset = $('#MSfileInputreset');
var frmData = new FormData();
var fileInputreset = this.filesreset[0];
frmData.append("jsonDetail", JSON.stringify(MyJsonreset));
if(this.uploadedfilereset != undefined) {
    frmData.append('JumpReadingFile', this.uploadedfilereset, this.uploadedfilereset.name);
   }
var ErrorMsg = this.MSchangeresetValidation(MyJsonreset, fileInputreset);
if(ErrorMsg == '' || ErrorMsg == undefined) {
    this.objDbServ.HoldResetReading(frmData).subscribe(
        (resp: any) => {
            const data= (resp.json());
            if(data.Status=="Inserted") {
              alert('Record Saved Successfully.!');
              this.getMSJumpHistory('GET');
              this.clearMS();
            }
            else if(data.Status=="Updated") {
              alert('Record Updated Successfully.!');
              this.getMSJumpHistory('GET');
              this.clearMS();
            }
            else {
              alert(data.Status);
            }
        },
        (error) =>{alert('Something went wrong.');
        this.objDbServ.ShowLoaders.emit(false);
    }
    )
 }
 else {
    alert(ErrorMsg);
  }   
}
MSchangeresetValidation(LcvDetailJsonreset ,fileInputreset) {
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
      if (fileInputreset.files.length > 0) {
         var validExtension = 'jpeg,jpg,png,gif';
         for (var i = 0; i < fileInputreset.files.length; i++) {
                  var fileExtension = fileInputreset.files[i].name.split('.').pop().toLowerCase()[1];
                  if (validExtension.indexOf(fileExtension) < 0) {
                    errorMsg = 'Attachment allowed only for [' + validExtension + '].'; 
                    return errorMsg;
                  }
              }
       }
      return errorMsg;
}
GetPackageDetail(PackageId){
  this.PackageId = PackageId;
  const obj = {
      StationCode: this.StationCode,
      LoginId: this.LoginId,
      PackageId: (this.PackageId=='') ? '-999' : this.PackageId,
      DPREntryDate:this.DPREntryDate
   };
  this.objDbServ.GetPackageDetail(obj).subscribe(
    (resp: any) => {
        const data = JSON.parse(resp.json());
         if(data.length > 0) {
           this.IsPackagehide = false;
           this.TablesPkgs = data[0];
           this.PackageDetailJson = data[1];
           this.PackageCode = this.PackageDetailJson[0].PackageCode;
           this.SelectedPkgId = { PkgId:this.PackageDetailJson[0].PackageId };
           this.PackageId = this.PackageDetailJson[0].PackageId;
           this.PKisCRSentToHo =  isNullOrUndefined(this.PackageDetailJson[0].isCRSentToHo) ?  0 : this.PackageDetailJson[0].isCRSentToHo;
           this.PKisStationSubmitted = isNullOrUndefined(this.PackageDetailJson[0].isStationSubmitted)? 0 : this.PackageDetailJson[0].isStationSubmitted;
           if (!isUndefined(this.PackageDetailJson)) {
              if (data[0].length > 0)
                  this.SelectedPkgId = { PkgId: this.PackageDetailJson[0].PackageId };
              if (this.PackageDetailJson[0].PrimeMover != 'M')
                  this.ShowEngineMeter = true;
              else
                  this.ShowEngineMeter = false;
           this.imgPathSFM = this.PackageDetailJson[0].JumpCertificateSFM;
           if (this.imgPathSFM != '' && !isNullOrUndefined(this.imgPathSFM)) {
               this.mdlImgShowSFM = true;
           }
           this.imgPathDFM = this.PackageDetailJson[0].JumpCertificateDFM;
           if (this.imgPathDFM != '' && !isNullOrUndefined(this.imgPathDFM)) {
               this.mdlImgShowDFM = true;
           }
           this.imgPathEFM = this.PackageDetailJson[0].JumpCertificateEFM;
           if (this.imgPathEFM != '' && !isNullOrUndefined(this.imgPathEFM)) {
               this.mdlImgShowEFM = true;
           }
           this.SuctionFlowMeterReading= isNullOrUndefined(this.PackageDetailJson[0].SuctionFlowMeterReading) ? "0" : this.PackageDetailJson[0].SuctionFlowMeterReading;
           this.SuctionFlowMeterReadingPrv=this.PackageDetailJson[0].SuctionFlowMeterReadingPrv;
           this.MotorFrequency=this.PackageDetailJson[0].MotorFrequency;
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
           else {
              $("#IscheckboxEFS").prop("checked", false);
              this.JumpVisibleEFS =true;
           }
           this.JumpReadingEFMCount = this.PackageDetailJson[0].JumpReadingEFMCount;
           this.JumpCertificateEFM = this.PackageDetailJson[0].JumpCertificateEFM;
           var VentFlow = this.PackageDetailJson[0].IsVentFlow;
           if(parseFloat(VentFlow) > 0) {
              this.IsVentFlow =true;
           }
           else {
              this.IsVentFlow =false;
           }
           this.VentFlowMeterReading = (this.PackageDetailJson[0].VentFlowMeterReading=="" || isNullOrUndefined(this.PackageDetailJson[0].VentFlowMeterReading)) ? "0.00" : this.PackageDetailJson[0].VentFlowMeterReading; 
           this.VentFlowMeterReadingPrv=this.PackageDetailJson[0].VentFlowMeterReadingPrv;
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
          if(this.Remark == "Breakdown due to Leakage" || this.Remark == "Instrumentation breakdown" || this.Remark == "Mechanical breakdown" || this.Remark == "Instrumentation breakdown" || this.Remark == "Powercut" || this.Remark == "Voltage problem" || this.Remark == "Maintenance Shutdown" ){
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
            if( resetSFM.MeterType == 'SFM') { 
                if (!isUndefined(resetSFM))
                    if (resetSFM.ReadingOnSwitch == -999)
                        this.mdlShowResetReadingSFM = false;
                    else {
                        this.mdlShowResetReadingSFM = true;
                        this.mdlReadingOnSwitchSFM = resetSFM.ReadingOnSwitch;
                        this.ResetMeterReadingOfTodaySFM = resetSFM.ResetMeterReadingOfToday;
                        this.meterResetIdSFM = resetSFM.MeterResetId;
                        this.mdlResetJumpReadingSFM = resetSFM.JumpReading;
                        this.ActionTypeSFM = (resetSFM.FlagReadingType == 'R') ? 'Reset' : 'Change';
                        if (resetSFM.JumpCertificateReset != '-999' && resetSFM.JumpCertificateReset != '') {
                            this.imgSFM = resetSFM.JumpCertificateReset;
                            this.imgPathResetSFM = this.glovalList.imgBaseUrl + resetSFM.JumpCertificateReset;
                            this.mdlShowResetImageSFM = true;
                        }
                    }
              }
                  var resetDFM = this.resetMeterJSON[0];
              if(resetDFM.MeterType == 'DFM') { 
                  if (!isUndefined(resetDFM))
                  if (resetDFM.ReadingOnSwitch == -999)
                      this.mdlShowResetReadingDFM = false;
                  else {
                      this.mdlShowResetReadingDFM = true;
                      this.mdlReadingOnSwitchDFM = resetDFM.ReadingOnSwitch;
                      this.meterResetIdDFM = resetDFM.MeterResetId;
                      this.ResetMeterReadingOfTodayDFM = resetDFM.ResetMeterReadingOfToday;
                      this.mdlResetJumpReadingDFM = resetDFM.JumpReading;
                      this.ActionTypeDFM = (resetSFM.FlagReadingType == 'R') ? 'Reset' : 'Change';
                      if (resetDFM.JumpCertificateReset != '-999' && resetDFM.JumpCertificateReset != '') {
                          this.imgDFM = resetDFM.JumpCertificateReset;
                          this.imgPathResetDFM = this.glovalList.imgBaseUrl + resetDFM.JumpCertificateReset;
                          this.mdlShowResetImageDFM = true;
                      }
                  }
                }
                    var resetEFM = this.resetMeterJSON[0];
                 if(resetEFM.MeterType == 'EFM') { 
                  if (!isUndefined(resetEFM))
                      if (resetEFM.ReadingOnSwitch == -999)
                          this.mdlShowResetReadingEFM = false;
                      else {
                          this.mdlShowResetReadingEFM = true;
                          this.mdlReadingOnSwitchEFM = resetEFM.ReadingOnSwitch;
                          this.meterResetIdEFM = resetEFM.MeterResetId;
                          this.ResetMeterReadingOfTodayEFM = resetEFM.ResetMeterReadingOfToday;
                          this.mdlResetJumpReadingEFM = resetEFM.JumpReading;
                          this.ActionTypeEFM = (resetSFM.FlagReadingType == 'R') ? 'Reset' : 'Change';
                          if (resetEFM.JumpCertificateReset != '-999' && resetEFM.JumpCertificateReset != '') {
                              this.imgEFM = resetEFM.JumpCertificateReset;
                              this.imgPathResetEFM =  this.glovalList.imgBaseUrl + resetEFM.JumpCertificateReset;
                              this.mdlShowResetImageEFM = true;
                          }
                       }  
                   } 
                }
          }
       }         
          else {
              this.objDbServ.ShowLoaders.emit(false);
              alert('There is no package available.')
              this.IsPackagehide = true;
              this.PKisCRSentToHo= 0;
              this.PKisStationSubmitted=0;
              return false;
          }
    },
    (error) => {alert("Something went wrong.");
     this.objDbServ.ShowLoaders.emit(false);
    }
  )
}
PackageCallOninit() {
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
PKOnCheckboxChange(evt, flag : any) {
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
    else if (flag == "VFM") {
      if(evt.target.checked==true) 
        this.IsVentFlow = true;
      else if(evt.target.checked==false)
         this.IsVentFlow = false;  
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
                if(this.PackageDetailJson[0].PrimeMover == 'M')
                {
                  alert('Please enter the jump reading for Motor Flow Meter.');
                }
                else
                {
                  alert('Please enter the jump reading for Engine Flow Meter.');
                }
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
  resetPopupVFM(flag) { 
    this.mdlResetPopupVFM = flag; 
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
  uploadJumpReadingImgVFMPopUp(file: File, event: any) {
    this.filesVFM  = file;
  } 
  PKresetchange(evt, flag:string) {
    if(flag == 'SFM')
      this.ActionTypeSFM = evt;
    else if(flag == 'DFM')
      this.ActionTypeDFM = evt;
    else if(flag == 'EFM')
      this.ActionTypeEFM = evt;      
 }
 getSFMJumpHistory(FlagType){
   this.clearPkgSFM();
   const obj = {
    FlagEntryFor:FlagType,
    MeterOf:'PKG',
    Id:'',
    StationCode:'',
    MeterOfId:this.PackageDetailJson[0].PackageId,
    MeterType:'SFM',
    EntryDate:this.DPREntryDate,
    FlagReadingType:""
  };
  this.objDbServ.ShowLoaders.emit(true);
  this.objDbServ.GetJumpListHistory(obj).subscribe(
    (resp: any) => {
      this.SFMJumpListHistory = JSON.parse(resp.json()).Table;
      this.objDbServ.ShowLoaders.emit(false);
    },
    (error) => {alert("Something went wrong.");
    this.objDbServ.ShowLoaders.emit(false);}
  )
  this.CheckAllResetEntry();  
}
DeleteSFMJumpHistory(Id:string,FlagReading:string, itm:any){
  if(confirm("Are you sure to delete this record..?")) {
    var Json = {
      Id: Id,
      FlagEntryFor:'DELETE',
      FlagReadingType:FlagReading,
      MeterOf:'PKG',
      MeterOfId:this.PackageDetailJson[0].PackageId,
      EntryDate:this.DPREntryDate,
      MeterType:'SFM'
     }
    this.objDbServ.GetJumpListHistory(Json).subscribe(
      (resp: any) => {
        this.getSFMJumpHistory('GET');
        const data = JSON.parse(resp.json());
        alert(data.Table[0].Meaasge);
        setTimeout(() => {
          this.getSFMJumpHistory('GET');
        });
        this.objDbServ.ShowLoaders.emit(false);
      },
      (error) => {alert("Something went wrong.");
      this.objDbServ.ShowLoaders.emit(false);}
    )
  }
  this.getSFMJumpHistory('GET');
}
UpdateSFMJumpHistory(Id:string, itm:any){
  this.JumpHistoryId = Id;
  this.OldMeterReading = itm.BeforeJumpReading;
  this.NewMeterReading = itm.AfterJumpReading;
  this.MeterJumpRemark = itm.Remark;
  if(itm.Action == "Jump") {this.ActionTypeSFM = "J" } 
  else if (itm.Action == "Change") {this.ActionTypeSFM = "C"}
  else {this.ActionTypeSFM = "R"}
}
getDFMJumpHistory(FlagType){
  this.clearPkgDFM();
   const obj = {
    FlagEntryFor:FlagType,
    MeterOf:'PKG',
    Id:'',
    StationCode:'',
    MeterOfId:this.PackageDetailJson[0].PackageId,
    MeterType:'DFM',
    EntryDate:this.DPREntryDate,
    FlagReadingType:""
  };
  this.objDbServ.ShowLoaders.emit(true);
  this.objDbServ.GetJumpListHistory(obj).subscribe(
    (resp: any) => {
      this.DFMJumpListHistory = JSON.parse(resp.json()).Table;
      this.objDbServ.ShowLoaders.emit(false);
    },
    (error) => {alert("Something went wrong.");
    this.objDbServ.ShowLoaders.emit(false);}
  )
  this.CheckAllResetEntry();  
}
DeleteDFMJumpHistory(Id:string,FlagReading:string, itm:any){
  if(confirm("Are you sure to delete this record..?")) {
    var Json = {
      Id: Id,
      FlagEntryFor:'DELETE',
      FlagReadingType:FlagReading,
      MeterOf:'PKG',
      MeterOfId:this.PackageDetailJson[0].PackageId,
      EntryDate:this.DPREntryDate,
      MeterType:'DFM'
     }
    this.objDbServ.GetJumpListHistory(Json).subscribe(
      (resp: any) => {
        this.getDFMJumpHistory('GET');
        const data = JSON.parse(resp.json());
        alert(data.Table[0].Meaasge);
        setTimeout(() => {
          this.getDFMJumpHistory('GET');
        });
        this.objDbServ.ShowLoaders.emit(false);
      },
      (error) => {alert("Something went wrong.");
      this.objDbServ.ShowLoaders.emit(false);}
    )
  }
  this.getDFMJumpHistory('GET');
}
UpdateDFMJumpHistory(Id:string, itm:any){
  this.JumpHistoryId = Id;
  this.mdlReadingOnSwitchDFM = itm.BeforeJumpReading;
  this.NewMeterReading = itm.AfterJumpReading;
  this.MeterJumpRemark = itm.Remark;
  if(itm.Action == "Jump") {this.ActionTypeDFM = "J" } 
  else if (itm.Action == "Change") {this.ActionTypeDFM = "C"}
  else {this.ActionTypeDFM = "R"}
}
getEFMJumpHistory(FlagType){
  this.clearPkgEFM();
   const obj = {
    FlagEntryFor:FlagType,
    MeterOf:'PKG',
    Id:'',
    StationCode:'',
    MeterOfId:this.PackageDetailJson[0].PackageId,
    MeterType:'EFM',
    EntryDate:this.DPREntryDate,
    FlagReadingType:""
  };
  this.objDbServ.ShowLoaders.emit(true);
  this.objDbServ.GetJumpListHistory(obj).subscribe(
    (resp: any) => {
      this.EFMJumpListHistory = JSON.parse(resp.json()).Table;
      this.objDbServ.ShowLoaders.emit(false);
    },
    (error) => {alert("Something went wrong.");
    this.objDbServ.ShowLoaders.emit(false);}
  )
  this.CheckAllResetEntry();  
}
DeleteEFMJumpHistory(Id:string,FlagReading:string, itm:any){
  if(confirm("Are you sure to delete this record..?")) {
    var Json = {
      Id: Id,
      FlagEntryFor:'DELETE',
      FlagReadingType:FlagReading,
      MeterOf:'PKG',
      MeterOfId:this.PackageDetailJson[0].PackageId,
      EntryDate:this.DPREntryDate,
      MeterType:'EFM'
     }
    this.objDbServ.GetJumpListHistory(Json).subscribe(
      (resp: any) => {
        this.getEFMJumpHistory('GET');
        const data = JSON.parse(resp.json());
        alert(data.Table[0].Meaasge);
        setTimeout(() => {
          this.getEFMJumpHistory('GET');
        });
        this.objDbServ.ShowLoaders.emit(false);
      },
      (error) => {alert("Something went wrong.");
      this.objDbServ.ShowLoaders.emit(false);}
    )
  }
  this.getEFMJumpHistory('GET');
}
UpdateEFMJumpHistory(Id:string, itm:any){
  this.JumpHistoryId = Id;
  this.mdlReadingOnSwitchEFM = itm.BeforeJumpReading;
  this.NewMeterReading = itm.AfterJumpReading;
  this.MeterJumpRemark = itm.Remark;
  if(itm.Action == "Jump") {this.ActionTypeEFM = "J" } 
  else if (itm.Action == "Change") {this.ActionTypeEFM = "C"}
  else {this.ActionTypeEFM = "R"}
}
getVFMJumpHistory(FlagType){
  this.clearPkgVFM();
   const obj = {
    FlagEntryFor:FlagType,
    MeterOf:'PKG',
    Id:'',
    StationCode:'',
    MeterOfId:this.PackageDetailJson[0].PackageId,
    MeterType:'VFM',
    EntryDate:this.DPREntryDate,
    FlagReadingType:""
  };
  this.objDbServ.ShowLoaders.emit(true);
  this.objDbServ.GetJumpListHistory(obj).subscribe(
    (resp: any) => {
      this.VFMJumpListHistory = JSON.parse(resp.json()).Table;
      this.objDbServ.ShowLoaders.emit(false);
    },
    (error) => {alert("Something went wrong.");
    this.objDbServ.ShowLoaders.emit(false);}
  )
  this.CheckAllResetEntry();  
}
DeleteVFMJumpHistory(Id:string,FlagReading:string, itm:any){
  if(confirm("Are you sure to delete this record..?")) {
    var Json = {
      Id: Id,
      FlagEntryFor:'DELETE',
      FlagReadingType:FlagReading,
      MeterOf:'PKG',
      MeterOfId:this.PackageDetailJson[0].PackageId,
      EntryDate:this.DPREntryDate,
      MeterType:'VFM'
     }
    this.objDbServ.GetJumpListHistory(Json).subscribe(
      (resp: any) => {
        this.getVFMJumpHistory('GET');
        const data = JSON.parse(resp.json());
        alert(data.Table[0].Meaasge);
        setTimeout(() => {
          this.getVFMJumpHistory('GET');
        });
        this.objDbServ.ShowLoaders.emit(false);
      },
      (error) => {alert("Something went wrong.");
      this.objDbServ.ShowLoaders.emit(false);}
    )
  }
  this.getVFMJumpHistory('GET');
}
UpdateVFMJumpHistory(Id:string, itm:any){
  this.JumpHistoryId = Id;
  this.mdlReadingOnSwitchVFM = itm.BeforeJumpReading;
  this.NewMeterReading = itm.AfterJumpReading;
  this.MeterJumpRemark = itm.Remark;
  if(itm.Action == "Jump") {this.ActionTypeVFM = "J" } 
  else if (itm.Action == "Change") {this.ActionTypeVFM = "C"}
  else {this.ActionTypeVFM = "R"}
}
clearPkgSFM()
{
  this.ActionTypeSFM = "J";
  this.OldMeterReading="";
  this.NewMeterReading = "";
  this.MeterJumpRemark = "";
}
clearPkgDFM()
{
  this.ActionTypeDFM = "J";
  this.mdlReadingOnSwitchDFM="";
  this.NewMeterReading = "";
  this.MeterJumpRemark = "";
}
clearPkgEFM(){
  this.ActionTypeEFM = "J";
  this.mdlReadingOnSwitchEFM="";
  this.NewMeterReading = "";
  this.MeterJumpRemark = "";
}
clearPkgVFM(){
  this.ActionTypeVFM = "J";
  this.mdlReadingOnSwitchVFM="";
  this.NewMeterReading = "";
  this.MeterJumpRemark = "";
}
 HoldResetReading(flag) {
    var FlagReadingType = '', fileInput, file;
    var PrvReading, JumpReading,MeterResetId,ReadingOnSwitch;
    if (flag == 'SFM') {
        file = (isUndefined(this.filesSFM)) ? null : this.filesSFM[0];
        this.resetTypeOptionSFM;
        var jsonValidation = {
            ActionType : this.ActionTypeSFM,
            oldMeterReading: this.OldMeterReading,
            oldJumpReading: this.mdlResetJumpReadingSFM,
            fileObject: file
        };
        var retJson = this.validationMeterReset(jsonValidation);
        if (retJson.errorMsg != '') {
            alert(retJson.errorMsg);
            return false;
        };
        FlagReadingType = this.resetTypeJsonSelected;
        PrvReading = this.PackageDetailJson[0].SuctionFlowMeterReadingPrv;
        JumpReading = this.mdlResetJumpReadingSFM;
        MeterResetId = this.meterResetIdSFM;
        ReadingOnSwitch = this.mdlReadingOnSwitchSFM;
        this.PackageOldReading = this.OldMeterReading;
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
        FlagReadingType = this.resetTypeJsonSelected;
        PrvReading = this.PackageDetailJson[0].DischargeFlowMeterReadingPrv;
        JumpReading = this.mdlResetJumpReadingDFM;
        MeterResetId =  this.meterResetIdDFM;
        ReadingOnSwitch = this.mdlReadingOnSwitchDFM;
        this.PackageOldReading = this.mdlReadingOnSwitchDFM;
    }
    else if (flag == 'EFM') {
        file = (isUndefined(this.filesEFM)) ? null : this.filesEFM[0];
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
        FlagReadingType = this.resetTypeJsonSelected;
        PrvReading = this.PackageDetailJson[0].EngineFlowMeterReadingPrv;
        JumpReading = this.mdlResetJumpReadingEFM;
        MeterResetId = this.meterResetIdEFM;
        ReadingOnSwitch = this.mdlReadingOnSwitchEFM;
        this.PackageOldReading = this.mdlReadingOnSwitchEFM;
    }
    else if (flag == 'VFM') {
      file = (isUndefined(this.filesVFM)) ? null : this.filesVFM[0];
      var jsonValidation = {
          ActionType : this.ActionTypeVFM,
          oldMeterReading: this.mdlReadingOnSwitchVFM,
          oldJumpReading: this.mdlReadingOnSwitchVFM,
          fileObject: file
      };
      var retJson = this.validationMeterReset(jsonValidation);
      if (retJson.errorMsg != '') {
          alert(retJson.errorMsg);
          return false;
      };
      FlagReadingType = this.resetTypeJsonSelected;
      PrvReading = this.PackageDetailJson[0].VentFlowMeterReading;
      JumpReading = this.mdlReadingOnSwitchVFM;
      MeterResetId = this.meterResetIdEFM;
      ReadingOnSwitch = this.mdlReadingOnSwitchVFM;
      this.PackageOldReading = this.mdlReadingOnSwitchVFM;
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
        PrvReading: this.PackageOldReading,
        JumpReading: ((JumpReading == '') ? '0' : JumpReading),
        ReadingOnSwitch: ReadingOnSwitch,
        FilePath: localStorage.getItem('LoginId') + "/Package/",
        MeterJumpRemark : this.MeterJumpRemark,
        JumpHistoryId : this.JumpHistoryId,
        MeterAfterJump : this.NewMeterReading,
        MeterBeforeJump: this.PackageOldReading,
        EntryDate:this.DPREntryDate
      };
      this.JumpHistoryId = "";
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
               this.getSFMJumpHistory('GET');
               this.clearPkgSFM();
                this.mdlResetPopupSFM = false;
                this.mdlShowResetReadingSFM = true; 
            }
            else if (flag == 'EFM') {
              this.getEFMJumpHistory('GET');
              this.clearPkgEFM();
                this.mdlResetPopupEFM = false;
                this.mdlShowResetReadingEFM = true;  
            }
            else if (flag == 'DFM') {
              this.getDFMJumpHistory('GET');
              this.clearPkgDFM();
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
        MotorFrequency: pkgDetJson[0].MotorFrequency,
        Remark: remarkJson.pkgRemark,
        StationCode: this.StationCode,
        FilePath: localStorage.getItem('LoginId') + "/Package/",
        PackageId: SelectedPkgId,
        DPREntryDate: this.DPREntryDateTime, 
        VentFlowMeterReading :  (pkgDetJson[0].VentFlowMeterReading=="" || isNullOrUndefined(pkgDetJson[0].VentFlowMeterReading)) ? "0.00" : pkgDetJson[0].VentFlowMeterReading 
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
  if (pkgDetJson[0].PrimeMover != 'M' && parseFloat(pkgDetJson[0].EngineFlowMeterReading) <= parseFloat(pkgDetJson[0].EngineFlowMeterReadingPrv))
      PromptErrorE = 'Suspected Engine Flow Meter Reading, Do you want to continue?';
  if (pkgDetJson[0].PrimeMover == 'M' && parseFloat(pkgDetJson[0].EngineFlowMeterReading) <= parseFloat(pkgDetJson[0].EngineFlowMeterReadingPrv))
    PromptErrorE = 'Suspected Motor Flow Meter Reading, Do you want to continue?';
  if (pkgDetJson[0].SuctionFlowMeterReading > this.SuctionFlowReadingAverage && Number(this.SuctionFlowReadingAverage) != 0)
      PromptErrorS = 'Wrong Entry for Suction Flow Meter Reading, Do you want to continue?';
      else if (parseFloat(pkgDetJson[0].SuctionFlowMeterReading) >= 2*parseFloat(pkgDetJson[0].SuctionFlowMeterReadingPrv))
      PromptErrorS = 'Suspected Suction Flow Meter Reading, Do you want to continue?';
  if (pkgDetJson[0].DischargeFlowMeterReading > this.DischargeFlowReadingAverage && Number(this.DischargeFlowReadingAverage) != 0)
      PromptErrorD = 'Wrong Entry for Discharge Flow Meter Reading, Do you want to continue?';
      else if (parseFloat(pkgDetJson[0].DischargeFlowMeterReading) >= 2*parseFloat(pkgDetJson[0].DischargeFlowMeterReadingPrv))
      PromptErrorD = 'Suspected Discharge Flow Meter Reading, Do you want to continue?';
  if (pkgDetJson[0].PrimeMover != 'M' && pkgDetJson[0].EngineFlowMeterReading > this.EngineFlowReadingAverage && Number(this.EngineFlowReadingAverage) != 0)
      PromptErrorE = 'Wrong Entry for Engine Flow Meter Reading, Do you want to continue?';
      else if (pkgDetJson[0].PrimeMover != 'M' && parseFloat(pkgDetJson[0].EngineFlowMeterReading) >= 2*parseFloat(pkgDetJson[0].EngineFlowMeterReadingPrv))
      PromptErrorE = 'Suspected Engine Flow Meter Reading, Do you want to continue?';
      if (pkgDetJson[0].PrimeMover == 'M' && pkgDetJson[0].EngineFlowMeterReading > this.EngineFlowReadingAverage && Number(this.EngineFlowReadingAverage) != 0)
        PromptErrorE = 'Wrong Entry for Motor Flow Meter Reading, Do you want to continue?';
        else if (pkgDetJson[0].PrimeMover == 'M' && parseFloat(pkgDetJson[0].EngineFlowMeterReading) >= 2*parseFloat(pkgDetJson[0].EngineFlowMeterReadingPrv))
        PromptErrorE = 'Suspected Motor Flow Meter Reading, Do you want to continue?';
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
    var MotorFrequency = pkgDetJson[0].MotorFrequency;
    if (SFMRead == "" || isUndefined(SFMRead)) {
        foundError = 'Suction Flow Meter Reading is required.';
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
        if(parseFloat(this.isResetSFM)==0)
        {
          if (parseFloat(SFMRead) < parseFloat(this.PackageDetailJson[0].SuctionFlowMeterReadingPrv)) {
          foundError = 'Suction Flow Meter Reading should be greater than Previous Reading';
          return foundError;
          }
        }
          this.objDbServ.PackagesAverage({LoginId:this.StationCode,DPREntryDate:this.dp.transform(this.SummeryDate,'dd-MMM-yyyy')}).subscribe(
            (resp: any) => {
              const data=JSON.parse(resp.json()).Table[0]
              this.SuctionFlowReadingAverage=data.FinalSuctionFlow;
              this.DischargeFlowReadingAverage = data.FinalDischargeFlow
              this.EngineFlowReadingAverage = data.FinalEngineFlow
            },
            (error) => {
              alert("Something went wrong.");
             this.objDbServ.ShowLoaders.emit(false);
            }
          )
    }
    if (pkgDetJson[0].PrimeMover != 'M' && EFMRead == "") {
        foundError = 'Engine Flow Meter Reading is required.';
        return foundError;
    }
    if (pkgDetJson[0].PrimeMover == 'M' && EFMRead == "") {
      foundError = 'Motor Flow Meter Reading is required.';
      return foundError;
  }
  if(parseFloat(this.isResetEFM)==0)
    {
      if(pkgDetJson[0].PrimeMover != 'M' && (pkgDetJson[0].JumpReadingEFM == '' || pkgDetJson[0].JumpReadingEFM == undefined || parseFloat(pkgDetJson[0].JumpReadingEFM) == parseFloat("0")) && parseFloat(EFMRead) == parseFloat("0")) {
        foundError = 'Invalid Engine Flow Meter Reading';
        return foundError;
      }
      if(pkgDetJson[0].PrimeMover == 'M' && (pkgDetJson[0].JumpReadingEFM == '' || pkgDetJson[0].JumpReadingEFM == undefined || parseFloat(pkgDetJson[0].JumpReadingEFM) == parseFloat("0")) && parseFloat(EFMRead) == parseFloat("0")) {
        foundError = 'Invalid Motor Flow Meter Reading';
        return foundError;
      }
      if (parseFloat(EFMRead) < parseFloat(this.PackageDetailJson[0].EngineFlowMeterReadingPrv) && pkgDetJson[0].PrimeMover != 'M') {
      foundError = 'Engine Flow Meter Reading should be greater than Previous Reading';
      return foundError;
      }
      if (parseFloat(EFMRead) < parseFloat(this.PackageDetailJson[0].EngineFlowMeterReadingPrv) && pkgDetJson[0].PrimeMover == 'M') {
        foundError = 'Motor Flow Meter Reading should be greater than Previous Reading';
        return foundError;
        }
    }
    if ((pkgDetJson[0].PrimeMover != 'M' || pkgDetJson[0].PrimeMover == 'M') && EFMRead != "")
        if (regexNumeric.test(EFMRead) == false) {
            foundError = 'Only numeric value allowed for reading.';
            return foundError;
        }
    if(this.IsVentFlow==true) {
      if (pkgDetJson[0].VentFlowMeterReading == '' || parseFloat(pkgDetJson[0].VentFlowMeterReading) == 0 || isNullOrUndefined(pkgDetJson[0].VentFlowMeterReading)) {
        foundError = 'Please enter the Vent Flow Meter Reading.'; 
        return foundError;
      }
    }
    if (DFMRead == "" || isUndefined(DFMRead)) {
        foundError = 'Discharge Flow Meter Reading is required.';
        return foundError;
    }
    if(parseFloat(this.isResetDFM)==0)
    {
      if((pkgDetJson[0].JumpReadingDFM == '' || pkgDetJson[0].JumpReadingDFM == undefined || parseFloat(pkgDetJson[0].JumpReadingDFM) == parseFloat("0")) && parseFloat(DFMRead) == parseFloat("0")) {
      foundError = 'Invalid Discharge Flow Meter Reading';
      return foundError;
      }
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
        if(parseFloat(this.isResetDFM)==0)
        {
          if (parseFloat(DFMRead) < parseFloat(this.PackageDetailJson[0].DischargeFlowMeterReadingPrv)) {
          foundError = 'Discharge Flow Meter Reading should be greater than Previous Reading';
          return foundError;
          }
        }
  }
  if ((this.MotorFrequency == "" || isUndefined(MotorFrequency)) && (this.PackageDetailJson[0].PrimeMover == 'M')) {
      foundError = 'Motor Frequencty is required.';
      return foundError;
  } 
  if ((MotorFrequency != "") && (this.PackageDetailJson[0].PrimeMover == 'M')) {
      if (regexNumeric.test(MotorFrequency) == false) {
        foundError = 'Only numeric value allowed for Frequency.';
        return foundError;
  }
  if ((parseFloat(MotorFrequency) < 0) && (this.PackageDetailJson[0].PrimeMover == 'M')) {
        foundError = 'Motor Frequencty must be Positive.';
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
    if(this.mdlSelectedRemark==''){
      foundError = 'Please Select Remarks.';
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
        (resp: any) => {
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
          this.PKrefereshReset();     
        },
        (error) => {alert("Something went wrong.");
          this.objDbServ.ShowLoaders.emit(false);
        }
    )
}
PKrefereshReset() {
    this.mdlResetPopupSFM = false;
    this.mdlShowResetReadingSFM = false
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
GetStationDispenser(DispId){
    try {
      this.objDbServ.ShowLoaders.emit(true);
      this.DispenserId = DispId;
      this.SAPEquipmentNumber1 = "";
      this.SAPEquipmentNumber2 = "";
      this.PreviousReadingArmA = "";
      this.PreviousReadingArmB = "";
      this.objDbServ.GetStationDispenser({StationCode:this.objCook.get('stationCode'),LoginId:this.objCook.get('stationCode'),DispenserId:DispId, DPREntryDate:this.DPREntryDate}).subscribe(
        (response: any)=>{
          const data = JSON.parse(response._body);  
          if(JSON.parse(data)[0].length > 0){
            this.IsDisphide = false;
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
                this.DISisStationSubmitted = isNullOrUndefined(this.DispenserDetails.isStationSubmitted) ? 0 : this.DispenserDetails.isStationSubmitted;
                this.DISisCRSentToHo = isNullOrUndefined(this.DispenserDetails.isCRSentToHo) ? 0 : this.DispenserDetails.isCRSentToHo;
                this.ArmASale = this.DispenserDetails.ArmASale;
                this.ArmBSale = this.DispenserDetails.ArmBSale;
                this.TotalSale = parseFloat(this.DispenserDetails.ArmASale) + parseFloat(this.DispenserDetails.ArmBSale);
                this.objDbServ.ShowLoaders.emit(false);
                if(this.DispenserDetails.isStationSubmitted == "0") {
                  this.formFlag = true;
                }
                else {
                  this.formFlag = false;
                }
                if(this.formFlag == true && this.JumpReadingArmA != '') {
                  this.filevisibleA = false;
                 }
                 else  {
                  this.filevisibleA =true;
                }
                if(this.formFlag == true && this.JumpReadingArmB != '') {
                  this.filevisibleB = false;
                 }
                 else  {
                  this.filevisibleB =true;
                }
                if(parseFloat(this.JumpReadingArmA) > 0.000) {
                    this.filevisibleA = false;
                    $("#IscheckboxArmA").prop("checked", true);
                    this.JumpVisibleArmA=false;
                }
                else {
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
                this.IsDisphide = true;
                this.DISisStationSubmitted=0;
                this.DISisCRSentToHo=0;
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
DISOnCheckboxChange(evt, flag : any) {
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
      JumpReadingArmA: 0,
      JumpReadingArmACount:0,
      JumpCeritificateArmA:0,
      ArmB: this.ArmB,
      JumpReadingArmB: 0,
      JumpReadingArmBCount:0,
      JumpCeritificateArmB:0,
      Remark: this.Remark,
      StationCode: localStorage.getItem('LoginId'),
      FilePath: localStorage.getItem('LoginId') + "/dispenser/",
      PrvReadingA: this.DispenserDetails.ArmAPrv,
      PrvReadingB: this.DispenserDetails.ArmBPrv,
      DPREntryDate: this.DPREntryDateTime
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
      var retJson = "";
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
      var retJson = "";
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
              (resp: any) => {
                const data= (resp.json());
                if(data.Status=="Updated" || data.Status=="Inserted") {
                  alert('Record Saved Successfully.!');
                }
                else {
                  alert(data.Status);
                }
              },
              (error) =>{alert('Something went wrong.');
              this.objDbServ.ShowLoaders.emit(false);
          }
          )   
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
    return foundError;
  }
  DISresetchange(value) {
    this.resetTypeJsonSelected = value;
  }
  fileuploadresetA(file: FileList, event: any) {
    this.fileInput = file.item(0);
  }
  fileuploadresetB(file: FileList, event: any) {
    this.fileInput = file.item(0);
  }
GetStationLcv(id) {
    this.LCVuploadedfile = null;
    this.lcvid = id;
    this.LCVMeterTotaliserPrv = "";
    this.SAPEquipmentNumber = "";
    var LoginId = localStorage.getItem('LoginId');
    this.objDbServ.ShowLoaders.emit(true);
    this.objDbServ.GetStationLcv({LoginId:LoginId, StationCode:LoginId, LcvId:id, DPREntryDate:this.DPREntryDate}).subscribe(
      (resp: any) => {
        const data = JSON.parse(resp.json());
        if(data[0].length != 0 && data[1].length != 0) {
            this.IsLCVhide=false;
            this.stationLcvData = JSON.parse(resp.json());
            this.stationLcvData1 = JSON.parse(resp.json())[1];
            this.stationLcvData2 = JSON.parse(resp.json())[0];
            this.lcvmeterTotaliser = this.stationLcvData1[0].LCVMeterTotaliser;
            this.LCVjumpreading = this.stationLcvData1[0].JumpReadingLCV;
            this.jumpreadingcount = this.stationLcvData1[0].JumpReadingLCVCount;
            this.JumpCertificateLCV = this.stationLcvData1[0].JumpCeritificateLCV;
            if(this.JumpCertificateLCV != '')
                this.LCVShowJumpImage = true;
            else
                this.LCVShowJumpImage = false;
            this.LCVremark = this.stationLcvData1[0].Remark;
            this.LCVisCRSentToHo = isNullOrUndefined(this.stationLcvData1[0].isCRSentToHo) ? 0 : this.stationLcvData1[0].isCRSentToHo;
            this.LCVisStationSubmitted = isNullOrUndefined(this.stationLcvData1[0].isStationSubmitted) ? 0 : this.stationLcvData1[0].isStationSubmitted;
            if(parseFloat(this.LCVjumpreading) > 0.000) {
                this.LCVfilevisible = false;
                $("#Ischeckbox").prop("checked", true);
                this.LCVJumpVisible=false;
            } else  {
                this.LCVfilevisible= true;
                $("#Ischeckbox").prop("checked", false);
                this.LCVJumpVisible =true;
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
        this.IsLCVhide=true;
        this.LCVisCRSentToHo = 0; 
        this.LCVisStationSubmitted = 0; 
    }
      },
      (error) =>{alert('Something went wrong.');
      this.objDbServ.ShowLoaders.emit(false);
    }
    )
}
fileupload(file: FileList, event: any) {
  this.LCVuploadedfile = file.item(0);
}
LCVfileuploadreset(file: FileList, event: any) {
  this.LCVuploadedfilereset = file.item(0);
}
LCVjumpreadingValue(value) {
  this.LCVjumpreading = value;
  if(this.LCVjumpreading != '') {
      this.LCVfilevisible = false;
  }else {
      this.LCVfilevisible = true;
  }
}
LCVOnCheckboxChange(evt) {
  if(evt.target.checked==true) 
    this.LCVJumpVisible = false;
  else if(evt.target.checked==false)
    this.LCVJumpVisible = true;     
}
InsertStationLCV() {
    var MyJson = {
      LoginId: localStorage.getItem('LoginId'),
      LcvId: this.lcvid,
      LCVMeterTotaliser: this.lcvmeterTotaliser,
      JumpReadingLCV: 0,
      JumpReadingLCVCount: 0, 
      JumpCeritificateLCV: ((this.LCVuploadedfile == undefined) ? '' : this.LCVuploadedfile.name),
      Remark: this.LCVremark,
      StationCode: localStorage.getItem('LoginId'),
      FilePath: localStorage.getItem('LoginId') + "/lcv/",
      DPREntryDate: this.DPREntryDateTime
     };
  this.LCVfiles = $('#LCVfileInput');
  var frmData = new FormData();
  var fileInput = this.LCVfiles[0];
  frmData.append("lcvDetail", JSON.stringify(MyJson));
  if(this.LCVuploadedfile != undefined) {
    frmData.append('JumpReadingFile', this.LCVuploadedfile, this.LCVuploadedfile.name);
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
   else if(this.lcvmeterTotaliser > this.LcvReadingAverage && Number(this.LcvReadingAverage) != 0){
    if(confirm("Wrong Entry for Meter Totaliser Reading, Do you want to continue?")) {
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
    if(parseFloat(this.isResetLCV)==0)
    {
        if((LcvDetailJson.JumpReadingLCV == '' || LcvDetailJson.JumpReadingLCV == undefined || parseFloat(LcvDetailJson.JumpReadingLCV) == parseFloat("0")) && parseFloat(LcvDetailJson.LCVMeterTotaliser) == parseFloat("0")) {
        foundError = 'Invalid Meter Totaliser Reading';
        return foundError;
        }
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
        if(parseFloat(this.isResetLCV)==0)
        {
          if (parseFloat(LcvDetailJson.LCVMeterTotaliser) < parseFloat(this.LCVMeterTotaliserPrv)) {
          foundError = 'LCV Meter Totaliser should be greater than previous reading';
          return foundError;
          }
        }
          this.objDbServ.LCVAverage({LoginId:this.StationCode,DPREntryDate:this.dp.transform(this.SummeryDate,'dd-MMM-yyyy')}).subscribe(
            (resp: any) => {
              const data=JSON.parse(resp.json()).Table[0]
              this.LcvReadingAverage=data.FinalAmount;
            },
            (error) => {
              alert("Something went wrong.");
             this.objDbServ.ShowLoaders.emit(false);
            }
          )
    }
    return foundError;
}
LCVresetchange(value, flag) {
    this.resetTypeJsonSelected = value;
}
getLCVJumpHistory(FlagType){
  this.clearLCV();
  const obj = {
    FlagEntryFor:FlagType,
    MeterOf:'LCV',
    Id:'',
    StationCode:'',
    MeterOfId:this.lcvid,
    MeterType:'LMT',
    EntryDate:this.DPREntryDate,
    FlagReadingType:""
  };
  this.objDbServ.ShowLoaders.emit(true);
  this.objDbServ.GetJumpListHistory(obj).subscribe(
    (resp: any) => {
      this.LCVJumpListHistory = JSON.parse(resp.json()).Table;
      this.objDbServ.ShowLoaders.emit(false);
    },
    (error) => {alert("Something went wrong.");
    this.objDbServ.ShowLoaders.emit(false);}
  )
  this.CheckAllResetEntry();
}
DeleteLCVJumpHistory(Id:string,FlagReading:string, itm:any){
  if(confirm("Are you sure to delete this record..?")) {
    var Json = {
      Id: Id,
      FlagEntryFor:'DELETE',
      FlagReadingType:FlagReading,
      MeterOf:'LCV',
      MeterOfId:this.lcvid,
      EntryDate:this.DPREntryDate
     }
    this.objDbServ.GetJumpListHistory(Json).subscribe(
      (resp: any) => {
        this.getLCVJumpHistory('GET');
        const data = JSON.parse(resp.json());
        alert(data.Table[0].Meaasge);
        setTimeout(() => {
          this.getLCVJumpHistory('GET');
        });
        this.objDbServ.ShowLoaders.emit(false);
      },
      (error) => {alert("Something went wrong.");
      this.objDbServ.ShowLoaders.emit(false);}
    )
  }
  this.getLCVJumpHistory('GET');
}
UpdateLCVJumpHistory(Id:string, itm:any){
  this.JumpHistoryId = Id;
  this.OldMeterReading = itm.BeforeJumpReading;
  this.NewMeterReading = itm.AfterJumpReading;
  this.MeterJumpRemark = itm.Remark;
  if(itm.Action == "Jump") {this.LCVFlagJumpType = "J" } 
  else if (itm.Action == "Change") {this.LCVFlagJumpType = "C"}
  else {this.LCVFlagJumpType = "R"}
}
LCVJReadingvalue(value) {
  this.JReading = value;
  if(this.JReading!='') {
      this.popupfilevisible = false;
  }
  else {
      this.popupfilevisible = true;
  }
}
clearLCV() {
  this.LCVFlagJumpType = "J";
  this.OldMeterReading="";
  this.NewMeterReading = "";
  this.MeterJumpRemark = "";
}
LCVchangeresetpopup() {
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
        FilePath: localStorage.getItem('LoginId') + "/lcv/",
        MeterAfterJump : this.NewMeterReading,
        MeterJumpRemark : this.MeterJumpRemark,
        JumpHistoryId : this.JumpHistoryId,
        MeterBeforeJump: this.OldMeterReading,
        EntryDate:this.DPREntryDate
    };
    this.JumpHistoryId = "";
this.LCVfilesreset = $('#LCVfileInputreset');
var frmData = new FormData();
var fileInputreset = this.LCVfilesreset[0];
frmData.append("jsonDetail", JSON.stringify(MyJsonreset));
if(this.LCVuploadedfilereset != undefined) {
    frmData.append('JumpReadingFile', this.LCVuploadedfilereset, this.LCVuploadedfilereset.name);
   }
var ErrorMsg = this.LCVchangeresetValidation(MyJsonreset, fileInputreset);
if(ErrorMsg == '' || ErrorMsg == undefined) {
    this.objDbServ.HoldResetReading(frmData).subscribe(
        (resp: any) => {
            const data= (resp.json());
            if(data.Status=="Inserted") {
              this.getLCVJumpHistory('GET');
              this.clearLCV();
              alert('Record Saved Successfully.!');
            }
            else if(data.Status=="Updated") {
              this.getLCVJumpHistory('GET');
              this.clearLCV();
              alert('Record Updated Successfully.!');
            }
            else {
              alert(data.Status);
            }
        },
        (error) =>{alert('Something went wrong.');
        this.objDbServ.ShowLoaders.emit(false);
    }
    )
}
else {
    alert(ErrorMsg);
 }
 this.getLCVJumpHistory('GET');
}
LCVchangeresetValidation(LcvDetailJsonreset, fileInputreset) {
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
        if (fileInputreset.files.length > 0) {
          var validExtension = 'jpeg,jpg,png,gif';
          for (var i = 0; i < fileInputreset.files.length; i++) {
              var fileExtension = fileInputreset.files[i].name.split('.').pop().toLowerCase()[1];
              if (validExtension.indexOf(fileExtension) < 0) {
                  errorMsg = 'Attachment allowed only for [' + validExtension + '].';
                  return errorMsg;
              }
          }
      }
        return errorMsg;
}
 GetStationGenSet(GenSetId){
    try
    {    
      this.GenSetId = GenSetId;
      this.objDbServ.ShowLoaders.emit(true);
      this.objDbServ.GetStationGenSet({StationCode:this.objCook.get('stationCode'),LoginId:this.objCook.get('stationCode'),GenSetId:GenSetId, DPREntryDate:this.DPREntryDate}).subscribe(
        (response: any)=>{
          const data = JSON.parse(response._body);
          this.getGenSetData = JSON.parse(data);
          if(this.getGenSetData[0].length != 0 && this.getGenSetData[1].length != 0) {
          this.IsGenSethide=false;
          this.getGenSetDetails = JSON.parse(data)[0];
          this.getGenSetFormData = JSON.parse(data)[1];
          this.PreviousReading = this.getGenSetFormData[0].FlowMeterReadingPrv;
          this.GSSAPEquipmentNumber = this.getGenSetFormData[0].GasGenSetCode;
          this.GSmeterTotaliser = this.getGenSetFormData[0].FlowMeterReading;
          this.GSjumpReading = this.getGenSetFormData[0].JumpReadingFMR;
          this.GSjumpReadingCount = this.getGenSetFormData[0].JumpReadingFMRCount;
          this.JumpCertificateGenset = this.getGenSetFormData[0].JumpCeritificateFMR;
          if(this.JumpCertificateGenset !='')
             this.GensetShowJumpImage=true;
          else
             this.GensetShowJumpImage=false;
          this.GSremark = this.getGenSetFormData[0].Remark;
          this.GSRunHrs = this.getGenSetFormData[0].RunninInHours;
          this.GSRunMins = this.getGenSetFormData[0].RunningInMinutes;
          this.GSisCRSentToHo = this.getGenSetFormData[0].isCRSentToHo;
          this.GSisStationSubmitted = this.getGenSetFormData[0].isStationSubmitted;
          if(parseFloat(this.GSjumpReading) > 0.000) {
             this.GSfilevisible = false;
             $("#GSIscheckbox").prop("checked", true);
             this.GSJumpVisible =false;
           } 
           else {
             this.GSfilevisible =true;
             $("#GSIscheckbox").prop("checked", false);
             this.GSJumpVisible =true;
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
            this.IsGenSethide=true;
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
  GensetuploadJumpReadingImg(file: FileList, event: any) {
    this.GSuploadedfile = file.item(0);
  }
  Gensetfileuploadreset(file: FileList, event: any) {
    this.GSuploadedfilereset = file.item(0);
  }
  selecthrsmnts(value,flag) {
    if(flag == 'HH') {
      this.GSRunHrs = value;
    }else {
      this.GSRunMins = value;
    }
  }
  GensetjumpreadingValue(value) {
    this.GSjumpReading = value;
    if(this.GSjumpReading != '') {
        this.GSfilevisible = false;
    }
    else {
        this.GSfilevisible = true;
    }
  }
  GensetOnCheckboxChange(evt) {
    if(evt.target.checked==true) 
      this.GSJumpVisible = false;
    else if(evt.target.checked==false)
      this.GSJumpVisible = true;     
  }
  InsertGenSetDetails() {
    var MyJson = {
      LoginId: localStorage.getItem('LoginId'),
      GenSetId: this.GenSetId,
      RunningHours: this.GSRunHrs + ":" + this.GSRunMins,
      FlowMeterReading: this.GSmeterTotaliser,
      JumpReadingFMR:0,
      JumpReadingFMRCount:0,
      JumpCeritificateFMR: ((this.GSuploadedfile == undefined) ? '' : this.GSuploadedfile.name),
      Remark: this.remark,
      StationCode: localStorage.getItem('LoginId'),
      FilePath: localStorage.getItem('LoginId') + "/genset/",
      DPREntryDate: this.DPREntryDateTime
    };
  this.GSfiles = $('#GSfileInput');
  var frmData = new FormData();
  var fileInput = this.GSfiles[0];
  frmData.append("genSetDetail", JSON.stringify(MyJson));
  if(this.GSuploadedfile != undefined) {
    frmData.append('JumpCeritificateFMR', this.GSuploadedfile, this.GSuploadedfile.name);
  }
  var ErrorMsg = this.checkGensetvalidations(MyJson, fileInput);
  if(ErrorMsg == '' || ErrorMsg == undefined) {
    if(Number(this.GSmeterTotaliser) <= Number(this.PreviousReading)) {
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
    else if(this.GSmeterTotaliser > this.GasGensetReadingAverage && Number(this.GasGensetReadingAverage) != 0){
      if(confirm("Wrong Entry for Flow Meter Reading, Do you want to continue?")) {
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
    else if(Number(this.GSmeterTotaliser) >= 2*Number(this.PreviousReading)) {
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
    var TotalHrs = parseInt(this.GSRunHrs);
    var TotalMins = parseInt(this.GSRunMins);
      if (parseFloat(genSetDetailJson.FlowMeterReading) > parseFloat(this.PreviousReading) && (genSetDetailJson.FlowMeterReading != undefined)) {
        if (this.GSRunHrs + ":" + this.GSRunMins == '00:00') {
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
    if(parseFloat(this.isResetGG)==0)
    {
      if((genSetDetailJson.JumpReadingFMR == '' || genSetDetailJson.JumpReadingFMR == undefined || parseFloat(genSetDetailJson.JumpReadingFMR) == parseFloat("0")) && parseFloat(genSetDetailJson.FlowMeterReading) == parseFloat("0")) {
      foundError = 'Invalid Flow Meter Reading';
      return foundError;
      }
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
        if(parseFloat(this.isResetGG)==0)
        {
          if (parseFloat(genSetDetailJson.FlowMeterReading) < parseFloat(this.PreviousReading)) {
          foundError = 'Flow Meter Reading should be greater than previous reading';
          return foundError;
          }
        }
          this.objDbServ.GasGensetAverage({LoginId:this.StationCode,DPREntryDate:this.dp.transform(this.SummeryDate,'dd-MMM-yyyy')}).subscribe(
            (resp: any) => {
              const data=JSON.parse(resp.json()).Table[0]
              this.GasGensetReadingAverage=data.FinalAmount;
            },
            (error) => {
              alert("Something went wrong.");
             this.objDbServ.ShowLoaders.emit(false);
            }
          )
    }
    return foundError;
  }
Gensetresetchange(value) {
    this.GSresetTypeJsonSelected = value;
}
getGSIJumpHistory(FlagType){
  this.clearGenset();
  const obj = {
    FlagEntryFor:FlagType,
    MeterOf:'GSET',
    Id:'',
    StationCode:'',
    MeterOfId:this.GenSetId,
    MeterType:'MR',
    EntryDate:this.DPREntryDate,
    FlagReadingType:""
  };
  this.objDbServ.ShowLoaders.emit(true);
  this.objDbServ.GetJumpListHistory(obj).subscribe(
    (resp: any) => {
      this.GSIJumpListHistory = JSON.parse(resp.json()).Table;
      this.objDbServ.ShowLoaders.emit(false);
    },
    (error) => {alert("Something went wrong.");
    this.objDbServ.ShowLoaders.emit(false);}
  )
  this.CheckAllResetEntry();
}
DeleteGSIJumpHistory(Id:string,FlagReading:string, itm:any){
  if(confirm("Are you sure to delete this record..?")) {
    var Json = {
      Id: Id,
      FlagEntryFor:'DELETE',
      FlagReadingType:FlagReading,
      MeterOf:'GSET',
      MeterOfId:this.GenSetId,
      EntryDate:this.DPREntryDate
     }
    this.objDbServ.GetJumpListHistory(Json).subscribe(
      (resp: any) => {
        this.getGSIJumpHistory('GET');
        const data = JSON.parse(resp.json());
        alert(data.Table[0].Meaasge);
        setTimeout(() => {
          this.getGSIJumpHistory('GET');
        });
        this.objDbServ.ShowLoaders.emit(false);
      },
      (error) => {alert("Something went wrong.");
      this.objDbServ.ShowLoaders.emit(false);}
    )
  }
  this.getGSIJumpHistory('GET');
}
UpdateGSIJumpHistory(Id:string, itm:any){
  this.JumpHistoryId = Id;
  this.GSOldMeterReading = itm.BeforeJumpReading;
  this.NewMeterReading = itm.AfterJumpReading;
  this.MeterJumpRemark = itm.Remark;
  if(itm.Action == "Jump") {this.GSFlagJumpType = "J" } 
  else if (itm.Action == "Change") {this.GSFlagJumpType = "C"}
  else {this.GSFlagJumpType = "R"}
}
GensetJReadingvalue(value) {
  this.GSJReading = value;
  if(this.GSJReading!='') {
      this.GSpopupfilevisible = false;
  }
  else {
      this.GSpopupfilevisible = true;
  }
}
clearGenset(){
  this.GSFlagJumpType = "J";
  this.GSOldMeterReading="";
  this.NewMeterReading = "";
  this.MeterJumpRemark = "";
}
Gensetchangeresetpopup() {
    var MyJsonreset = {
        StationCode: localStorage.getItem('LoginId'),
        MeterOf: 'GSET',
        MeterOfId: this.GenSetId,
        MeterType: 'MR',
        FlagRead: 0,
        FlagReadingType: this.GSresetTypeJsonSelected,
        Id: this.getGenSetFormData[0].MeterResetId,
        LoginId: localStorage.getItem('LoginId'),
        PrvReading: this.GSOldMeterReading,
        JumpReading: ((this.GSJReading == '') ? '0' : this.GSJReading),
        ReadingOnSwitch: ((this.getGenSetFormData[0].ReadingOnSwitch == '') ? '0' : this.getGenSetFormData[0].ReadingOnSwitch),
        FilePath: localStorage.getItem('LoginId') + "/Genset/",
        MeterAfterJump : this.NewMeterReading,
        MeterJumpRemark : this.MeterJumpRemark,
        JumpHistoryId : this.JumpHistoryId,
        MeterBeforeJump: this.GSOldMeterReading,
        EntryDate:this.DPREntryDate
      };
      this.JumpHistoryId = "";
      this.GSfilesreset = $('#GSfileInputreset');
      var frmData = new FormData();
      var fileInputreset = this.GSfilesreset[0];
      frmData.append("jsonDetail", JSON.stringify(MyJsonreset));
      if(this.GSuploadedfilereset != undefined) {
          frmData.append('JumpReadingFile', this.GSuploadedfilereset, this.GSuploadedfilereset.name);
      }
      var ErrorMsg = this.GaschangeresetValidations(MyJsonreset, fileInputreset);
      if(ErrorMsg == '' || ErrorMsg == undefined) {
          this.objDbServ.HoldResetReading(frmData).subscribe(
              (resp: any) => {
              const data= (resp.json());
              if(data.Status=="Inserted") {
                this.getGSIJumpHistory('GET');
                this.clearGenset();
                alert('Record Saved Successfully.!');
              }
              else if(data.Status=="Updated") {
                this.getGSIJumpHistory('GET');
                this.clearGenset();
                alert('Record Updated Successfully.!');
              }
              else {
                alert(data.Status);
              }
              },
              (error) =>{
                 alert('Something went wrong.');
                 this.objDbServ.ShowLoaders.emit(false);
             }
          )
      }else {
          alert(ErrorMsg);
      }
      this.getGSIJumpHistory('GET');
}
GaschangeresetValidations(LcvDetailJsonreset, fileInputreset) {
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
        if ((parseFloat(LcvDetailJsonreset.MeterAfterJump) == 0 || LcvDetailJsonreset.MeterAfterJump=='') && LcvDetailJsonreset.FlagReadingType=='J') {
          errorMsg = 'After Meter Reading must be Positive.';
          return errorMsg;
        }
        if (LcvDetailJsonreset.MeterAfterJump=='' && LcvDetailJsonreset.FlagReadingType=='R') {
          errorMsg = 'After Meter Reading must be fill.';
          return errorMsg;
        }
        if (regexNumeric.test(LcvDetailJsonreset.JumpReading) == false) {
            errorMsg = 'Only numeric value allowed for Jump reading.';
            return errorMsg;
        }
        if (fileInputreset.files.length > 0) {
          var validExtension = 'jpeg,jpg,png,gif';
          for (var i = 0; i < fileInputreset.files.length; i++) {
              var fileExtension = fileInputreset.files[i].name.split('.').pop().toLowerCase()[1];
              if (validExtension.indexOf(fileExtension) < 0) {
                  errorMsg = 'Attachment allowed only for [' + validExtension + '].';
                  return errorMsg;
              }
          }
        }
        return errorMsg;
}
GetGeneralEntry(){
    this.objDbServ.GetGeneralEntry({StationCode:this.StationCode, LoginId:this.LoginId, DPREntryDate:this.DPREntryDate}).subscribe(
      (resp: any) => {
          const data = JSON.parse(resp.json()).Table;
        if(data.length > 0) {
            this.generalEntryList=JSON.parse(resp.json()).Table;
            this.GEId = JSON.parse(resp.json()).Table[0].GEID;
            this.NOB = JSON.parse(resp.json()).Table[0].NOB;
            this.NOL = JSON.parse(resp.json()).Table[0].NOL;
            this.EnergyMeterReading = JSON.parse(resp.json()).Table[0].ENERGY;
        }
        this.GEisCRSentToHo = JSON.parse(resp.json()).Table1[0].isCRSentToHo;
        this.GEisStationSubmitted = JSON.parse(resp.json()).Table2[0].isStationSubmitted; 
      },
      (error) => {alert("Something went wrong.");
       this.objDbServ.ShowLoaders.emit(false);
      }
    )
}

GetHybridDetails(){
    this.objDbServ.GetHybridDetails({StationCode:this.StationCode, LoginId:this.LoginId, DPREntryDate:this.DPREntryDate}).subscribe(
      (resp: any) => {
          const data = JSON.parse(resp.json());
          console.log("Hybrid data", data);
        if(data.length > 0) {
            var timeStats = this.getTimeStats();
            this.hoursList = timeStats.hours;
            this.minutesList = timeStats.minutes;

            console.log("hoursList", this.hoursList);
            this.HybridEntryDetails=JSON.parse(resp.json());
            this.ScheduleShutdownHours = this.HybridEntryDetails[0].ScheduleShutdownHours;
            this.UnscheduledShutdownHours = this.HybridEntryDetails[0].UnscheduledShutdownHours;
            this.BreakdownHours = this.HybridEntryDetails[0].BreakdownHours;
            this.HyRemark = this.HybridEntryDetails[0].Remark;

            
            this.ScheduleShutdownHours_hr = this.HybridEntryDetails[0].ScheduleShutdownInHours || '00';
            this.ScheduleShutdownHours_min = this.HybridEntryDetails[0].ScheduleShutdownInMinutes || '00';

            
            this.UnscheduledShutdownHours_hr = this.HybridEntryDetails[0].UnscheduledShutdownInHours || '00';
            this.UnscheduledShutdownHours_min = this.HybridEntryDetails[0].UnscheduledShutdownInMinutes || '00';

           
           
            this.BreakdownHours_hr = this.HybridEntryDetails[0].BreakdownInHours || '00';
            this.BreakdownHours_min = this.HybridEntryDetails[0].BreakdownInMinutes || '00';
        }
       
        this.GEisCRSentToHo =this.HybridEntryDetails[1].isCRSentToHo;
        this.GEisStationSubmitted = this.HybridEntryDetails[2].isStationSubmitted; 
      },
      (error) => {alert("Something went wrong.");
       this.objDbServ.ShowLoaders.emit(false);
      }
    )
}
InsertHybridEntry() { 
  
  this.objDbServ.ShowLoaders.emit(true);
  this.objDbServ.InsertHybridEntry({
      "StationCode": this.StationCode,
      "Remark": this.HyRemark,
      "ScheduleShutdownInHours": this.ScheduleShutdownHours_hr,
      "ScheduleShutdownInMinutes": this.ScheduleShutdownHours_min,
      "UnscheduledShutdownInHours": this.UnscheduledShutdownHours_hr,
      "UnscheduledShutdownInMinutes": this.UnscheduledShutdownHours_min,
      "BreakdownInHours": this.BreakdownHours_hr,
      "BreakdownInMinutes": this.BreakdownHours_min,
      "DPREntryDate": this.DPREntryDate,
      "LoginId": this.LoginId
    }).subscribe(
      (resp: any) => {
          this.objDbServ.ShowLoaders.emit(false);
          if (JSON.parse(resp.json())[0]  != null)
              var retJson = JSON.parse(resp.json())[0];
          if (retJson.status == '1') {
              this.HybridEntryDetails = retJson;
              alert('Data Inserted Successfully.');
          } 
          else if (retJson.status == '2')
              alert('Couldn\'t insert the record.');
          else if (retJson.status == '3')
              alert('Data updated Successfully');
          else if (retJson.status == '4')
              alert('Data for today is already Submitted.');
          else
              alert(retJson.Msg);
          this.GetHybridDetails();
      },
      (error) => {alert("Something went wrong.");
        this.objDbServ.ShowLoaders.emit(false);
      }
    )
}
InsertGeneralEntry() { 
  var getJson = this.GetValidation(this.globalJson, this.generalEntryList);
  if (getJson.error != '') {
      alert(getJson.error)
      return false;      
  }
  if (getJson.skipSave == true) {
      return false;
  }
  this.objDbServ.ShowLoaders.emit(true);
  this.objDbServ.InsertGeneralEntry(getJson.retJson).subscribe(
      (resp: any) => {
          this.objDbServ.ShowLoaders.emit(false);
          if (JSON.parse(resp.json())[0]  != null)
              var retJson = JSON.parse(resp.json())[0];
          if (retJson.status == '1') {
              this.generalEntryList = retJson;
              alert('Data Inserted Successfully.');
          } 
          else if (retJson.status == '2')
              alert('Couldn\'t insert the record.');
          else if (retJson.status == '3')
              alert('Data updated Successfully');
          else if (retJson.status == '4')
              alert('Data for today is already Submitted.');
          else
              alert(retJson.Msg);
          this.GetGeneralEntry();
      },
      (error) => {alert("Something went wrong.");
        this.objDbServ.ShowLoaders.emit(false);
      }
    )
}
GetValidation(globalJson, generalEntryList) {
    var re = new RegExp(/^[a-zA-Z ]*$/);
    var regexNumeric = /^[+-]?[0-9]{1,1000}(?:\.[0-9]{1,1000})?$/;
    var regexDecimalThree = /^[+-]?[0-9]{1,10}(?:\.[0-9]{1,3})?$/;
    var regIntegers= /^[1-9]\d*$/;
    var ErrorMsg = '', flagSS = false;
    if (this.NOB != "" && isNullOrUndefined(this.NOB) == false) {
        if (regexNumeric.test(this.NOB) == false) {
            ErrorMsg = 'Only numeric value allowed for Buses.';
        }
        else {
            var re = new RegExp(/^[0-9]*$/gm);
            if (!re.test(this.NOB)) {
                ErrorMsg = 'Decimal is not allowed.';
            }
        }
    }
    else {
        ErrorMsg = 'Please enter no. of Buses.!';
    }
    if (this.NOL != "" && isNullOrUndefined(this.NOL) == false) {
        if (regexNumeric.test(this.NOL) == false) {
            ErrorMsg = 'Only numeric value allowed for LCV.';
        }
        else {
            var re = new RegExp(/^[0-9]*$/gm);
            if (!re.test(this.NOL)) {
                ErrorMsg = 'Decimal is not allowed.';
            }
        }
    }
    else {
        ErrorMsg = 'Please enter no. of LCV !';   
    }
    if (this.EnergyMeterReading == ""|| isNullOrUndefined(this.EnergyMeterReading) == true) {
      ErrorMsg = 'Please enter Energy Meter Reading !';   
    }
    var retJson = {
        GEID: this.GEId,
        LoginId: this.LoginId,
        StationCode: this.StationCode,
        NOB: this.NOB,
        NOL: this.NOL,
        Energy:this.EnergyMeterReading,
        DPREntryDate: this.DPREntryDateTime
    };
    return {
        error: ErrorMsg,
        retJson: retJson,
        skipSave: false
    };
}
getStationReportData(){
    try
    {
      this.objDbServ.ShowLoaders.emit(true);
      this.objDbServ.getStationReportApi({StationCode:this.SummaryStationCode, LoginId:this.SummaryLoginId, DPREntryDate:this.SummeryDate}).subscribe(
        (response: any)=>{
          const data = JSON.parse(response._body);
          if(data){
            this.stationReportData = JSON.parse(data);
            this.MeterSkitdiffAVG = this.stationReportData.Table[0].MeterskitdiffAVG;
             this.DataTable1=this.stationReportData.Table1;
             this.DataTable2=this.stationReportData.Table2;
             this.DataTable3=this.stationReportData.Table3;
             this.StationGasLoss = this.stationReportData.Table4[0].Loss;
             this.StationGasLoss = parseFloat(this.StationGasLoss.toFixed(2));
             this.objDbServ.ShowLoaders.emit(false);
          }
          else {
            alert('No data available. Please try again.')
          }             
        },
        (error)=>{
        }  
      );
    }
    catch(err){
    }
}
stationSummarySubmit() {
    if (!confirm('You won\'t be able to make changes after submit, are you sure?')){return false;}
    try
    {
     const obj = {       
        LoginId:this.glovalJson[0].LoginId,
        StationName:this.glovalJson[0].StationCode,
        StationCode:this.StationCode,
        DPREntryDate:this.SummeryDate
      };
      this.objDbServ.getFinalSubmitStation(obj).subscribe(
        (response: any)=>{
          const data = JSON.parse(JSON.parse(response._body));
          if (data.Status.indexOf('#999#') > -1) {
            var missingFor = data.Status.split('#999#')[1];
            alert('Please fill the entry for ' + missingFor + '.');
            return false;
          }
          if (data.Status == '3') {
              alert('Data is already submitted.');
              return false;
          }
          if (data.Status == '4') {
              alert('You are not authorized to submit data.');
              return false;
          }
          else
              alert('Data is submitted.');                        
        },
        (error)=>{
        }  
      );
    }
    catch(err){
    }    
}
ExportToPdf() {
const obj = {
    StationCode:this.SummaryStationCode, 
    LoginId:this.SummaryLoginId, 
    DPREntryDate:this.dp.transform(this.SummeryDate,"dd-MMM-yyyy"),
    StationName: this.glovalJson[0].StationName
};
this.objDbServ.DPRSummaryPDF(obj).subscribe(
    (resp: any) => {
    const data = JSON.parse(resp.json());
    if(data != 'No Data Available') {
        var PdfUrl:string="";
        PdfUrl = this.objDbServ.apiUrl.substring(0,this.objDbServ.apiUrl.length-4)+JSON.parse(resp.json());
        const FileSaver = require('file-saver');
        FileSaver.saveAs(PdfUrl);
    }
    else {
        alert(data);
    }
    this.objDbServ.ShowLoaders.emit(false);
    },
    (error) => {alert("Something went wrong.");this.objDbServ.ShowLoaders.emit(false);}
)
}
JumpshowCertificates(flag:string) {
   this.closePopup();
    if(flag=='MSkid')
      this.CertificatePath = this.JumpCertificateFMT;
    else if(flag=='LCV')
      this.CertificatePath = this.JumpCertificateLCV;
    else if(flag=='GenSet')
      this.CertificatePath = this.JumpCertificateGenset;
    else if (flag=='SFM')
      this.CertificatePath = this.imgPathSFM;
    else if (flag=='DFM')
      this.CertificatePath = this.imgPathDFM;
    else if (flag=='EFM')
      this.CertificatePath = this.imgPathEFM;
    if(this.CertificatePath==""){
      this.isDataFound = true;
      this.imgDisplay = false;
    }
    else {
      this.isDataFound = false;
      this.imgDisplay = true;
      this.pathDB =  this.CertificatePath;
      var ImagePath = this.pathDB.replace(",", ""); 
      this.imgURL = this.objDbServ.apiImageAttachment + '/Attachments'+ImagePath;
      this.imgURL = this.sanitizer.bypassSecurityTrustUrl(this.imgURL);
    }
}
closePopup(){
    this.imgURL = null;
    this.imgDisplay = true;
}
CheckAllResetEntry()
{
  this.CheckIsResetEntryExists("MS",'');
  this.CheckIsResetEntryExists("LCV",'');
  this.CheckIsResetEntryExists("GSET",'');
  this.CheckIsResetEntryExists("PKG",'DFM');
  this.CheckIsResetEntryExists("PKG",'SFM');
  this.CheckIsResetEntryExists("PKG",'EFM');
}
CheckIsResetEntryExists(MeterOf:string,MeterType:string){
    const obj = {
      EntryDate: this.DPREntryDate,
      StationCode : this.StationCode,
      MeterOf : MeterOf,
      MeterType:MeterType
     };
     this.objDbServ.CheckIsResetEntryExists(obj).subscribe(
       (resp: any) =>{
         const data = JSON.parse(resp.json());
         if(data.Table[0]['MeterOf'].indexOf('MS') > -1)
         {
          this.isResetMS = "1";
         }
         else if(data.Table[0]['MeterOf'].indexOf('GSET') > -1)
         {
          this.isResetGG = "1";
         }
         else if(data.Table[0]['MeterOf'].indexOf('LCV') > -1)
         {
          this.isResetLCV = "1";
         }
         else if(data.Table[0]['MeterOf'].indexOf('PKG') > -1)
         {
          if(data.Table[0]['MeterType'].indexOf('DFM') > -1)
          {
            this.isResetDFM = "1";
          }
          else if(data.Table[0]['MeterType'].indexOf('SFM') > -1)
          {
            this.isResetSFM = "1";
          }
          else if(data.Table[0]['MeterType'].indexOf('EFM') > -1)
          {
            this.isResetEFM = "1";
          }
         }
         else
         {
          this.isResetMS="0";
          this.isResetSFM="0";
          this.isResetEFM="0";
          this.isResetDFM="0";
          this.isResetLCV="0";
          this.isResetGG="0";
         }
         this.objDbServ.ShowLoaders.emit(false);
     },
       (error) =>{
         alert('Something went wrong.');
         this.objDbServ.ShowLoaders.emit(false);
       }
     )
}
}
