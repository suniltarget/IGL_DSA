import { Component, OnInit } from '@angular/core';
import { dbService } from '../../Service/db.service';
import { CookieService } from 'ngx-cookie-service';
declare var $:any;
@Component({
  selector: 'app-issuesresponse',
  templateUrl: './issuesresponse.component.html',
  styleUrls: ['./issuesresponse.component.css']
})
export class IssuesresponseComponent implements OnInit {
  flag:string = '';
  listEntryThreshold:any =[];
  EntryThresholdId:string='';
  DaysForAverage:string='';
  ThresholdValue:string='';
  errorFound = true;
  title:string='';
  EntryThresholdPopup: boolean = false;
  SelectedStationCode:string='';
  Status:boolean;
  key: string = 'Name';
  reverse: boolean = true;
  StatusIsfalse:boolean=false;
  ActiveStatus:string = '';
  filter:string='';
  uId:string="";
  sortingColumn:string="";
  exportList: any=[];
  metervisible:boolean = false;
  listIssueLog:any=[];
  imgURL:string='';
  issueAttachement:string='';
  selectedissuestatus:string="Pending";
  imgDisplay:boolean=true;
  constructor(private objDbServ: dbService, private objCook: CookieService) {
    this.objDbServ.MasterCompDisplay.emit(false);
    this.objDbServ.HeaderDisplay.emit(false);
    this.objDbServ.LeftMenu.emit(false);
  }
  ngOnInit() {
    this.GetIssueLog();
  }
  GetIssueLog() {
    this.objDbServ.GetIssueLog({RequestFrom:"Developer",RequesterID:"admin"}).subscribe(
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
issuestatus(value){
  this.selectedissuestatus = value;
}
updateIssueLog(remarks,refNo) {
  this.objDbServ.updateIssueLog({RequestFrom: "Developer", CurrentStatus: this.selectedissuestatus, ReferenceNo:refNo, RemarksByDeveloper: remarks}).subscribe(
  (resp: any) => {
    const data = JSON.parse(resp.json()).Table1
    const data2 = JSON.parse(resp.json()).Table
    alert(data[0].AlertMsg);
    this.listIssueLog = data2;
  },
  (error) => {
    alert("Something went wrong.");
   this.objDbServ.ShowLoaders.emit(false);
  }
)
}
  exportFile() {
  }
  openAddDisp() {
  }
  sortColPopUp(key:string) {
    this.sortingColumn = key;
    this.key = key;
    this.reverse= !this.reverse;
  }
}
