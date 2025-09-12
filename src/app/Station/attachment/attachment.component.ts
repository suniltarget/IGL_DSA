import { Component, OnInit } from '@angular/core';
import { dbService } from '../../Service/db.service';
import { CookieService } from 'ngx-cookie-service';
import { DatepickerOptions } from 'ng2-datepicker';
import * as enLocale from 'date-fns/locale/en';
import { Http, Response} from '@angular/http';
import { NgForm, FormGroup } from '@angular/forms';
import { FilterSearchPipe } from '../../Filters/filter-search.pipe';
import { DomSanitizer} from '@angular/platform-browser';
declare var $:any;
@Component({
  selector: 'app-attachment',
  templateUrl: './attachment.component.html',
  styleUrls: ['./attachment.component.css']
})
export class AttachmentComponent implements OnInit {
  listDispAttachments:any=[];
  fileCollection:{
    DispanserJumpId: string,
    file: string
  }[];
  Dashdate='';
  UserIdCook:string = '';
  fileToUpload:File = null;
  isDataFound:boolean = false;
  popupFlag:boolean = false;
  key: string = 'Name';
  reverse: boolean = true;
  imgURL:any = '';
  JumpReadingId:string='';
  searchText:string='';
  errorFlag:boolean =false;
  attachedImageUrl:string = '';
  imgDisplay:boolean=true;
  sortingColumn:string="";
  path:any= window.location; 
  DispanserJumpCeritificate:string='';
  pathDB:any;
  stationName:string="";
  filter:string;
  IsImageUpload:boolean=false;
  selectedStation:string='';
  DateFrom:string;
  DateTo:string;
  StationId:string;
  DepartmentCode:string= this.objCook.get('DepartmentCode');
  LoginStationId:string= this.objCook.get('stationId');
  Id:string='';
  monthNames = [
    "Jan", "Feb", "Mar",
    "Apr", "May", "Jun", "Jul",
    "Aug", "Sep", "Oct",
    "Nov", "Dec"
  ];
  constructor(private objDbServ: dbService, private objCook: CookieService,private sanitizer: DomSanitizer) { 
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
    this.stationName = JSON.parse(sessionStorage.getItem("globalDetail"))[0].UserName;
    this.UserIdCook = this.objCook.get('UID');
    this.StationId = this.objCook.get('stationId');
    setTimeout(() => {
      this.getData();
    });
    this.resizeHight()
  }
  resizeHight() {
        function setHeight() {
          var windowHeight = $(window).innerHeight();
          $('#attachMent').css('height', windowHeight -270);
        };
        setHeight();
        $(window).resize(function () {
            setHeight();
        });
  }
  OnDateChnageFrom(val){
    const dt = new Date(val);
    this.DateFrom= dt.getDate() + "/" + this.monthNames[dt.getMonth()] + "/" + dt.getFullYear();
    this.getData();
 }
 OnDateChnageTo(val){
  const dt = new Date(val);
  this.DateTo= dt.getDate() + "/" + this.monthNames[dt.getMonth()] + "/" + dt.getFullYear();
  this.getData();
 }
  getData() {
    var Json = {
      Flag: (this.DepartmentCode =='SO') ? 'JumpDispenserDataByStation' : 'JumpDispenserDataByMO',
      Id: (this.DepartmentCode =='SO') ? this.StationId : this.UserIdCook, 
      ActivityLog_date:this.DateFrom,
      CDashdate:this.DateTo
    }
    this.objDbServ.ShowLoaders.emit(true);
    this.objDbServ.CommonGetData(Json).subscribe(
      (resp: any) => {
        if(JSON.parse(resp.json()).Table.length > 0) {
          this.listDispAttachments = JSON.parse(resp.json()).Table;
        }
        this.objDbServ.ShowLoaders.emit(false);
      },
      (error) => {
        alert("Something went wrong.");
        this.objDbServ.ShowLoaders.emit(false);
    }
    )
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
  openPopup(objRow:any){
    this.popupFlag = true;
    this.JumpReadingId = objRow.DispanserJumpId;
    this.DispanserJumpCeritificate = objRow.DispanserJumpCeritificate;
    if(this.DispanserJumpCeritificate==""){
      this.isDataFound = true;
      this.imgDisplay = false;
    }
     else {
      this.isDataFound = false;
      this.imgDisplay = true;
      this.pathDB =  this.DispanserJumpCeritificate;
      var ImagePath = this.pathDB.replace(",", "");
      this.imgURL = this.objDbServ.apiImageAttachment +ImagePath;
      this.imgURL = this.sanitizer.bypassSecurityTrustUrl(this.imgURL);
     }
  }
  closePopup(){
    this.popupFlag = false;
    this.fileToUpload = null;
    this.imgURL = null;
    this.imgDisplay = true;
    $('#fileInput').val('');
  }
  saveAttachment(){
    this.errorFlag = false;
    if(this.validation()){
      return false;
    }
    const frmData = new FormData();
    frmData.append('Image', this.fileToUpload, this.fileToUpload.name);
    frmData.append('JumpReadingId', this.JumpReadingId);
    this.objDbServ.ShowLoaders.emit(true);
    this.objDbServ.uploadAttachment(frmData).subscribe(
      (resp: Response) => {
        alert(JSON.parse(resp.json()).message);
        $('.modal').modal('hide');
        this.getData();
        this.closePopup();
        this.objDbServ.ShowLoaders.emit(false);
      },
      (error) => {
        alert("Something went wrong.");
        this.objDbServ.ShowLoaders.emit(false);
      }
    )
  }
  sortCol(key:string){
    if(key == 'EntryDate') {
      this.sortingColumn = key;
      this.key = '';
      this.listDispAttachments.sort(function(a,b){
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
  sortDateWise(key) {
    this.sortingColumn = key;
    this.listDispAttachments.sort(function(a,b){
      return new Date(b.EntryDate).getTime() - new Date(a.EntryDate).getTime() 
      });
      this.reverse = !this.reverse;
  }
  GenerateJumpCertificate(itm) {
     this.Id=itm.JumpSystemId,
     this.StationId= itm.StationId
    this.objDbServ.JumpReadingCertificate({Flag: 'JumpReadingCerficatateById',  CDashdate:itm.EntryDate, Id:this.Id, Status:this.StationId}).subscribe(
      (resp: Response) => {  
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
}
