import { Component, OnInit } from '@angular/core';
import { dbService } from '../../Service/db.service';
import { Response } from '@angular/http';
import { FilterSearchPipe } from '../../Filters/filter-search.pipe';
import { ngxCsv } from 'ngx-csv/ngx-csv';
import { METHODS } from 'http';
import { parse } from 'cfb/types';
import { isNullOrUndefined } from 'util';
import { retry } from 'rxjs/operator/retry';
import { CookieService } from 'ngx-cookie-service';
declare var $:any;
@Component({
  selector: 'app-stationmasterlist',
  templateUrl: './stationmasterlist.component.html',
  styleUrls: ['./stationmasterlist.component.css']
})
export class StationmasterlistComponent implements OnInit {
   listSO:any=[];
   soPopup:boolean = false;
   searchText:string = '';
   OpeBalance:string='0.000';
   filter:string='';
   StationId:string='';
   StationCode:string='';
   SAPCode:string='';
   StationName:string='';
   StationAddress:string='';
   Cost_Center:string='';
   RegionName:string='';
   CompanyName:string='';
   StationTypeName:string='';
   Status:boolean=true;  
   StationPassword:string='';
   StationConfPassword:string='';
   StationRegionId:string='';
   StationCompanyId:string='';
   StationTypeId:string='';
   MoId:string = '';
   StationLoginId:string='';  
   StationEmailId:string='';
   StationContactNo:string='';
   SelectedStationId:string = '0';
   ControlRoomId:string='';   
   ShiftAManagerName:string='';
   ShiftAManagerContactNo:string='';
   ShiftBManagerName:string='';
   ShiftBManagerContactNo:string='';
   ShiftCManagerName:string='';
   ShiftCManagerContactNo:string='';
   ShiftDManagerName:string='';
   ShiftDManagerContactNo:string='';
   dataRegionMaster:{}[];
   dataCompanyMaster:{}[];
   dataStationTypeMaster:{}[];
   dataMoMaster:{}[];
   dataCRoomMaster:{}[];
   errorFound: boolean;
   actionFlag: string;
   title: string;
   key: string = 'Name';
   reverse: boolean = true;
   StatusIsfalse:boolean=false;
   DS:boolean=true;
   DSStatus='';
   exportList:any=[];
   uId:string = "";
   sortingColumn:string="";
   IsVisible:boolean=true;
   ShutdownRemark:string='';
   StationLalitude:string='';
   StationLongitude:string='';
  constructor(private objDbServ: dbService, private objCook: CookieService) { 
    this.objDbServ.MasterCompDisplay.emit(true);
    this.objDbServ.HeaderDisplay.emit(true);
    this.objDbServ.LeftMenu.emit(true); 
  }
  ngOnInit() {
    setTimeout(() => {this.getSoOffice();});
    this.hovertexttooltip();
    $(document).ready(function(){
		$("#ab").click(function(){
			$("#tgt_div").animate({left: "0px"});
		});
		$("#StationCheck").click(function(){
			$("#tgt_div").animate({left:"55px"});
		});
		$("#ef").click(function(){
			$("#tgt_div").animate({left: "110px"});
		});
    });
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
}
OnChangeStatus(evt, flag:string) {
  this.StatusIsfalse = evt.target.checked;
  if(flag=='swthActive') {
    this.DSStatus = '1';
  }
  else if(flag=='swthAll') {
    this.DSStatus = '';
  }
  else if(flag=='swthInActive') {
    this.DSStatus = '2';
  }
  this.getSoOffice();
}
  getSoOffice(){
    this.objDbServ.ShowLoaders.emit(true);
    this.objDbServ.getSoOffice({Flag: 'SOList', Id: '0', Status:this.DSStatus}).subscribe(
      (resp: Response) => {
        this.listSO = JSON.parse(resp.json()).Table;
        this.objDbServ.ShowLoaders.emit(false);
      },
      (error) =>{
        alert('Something went wrong.');
        this.objDbServ.ShowLoaders.emit(false);
      }
    )
  }
  addSO(){
    this.title = 'Add Station';
    this.actionFlag = 'Add';
    this.soPopup = true;
    this.SelectedStationId = '0';    
    this.StationConfPassword = '';
    this.StationId = '';
    this.StationCode =  '';
    this.SAPCode='';
    this.StationName = '';
    this.StationAddress =  '';
    this.Cost_Center='';
    this.StationRegionId =  '';
    this.StationCompanyId = '';
    this.StationTypeId = '';
    this.MoId = '';
    this.ControlRoomId = '';
    this.StationLoginId = '';
    this.StationPassword = '';
    this.StationEmailId = '';
    this.StationContactNo = '';
    this.StationLalitude = '';
    this.StationLongitude = '';
    this.ShiftAManagerName = '';
    this.ShiftAManagerContactNo = '';
    this.ShiftBManagerName = '';
    this.ShiftBManagerContactNo = '';
    this.ShiftCManagerName = '';
    this.ShiftCManagerContactNo = '';
    this.ShiftDManagerName = '';
    this.ShiftDManagerContactNo = '';
    this.Status = true;
    this.OpeBalance ='0.000';
    this.IsVisible=true;
    this.ShutdownRemark='';
    this.getSO('0');
    this.StationLalitude='';
    this.StationLongitude='';
  }
  getSO(StationId:string){
    this.objDbServ.ShowLoaders.emit(true);
    this.objDbServ.getSoOffice({Flag: 'SoById', Id: StationId}).subscribe(
      (resp: Response) => {
        if(JSON.parse(resp.json()).Table.length > 0){
          const retData = JSON.parse(resp.json()).Table[0];
          this.StationId = retData.StationId;
          this.StationCode = retData.StationCode;
          this.SAPCode=retData.SAPCode; 
          this.StationName = retData.StationName;           
          this.StationAddress = retData.StationAddress;
          this.Cost_Center = retData.Cost_Center;
          this.Status = (retData.Status == '2')? false: true;
          this.StationRegionId = retData.StationRegionId;
          this.StationCompanyId = retData.StationCompanyId;
          this.StationTypeId = retData.StationTypeId;
          this.MoId = retData.MoId;
          this.ControlRoomId = retData.ControlRoomId;
          this.StationLoginId = retData.LoginId;
          this.StationEmailId = retData.StationEmailId;
          this.StationContactNo = retData.StationContactNo;
          this.ShiftAManagerName = retData.ShiftAManager;
          this.ShiftAManagerContactNo = retData.ShiftAManagerContact;
          this.ShiftBManagerName = retData.ShiftBManager;
          this.ShiftBManagerContactNo = retData.ShiftBManagerContact;
          this.ShiftCManagerName = retData.ShiftCManager;
          this.ShiftCManagerContactNo = retData.ShiftCManagerContact;
          this.ShiftDManagerName = retData.ShiftDManager;
          this.ShiftDManagerContactNo = retData.ShiftDManagerContact;
          this.StationEmailId = retData.EmailId;
          this.StationContactNo = retData.ContactNo;
          this.OpeBalance = retData.OpeBalance;
          this.ShutdownRemark = retData.ShutdownRemark;
          this.IsVisible=false;
          this.StationLalitude = retData.Latitude;
          this.StationLongitude = retData.Longitude;
        }
        this.StationLoginId = '';
        this.StationPassword='';
        this.dataRegionMaster = JSON.parse(resp.json()).Table1;
        this.dataCompanyMaster = JSON.parse(resp.json()).Table2;
        this.dataStationTypeMaster = JSON.parse(resp.json()).Table3;
        this.dataMoMaster = JSON.parse(resp.json()).Table4;
        this.dataCRoomMaster = JSON.parse(resp.json()).Table5;
        this.objDbServ.ShowLoaders.emit(false);        
      },
      (error) =>{
        alert('Something went wrong.');
        this.objDbServ.ShowLoaders.emit(false);
      }
    )
  }
  openPopupForUpdate(StationId:string){
    this.uId = StationId;
    this.title = 'Update Station';
    this.actionFlag = 'Update';
    this.soPopup = true;
    this.SelectedStationId = StationId;
    this.getSO(StationId);
    this.IsVisible=false;
  }
  saveSM(){
    this.errorFound = true;
    if(this.validationSO()){
      const obj = {
        StationId:(this.actionFlag == 'Update') ? this.SelectedStationId : '0',
        StationCode:this.StationCode,
        SAPCode : this.SAPCode,
        StationName:this.StationName.toUpperCase(),
        StationAddress:this.StationAddress, 
        Cost_Center:this.Cost_Center,       
        StationRegionId:this.StationRegionId,
        StationCompanyId:this.StationCompanyId,
        StationTypeId:this.StationTypeId,
        MoId:this.MoId,        
        StationLoginId:this.StationLoginId,
        StationPassword:this.StationPassword,
        ControlRoomId :this.ControlRoomId,
        StationEmailId:this.StationEmailId,
        StationContactNo:this.StationContactNo,
        Status: ((this.Status == true) ?'1':'2'),
        OpeBalance : parseFloat(this.OpeBalance),
        ShutdownRemark : this.ShutdownRemark,
        ShiftAManagerName:this.ShiftAManagerName,
        ShiftAManagerContactNo:this.ShiftAManagerContactNo,
        ShiftBManagerName:this.ShiftBManagerName,
        ShiftBManagerContactNo:this.ShiftBManagerContactNo,
        ShiftCManagerName:this.ShiftCManagerName,
        ShiftCManagerContactNo:this.ShiftCManagerContactNo,
        ShiftDManagerName:this.ShiftDManagerName,
        ShiftDManagerContactNo:this.ShiftDManagerContactNo,
        Lalitude:this.StationLalitude,
        Longitude:this.StationLongitude
      };
      this.objDbServ.ShowLoaders.emit(true);
      this.objDbServ.addSoOffice(obj).subscribe(
        (resp: Response) =>{
          const data = JSON.parse(resp.json());
          this.getSoOffice();
          if(data.Table[0].Meaasge.indexOf('successfully') > -1)
          {
            this.StationId = '';
            this.StationCode =  '';
            this.StationName = '';
            this.StationAddress =  '';
            this.Cost_Center='';
            this.StationRegionId =  '';
            this.StationCompanyId = '';
            this.StationTypeId = '';
            this.ControlRoomId = '';
            this.MoId = '';
            this.StationLoginId = '';
            this.StationConfPassword = '';
            this.StationPassword = '';
            this.StationEmailId = '';
            this.StationContactNo = '';           
            this.ShiftAManagerName = '';
            this.ShiftAManagerContactNo = '';
            this.ShiftBManagerName = '';
            this.ShiftBManagerContactNo = '';
            this.ShiftCManagerName = '';
            this.ShiftCManagerContactNo = '';
            this.ShiftDManagerName = '';
            this.ShiftDManagerContactNo = '';
            this.ShutdownRemark ='',
            this.Status = true;
            this.soPopup = false;
            $("#StationCheck").prop("checked", true);
            this.DSStatus = '';
            $("#tgt_div").animate({left:"55px"});
            this.getSoOffice();            
          }
          alert(data.Table[0].Meaasge);
          this.objDbServ.ShowLoaders.emit(false);
        },
        (error) =>{
          alert('Something went wrong.');
          this.objDbServ.ShowLoaders.emit(false);
        }
      )
    }
  }
  validationSO(){
    var re = new RegExp(/^[0-9]*$/);
    var len = new RegExp(/^.{1,50}$/);
    var Ope = /^\s*(?=.*[1-9])\d*(?:\.\d{1,3})?\s*$/g;
    if(this.StationCode == ''){
      alert('Station code must be filled.');
      this.errorFound = false;
      return this.errorFound;
    }
    else if(this.StationCode.length < 3 ){
      alert('Station code must be min. 3 character.');
      this.errorFound = false;
      return this.errorFound;
    }
    if(this.SAPCode == ''){
      alert('SAP Code must be filled.');
      this.errorFound = false;
      return this.errorFound;
    }
    else if(this.StationName == ''){
      alert('Station name must be filled.');
      this.errorFound = false;
      return this.errorFound;
    }
    else if(this.StationName.length < 3){
      alert('Station name must be min. 3 character.');
      this.errorFound = false;
      return this.errorFound;
    }
    else if (re.test(this.StationName)) {
      alert('Invalid Station Name.');
       this.errorFound = false;
    }
    else if (this.StationAddress == '' ||
      isNullOrUndefined(this.StationAddress)){
      alert('Station address must be filled.');
      this.errorFound = false;
    }  
    else if (this.Cost_Center == '' ||
      isNullOrUndefined(this.Cost_Center)){
      alert('Cost Center must be filled.');
      this.errorFound = false;
    }   
    else if (this.StationRegionId == ''){
      alert('Region must be selected.');
      this.errorFound = false;
    }
    else if (this.StationCompanyId == ''){
      alert('Company must be selected.');
      this.errorFound = false;
    }
    else if (this.StationTypeId == ''){
      alert('Station type must be selected.');
      this.errorFound = false;
    }
    else if (this.MoId == ''){
      alert('Marketing officer must be selected.');
      this.errorFound = false;
    }
    else if (this.ControlRoomId == '') {
      alert('Control Room must be selected.');
      this.errorFound = false;
    }
    else if (this.OpeBalance != "0.000") {
       if(!Ope.test(this.OpeBalance) && this.actionFlag == 'Add') {
        alert('Invalid Ope. Balance.');
        this.errorFound = false;
       }
     }
     else if(this.StationLalitude == ''){
      alert('Latitude must be entered.');
      this.errorFound = false;
    }
    else if(this.StationLongitude == ''){
      alert('Longitude must be entered.');
      this.errorFound = false;
    }
    else if (this.StationLoginId == ''  && this.actionFlag == 'Add'){
      alert('Login Id must be filled.');
      this.errorFound = false;
    }
    else if (this.StationPassword == ''  && this.actionFlag == 'Add'){
      alert('Station password must be filled.');
      this.errorFound = false;
    }
    else if (this.StationConfPassword == '' && this.actionFlag == 'Add'){
      alert('Confirm password must be filled.');
      this.errorFound = false;
    }
    else if (this.StationPassword != this.StationConfPassword  && this.actionFlag == 'Add'){
      alert('Password did not matched.');
      this.errorFound = false;
    }
    else if (this.ShiftAManagerContactNo == '' && this.actionFlag == 'Add'){
      alert('Shift A Manager Name must be filled.');
      this.errorFound = false;
      return this.errorFound;
    }
    else if(isNullOrUndefined(this.ShiftAManagerName) || this.ShiftAManagerName=="")
    {
      alert('Shift A Manager Name must be filled.');
      this.errorFound = false;
      return this.errorFound;
    }
    else if (this.ShiftAManagerContactNo == ''  && this.actionFlag == 'Add'){
      alert('Shift A Contact No must be filled.');
      this.errorFound = false;
      return this.errorFound;
    }
    else if(isNullOrUndefined(this.ShiftAManagerContactNo))
    {
      alert('Shift A Contact No must be filled.');
      this.errorFound = false;
      return this.errorFound;
    }
    else if (this.ShiftBManagerName == ''  && this.actionFlag == 'Add')
    {
      alert('Shift B Manager Name must be filled.');
      this.errorFound = false;
      return this.errorFound;
    }
    else if(isNullOrUndefined(this.ShiftBManagerName) || this.ShiftBManagerName=="")
    {
      alert('Shift B Manager Name must be filled.');
      this.errorFound = false;
      return this.errorFound;
    }
    else if (this.ShiftBManagerContactNo == ''  && this.actionFlag == 'Add'){
      alert('Shift B Contact No must be filled.');
      this.errorFound = false;
      return this.errorFound;
    }
    else if(isNullOrUndefined(this.ShiftBManagerContactNo))
    {
      alert('Shift B Contact No must be filled.');
      this.errorFound = false;
      return this.errorFound;
    }
    else if (this.ShiftCManagerName == ''  && this.actionFlag == 'Add'){
      alert('Shift C Manager Name must be filled.');
      this.errorFound = false;
      return this.errorFound;
    }
    else if(isNullOrUndefined(this.ShiftCManagerName) || this.ShiftCManagerName=="")
    {
      alert('Shift C Manager Name must be filled.');
      this.errorFound = false;
      return this.errorFound;
    }
    else if (this.ShiftCManagerContactNo == ''  && this.actionFlag == 'Add'){
      alert('Shift C Contact No must be filled.');
      this.errorFound = false;
      return this.errorFound;
    }
    else if(isNullOrUndefined(this.ShiftCManagerContactNo))
    {
      alert('Shift C Contact No must be filled.');
      this.errorFound = false;
      return this.errorFound;
    }
    else if (this.ShiftDManagerName == ''  && this.actionFlag == 'Add'){
      alert('Shift D Manager Name must be filled.');
      this.errorFound = false;
      return this.errorFound;
    }
    else if(isNullOrUndefined(this.ShiftDManagerName) || this.ShiftDManagerName=="") 
    {
      alert('Shift D Manager Name must be filled.');
      this.errorFound = false;
      return this.errorFound;
    }
    else if (this.ShiftDManagerContactNo == ''){
      alert('Shift D Contact No must be filled.');
      this.errorFound = false;
      return this.errorFound;
    }
    else if(isNullOrUndefined(this.ShiftDManagerContactNo))
    {
      alert('Shift D Contact No must be filled.');
      this.errorFound = false;
      return this.errorFound;
    }
    else if(this.ShiftAManagerName.length < 3 ){
      alert('Shift A Manager Name must be min. 3 character.');
      this.errorFound = false;
      return this.errorFound;
    }
    else if(this.ShiftBManagerName.length < 3 ){
      alert('Shift B Manager Name must be min. 3 character.');
      this.errorFound = false;
      return this.errorFound;
    }
    else if(this.ShiftCManagerName.length < 3 ){
      alert('Shift C Manager Name must be min. 3 character.');
      this.errorFound = false;
      return this.errorFound;
    }
    else if(this.ShiftDManagerName.length < 3 ){
      alert('Shift D Manager Name must be min. 3 character.');
      this.errorFound = false;
      return this.errorFound;
    }
    if (this.StationEmailId != ''){
      const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      const isValidated = this.StationEmailId.match(mailformat);
      if(isValidated==null)
      {
        alert('You have entered an invalid email address.');
        this.errorFound = false;
      }    
    }
    if(this.StationContactNo != '' && !isNullOrUndefined(this.StationContactNo)){
      var phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
      const isValidated = this.StationContactNo.match(phoneno);
      if(isValidated==null)
      {
        alert('You have entered an invalid contact no.');
       this.errorFound = false;
      }
    }
    if(this.ShiftAManagerContactNo != '' && !isNullOrUndefined(this.ShiftAManagerContactNo)){
      var phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
      const isValidated = this.ShiftAManagerContactNo.match(phoneno);
      if(isValidated==null)
      {
        alert('You have entered an invalid contact no. of Shift A Manager');
        return this.errorFound = false; 
      }
    }
    if(this.ShiftBManagerContactNo != '' && !isNullOrUndefined(this.ShiftBManagerContactNo)){
      var phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
      const isValidated = this.ShiftBManagerContactNo.match(phoneno);
      if(isValidated==null)
      {
        alert('You have entered an invalid contact no. of Shift B');
        return this.errorFound = false;
      }
    }
    if(this.ShiftCManagerContactNo != '' && !isNullOrUndefined(this.ShiftCManagerContactNo)){
      var phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
      const isValidated = this.ShiftCManagerContactNo.match(phoneno);
      if(isValidated==null)
      {
        alert('You have entered an invalid contact no. of Shift C');
         return  this.errorFound = false;
      }
    }
    if(this.ShiftDManagerContactNo != '' && !isNullOrUndefined(this.ShiftDManagerContactNo)){
      var phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
      const isValidated = this.ShiftDManagerContactNo.match(phoneno);
      if(isValidated==null)
      {
        alert('You have entered an invalid contact no. of Shift D');
        return this.errorFound = false;
      }
    }
    return this.errorFound;
  }
  sortCol(key:string){
    this.sortingColumn = key;
    this.key = key;
    this.reverse = !this.reverse;
  }
  exportFile() {
    this.exportList = [];
   if(this.listSO.length > 0)
   {
    this.listSO.forEach((element,i)=>{
      this.exportList.push({'SrNo':i+1,'MarketingOfficerName':element.MarketingOfficerName,'StationCode':element.StationCode,
       'SAPCode' : element.SAPCode, 'StationName':element.StationName,'ControlRoomName':element.ControlRoomName,
       'RegionName':element.RegionName,'CompanyName':element.CompanyName,'StationTypeName':element.StationTypeName,'Status':element.StatusSort  })
    })
    var head = ['Sr. No.', 'Marketing Officer', 'Station Code', 'SAP Code', 'Station Name','Controm Room','Region Name','Company Name',' Station Type','Status'];  
    var filename = 'Station_Management_'+this.objCook.get('CurrentDate');
    new ngxCsv(this.exportList, filename, {headers: (head)});
  }
  else{
    alert('No Data available to export.!');
  }
 }
}