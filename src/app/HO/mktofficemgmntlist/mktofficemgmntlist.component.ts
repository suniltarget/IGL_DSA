import { Component, OnInit } from '@angular/core';
import { dbService } from '../../Service/db.service';
import { Response } from '@angular/http';
import { FilterSearchPipe } from '../../Filters/filter-search.pipe';
import { ngxCsv } from 'ngx-csv/ngx-csv';
declare var $:any;
@Component({
  selector: 'app-mktofficemgmntlist',
  templateUrl: './mktofficemgmntlist.component.html',
  styleUrls: ['./mktofficemgmntlist.component.css']
})
export class MktofficemgmntlistComponent implements OnInit {
   listMO:any = [];
   momPopup:boolean = false;
   UserId: string;
   MOName: string;
   MOLoginId: string;
   MOEmailId: string;
   MOEmailId2: string;
   MOEmailId3: string;
   MOEmailId4: string;
   MOContactNo: string;
   MOContactNo2: string;
   MOContactNo3: string;
   MOContactNo4: string;
   CPwd: string;
   MOPassword: string;
   title: string;
   errorFound: boolean;
   actionFlag: string;
   searchText: string;
   key: string = 'Name';
   reverse: boolean = true;
   DS:boolean=true;
   StatusIsfalse:boolean=false;
   ActiveStatus:string ='';
   StatusSort:string ='';
   Status:boolean=true;
   exportList:any=[];
   uId:string="";
   sortingColumn:string="";
   CDate:string;
   filter:string='';
   monthNames = [
     "Jan", "Feb", "Mar",
     "Apr", "May", "Jun", "Jul",
     "Aug", "Sep", "Oct",
     "Nov", "Dec"
   ];
  constructor(private objDbServ: dbService) { 
    this.objDbServ.MasterCompDisplay.emit(true);
    this.objDbServ.HeaderDisplay.emit(true);
    this.objDbServ.LeftMenu.emit(true);
  }
  ngOnInit() {
    this.title = 'a';
    const dt = new Date();
    this.CDate = dt.getDate() + "/" + this.monthNames[dt.getMonth()] + "/" + dt.getFullYear();
    setTimeout(() => {this.getMktOffice();
    });
    $(document).ready(function(){
      $("#ab").click(function(){
        $("#tgt_div").animate({left: "0px"});
      });
      $("#MKOcheck").click(function(){
        $("#tgt_div").animate({left:"55px"});
      });
      $("#ef").click(function(){
        $("#tgt_div").animate({left: "110px"});
      });
    });
  }
  OnChangeStatus(evt, flag:string) {
    this.StatusIsfalse = evt.target.checked;
    if(flag=='swthActive') {
      this.ActiveStatus = '1';
    }
    else if(flag=='swthAll') {
      this.ActiveStatus = '';
    }
    else if(flag=='swthInActive') {
      this.ActiveStatus = '2';
    }
    this.getMktOffice();
  }
  getMktOffice() {
    this.objDbServ.ShowLoaders.emit(true);
    this.objDbServ.getMktOffice({Flag: 'MOList', Id: '0', Status: this.ActiveStatus}).subscribe(
      (resp: Response) => {
        this.listMO = JSON.parse(resp.json()).Table;
        this.objDbServ.ShowLoaders.emit(false);
      },
      (error) =>{alert('Something went wrong.')}
    )
  }
  addMom(){
    this.title = 'Add AMO';
    this.actionFlag = 'Add';
    this.momPopup = true;
    this.UserId = '';
    this.MOName =  '';
    this.MOLoginId = '';
    this.MOEmailId =  '';
    this.MOEmailId2 =  '';
    this.MOEmailId3 =  '';
    this.MOEmailId4 =  '';
    this.MOContactNo =  '';
    this.MOContactNo2 =  '';
    this.MOContactNo3 =  '';
    this.MOContactNo4 =  '';
    this.MOPassword = '';
    this.CPwd = '';
    this.Status=true;
  }
  updateMom(itm){
    this.uId = itm.UserId;
    this.title = 'Update AMO';
    this.actionFlag = 'Update';
    this.momPopup = true;
    this.ActiveStatus = (this.DS==true) ? '0' : '1';
    this.objDbServ.ShowLoaders.emit(true);
    this.objDbServ.getMktOffice({Flag: 'MoById', Id: itm.UserId, Status: itm.Status}).subscribe(
      (resp: Response) =>
      {
        const retData = JSON.parse(resp.json()).Table[0];
        const retData1 = JSON.parse(resp.json()).Table1;
        if(retData != undefined) {
        this.UserId = retData.UserId;
        this.MOName = retData.MOName.toUpperCase(); 
        this.MOLoginId = retData.UserId;
        this.MOEmailId = retData.MOEmailId;
        this.MOContactNo = retData.MOContactNo;
        if(retData1.length > 0)
        {
          if(retData1.length==1)
          {
            this.MOEmailId2 = retData1[0].EmailId;
            this.MOEmailId3='';
            this.MOEmailId4='';
            this.MOContactNo2 = retData1[0].ContactNo;
            this.MOContactNo3='';
            this.MOContactNo4='';
          }
        else if(retData1.length==2)
          {
            this.MOEmailId2 = retData1[0].EmailId;
            this.MOEmailId3= retData1[1].EmailId;
            this.MOEmailId4='';
            this.MOContactNo2 = retData1[0].ContactNo;
            this.MOContactNo3= retData1[1].ContactNo;
            this.MOContactNo4='';
          }
       else if(retData1.length==3)
          {
            this.MOEmailId2 =retData1[0].EmailId;
            this.MOEmailId3 = retData1[1].EmailId;
            this.MOEmailId4 = retData1[2].EmailId;
            this.MOContactNo2 = retData1[0].ContactNo;
            this.MOContactNo3 = retData1[1].ContactNo;
            this.MOContactNo4 = retData1[2].ContactNo;
          }
        }
        else{
          this.MOEmailId2='';
          this.MOEmailId3 ='';
          this.MOEmailId4='';
          this.MOContactNo2='';
          this.MOContactNo3='';
          this.MOContactNo4='';
        }
        this.MOPassword='';
        this.objDbServ.ShowLoaders.emit(false);
        this.Status = (retData.DS == 2) ? false: true;
      }
      else {
        alert('No Data Available');
        this.momPopup = false;  
        this.objDbServ.ShowLoaders.emit(false);
      }
      }
    )
  }
  saveMO(){
    this.errorFound = true;
    if(this.validationMom()){
      const obj = {
        MOId : this.UserId,
        MOName :  this.MOName.toUpperCase(),
        MOLoginId : this.MOLoginId,
        MOEmailId :  this.MOEmailId,
        MOEmailId2 :  this.MOEmailId2,
        MOEmailId3 :  this.MOEmailId3,
        MOEmailId4 :  this.MOEmailId4,
        MOContactNo :  this.MOContactNo,
        MOContactNo2 :  this.MOContactNo2,
        MOContactNo3 :  this.MOContactNo3,
        MOContactNo4 :  this.MOContactNo4,
        MOPassword: this.MOPassword,
        Status: (this.Status==true) ? '1' : '2'
      };
      this.objDbServ.ShowLoaders.emit(true);
      this.objDbServ.addMktOffice(obj).subscribe(
        (resp: Response) =>{
          const data = JSON.parse(resp.json());
          if(data.Table[0].Meaasge.indexOf('successfully') > -1)
          {
            this.UserId = '';
            this.MOName =  '';
            this.MOLoginId = '';
            this.MOEmailId =  '';
            this.MOEmailId2 =  '';
            this.MOEmailId3 =  '';
            this.MOEmailId4 =  '';
            this.MOContactNo =  '';
            this.MOContactNo2 =  '';
            this.MOContactNo3 =  '';
            this.MOContactNo4 =  '';
            this.MOPassword = '';
            this.CPwd = '';
            this.momPopup = false;
            $("#MKOcheck").prop("checked", true);
            this.ActiveStatus = '';
            $("#tgt_div").animate({left:"55px"});
            this.getMktOffice();
          }
          this.objDbServ.ShowLoaders.emit(false);
          alert(data.Table[0].Meaasge);
        },
        (error) =>{alert('Something went wrong.')}
      )
    }
  }
  closePopup(){
    this.actionFlag = '';
    this.momPopup = false;
  }
  sortCol(key:string){
    this.sortingColumn = key;
    this.key = key;
    this.reverse = !this.reverse;
  }
  validationMom(){
    if(this.MOName == ''){
      alert('Name must be filled.');
      this.errorFound = false;
      return this.errorFound;
    }
    var re = new RegExp(/^[a-zA-Z ]*$/);
    if (!re.test(this.MOName)) {
        alert('Invalid Name.');
        this.errorFound = false;
        return this.errorFound;
    }
    else if (this.MOLoginId == ''){
      alert('Login Id must be filled.');
      this.errorFound = false;
      return this.errorFound;
    }    
    else if (this.MOPassword == '' && this.actionFlag == 'Add'){
      alert('Password must be filled.');
      this.errorFound = false;
      return this.errorFound;
    }
    else if (this.CPwd == '' && this.actionFlag == 'Add'){
      alert('Confirm password must be filled.');
      this.errorFound = false;
      return this.errorFound;
    }
    else if(this.MOPassword != this.CPwd && this.actionFlag == 'Add')
    {
      alert('Password did not match.');
      this.errorFound = false;
      return this.errorFound;
    }
    else if (this.MOEmailId == ''){
      alert('Primary Email address must be filled.');
      this.errorFound = false;
      return this.errorFound;
    }
    else if(this.MOContactNo == ''){
      alert('Primary Contact number must be filled.');
      this.errorFound = false;
      return this.errorFound;
    }
    if (this.MOEmailId != '' && this.MOEmailId != null){
      const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      const isValidated = this.MOEmailId.match(mailformat);
      if(isValidated==null) {
        alert('You have entered an invalid Primary email address.');
        this.errorFound = false;
        return this.errorFound;
      } 
    }
    if (this.MOEmailId2 != '' && this.MOEmailId2 != null){
      const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      const isValidated = this.MOEmailId2.match(mailformat);
      if(isValidated==null)  {
        alert('You have entered an invalid email 2 address.');
        this.errorFound = false;
        return this.errorFound;
      } 
    }
    if (this.MOEmailId3 != '' && this.MOEmailId3 != null) {
      const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      const isValidated = this.MOEmailId3.match(mailformat);
      if(isValidated==null) {
        alert('You have entered an invalid email 3 address.');
        this.errorFound = false;
        return this.errorFound;
      } 
    }
    if (this.MOEmailId4 != '' && this.MOEmailId4 != null){
      const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      const isValidated = this.MOEmailId2.match(mailformat);
      if(isValidated==null) {
        alert('You have entered an invalid email 4 address.');
        this.errorFound = false;
        return this.errorFound;
      } 
    }
    if(this.MOContactNo != '' && this.MOContactNo != null){
      var phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
      const isValidated = this.MOContactNo.match(phoneno);
      if(isValidated==null) {
        alert('You have entered an invalid Primary contact no.');
        this.errorFound = false;
        return this.errorFound;
      }
    }
    if(this.MOContactNo2 != '' && this.MOContactNo2 != null){
      var phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
      const isValidated = this.MOContactNo2.match(phoneno);
      if(isValidated==null)
      {
        alert('You have entered an invalid contact no 2.');
        this.errorFound = false;
        return this.errorFound;
      }
    }
    if(this.MOContactNo3 != '' && this.MOContactNo3 != null){
      var phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
      const isValidated = this.MOContactNo3.match(phoneno);
      if(isValidated==null)
      {
        alert('You have entered an invalid contact no 3.');
        this.errorFound = false;
        return this.errorFound;
      }
    }
    if(this.MOContactNo4 != '' && this.MOContactNo4 != null){
      var phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
      const isValidated = this.MOContactNo4.match(phoneno);
      if(isValidated==null)
      {
        alert('You have entered an invalid contact no 4.');
        this.errorFound = false;
        return this.errorFound;
      }
    }
    if(((this.MOEmailId !='' && this.MOEmailId !=null) && (this.MOEmailId ==this.MOEmailId2 || this.MOEmailId==this.MOEmailId3 || this.MOEmailId==this.MOEmailId4)) || ((this.MOEmailId2 !='' && this.MOEmailId2 !=null )&& (this.MOEmailId2==this.MOEmailId3 ||  this.MOEmailId2==this.MOEmailId4)) || ((this.MOEmailId3 !='' && this.MOEmailId3 !=null) && (this.MOEmailId3==this.MOEmailId4)))
    {
      alert('Email must be unique');
      this.errorFound = false;
      return this.errorFound;
    }
    if(((this.MOContactNo !='' && this.MOContactNo !=null) && (this.MOContactNo ==this.MOContactNo2 || this.MOContactNo==this.MOContactNo3 || this.MOContactNo==this.MOContactNo4)) || ((this.MOContactNo2 !='' && this.MOContactNo2 !=null) && (this.MOContactNo2==this.MOContactNo3 ||  this.MOContactNo2==this.MOContactNo4)) || ((this.MOContactNo3 !='' && this.MOContactNo3 !=null)  && (this.MOContactNo3==this.MOContactNo4)))
    {
      alert('Contact no must be unique');
      this.errorFound = false;
      return this.errorFound;
    }
    return this.errorFound;
  }
  exportFile() {
    this.exportList = [];
    if(this.listMO.length > 0)
    {
      this.listMO.forEach((element,i)=>{
        this.exportList.push({'SrNo':i+1,'Name':element.Name,'LoginId':element.LoginId,'EmailId':element.EmailId,'ContactNo':element.ContactNo,'Status':element.StatusSort  })
      })
      var head = ['Sr. No.', 'MO Name', ' Login Id','Email','Contact No','Status'];  
      var filename = 'MO_Management_'+this.CDate;
      new ngxCsv(this.exportList, filename, {headers: (head)});
   }
   else{
    alert('No Data available to export.!');
   }
 }
}
