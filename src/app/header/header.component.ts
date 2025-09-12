import { Component, OnInit } from '@angular/core';
import { dbService } from '../Service/db.service';
import { Response} from '@angular/http';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { DatePipe } from '@angular/common';
import { Button } from 'protractor';
import { FilterSearchPipe } from '../Filters/filter-search.pipe';
import { DatepickerOptions } from 'ng2-datepicker';
import * as enLocale from 'date-fns/locale/en';
declare var $:any;
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  showHeaderTitle: string = '';
  LoginDetails: any = [];
  SMList: any = [];
  UserIdCook: string;
  SelectedNotificationId: string='';
  UserPanel:boolean=false;
  NotificationDetails:{}[];
  NotificationDetailsMOJump:{}[];
  NotificationDetailsMOPending:{}[];
  NotificationDetailsCOJump:{}[];
  NotificationDetailsCOPending:{}[];
  NotificationDetailsSOP:{}[];
  StationOTP:string='';
  StationPassword:string='';
  StationCPassword:string='';
  errorFound: boolean;
  StationName='';
  mailSendOTP:string="";
  searchText:string='';
  key: string = 'Name';
  reverse: boolean = true;
  sortingColumn:string="";
  filter:string='';
  ProfilePopup:boolean=false;
  Cdate:string= this.objCook.get('CurrentDate');
  issuePopup:boolean = false;
  Issuesuploadedfile:File;
  Issuelogfiles:File;
  listIssueLog:any=[];
  imgURL:string ='';
  issueAttachement:string='';
  issuepath:string = "../../assets/Images/question.png";
  Reportflag:string='PendingEntry';
  TabFlag:string='';
  imgDisplay:boolean=true;
  IsDatafound:boolean=true;
  IssueDate:string;
  id:string;
  flag:string='';
  options:DatepickerOptions = {
    minYear: 2018,
    locale: enLocale,
    displayFormat: 'DD-MMM-YYYY'
  };
  constructor(private objDbServ: dbService, private objRoute: Router, private objCook: CookieService,private dp: DatePipe) { 
  }
  pathChange()
  {
    this.issuepath = "../../assets/Images/question_yellow.png";
  }
  pathChange1()
  {
    this.issuepath = "../../assets/Images/question.png";
  }
  ngOnInit() {
    var now = new Date();
    this.Cdate = this.dp.transform(this.Cdate, 'dd-MMM-yyyy')
    this.UserIdCook = this.objCook.get('UID');
    this.IssueDate=new Date().toLocaleDateString();
    this.getHeader();
    this.ShowPopup();
    this.hovertexttooltip()
    $(document).ready(function(){
    $("#pass_close").click(function(){
      $("#mypopup_passupdate").fadeOut();
    });
    });
  }
  ViewProfile() {
    this.objDbServ.CommonGetData({Flag: 'SMProfile', Id:this.UserIdCook}).subscribe(
      (resp: Response) => {
        const data = JSON.parse(resp.json()).Table;
        if(data.length > 0) {
          this.ProfilePopup=true;
          this.SMList = JSON.parse(resp.json()).Table;
        }       
        else
          alert("No Data found.!");         
      },
      (error) => {alert("Something went wrong.")}
    )
  }
