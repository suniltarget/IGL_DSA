import { BrowserModule } from '@angular/platform-browser';
import { NgModule, OnInit } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { Ng2OrderModule } from 'ng2-order-pipe';
import { FilterSearchPipe } from './Filters/filter-search.pipe';
import { analyzeFile } from '@angular/compiler';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RouterModule, Routes } from '@angular/router';
import { NgDatepickerModule, DatepickerOptions } from 'ng2-datepicker';
import * as enLocale from 'date-fns/locale/en';
import { NgxPaginationModule } from 'ngx-pagination';
import { HeaderComponent } from './header/header.component'
import { LeftPaneComponent } from './left-pane/left-pane.component';
import { dbService } from './Service/db.service';
import { DipenserReadingComponent } from './Station/dipenser-reading/dipenser-reading.component';
import { DispenserMasterComponent } from './HO/dispenser-master/dispenser-master.component';
import { SummaryComponent } from './HO/summary/summary.component';
import { MktofficemgmntlistComponent } from './HO/mktofficemgmntlist/mktofficemgmntlist.component';
import { StationmasterlistComponent } from './HO/stationmasterlist/stationmasterlist.component';
import { RateManagemntComponent } from './HO/rate-managemnt/rate-managemnt.component';
import { RegionManagementComponent } from './HO/region-management/region-management.component';
import { AttachmentComponent } from './Station/attachment/attachment.component';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { BankDepositComponent } from './Station/bank-deposit/bank-deposit.component';
import { OtherSalesComponent } from './Station/other-sales/other-sales.component';
import { AddPaymentComponent } from './Station/add-payment/add-payment.component';
import { StationDetailComponent } from './HO/station-detail/station-detail.component';
import { DashBoardComponent } from './HO/dash-board/dash-board.component';
import { DispencerEntrySideBarComponent } from './Station/dispencer-entry-side-bar/dispencer-entry-side-bar.component';
import { ActivityLogComponent } from './HO/activity-log/activity-log.component';
import { RouteGuardService } from './Service/RouteGuard.service';
import { ReportMasterComponent } from './HO/report-master/report-master.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { TestPageComponent } from './HO/test-page/test-page.component';
import { DPRDashboardComponent } from './HO/dpr-dashboard/dpr-dashboard.component';
import { DPRControlOfficeComponent } from './HO/dpr-control-office/dpr-control-office.component';
import { DPRMeterSkidComponent } from './HO/dpr-meter-skid/dpr-meter-skid.component';
import { DPRPackageComponent } from './HO/dpr-package/dpr-package.component';
import { DPRLCVComponent } from './HO/dpr-lcv/dpr-lcv.component';
import { DPRGasGensetComponent } from './HO/dpr-gas-genset/dpr-gas-genset.component';
import { DPRDprSortingComponent } from './HO/dpr-dpr-sorting/dpr-dpr-sorting.component';
import { DPRRejectStationComponent } from './HO/dpr-reject-station/dpr-reject-station.component';
import { MeterSkidComponent } from './Station/meter-skid/meter-skid.component';
import { PackageComponent } from './Station/package/package.component';
import { DispenserComponent } from './Station/dispenser/dispenser.component';
import { LCVComponent } from './Station/lcv/lcv.component';
import { GasGensetComponent } from './Station/gas-genset/gas-genset.component';
import { GeneralEntryComponent } from './Station/general-entry/general-entry.component';
import { StationSummaryComponent } from './Station/station-summary/station-summary.component';
import { ReviewsComponent } from './HO/reviews/reviews.component';
import { ActivityLogDprComponent } from './HO/activity-log-dpr/activity-log-dpr.component';
import { DPRReportComponent } from './HO/dpr-report/dpr-report.component';
import { DashboardCOComponent } from './HO/dashboard-co/dashboard-co.component';
import { DPRAttachmentComponent } from './Station/dpr-attachment/dpr-attachment.component';
import { DSAStationSummaryComponent } from './Station/dsa-station-summary/dsa-station-summary.component';
import { DSADSMMasterComponent } from './HO/dsa-dsm-master/dsa-dsm-master.component';
import { DPREntyComponent } from './Station/dpr-enty/dpr-enty.component';
import { DatePipe } from '@angular/common';
import { DispenserEntryComponent } from './Station/dispenser-entry/dispenser-entry.component';
import { UsersMasterComponent } from './HO/users-master/users-master.component';
import { DSASortingComponent } from './HO/dsa-sorting/dsa-sorting.component';
import { DSAMailEscalationComponent } from './HO/dsa-mail-escalation/dsa-mail-escalation.component';
import { DsaSummaryComponent } from './Station/dsa-summary/dsa-summary.component';
import { StationStatusComponent } from './HO/station-status/station-status.component';
import { JumpReportSystemComponent } from './HO/jump-report-system/jump-report-system.component';
import { PaymentModeMgtComponent } from './HO/payment-mode-mgt/payment-mode-mgt.component';
import { StationAttachmenttComponent } from './Station/station-attachmentt/station-attachmentt.component';
import { EntryThreshholdComponent } from './HO/entry-threshhold/entry-threshhold.component';
import { IssuesresponseComponent } from './developeruse/issuesresponse/issuesresponse.component';
import { CashReconciliationComponent } from './HO/cash-reconciliation/cash-reconciliation.component';
import { GasReconciliationComponent } from './HO/gas-reconciliation/gas-reconciliation.component';
import { DsaStationSummary2Component } from './HO/dsa-station-summary2/dsa-station-summary2.component';
import { ClusterCompanyComponent } from './HO/cluster-company/cluster-company.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { DSMAttendenceComponent } from './Station/dsm-attendence/dsm-attendence.component';
import { ExcelImportComponent } from './HO/excel-import/excel-import.component';
import { ControlStationMapComponent } from './HO/Control-Station-Map/control-station-map.component';
import { DailyDPRMailComponent } from './HO/daily-dprmail/daily-dprmail.component';
import { DispUnlockComponent } from './HO/disp-unlock/disp-unlock.component';
import { JMRStationsComponent } from './Station/jmr-stations/jmr-stations.component';
import { calendar, getCalendarFormat } from 'ngx-bootstrap/chronos/moment/calendar';
import { JMRCOComponent } from './HO/jmr-co/jmr-co.component';
import { JMRAMOComponent } from './HO/jmr-amo/jmr-amo.component';
import { JMRDashboardComponent } from './HO/jmr-dashboard/jmr-dashboard.component';
import { SAPJMRComponent } from './HO/sap-jmr/sap-jmr.component';
import { DSAEntryUnlockComponent } from './HO/dsaentry-unlock/dsaentry-unlock.component';
import { ECDCreditComponent } from './Station/ecdcredit/ecdcredit.component';
import { ECDMasterComponent } from './HO/ecdmaster/ecdmaster.component';
import { LCVvehicleComponent } from './Station/lcvvehicle/lcvvehicle.component';
import { DocumentListComponent } from './HO/document-list/document-list.component';
const appRoutes = [
  { path: '', component: LoginComponent },
  { path: 'Mom', component: MktofficemgmntlistComponent, canActivate: [RouteGuardService] },
  { path: 'StationMaster', component: StationmasterlistComponent, canActivate: [RouteGuardService] },
  { path: 'DispenserMaster', component: DispenserMasterComponent, canActivate: [RouteGuardService] },
  { path: 'RateManagemnt', component: RateManagemntComponent, canActivate: [RouteGuardService] },
  { path: 'Summary', component: SummaryComponent, canActivate: [RouteGuardService] },
  { path: 'DispenserReading', component: DipenserReadingComponent, canActivate: [RouteGuardService] },
  { path: 'PaymentCollection', component: AddPaymentComponent, canActivate: [RouteGuardService] },
  { path: 'OtherSales', component: OtherSalesComponent, canActivate: [RouteGuardService] },
  { path: 'AttachmentStation', component: AttachmentComponent, canActivate: [RouteGuardService] },
  { path: 'BankDeposit', component: BankDepositComponent, canActivate: [RouteGuardService] },
  { path: 'RegionManagement', component: RegionManagementComponent, canActivate: [RouteGuardService] },
  { path: 'StationDetail', component: StationDetailComponent, canActivate: [RouteGuardService] },
  { path: 'DashBoard', component: DashBoardComponent, canActivate: [RouteGuardService] },
  { path: 'Activity', component: ActivityLogComponent, canActivate: [RouteGuardService] },
  { path: 'Report', component: ReportMasterComponent, canActivate: [RouteGuardService] },
  { path: 'TestOnly', component: TestPageComponent, canActivate: [RouteGuardService] },
  { path: 'DPRDashboard', component: DPRDashboardComponent, canActivate: [RouteGuardService] },
  { path: 'ControlOffice', component: DPRControlOfficeComponent, canActivate: [RouteGuardService] },
  { path: 'MeterSkid', component: DPRMeterSkidComponent, canActivate: [RouteGuardService] },
  { path: 'Package', component: DPRPackageComponent, canActivate: [RouteGuardService] },
  { path: 'LCV', component: DPRLCVComponent, canActivate: [RouteGuardService] },
  { path: 'GasGenset', component: DPRGasGensetComponent, canActivate: [RouteGuardService] },
  { path: 'DPRSorting', component: DPRDprSortingComponent, canActivate: [RouteGuardService] },
  { path: 'DPRRejectStation', component: DPRRejectStationComponent, canActivate: [RouteGuardService] },
  { path: 'MeterSkidS', component: MeterSkidComponent, canActivate: [RouteGuardService] },
  { path: 'PackageS', component: PackageComponent, canActivate: [RouteGuardService] },
  { path: 'DispenserS', component: DispenserComponent, canActivate: [RouteGuardService] },
  { path: 'LCVS', component: LCVComponent, canActivate: [RouteGuardService] },
  { path: 'GasGensetS', component: GasGensetComponent, canActivate: [RouteGuardService] },
  { path: 'GeneralEntryS', component: GeneralEntryComponent, canActivate: [RouteGuardService] },
  { path: 'AttachmentsS', component: DPRAttachmentComponent, canActivate: [RouteGuardService] },
  { path: 'StationSummaryS', component: StationSummaryComponent, canActivate: [RouteGuardService] },
  { path: 'ReviewsCO', component: ReviewsComponent, canActivate: [RouteGuardService] },
  { path: 'ActivityLogDPR', component: ActivityLogDprComponent, canActivate: [RouteGuardService] },
  { path: 'DPRReportManagement', component: DPRReportComponent, canActivate: [RouteGuardService] },
  { path: 'DashboardCO', component: DashboardCOComponent, canActivate: [RouteGuardService] },
  { path: 'DSMMaster', component: DSADSMMasterComponent, canActivate: [RouteGuardService] },
  { path: 'EntryDPR', component: DPREntyComponent, canActivate: [RouteGuardService] },
  { path: 'DSAStationSummary', component: DSAStationSummaryComponent, canActivate: [RouteGuardService] },
  { path: 'DispenserEntry', component: DispenserEntryComponent, canActivate: [RouteGuardService] },
  { path: 'UsersManagement', component: UsersMasterComponent, canActivate: [RouteGuardService] },
  { path: 'DSASorting', component: DSASortingComponent, canActivate: [RouteGuardService] },
  { path: 'MailEscalation', component: DSAMailEscalationComponent, canActivate: [RouteGuardService] },
  { path: 'StationStatus', component: StationStatusComponent, canActivate: [RouteGuardService] },
  { path: 'JumpReadingSystem', component: JumpReportSystemComponent, canActivate: [RouteGuardService] },
  { path: 'PaymentManagement', component: PaymentModeMgtComponent, canActivate: [RouteGuardService] },
  { path: 'StationAttachment', component: StationAttachmenttComponent, canActivate: [RouteGuardService] },
  { path: 'EntryThreshHold', component: EntryThreshholdComponent, canActivate: [RouteGuardService] },
  { path: 'IssueResponse', component: IssuesresponseComponent },
  { path: 'CashReconciliation', component: CashReconciliationComponent, canActivate: [RouteGuardService] },
  { path: 'GasReconciliation', component: GasReconciliationComponent, canActivate: [RouteGuardService] },
  { path: 'SumaryDSAI', component: DsaStationSummary2Component, canActivate: [RouteGuardService] },
  { path: 'ClusterCompany', component: ClusterCompanyComponent, canActivate: [RouteGuardService] },
  { path: 'DSMAttendance', component: DSMAttendenceComponent, canActivate: [RouteGuardService] },
  { path: 'ExcelImport', component: ExcelImportComponent, canActivate: [RouteGuardService] },
  { path: 'ControlStationMap', component: ControlStationMapComponent, canActivate: [RouteGuardService] },
  { path: 'DailyDPR', component: DailyDPRMailComponent, canActivate: [RouteGuardService] },
  { path: 'DispUnlock', component: DispUnlockComponent, canActivate: [RouteGuardService] },
  { path: 'JMRStations', component: JMRStationsComponent, canActivate: [RouteGuardService] },
  { path: 'JMRCO', component: JMRCOComponent, canActivate: [RouteGuardService] },
  { path: 'JMRAMO', component: JMRAMOComponent, canActivate: [RouteGuardService] },
  { path: 'JMRDashBoard', component: JMRDashboardComponent, canActivate: [RouteGuardService] },
  { path: 'SAPJMR', component: SAPJMRComponent, canActivate: [RouteGuardService] },
  { path: 'DSAEntryUnlock', component: DSAEntryUnlockComponent, canActivate: [RouteGuardService] },
  { path: 'ECDCredit', component: OtherSalesComponent, canActivate: [RouteGuardService] },
  { path: 'ECDMaster', component: ECDMasterComponent, canActivate: [RouteGuardService] },
  { path: 'LCVvehicle', component: LCVvehicleComponent, canActivate: [RouteGuardService] },
  { path: 'StationDocuments', component: DocumentListComponent, canActivate: [RouteGuardService] },
];
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DipenserReadingComponent,
    DispenserMasterComponent,
    HeaderComponent,
    LeftPaneComponent,
    SummaryComponent,
    MktofficemgmntlistComponent,
    StationmasterlistComponent,
    FilterSearchPipe,
    RateManagemntComponent,
    AttachmentComponent,
    BankDepositComponent,
    OtherSalesComponent,
    AddPaymentComponent,
    RegionManagementComponent,
    StationDetailComponent,
    DashBoardComponent,
    DispencerEntrySideBarComponent,
    ActivityLogComponent,
    ReportMasterComponent,
    TestPageComponent,
    DPRDashboardComponent,
    DPRControlOfficeComponent,
    DPRMeterSkidComponent,
    DPRPackageComponent,
    DPRLCVComponent,
    DPRGasGensetComponent,
    DPRDprSortingComponent,
    DPRRejectStationComponent,
    MeterSkidComponent,
    PackageComponent,
    DispenserComponent,
    LCVComponent,
    GasGensetComponent,
    GeneralEntryComponent,
    StationSummaryComponent,
    ReviewsComponent,
    ActivityLogDprComponent,
    DPRReportComponent,
    DashboardCOComponent,
    DPRAttachmentComponent,
    DSAStationSummaryComponent,
    DSADSMMasterComponent,
    DPREntyComponent,
    DispenserEntryComponent,
    UsersMasterComponent,
    DSASortingComponent,
    DSAMailEscalationComponent,
    DsaSummaryComponent,
    StationStatusComponent,
    JumpReportSystemComponent,
    PaymentModeMgtComponent,
    StationAttachmenttComponent,
    EntryThreshholdComponent,
    IssuesresponseComponent,
    CashReconciliationComponent,
    GasReconciliationComponent,
    DsaStationSummary2Component,
    ClusterCompanyComponent,
    DSMAttendenceComponent,
    ExcelImportComponent,
    ControlStationMapComponent,
    DailyDPRMailComponent,
    DispUnlockComponent,
    JMRStationsComponent,
    JMRCOComponent,
    JMRAMOComponent,
    JMRDashboardComponent,
    SAPJMRComponent,
    DSAEntryUnlockComponent,
    ECDCreditComponent,
    ECDMasterComponent,
    LCVvehicleComponent,
    DocumentListComponent,
  ],
  imports: [
    RouterModule.forRoot(appRoutes),
    BrowserModule, HttpModule,
    FormsModule, AngularFontAwesomeModule, Ng2OrderModule,
    NgDatepickerModule,
    Ng2SearchPipeModule,
    NgMultiSelectDropDownModule,
    NgxPaginationModule,
  ],
  providers: [dbService, CookieService, { provide: LocationStrategy, useClass: HashLocationStrategy },
    RouteGuardService, DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule implements OnInit {
  ngOnInit() {
  }
}
