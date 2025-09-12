import { Component, OnInit } from '@angular/core';
import { dbService } from '../../Service/db.service';
import { CookieService } from 'ngx-cookie-service';
import { DatepickerOptions } from 'ng2-datepicker';
import * as enLocale from 'date-fns/locale/en';
import { FilterSearchPipe } from '../../Filters/filter-search.pipe';
import { DomSanitizer} from '@angular/platform-browser';
declare var $:any;
@Component({
  selector: 'app-dpr-attachment',
  templateUrl: './dpr-attachment.component.html',
  styleUrls: ['./dpr-attachment.component.css']
})
export class DPRAttachmentComponent implements OnInit {
  globalDetail:any = JSON.parse(sessionStorage.getItem('globalDetail'));
  stationList:any  = JSON.parse(sessionStorage.getItem('AllStation'));
  arrPath: any [];
  key: string = 'Name';
  reverse: boolean = true;
  mdlShowCertificates: boolean = true;
  AttachmentData:any [];
  AttPageVars:any [];
  SelectedStationCode:string="";
  SummeryDate:string="";
  dateFrom:string="";
  popupFlag: boolean=false;
  CertificatePath:string='';
  imgURL:any = '';
  isDataFound:boolean=false;
  imgDisplay:boolean=true;
  pathDB:string='';
  filter:string;
  StationCode:string= localStorage.getItem('LoginId');
  DepartmentCode:string= this.objCook.get('DepartmentCode');
  LoginStationId:string= this.objCook.get('stationId');
  JumpReadingId:string='';
  fileToUpload:File = null;
  errorFlag:boolean =false;
  DPRJumpCeritificate:string='';
  FlagType :string='';
  searchText:string='';
  sortingColumn:string="";
  Dashdate='';
  DateFrom:string;
  DateTo:string;
  Id='';
  StationId:string='';
  ImagePath:string='';
  monthNames = [
    "Jan", "Feb", "Mar",
    "Apr", "May", "Jun", "Jul",
    "Aug", "Sep", "Oct",
    "Nov", "Dec"
  ];
  constructor(private objDbServ: dbService, private objCook: CookieService, private sanitizer: DomSanitizer) {
    this.objDbServ.MasterCompDisplay.emit(true);
 }
 options:DatepickerOptions = {
  minYear: 2018,
  locale: enLocale,
  displayFormat: 'DD-MMM-YYYY',
  maxDate:new Date(Date.now())
 };
ngOnInit() {
  this.DateFrom = this.objCook.get('CurrentDate'); 
  this.DateTo = this.objCook.get('CurrentDate'); 
  const dt = new Date();
    this.GetAttachmentForHO();
}
GetAttachmentForHO () {
  this.objDbServ.ShowLoaders.emit(false);
  var json = {
      StationCode: this.StationCode, 
      FromDate: this.DateFrom,
      ToDate: this.DateTo,
      flag: (this.DepartmentCode =='SO') ? 'JumpDispenserDataByStation' : 'JumpDispenserDataByCO' 
  }
  this.objDbServ.GetAttachmentForHO(json).subscribe(
    (resp: any) => {
       const data = JSON.parse(resp.json());
      if(data.Table.length > 0)
        this.AttachmentData = data.Table;
      else{
        this.AttachmentData=[];
      }
    },
    (error) => {alert("Something went wrong.");
     this.objDbServ.ShowLoaders.emit(false);
    }
  )
}
OnDateChnageFrom(val) {
  const dt = new Date(val);
  this.DateFrom= dt.getDate() + "/" + this.monthNames[dt.getMonth()] + "/" + dt.getFullYear();
  setTimeout(() => {
        this.GetAttachmentForHO();
    });
}
OnDateChnageTo(val) {
  const dt = new Date(val);
  this.DateTo= dt.getDate() + "/" + this.monthNames[dt.getMonth()] + "/" + dt.getFullYear();
  setTimeout(() => {
        this.GetAttachmentForHO();
    });
}
OnStationChange(val) {
  this.SelectedStationCode=val;
  setTimeout(() => {
    this.GetAttachmentForHO();
  });
}
showCertificates(objRow:any) {
  this.popupFlag = true;
  this.CertificatePath = objRow.CertificatePath;
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
openPopup(objRow:any){
  this.popupFlag = true;
  this.JumpReadingId = objRow.JumpID;
  this.FlagType = objRow.Flag;
  this.DPRJumpCeritificate = objRow.CertificatePath;
  if(this.DPRJumpCeritificate==""){
    this.isDataFound = true;
    this.imgDisplay = false;
  }
   else {
    this.isDataFound = false;
    this.imgDisplay = true;
    this.pathDB =  this.DPRJumpCeritificate;
    var ImagePath = this.pathDB.replace(",", "");
    this.imgURL = this.objDbServ.apiImageAttachment + '/Attachments'+ImagePath;
    this.imgURL = this.sanitizer.bypassSecurityTrustUrl(this.imgURL);
   }
}
closePopup(){
  this.popupFlag = false;
  this.imgURL = null;
  this.imgDisplay = true;
}
onChangeImage(file: FileList, event: any){
  if (event.target.files && event.target.files[0]) {
    this.fileToUpload = file.item(0);
    var reader = new FileReader();
    reader.onload = (event: any) => {
        this.imgURL = event.target.result;
    }
    reader.readAsDataURL(event.target.files[0]);
  }
}
UpdateAttachment(){
  this.errorFlag = false;
  if(this.validation()){
    return false;
  }
  var MyJson = {
    Id: this.JumpReadingId,
    LoginId: this.StationCode,
    flag: this.FlagType
  };
  const frmData = new FormData();
  frmData.append('Image', this.fileToUpload, this.fileToUpload.name);
  frmData.append('Id', this.JumpReadingId);
  frmData.append("jsonDetail", JSON.stringify(MyJson));
  this.objDbServ.ShowLoaders.emit(true);
  this.objDbServ.udpateAttachment(frmData).subscribe(
    (resp: any) => {
      const data = JSON.parse(resp._body);  
      alert(data);
      $('.modal').modal('hide');
      $('#fileInput').val('');
      this.GetAttachmentForHO();
      this.objDbServ.ShowLoaders.emit(false);
    },
    (error) => {
      alert("Something went wrong.");
      this.objDbServ.ShowLoaders.emit(false);
    }
  )
}
validation(){
  if($('#fileInput').val()!='')
  {
    const fileName = (',' + this.fileToUpload.name.split('.')[1] + ',').toLowerCase();
    if(this.fileToUpload == null){
      alert('Please select the attachment');
      this.errorFlag = true;
    }
    else if(',png,jpeg,jpg,'.indexOf(fileName) == -1){
      alert('Please select the valid file (png, jpeg, jpg)');
      this.errorFlag = true;
    }
    else if(this.fileToUpload.size > 2097152){
      alert('Please select the file under size limit (2 MB)');
      this.errorFlag = true;
    }
}
else {
    alert('Please select the attachment');
    this.errorFlag = true;
  }
  return this.errorFlag;
}
sortCol(key:string){
  if(key == 'EntryDate') {
    this.sortingColumn = key;
    this.key = '';
    this.AttachmentData.sort(function(a,b){
    return new Date(a.EntryDate).getTime() - new Date(b.EntryDate).getTime() 
    });
    this.reverse = !this.reverse;
  }
  else {
    this.sortingColumn = key;
    this.key = key;
    this.reverse = !this.reverse;
  }
}
GenerateJumpCertificate(itm) {
  this.Id=itm.JumpSystemId,
  this.StationId= itm.StationId
 this.objDbServ.JumpReadingCertificate({Flag: 'JumpReadingCerficatateById',  CDashdate:itm.EntryDate, Id:this.Id, Status:this.StationId}).subscribe(
   (resp: any) => {  
     const data = JSON.parse(resp.json());
     if(data) {
       var PdfUrl:string="";
       PdfUrl = this.objDbServ.apiUrl.substring(0,this.objDbServ.apiUrl.length-4)+JSON.parse(resp.json());
       const FileSaver = require('file-saver');
       FileSaver.saveAs(PdfUrl);
     }
   },
   (error) => {alert("Something went wrong.");
    this.objDbServ.ShowLoaders.emit(false);
   }
 )
}
ViewPdf(Path:string, itm:any) {
  if(Path.split('.').pop() == "pdf"){
    this.ImagePath = this.objDbServ.apiImageAttachment+"/Attachments/pdfIcon.png";
  }
  else {
    this.ImagePath = this.objDbServ.apiImageAttachment+"/Attachments/"+Path;
  }
}
}