show_mypopup(val){
  this.SelectedNotificationId=val;
  this.StationOTP='';
  this.StationPassword='';
  this.StationCPassword='';
	$("#mypopup_passupdate").fadeIn();
}
faq(){
  this.objDbServ.CommonGetData({Flag: 'SMProfile', Id:this.UserIdCook}).subscribe(
    (resp: Response) => {
      const data = JSON.parse(resp.json()).Table;
      if(data.length > 0) {
        this.ProfilePopup=true;
        this.SMList = JSON.parse(resp.json()).Table;
      }       
      else
        alert("No Data found.!");         
    },
    (error) => {alert("Something went wrong.")}
  )
}
logoff(){
  if (confirm("Do You Want To Logout?") == true) {
    this.objCook.set('UID', '0');
    this.objRoute.navigate(['']);
  }
}
hovertexttooltip(){
    $(document).on('mouseenter', ".overTextTip", function () {
     var $this = $(this);
     if (this.offsetWidth < this.scrollWidth && !$this.attr('title')) {
         $this.tooltip({
             title: $this.text(),
             container: 'body',
             placement: "top"
         });
         $this.tooltip('show');
     }
 });
 $(document).on('mouseout', ".overTextTip", function () {
     var $this = $(this);
     if (this.offsetWidth < this.scrollWidth && !$this.attr('title')) {
         $this.tooltip({
             title: $this.text(),
             container: 'body',
             placement: "top"
         });
         $this.tooltip('hide');
     }
 });
 function toolTip() {
  $(".overTextTip").mouseover(function () {
      var $this = $(this);
      if (this.offsetWidth < this.scrollWidth && !$this.attr('title')) {
          $this.tooltip({
              title: $this.text(),
              container: 'body',
              placement: "top"
          });
          $this.tooltip('show');
      }
  });
}
}
  UpdatePassword(){
    this.errorFound = true;
    if(this.ValidateData()){
      this.objDbServ.UpdatePassword({NotificationId:this.SelectedNotificationId,OTP:this.StationOTP,Password:this.StationCPassword}).subscribe(
        (response: Response)=>{
          const data = JSON.parse(response.json());
          if(data.Table[0].Meaasge.indexOf('successfully') > -1)
          {
            this.SelectedNotificationId='';
            this.StationOTP='';
            this.StationPassword='';
            this.StationCPassword='';
            $(".close").trigger( "click" );
            $("#mypopup_passupdate").fadeOut();
            this.getHeader();
          }
          alert(data.Table[0].Meaasge);
        },
        (error)=>{alert('something went wrong.');}
    );
    }     
  }
  ValidateData(){
    if(this.StationOTP == ''){
      alert('OTP must be entered.');
      this.errorFound = false;
    }
    else if (this.StationPassword == '' ){
      alert('password must be entered.');
      this.errorFound = false;
    }
    else if (this.StationCPassword == ''){
      alert('Confirm password must be entered.');
      this.errorFound = false;
    }
    else if (this.StationPassword != this.StationCPassword){
      alert('Password did not matched.');
      this.errorFound = false;
    }
    return this.errorFound;
  }
  NotiFicationData(){
    this.objDbServ.CommonGetData({Flag: 'NotificationData', Id: 0}).subscribe(
      (resp: Response) => {
        this.NotificationDetails = JSON.parse(resp.json()).Table;
      },
      (error) => {alert("Something went wrong.")}
    )
  }
  getValueCO(flagCO:string){
    this.Reportflag=flagCO;
    this.getNotificationdataCO();
  }
  getValueMO(flagMO:string){
    this.Reportflag=flagMO;
    this.getNotificationdataMO();
  }  
  getNotificationdataMO(){
    this.objDbServ.CommonGetData({Flag: 'NotificationDetailsMO', ReportFlag:this.Reportflag, Id:this.UserIdCook,CDashdate:this.Cdate}).subscribe(
      (resp: Response) => {
        this.NotificationDetailsMOJump=[];
        this.NotificationDetailsMOPending=[];
        if(this.Reportflag=='JumpEntry')
           this.NotificationDetailsMOJump=JSON.parse(resp.json()).Table;
        else
           this.NotificationDetailsMOPending=JSON.parse(resp.json()).Table;
      },
      (error) => {alert("Something went wrong.")}
    )
  }
  getNotificationdataCO(){
      this.objDbServ.CommonGetData({Flag: 'NotificationDetailsCO', ReportFlag:this.Reportflag, Id:this.UserIdCook,CDashdate:this.Cdate}).subscribe(
      (resp: Response) => {
        this.NotificationDetailsCOJump=[];
        this.NotificationDetailsCOPending=[];
        if(this.Reportflag=='JumpEntry')
           this.NotificationDetailsCOJump = JSON.parse(resp.json()).Table;
        else
           this.NotificationDetailsCOPending = JSON.parse(resp.json()).Table;
      },
      (error) => {alert("Something went wrong.")}
    )
  }
  getNotificationdataSOP(){
    this.objDbServ.CommonGetData({Flag: 'NotificationSOP', Id:this.UserIdCook,CDashdate:this.Cdate}).subscribe(
      (resp: Response) => {
        this.NotificationDetailsSOP = JSON.parse(resp.json()).Table;
      },
      (error) => {alert("Something went wrong.")}
    )
  }
  ShowPopup(){
    $('.fa-user').click(function() {
      if(this.UserPanel){
        $('#Userform').hide();
        this.UserPanel=false;
      }
      else{
         $('#Userform').show();
         this.UserPanel=true;
      }     
    })
  }
  getHeader(){
    this.objDbServ.getHeaders({UserID: this.UserIdCook}).subscribe(
        (response: Response)=>{
          const data = JSON.parse(response.json()).Table;
          if(data.length > 0){
            this.showHeaderTitle = data[0].DepartmentCode;
            this.LoginDetails = data[0];
            localStorage.setItem('DSA Date',this.LoginDetails)
            if(this.showHeaderTitle=='HO')
               this.NotiFicationData();
            }
            if(this.showHeaderTitle=='SOP') {
               this.getNotificationdataSOP();
            }
            if(this.showHeaderTitle=='CO') {
               this.getNotificationdataCO
            }
        },
        (error)=>{alert('something went wrong.');}
    );
  }
  RequestPassword(){
    if(confirm('Are You Sure, Want to Reset Your Password ?')) {
    this.objDbServ.RequestForChagePassword({NotificationId:0,UserID: this.UserIdCook,Flag:'Request'}).subscribe(
        (response: Response)=>{
          const data = JSON.parse(response.json());
          if(data[0].Meaasge == 'Reset password request send successfully.') {
            this.mailSendOTP = data[0].OTP;
            this.objRoute.navigate(['']);
          }
          alert(data[0].Meaasge);
        },
        (error)=>{alert('something went wrong.');}
    );
  }
  }
  helpsection() {
    this.objDbServ.helpsection({}).subscribe(
      (response: Response)=>{
        const data = JSON.parse(response.json());
        if(data!="File Not Found") {
          var filename = data.split('/');
          if(filename!='') {
          var apiUrl = this.objDbServ.apiImageAttachment; 
          if(data != '' || data != null) {   
            setTimeout(() => { window.open(apiUrl+'/'+data, '_blank'); }, 20);                 
          }
          else {
            }
          }
        }
        else {
          alert(data);
        }
     },
      (error)=>{alert('something went wrong.');}
  );
  }
  FAQDocument(evt,Flag:string) 
  {
    if(Flag =="dispensershiftwise"){
      this.objDbServ.FAQDocument({Flag:'dispensershiftwise'}).subscribe(
        (response: Response)=>{
          const data = JSON.parse(response.json());
          if(data!="File Not Found") {
            var filename = data.split('/');
            if(filename!='') {
            var apiUrl = this.objDbServ.apiImageAttachment; 
            if(data != '' || data != null) {   
              setTimeout(() => { window.open(apiUrl+'/'+data, '_blank'); }, 20);                 
            }
            else {
              }
            }
          }
          else {
            alert(data);
          }
       },
        (error)=>{alert('something went wrong.');}
    );
    }
     else if(Flag =="dispensernoshiftwise"){
      this.objDbServ.FAQDocument({Flag:'dispensernoshiftwise'}).subscribe(
        (response: Response)=>{
          const data = JSON.parse(response.json());
          if(data!="File Not Found") {
            var filename = data.split('/');
            if(filename!='') {
            var apiUrl = this.objDbServ.apiImageAttachment; 
            if(data != '' || data != null) {   
              setTimeout(() => { window.open(apiUrl+'/'+data, '_blank'); }, 20);                 
            }
            else {
              }
            }
          }
          else {
            alert(data);
          }
       },
        (error)=>{alert('something went wrong.');}
    );
    }
    else if(Flag =="MeterSkid"){
      this.objDbServ.FAQDocument({Flag:'MeterSkid'}).subscribe(
        (response: Response)=>{
          const data = JSON.parse(response.json());
          if(data!="File Not Found") {
            var filename = data.split('/');
            if(filename!='') {
            var apiUrl = this.objDbServ.apiImageAttachment; 
            if(data != '' || data != null) {   
              setTimeout(() => { window.open(apiUrl+'/'+data, '_blank'); }, 20);                 
            }
            else {
              }
            }
          }
          else {
            alert(data);
          }
       },
        (error)=>{alert('something went wrong.');}
    );
    }
    else if(Flag =="Compressor"){
      this.objDbServ.FAQDocument({Flag:'Compressor'}).subscribe(
        (response: Response)=>{
          const data = JSON.parse(response.json());
          if(data!="File Not Found") {
            var filename = data.split('/');
            if(filename!='') {
            var apiUrl = this.objDbServ.apiImageAttachment; 
            if(data != '' || data != null) {   
              setTimeout(() => { window.open(apiUrl+'/'+data, '_blank'); }, 20);                 
            }
            else {
              }
            }
          }
          else {
            alert(data);
          }
       },
        (error)=>{alert('something went wrong.');}
    );
    }
    else if(Flag =="LCV"){
      this.objDbServ.FAQDocument({Flag :'LCV'}).subscribe(
        (response: Response)=>{
          const data = JSON.parse(response.json());
          if(data!="File Not Found") {
            var filename = data.split('/');
            if(filename!='') {
            var apiUrl = this.objDbServ.apiImageAttachment; 
            if(data != '' || data != null) {   
              setTimeout(() => { window.open(apiUrl+'/'+data, '_blank'); }, 20);                 
            }
            else {
              }
            }
          }
          else {
            alert(data);
          }
       },
        (error)=>{alert('something went wrong.');}
    );
    }
    else if(Flag =="Gasgenset"){
      this.objDbServ.FAQDocument({Flag :'Gasgenset'}).subscribe(
        (response: Response)=>{
          const data = JSON.parse(response.json());
          if(data!="File Not Found") {
            var filename = data.split('/');
            if(filename!='') {
            var apiUrl = this.objDbServ.apiImageAttachment; 
            if(data != '' || data != null) {   
              setTimeout(() => { window.open(apiUrl+'/'+data, '_blank'); }, 20);                 
            }
            else {
              }
            }
          }
          else {
            alert(data);
          }
       },
        (error)=>{alert('something went wrong.');}
    );
    }
  }
  FAQView(evt,Flag:string) {
    if(Flag =="disshiftvideo"){
      this.objDbServ.FAQView({Flag:'disshiftvideo'}).subscribe(
        (response: Response)=>{
          const data = JSON.parse(response.json());
          if(data!="File Not Found") {
            var filename = data.split('/');
            if(filename!='') {
            var apiUrl = this.objDbServ.apiImageAttachment; 
            if(data != '' || data != null) {   
              setTimeout(() => { window.open(apiUrl+'/'+data, '_blank'); }, 20);                 
            }
            else {
              }
            }
          }
          else {
            alert(data);
          }
       },
        (error)=>{alert('something went wrong.');}
    );
    }
    else if(Flag =="disnoshiftvideo"){
      this.objDbServ.FAQView({Flag:'disnoshiftvideo'}).subscribe(
        (response: Response)=>{
          const data = JSON.parse(response.json());
          if(data!="File Not Found") {
            var filename = data.split('/');
            if(filename!='') {
            var apiUrl = this.objDbServ.apiImageAttachment; 
            if(data != '' || data != null) {   
              setTimeout(() => { window.open(apiUrl+'/'+data, '_blank'); }, 20);                 
            }
            else {
              }
            }
          }
          else {
            alert(data);
          }
       },
        (error)=>{alert('something went wrong.');}
    );
    }
    else if(Flag =="meterskidvideo"){
      this.objDbServ.FAQView({Flag:'meterskidvideo'}).subscribe(
        (response: Response)=>{
          const data = JSON.parse(response.json());
          if(data!="File Not Found") {
            var filename = data.split('/');
            if(filename!='') {
            var apiUrl = this.objDbServ.apiImageAttachment; 
            if(data != '' || data != null) {   
              setTimeout(() => { window.open(apiUrl+'/'+data, '_blank'); }, 20);                 
            }
            else {
              }
            }
          }
          else {
            alert(data);
          }
       },
        (error)=>{alert('something went wrong.');}
    );
    }
    else if(Flag =="Compressorvideo"){
      this.objDbServ.FAQView({Flag:'Compressorvideo'}).subscribe(
        (response: Response)=>{
          const data = JSON.parse(response.json());
          if(data!="File Not Found") {
            var filename = data.split('/');
            if(filename!='') {
            var apiUrl = this.objDbServ.apiImageAttachment; 
            if(data != '' || data != null) {   
              setTimeout(() => { window.open(apiUrl+'/'+data, '_blank'); }, 20);                 
            }
            else {
              }
            }
          }
          else {
            alert(data);
          }
       },
        (error)=>{alert('something went wrong.');}
    );
    }
    else if(Flag =="LCVvideo"){
      this.objDbServ.FAQView({Flag:'LCVvideo'}).subscribe(
        (response: Response)=>{
          const data = JSON.parse(response.json());
          if(data!="File Not Found") {
            var filename = data.split('/');
            if(filename!='') {
            var apiUrl = this.objDbServ.apiImageAttachment; 
            if(data != '' || data != null) {   
              setTimeout(() => { window.open(apiUrl+'/'+data, '_blank'); }, 20);                 
            }
            else {
              }
            }
          }
          else {
            alert(data);
          }
       },
        (error)=>{alert('something went wrong.');}
    );
    }
    else if(Flag =="Gasgensetvideo"){
      this.objDbServ.FAQView({Flag:'Gasgensetvideo'}).subscribe(
        (response: Response)=>{
          const data = JSON.parse(response.json());
          if(data!="File Not Found") {
            var filename = data.split('/');
            if(filename!='') {
            var apiUrl = this.objDbServ.apiImageAttachment; 
            if(data != '' || data != null) {   
              setTimeout(() => { window.open(apiUrl+'/'+data, '_blank'); }, 20);                 
            }
            else {
              }
            }
          }
          else {
            alert(data);
          }
       },
        (error)=>{alert('something went wrong.');}
    );
    }
  }
  sortColPopUp(key:string){
    this.sortingColumn = key;
    this.key = key;
    this.reverse= !this.reverse;
  }
  issuePopOpen() {
    this.issuePopup = true;
    this.GetIssueLog();
  }
  issuePopClose()
  {
    this.issuePopup = false;
  }
  fileupload(file: FileList, event: any) {
    this.Issuesuploadedfile = file.item(0);
  }
  OnDateChnage(val){
    this.IssueDate=this.dp.transform(val.toLocaleDateString(), 'yyyy/MM/dd')  
  }
  InsertIssueLog(heading, details) {
    var loginId = localStorage.getItem('LoginId');
    var tempRequester = '';
    if(loginId.toLowerCase().indexOf('cng') > -1){
      tempRequester = "Station";
    }
    else if(loginId.toLowerCase().indexOf('cr') > -1){
      tempRequester = "ControlRoom";
    }
    else if(loginId.toLowerCase().indexOf('admin') > -1){
      tempRequester = "Admin";
    }
    var MyJson = {
      RequestFrom: tempRequester,
      RequesterID: loginId,
      IssueHeading: heading,
      IssueDetails: details,
      CurrentStatus: "Pending",
      Attachment: ((this.Issuesuploadedfile == undefined) ? '' : this.Issuesuploadedfile.name),
      IssueDate : this.IssueDate
     };
    this.Issuelogfiles = $('#issuefiles');
    var frmData = new FormData();
    var fileInput = this.Issuelogfiles[0];
    frmData.append("IssuelogData", JSON.stringify(MyJson));
    if(this.Issuesuploadedfile != undefined) {
      frmData.append('IssuelogFiles', this.Issuesuploadedfile, this.Issuesuploadedfile.name);
    }
    var ErrorMsg = this.ValidationIssues(MyJson, fileInput);
    if(ErrorMsg == '' || ErrorMsg == undefined) {
      this.objDbServ.InsertIssueLog(frmData).subscribe(
        (resp : any) => {
            const data = JSON.parse(resp._body);
            const data1 = data.Table1;
            const data2 = data.Table;
            alert(data1[0].AlertMsg);
            this.listIssueLog = data2;
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
GetIssueLog() {
  var loginId = localStorage.getItem('LoginId');
    var tempRequester = '';
    if(loginId.toLowerCase().indexOf('cng') > -1){
      tempRequester = "Station";
    }
    else if(loginId.toLowerCase().indexOf('cr') > -1){
      tempRequester = "ControlRoom";
    }
    else if(loginId.toLowerCase().indexOf('admin') > -1){
      tempRequester = "Admin";
    }
    this.objDbServ.GetIssueLog({RequestFrom:tempRequester,RequesterID:loginId}).subscribe(
    (resp: any) => {
      this.listIssueLog=JSON.parse(resp.json()).Table
    },
    (error) => {
      alert("Something went wrong.");
     this.objDbServ.ShowLoaders.emit(false);
    }
  )
}
viewAttachment(RefNo){
  this.listIssueLog.forEach(element => {
    if(element.IssueReferenceNo == RefNo){
      this.issueAttachement = element.Attachment;
    }
    if(this.issueAttachement=='') 
       this.imgDisplay = false;
    else
        this.imgDisplay = true;
    this.imgURL = this.objDbServ.apiUrl.substring(0,this.objDbServ.apiUrl.length-4)+"Images/";
    this.imgURL = this.imgURL + this.issueAttachement;
  });
}
DeleteIssueLog(refno) {
  if(confirm("Are you sure want to delete this Issue ? ")){
    var loginId = localStorage.getItem('LoginId');
      var tempRequester = '';
      if(loginId.toLowerCase().indexOf('cng') > -1){
        tempRequester = "Station";
      }
      else if(loginId.toLowerCase().indexOf('cr') > -1){
        tempRequester = "ControlRoom";
      }
      else if(loginId.toLowerCase().indexOf('admin') > -1){
        tempRequester = "Admin";
      }
      else if(loginId.toLowerCase().indexOf('finadmin') > -1){
        tempRequester = "FinAdmin";
      }
      else if(loginId.toLowerCase().indexOf('JMRAdmin') > -1){
        tempRequester = "JMRAdmin";
      }
      this.objDbServ.DeleteIssueLog({RequestFrom:tempRequester,ReferenceNo:refno}).subscribe(
      (resp: any) => {
        const data = JSON.parse(resp.json());
        const data1 = data.Table1;
        const data2 = data.Table;
        alert(data1[0].AlertMsg);
        this.listIssueLog = data2;
      },
      (error) => {
        alert("Something went wrong.");
      this.objDbServ.ShowLoaders.emit(false);
      }
    )
  }
}
ValidationIssues(IssuesJson, fileInput) {
  var foundError = '';
  var foundError = '';
  if (IssuesJson.IssueHeading == '') {
      foundError = 'Issue Heading is required.';
      return foundError;
  }
  if (IssuesJson.IssueDetails == '') {
    foundError = 'Issue Details is required.';
    return foundError;
  }
  if (fileInput.files.length > 0) {
      var validExtension = 'jpeg,jpg,png,gif';
      for (var i = 0; i < fileInput.files.length; i++) {
          var fileExtension = fileInput.files[i].name.split('.').pop().toLowerCase()[1];
          if (validExtension.indexOf(fileExtension) < 0) {
              foundError = 'Attachment allowed only for [' + validExtension + '].';
              return foundError;
          }
      }
  }
  return foundError;
}
  }  
