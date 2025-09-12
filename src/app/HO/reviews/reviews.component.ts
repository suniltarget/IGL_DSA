import { Component, OnInit } from '@angular/core';
import { dbService } from '../../Service/db.service';
import { Response } from '@angular/http';
import {Router} from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { DatepickerOptions } from 'ng2-datepicker';
import * as enLocale from 'date-fns/locale/en';
declare var $:any;
@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.css']
})
export class ReviewsComponent implements OnInit {
hostPath:string="";
arrReviewData:any=[];
filter:string="";
LoginPass:string="";
reviewpoup:boolean = false;
rejectpopup:boolean = false;
stationToSubmit:any = [];
selectedAll: any;
apiURL:string="";
glovalJson:any = JSON.parse(sessionStorage.getItem('globalDetail'));
outerCheck:number=0;
key: string = 'Name';
reverse: boolean = true;
sortingColumn:string="";
DPREntryDate:string;
itmArray:any = [];
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
  maxDate:new Date(Date.now())
};
  constructor(private objRoute: Router,private objDbServ: dbService, private objCook: CookieService) { 
    this.objDbServ.MasterCompDisplay.emit(true);
    this.objDbServ.HeaderDisplay.emit(true);
    this.objDbServ.LeftMenu.emit(true);
  }
  ngOnInit() {
    this.apiURL = this.objDbServ.apiImageAttachment + '/Attachments/Excel/';
    this.DPREntryDate = this.objCook.get('CurrentDate'); 
    this.getReviewData();
  }
  OnDateChnagefrom(val){
    const dt = new Date(val);     
    this.DPREntryDate= dt.getDate() + "-" + this.monthNames[dt.getMonth()] + "-" + dt.getFullYear();
    this.getReviewData();
  }
  getReviewData(){
    this.objDbServ.ShowLoaders.emit(true);
    var LoginId=this.objCook.get('UID');
    this.objDbServ.getReviewData({LoginId:localStorage.getItem('LoginId'), DPREntryDate:this.DPREntryDate}).subscribe(
      (resp: any) => {
        const data = JSON.parse(resp._body);
        if(data) {
          this.arrReviewData = JSON.parse(resp._body);
          this.stationToSubmit = this.arrReviewData.filter(
            arrayobj => arrayobj.SubmitStatus == "1"
          ); 
          if (this.arrReviewData[0].isSentToHo == 1)
                    this.outerCheck = 1;
                else
                    this.outerCheck = 0;
          this.objDbServ.ShowLoaders.emit(false);
        }
        else {
           alert('Data not found.!')
           this.objDbServ.ShowLoaders.emit(false);
        }
      },
      (error) =>{alert('Something went wrong.');
      this.objDbServ.ShowLoaders.emit(false);
    }
    )
  }
  selectAll() {
    for (var i = 0; i < this.arrReviewData.length; i++) {
      this.arrReviewData[i].selected = this.selectedAll;
    }
  }
  checkIfAllSelected() {
    this.selectedAll = this.arrReviewData.every(function(item:any) {
        return item.selected == true;
      })
  }
  makeFinalApprove(){
    var temparray:any=[];
    temparray = this.arrReviewData.filter(arrayobj => arrayobj.selected == true);
          if (temparray.length == 0) {
            alert('Station Entry is Pending.');
            return false;
          }
        if (!confirm('Do you really want to Approve?'))
            return false;
        var stJson = [];
        temparray.forEach(element => {
            stJson.push({
                LoginId: this.glovalJson[0].LoginId,
                StationCode: element.StationCode,
                DPREntryDate:this.DPREntryDate
            });
        });
        this.objDbServ.FinalSubmitCO(stJson).subscribe(
          (resp: any) => {
            const data = JSON.parse(resp._body);
            if (data.Status == 'false') {
                alert('Please save all the entries before final Approval.');
                return false;
              }
              else
                alert('Data is Approved.');
            this.getReviewData();
          },
          (error) =>{alert('Something went wrong.');
          this.objDbServ.ShowLoaders.emit(false);
        }
        )        
  }
  rejectionPopup(flag, itm){
    this.itmArray=itm;
    this.rejectpopup = flag;
  }
  login(StationCode, LoginPassword){
    this.objCook.set('LoginCode', StationCode);
    this.objDbServ.ShowLoaders.emit(true);
    this.objDbServ.login({LoginId: StationCode, EmployeeCode: "Dummy", Password: LoginPassword}).subscribe(
        (response: Response)=>{
          const data = JSON.parse(response.json());
          if(data[0].Meaasge == undefined)
          {
              this.objCook.set('stationCode', data[0].StationCode);
              this.objCook.set('DepartmentCode', data[0].DepartmentCode);
              this.objCook.set('stationId', data[0].StationId);
              this.objCook.set('SId', data[0].StationId);
              this.objCook.set('LoginId', data[0].LoginId);
              this.objDbServ.globalUserid = data[0].UserId;
              this.objRoute.navigate([data[0].Redirect]);
              this.objCook.set('UID', data[0].UserId);
              this.objCook.set('ShiftId','-1');
              this.objCook.set('SubShiftId','-1');
              this.objCook.set('SummeryDate',data[0].SummeryDate);
              this.objCook.set('ReviewSummeryDate',this.DPREntryDate);
              this.objCook.set('isStationLogin','1');
              this.objCook.set('CurrentDate',data[0].CurrentDate);
              this.objCook.set('CurrentDateTime',data[0].CurrentDateTime);
              this.objDbServ.ShowBorder.emit(true);
              this.objDbServ.ShowLoaders.emit(false);
              localStorage.setItem('LoginId',StationCode);
              sessionStorage.setItem('globalDetail', JSON.stringify(data[0]));
              this.GetStationDetail(StationCode);
          }
          else{
            alert(data[0].Meaasge.replace('Error:', ''));
            this.objDbServ.ShowLoaders.emit(false);
          }
        },
        (error)=>{
          this.objDbServ.ShowLoaders.emit(false);
        }
    );
  }
  GetStationDetail (StationCode) {
    var MyJson = { LoginId: StationCode };
    this.objDbServ.GetStationDetail(MyJson).subscribe(
      (resp: any) => {
        const data = JSON.parse(resp.json());
        sessionStorage.setItem('globalDetail', JSON.stringify(data.Table));
        sessionStorage.setItem('leftMenus', JSON.stringify(data.Table1));
        sessionStorage.setItem('StationMenus', JSON.stringify(data.Table2));
        sessionStorage.setItem('AllStation', JSON.stringify(data.Table3));
      },
      (error) => {alert("Something went wrong.");
       this.objDbServ.ShowLoaders.emit(false);
      }
    )
  }
  OpenReviewWindow(itm){
    var n = itm.StationCode.lastIndexOf('-');
    this.LoginPass = itm.StationCode.substring(n + 1);
    this.login(itm.StationCode,this.LoginPass);
    this.hostPath=window.location.host.toString();
    if(this.hostPath.indexOf('localhost')>-1){  
      window.open('http://localhost:4203/index.html#/EntryDPR', "_blank");
   }
   else if(this.hostPath=='223.30.125.241:9010'){
     window.open('http://223.30.125.241:9010/index.html#/EntryDPR', "_blank");
   }
   else{
     window.open('http://203.101.109.245:9010/index.html#/EntryDPR', "_blank");
   }
  }
  finalRejection(remark) {
    this.itmArray.Reject = true;
        if (!confirm('Do you really want to Reject?'))
            return false;
        if (remark == '') {
            alert('Please enter the Remark.');
            return false;
        }
        var myJson = {  
          StationCode: this.itmArray.StationCode, 
          LoginId: localStorage.getItem('LoginId'), 
          Remark: remark,
          DPREntryDate:this.DPREntryDate
        };
        this.objDbServ.SubmitRejection(myJson).subscribe(
          (resp: any) => {
            this.objDbServ.ShowLoaders.emit(false);
            $('.modal').modal('hide');
            this.getReviewData();
          },
          (error) =>{alert('Something went wrong.');
          this.objDbServ.ShowLoaders.emit(false);
        }
        )  
  }
  showRemarkPopupSendToHO(flag){
    this.reviewpoup = flag;
  }
  SendToHO(remark) {
    var myJson = { 
      LoginId: localStorage.getItem('LoginId'), 
      ControlRoomCode: localStorage.getItem('LoginId'), 
      Remark: remark,
      DPREntryDate:this.DPREntryDate
      }
      if (myJson.Remark == '') {
          alert('Please enter the remarks.')
          return false;
      }
      if (!confirm('Do you want to proceed this to H.O?'))
          return false;
          this.objDbServ.SendToHO(myJson).subscribe(
            (resp: any) => {
              const data = JSON.parse(resp._body); 
              this.reviewpoup = false;
              if (data.Status == '1') {
                alert('Status forwarded to H.O.');
                $('.modal').modal('hide');
                this.getReviewData();
                return false;
            }
            else {
                alert('Status couldn\'t be sent to H.O.');
                $('.modal').modal('hide');
                this.getReviewData();
            }
            },
            (error) =>{alert('Something went wrong.');
            this.objDbServ.ShowLoaders.emit(false);
          }
        )
  }
  GetExeclReportDprMaster(){
    this.objDbServ.ShowLoaders.emit(true);
    var MyJsonExport = {
      LoginID: localStorage.getItem('LoginId'),
      flag: 'DPRMasterCO',
      ControlRoomCode: localStorage.getItem('LoginId'),
      SelectedDate: this.DPREntryDate
     }
    this.objDbServ.GetExeclReportDprMaster(MyJsonExport).subscribe(
      (resp: any) => {
        const data = JSON.parse(resp.json()); 
               if(data)
                {
                  if(JSON.parse(resp.json()).errMsg=='success'){
                    window.location.href = this.objDbServ.apiImageAttachment+"/Attachments/Excel/"+JSON.parse(resp.json()).FileName
                    this.objDbServ.ShowLoaders.emit(false);
                   }
                  else {
                    alert(JSON.parse(resp.json()).errMsg)
                    this.objDbServ.ShowLoaders.emit(false);
                   }
                 }
                 else  {
                  alert('No Report Data Found !');
                  this.objDbServ.ShowLoaders.emit(false);
                }
      },
      (error) =>{alert('Something went wrong.');
      this.objDbServ.ShowLoaders.emit(false);
    }
    )
  }
  sortCol(key:string){
    this.sortingColumn = key;
    if(key == 'PackageCapacity') {
      this.key = '';
      this.arrReviewData.sort(function(a,b){
        return Number(b.PackageCapacity) - Number(a.PackageCapacity) 
        });
        this.reverse = !this.reverse;
    }
    else if(key == 'StationCapacity') {
      this.key = '';
      this.arrReviewData.sort(function(a,b){
        return Number(b.StationCapacity) - Number(a.StationCapacity) 
        });
        this.reverse = !this.reverse;
    }
    else if(key == 'PreviousMonthAverageSale') {
      this.key = '';
      this.arrReviewData.sort(function(a,b){
        return Number(b.PreviousMonthAverageSale) - Number(a.PreviousMonthAverageSale) 
        });
        this.reverse = !this.reverse;
    }
    else if(key == 'TotalGasFilledLCV') {
      this.key = '';
      this.arrReviewData.sort(function(a,b){
        return Number(b.TotalGasFilledLCV) - Number(a.TotalGasFilledLCV) 
        });
        this.reverse = !this.reverse;
    }
    else if(key == 'TotalSaleKG') {
      this.key = '';
      this.arrReviewData.sort(function(a,b){
        return Number(b.TotalSaleKG) - Number(a.TotalSaleKG) 
        });
        this.reverse = !this.reverse;
    }
    else if(key == 'TotalBusGasSale') {
      this.key = '';
      this.arrReviewData.sort(function(a,b){
        return Number(b.TotalBusGasSale) - Number(a.TotalBusGasSale) 
        });
        this.reverse = !this.reverse;
    }
    else if(key == 'NumberOfLcv') {
      this.key = '';
      this.arrReviewData.sort(function(a,b){
        return Number(b.NumberOfLcv) - Number(a.NumberOfLcv) 
        });
        this.reverse = !this.reverse;
    }
    else if(key == 'NumberOfBusses') {
      this.key = '';
      this.arrReviewData.sort(function(a,b){
        return Number(b.NumberOfBusses) - Number(a.NumberOfBusses) 
        });
        this.reverse = !this.reverse;
    }
    else if(key == 'UTILIZATION') {
      this.key = '';
      this.arrReviewData.sort(function(a,b){
        return Number(b.UTILIZATION) - Number(a.UTILIZATION) 
        });
        this.reverse = !this.reverse;
    }
    else {
      this.key = key;
      this.reverse = !this.reverse;
    } 
  }
}
