import { Component, HostBinding, Input } from '@angular/core';
import { Http, Response} from '@angular/http';
import { dbService } from '../../Service/db.service';
declare var $:any;
@Component({
  selector: 'app-dispencer-entry-side-bar',
  templateUrl: './dispencer-entry-side-bar.component.html',
  styleUrls: ['./dispencer-entry-side-bar.component.css']
})
export class DispencerEntrySideBarComponent  {
  @HostBinding('class.is-open') @Input()
  isOpen = false;
  StationShift:{ShiftId:string,SubShiftId:string,ActiveTab:string}
  detailsStation:{StationId:string,SummeryDate:string,UserId:string}
  DDate:String='';
  DStation:String='';
  glovalJson:any = JSON.parse(sessionStorage.getItem('globalDetail'));
  IsFinanceTabsDisable:boolean=false;
  CompanyName: string;
  dCompany: boolean = false;
  selectedStation: any;
  values:{}[];
  constructor(private objDbServ: dbService) {
    this.objDbServ.ShiftDetails.subscribe(
      (test1: {ShiftId:string,SubShiftId:string,ActiveTab:string}) => 
      {
        this.StationShift =test1;
      }
    );
    this.objDbServ.StationDetails.subscribe(
      (test: {StationId:string,SummeryDate:string,UserId:string}) => 
      {
        this.detailsStation =test;
        this.selectedStation = test.StationId;
        this.DDate=this.detailsStation.SummeryDate;
        this.GetStationCompany();
      }
    );
    this.objDbServ.IsCompanyValid.subscribe(value=>{
      this.IsFinanceTabsDisable = value;
    })
   }
  ngOnInit() {
    this.backgrounddisble();  
  }
  backgrounddisble(){
    $(function() {
      $('[data-popup-open]').on('click', function(e) {
        var targeted_popup_class = $(this).attr('data-popup-open');
        $('[data-popup="' + targeted_popup_class + '"]').fadeIn(350);
        e.preventDefault();
      });
      $('[data-popup-close]').on('click', function(e) {
        var targeted_popup_class = $(this).attr('data-popup-close');
        $('[data-popup="' + targeted_popup_class + '"]').fadeOut(350);
        e.preventDefault();
      });
    });
  }
  ClosePopup(shouldOpen: boolean) {
    $('.nav-tabs >').first('li').find('a').trigger('click');
    this.isOpen = !this.isOpen;
    this.objDbServ.DispencerPopup.emit(false);
  }
  GetActiveTab(TabName){
    this.objDbServ.ShiftDetails.emit({
      ShiftId:this.StationShift.ShiftId,
      SubShiftId:this.StationShift.SubShiftId,
      ActiveTab:TabName
    }); 
    if(TabName=='Summary'){
    }
  }
  getlist11(){
    var obj={
      StationId:this.detailsStation.StationId,
      Date:this.detailsStation.SummeryDate
    }
    this.objDbServ.ECDCreditList(obj).subscribe(
      (resp: Response) => {
        this.values=JSON.parse(resp.json()).Table
      },
      (error) => {alert("Something went wrong.");
      this.objDbServ.ShowLoaders.emit(false);
      }
    )
  }
  GetStationCompany() {
    this.objDbServ.GetStationCompany({Flag: 'CompanyByStation', Id: this.selectedStation, Status:1}).subscribe(
      (resp: any) => {
        this.CompanyName=JSON.parse(resp.json()).Table[0].CompanyName;
        this.CheckCompany();      
      },
      (error) => {alert("Something went wrong.");
       this.objDbServ.ShowLoaders.emit(false);
      }
    )
  }
  CheckCompany() {
    if(this.CompanyName == 'DODO') {
      this.dCompany = false;
    }
    else {
      this.dCompany = true;
   }     
  }
}
