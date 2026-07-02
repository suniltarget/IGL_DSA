import { Injectable, EventEmitter, OnInit } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { Console } from '@angular/core/src/console';
import { isUndefined } from 'util';
import { retry } from 'rxjs/operators/retry';
import { BehaviorSubject } from 'rxjs';
import { ResponseContentType } from '@angular/http';
declare var $: any;
@Injectable()
export class dbService implements OnInit {
    hostPath: string = window.location.host.toString();
    apiUrl = 'http://localhost:56888/api/';
    apiImageAttachment = 'http://localhost:56888/';
    ngOnInit() {
    }
    globalUserid: string = '';
    MasterCompDisplay = new EventEmitter<boolean>();
    ShowLoaders = new EventEmitter<boolean>();
    ShowProgress = new EventEmitter<boolean>();
    ShowBorder = new EventEmitter<boolean>();
    SelectMenu = new EventEmitter<string>();
    StationDetails = new EventEmitter<{}>();
    ShiftDetails = new EventEmitter<{}>();
    RegionList = new EventEmitter<{}>();
    DispencerPopup = new EventEmitter<boolean>();
    HeaderDisplay = new EventEmitter<boolean>();
    LeftMenu = new EventEmitter<boolean>();
    globalValues: any = [];
    imgShow: string = "";
    rootPermission: string = "";
    showLoader: any = [];
    iAmPopup: boolean = false;
    MenuJson: any = [];
    MenuStation: any = [];
    GlobalDetail: any = [];
    todayDate: string = "";
    imgBaseUrl: string = 'http://localhost:56888/Attachments/';
    highlight: string = '';
    IsCompanyValid = new EventEmitter<boolean>();
    IsBankDepositValid = new EventEmitter<boolean>();
    lockUnlock = new EventEmitter<boolean>();
    lockUnlockSOP = new EventEmitter<boolean>(true);
    CurrentTime: any;
    CurrentSeconds: any;
    IsShiftIdPending = new EventEmitter<Number>();
    LockDate = new BehaviorSubject<string>('');
    TestVar = new BehaviorSubject("ABC");
    IsTimeOver = new BehaviorSubject<boolean>(false);
    SubmittedBySOFlag = new EventEmitter<boolean>();
    Numbertest: any;
    lockUnlockDispenserEntry = new BehaviorSubject<boolean>(false);
    lockUnlockShiftId = new BehaviorSubject<number>(0);
    GlovalValues() {
        this.globalValues = {
            imgBaseUrl: this.imgBaseUrl,
            imgShow: this.imgShow
        };
        this.rootPermission = JSON.parse(sessionStorage.getItem('globalDetail')).prm_id;
        this.showLoader = { value: false };
        var objQS = "";
        var path = window.location.hash;
        path = path.substring(1);
        if (isUndefined(sessionStorage.getItem('StationMenus'))) {
            this.MenuStation = JSON.parse(sessionStorage.getItem('StationMenus'));
        }
        return this.globalValues;
    }
    constructor(private objHttp: Http, private objCook: CookieService) {
        this.hostPath = window.location.host.toString();
        if (this.hostPath.indexOf('localhost') > -1) {
            this.apiUrl = 'http://localhost:9758/api/';
            this.apiImageAttachment = 'http://localhost:9758';
        }
        else {
            this.apiUrl = 'https://igldpr.igl.co.in/api/';
            this.apiImageAttachment = 'https://igldpr.igl.co.in/';
            // this.apiUrl = 'http://45.119.10.174:9011/api/';
            // this.apiImageAttachment = 'http://45.119.10.174:9011/';
        }
    }
    CommonGetData(obj: {}) {
        return this.objHttp.post(this.apiUrl + 'DSA/' + 'CommonGetData', obj);
    }
    getSummaryHO(obj: {}) {
        return this.objHttp.post(this.apiUrl + 'DSA/' + 'getSummaryHO', obj);
    }
    getSummaryHOForAdmin(obj: {}) {
        return this.objHttp.post(this.apiUrl + 'DSA/' + 'getSummaryHOForAdmin', obj);
    }
    login(objLogin: {}) {
        return this.objHttp.post(this.apiUrl + 'DSA/' + 'ValidateUser', objLogin);
    }
    getHeaders(objUserId: {}) {
        return this.objHttp.post(this.apiUrl + 'DSA/' + 'getHeader', objUserId);
    }
    getMenus(objUserId: {}) {
        return this.objHttp.post(this.apiUrl + 'DSA/' + 'getMenu', objUserId);
    }
    isAthenticated(nextURL: string) {
        const promise = new Promise(
            (resolve, reject) => {
                this.getMenus({ UserID: this.objCook.get('UID') }).subscribe(
                    (response: Response) => {
                        const mnu = JSON.parse(response.json()).Table;
                        const IsFound = mnu.find(x => x.URL == nextURL);
                        const retValue = '';
                        if (IsFound != undefined)
                            resolve(true);
                        else
                            resolve(false);
                    },
                    (error) => { alert('something went wrong.'); }
                );
            }
        )
        return promise;
    }
    getDSASortingData(obj: {}) {
        return this.objHttp.post(this.apiUrl + 'DSA/' + 'getDSASortingData', obj);
    }
    SaveDSASorting(obj: {}) {
        return this.objHttp.post(this.apiUrl + 'DSA/' + 'SaveDSASorting', obj);
    }
    RegionInsertUpdate(obj: {}) {
        return this.objHttp.post(this.apiUrl + 'DSA/' + 'RegionInsertUpdate', obj);
    }
    addMktOffice(objMktOffice: {}) {
        return this.objHttp.post(this.apiUrl + 'DSA/' + 'MOInsertUpdate', objMktOffice);
    }
    getMktOffice(objMomList: {}) {
        return this.objHttp.post(this.apiUrl + 'DSA/' + 'CommonGetData', objMomList);
    }
    addSoOffice(objSoOffice: {}) {
        return this.objHttp.post(this.apiUrl + 'DSA/' + 'SOInsertUpdate', objSoOffice);
    }
    getSoOffice(objSoList: {}) {
        return this.objHttp.post(this.apiUrl + 'DSA/' + 'CommonGetData', objSoList);
    }
    addDispenser(obj: {}) {
        return this.objHttp.post(this.apiUrl + 'DSA/' + 'DispencerMaster', obj);
    }
    getDispList(obj: {}) {
        return this.objHttp.post(this.apiUrl + 'DSA/' + 'CommonGetData', obj);
    }
    GetStationCompany(obj: {}) {
        return this.objHttp.post(this.apiUrl + 'DSA/' + 'CommonGetData', obj);
    }
    GetDispHistory(obj: {}) {
        return this.objHttp.post(this.apiUrl + 'DSA/' + 'CommonGetData', obj);
    }
    addRateMaster(objSoOffice: {}) {
        return this.objHttp.post(this.apiUrl + 'DSA/' + 'RateMaster', objSoOffice);
    }
    getRateMaster(objSoList: {}) {
        return this.objHttp.post(this.apiUrl + 'DSA/' + 'CommonGetData', objSoList);
    }
    getDSMMaster(objSoList: {}) {
        return this.objHttp.post(this.apiUrl + 'DSA/' + 'CommonGetData', objSoList);
    }
    getStation(objSoList: {}) {
        return this.objHttp.post(this.apiUrl + 'DSA/' + 'CommonGetData', objSoList);
    }
    InsertUpdateDSM(objSoList: {}) {
        return this.objHttp.post(this.apiUrl + 'DSA/' + 'InsertUpdateDSM', objSoList);
    }
    checkDSMByDay(objSoList: {}) {
        return this.objHttp.post(this.apiUrl + 'DSA/' + 'checkDSMByDay', objSoList);
    }
    getAlluserDetsils(objSoList: {}) {
        return this.objHttp.post(this.apiUrl + 'DSA/' + 'CommonGetData', objSoList);
    }
    getPermision(objSoList: {}) {
        return this.objHttp.post(this.apiUrl + 'DSA/' + 'CommonGetData', objSoList);
    }
    InsertUser(obj: {}) {
        return this.objHttp.post(this.apiUrl + 'DSA/' + 'insertUpdateUserMaster', obj);
    }
    UpdateUser(obj: {}) {
        return this.objHttp.post(this.apiUrl + 'DSA/' + 'insertUpdateUserMaster', obj);
    }
    insertMailEscaltion(obj: {}) {
        return this.objHttp.post(this.apiUrl + 'DSA/' + 'insertUpdateMailEscaltion', obj);
    }
    updateMailEscaltion(obj: {}) {
        return this.objHttp.post(this.apiUrl + 'DSA/' + 'insertUpdateMailEscaltion', obj);
    }
    getJumpReadingData(obj: {}) {
        return this.objHttp.post(this.apiUrl + 'DSA/' + 'CommonGetData', obj);
    }
    UpdateJumpReadingStatusByRole(obj: {}) {
        return this.objHttp.post(this.apiUrl + 'DSA/' + 'UpdateJumpReadingStatusByRole', obj);
    }
    InsertRemarkByInstrumental(obj: {}) {
        return this.objHttp.post(this.apiUrl + 'DSA/' + 'InsertRemarkByInstrumental', obj);
    }
    JumpReadingCertificate(obj: {}) {
        return this.objHttp.post(this.apiUrl + 'DSA/' + 'JumpReadingCertificate', obj);
    }
    DispenserEntryMaster(obj: {}) {
        return this.objHttp.post(this.apiUrl + 'DSA/' + 'DispenserEntryMaster', obj);
    }
    CheckDispencerLockUnlockStatus(obj: {}) {
        return this.objHttp.post(this.apiUrl + 'DSA/' + 'CheckDispencerLockUnlockStatus', obj);
    }
    DispenserUnlock(obj: {}) {
        return this.objHttp.post(this.apiUrl + 'DSA/' + 'DispenserUnlock', obj);
    }
    SaveJumpReading(frmData: FormData) {
        var api = this.apiUrl + 'DSA/' + 'DispenserJumpMaster';
        return this.objHttp.post(api, frmData);
    }
    DeleteJumpReading(obj: {}) {
        return this.objHttp.post(this.apiUrl + 'DSA/' + 'DeleteJumpReading', obj);
    }
    GetReadingbyShift(obj: {}) {
        return this.objHttp.post(this.apiUrl + 'DSA/' + 'GetReadingbyShift', obj);
    }
    GetJumpReadingByShift(obj: {}) {
        return this.objHttp.post(this.apiUrl + 'DSA/' + 'GetJumpReadingByShift', obj);
    }
    GetPaymentByShift(obj: {}) {
        return this.objHttp.post(this.apiUrl + 'DSA/' + 'GetPaymentByShift', obj);
    }
    GetOtherPaymentByShift(obj: {}) {
        return this.objHttp.post(this.apiUrl + 'DSA/' + 'GetOtherPaymentByShift', obj);
    }
    PaymentCollection(obj: {}) {
        return this.objHttp.post(this.apiUrl + 'DSA/' + 'DispenserPaymentCollection', obj);
    }
    OtherPaymentCollection(frmData: FormData) {
        var api = this.apiUrl + 'DSA/' + 'DispenserOtherPaymentCollection';
        return this.objHttp.post(api, frmData);
    }
    BankDepositPaymentCollection(obj: {}) {
        return this.objHttp.post(this.apiUrl + 'DSA/' + 'BankDepositPaymentCollection', obj);
    }
    GetDenominationsData(obj: {}) {
        return this.objHttp.post(this.apiUrl + 'DSA/' + 'GetDenominationsData', obj);
    }
    uploadAttachment(frmData: FormData) {
        return this.objHttp.post(this.apiUrl + 'DSA/' + 'uploadAttachment', frmData);
    }
    RequestForChagePassword(obj: {}) {
        return this.objHttp.post(this.apiUrl + 'DSA/' + 'PasswordNotification', obj);
    }
    UpdatePassword(obj: {}) {
        return this.objHttp.post(this.apiUrl + 'DSA/' + 'UpdatePassword', obj);
    }
    ExcelExportDSA(obj: {}) {
        return this.objHttp.post(this.apiUrl + 'DSA/' + 'ExcelExportDSA', obj);
    }
    ExcelExportDSAForHTML(obj: {}) {
        return this.objHttp.post(this.apiUrl + 'DSA/' + 'ExcelExportDSAForHTML', obj);
    }
    ExcelExportDSASec(obj: {}) {
        return this.objHttp.post(this.apiUrl + 'DSA/' + 'ExcelExportDSASec', obj);
    }
    getStationSummaryData(obj: {}) {
        return this.objHttp.post(this.apiUrl + 'DSA/' + 'getSummaryHO', obj);
    }
    InsertSOPMONotifiaction(obj: {}) {
        return this.objHttp.post(this.apiUrl + 'DSA/' + 'InsertSOPMONotifiaction', obj);
    }
    InsertStationStatus(obj: {}) {
        return this.objHttp.post(this.apiUrl + 'DSA/' + 'InsertStationStatus', obj);
    }
    InsertAttendance(obj: {}) {
        return this.objHttp.post(this.apiUrl + 'DSA/' + 'InsertAttendance', obj);
    }
    GetStationDetail(obj: {}) {
        var api = this.apiUrl + 'ApiService/' + 'GetStationDetail';
        return this.objHttp.post(api, obj);
    }
    getCRooms(obj: {}) {
        var api = this.apiUrl + 'ApiService/' + 'getCRooms';
        return this.objHttp.post(api, obj);
    }
    InsertCRoom(obj: {}) {
        var api = this.apiUrl + 'ApiService/' + 'insertCRoom';
        return this.objHttp.post(api, obj);
    }
    UnsertCRoom(obj: {}) {
        var api = this.apiUrl + 'ApiService/' + 'updateCRoom';
        return this.objHttp.post(api, obj);
    }
    getMeterSkid(obj: {}) {
        var api = this.apiUrl + 'ApiService/' + 'GetMeterSkidMaster';
        return this.objHttp.post(api, obj);
    }
    InsertMeterSkid(obj: {}) {
        var api = this.apiUrl + 'ApiService/' + 'insertMeterSkidMaster';
        return this.objHttp.post(api, obj);
    }
    UpdateMeterSkid(obj: {}) {
        var api = this.apiUrl + 'ApiService/' + 'updateMeterSkidMaster';
        return this.objHttp.post(api, obj);
    }
    getPackages(obj: {}) {
        var api = this.apiUrl + 'ApiService/' + 'GetPackageMaster';
        return this.objHttp.post(api, obj);
    }
    InsertPackages(obj: {}) {
        var api = this.apiUrl + 'ApiService/' + 'insertPackageMaster';
        return this.objHttp.post(api, obj);
    }
    PackageHoldResetReading(frmData: FormData) {
        var api = this.apiUrl + 'ApiService/' + 'HoldResetReading';
        return this.objHttp.post(api, frmData);
    }
    UpdatePackages(obj: {}) {
        var api = this.apiUrl + 'ApiService/' + 'updatePackageMaster';
        return this.objHttp.post(api, obj);
    }
    getLCV(obj: {}) {
        var api = this.apiUrl + 'ApiService/' + 'GetLcvMaster';
        return this.objHttp.post(api, obj);
    }
    InsertLCV(obj: {}) {
        var api = this.apiUrl + 'ApiService/' + 'insertLcvMaster';
        return this.objHttp.post(api, obj);
    }
    UpdateLCV(obj: {}) {
        var api = this.apiUrl + 'ApiService/' + 'updateLcvMaster';
        return this.objHttp.post(api, obj);
    }
    getGenSet(obj: {}) {
        var api = this.apiUrl + 'ApiService/' + 'GetGensetMaster';
        return this.objHttp.post(api, obj);
    }
    InsertGenSet(obj: {}) {
        var api = this.apiUrl + 'ApiService/' + 'insertGensetMaster';
        return this.objHttp.post(api, obj);
    }
    UpdateGenSet(obj: {}) {
        var api = this.apiUrl + 'ApiService/' + 'updateGensetMaster';
        return this.objHttp.post(api, obj);
    }
    getRejectDetails(obj: {}) {
        var api = this.apiUrl + 'ApiService/' + 'GetStationsByAdmin';
        return this.objHttp.post(api, obj);
    }

    loadControlRooms(obj: {}) {
        var api = this.apiUrl + 'ApiService/' + 'GetConrolRooms';
        return this.objHttp.post(api, obj);
    }

    getStationMeterSkidApi(obj: {}) {
        var api = this.apiUrl + 'ApiService/' + 'GetStationMeterSkid';
        return this.objHttp.post(api, obj);
    }
    getSortingData(obj: {}) {
        var api = this.apiUrl + 'ApiService/' + 'GetSortingData';
        return this.objHttp.post(api, obj);
    }
    SaveDPRSorting(obj: {}) {
        var api = this.apiUrl + 'ApiService/' + 'saveSortingData';
        return this.objHttp.post(api, obj);
    }
    GetDPRActivityLog(obj: {}) {
        var api = this.apiUrl + 'ApiService/' + 'GetActivityLog';
        return this.objHttp.post(api, obj);
    }
    getDPRDashboardHOApi(obj: {}) {
        var api = this.apiUrl + 'ApiService/' + 'GetDashBoardHO';
        return this.objHttp.post(api, obj);
    }
    getReviewData(obj: {}) {
        var api = this.apiUrl + 'ApiService/' + 'GetStationsByCR';
        return this.objHttp.post(api, obj);
    }
    insertStationSkidApi(frmData: FormData) {
        var api = this.apiUrl + 'ApiService/' + 'InsertMeterSkid';
        return this.objHttp.post(api, frmData);
    }
    getStationReportApi(obj: {}) {
        var api = this.apiUrl + 'ApiService/' + 'GetStationReport';
        return this.objHttp.post(api, obj);
    }
    getFinalSubmitStation(obj: {}) {
        var api = this.apiUrl + 'ApiService/' + 'FinalSubmit';
        return this.objHttp.post(api, obj);
    }
    getStationDetails(obj: {}) {
        var api = this.apiUrl + 'ApiService/' + 'GetStationsByAdmin';
        return this.objHttp.post(api, obj);
    }
    ExportDPR(obj: {}) {
        var api = this.apiUrl + 'ApiService/' + 'DprExcel';
        return this.objHttp.post(api, obj);
    }
    ExportPendingStations(obj: {}) {
        var api = this.apiUrl + 'ApiService/' + 'ExportPendingStation';
        return this.objHttp.post(api, obj);
    }
    PackageAvailability(obj: {}) {
        var api = this.apiUrl + 'ApiService/' + 'PackageAvailability';
        return this.objHttp.post(api, obj);
    }
    MOTORDRIVENPACKAGE(obj: {}) {
        var api = this.apiUrl + 'ApiService/' + 'MOTORDRIVENPACKAGE';
        return this.objHttp.post(api, obj);
    }
    ExportClosingOpenig(obj: {}) {
        var api = this.apiUrl + 'ApiService/' + 'ExportGetOpeningClosing';
        return this.objHttp.post(api, obj);
    }
    ExportRejectStationHistory(obj: {}) {
        var api = this.apiUrl + 'ApiService/' + 'ExportRejectStationHistory';
        return this.objHttp.post(api, obj);
    }
    ExportRemarkHistory(obj: {}) {
        var api = this.apiUrl + 'ApiService/' + 'ExportRemarkHistory';
        return this.objHttp.post(api, obj);
    }
    ExportJumpReading(obj: {}) {
        var api = this.apiUrl + 'ApiService/' + 'ExportJumpReport';
        return this.objHttp.post(api, obj);
    }
    GetStationLcv(obj: {}) {
        var api = this.apiUrl + 'ApiService/' + 'GetStationLcv';
        return this.objHttp.post(api, obj);
    }
    InsertStationLCV(frmData: FormData) {
        var api = this.apiUrl + 'ApiService/' + 'InsertLcv';
        return this.objHttp.post(api, frmData);
    }
    HoldResetReading(frmData: FormData) {
        var api = this.apiUrl + 'ApiService/' + 'HoldResetReading';
        return this.objHttp.post(api, frmData);
    }
    GetJumpListHistory(obj: {}) {
        var api = this.apiUrl + 'ApiService/' + 'GetJumpReadingList';
        return this.objHttp.post(api, obj);
    }
    udpateAttachment(frmData: FormData) {
        var api = this.apiUrl + 'ApiService/' + 'udpateAttachment';
        return this.objHttp.post(api, frmData);
    }
    GetGeneralEntry(obj: {}) {
        var api = this.apiUrl + 'ApiService/' + 'GetGeneralEntry';
        return this.objHttp.post(api, obj);
    }
    InsertHybridEntry(obj: {}) {
        var api = this.apiUrl + 'ApiService/' + 'InsertHybridEntry';
        return this.objHttp.post(api, obj);
    }
    InsertGeneralEntry(obj: {}) {
        var api = this.apiUrl + 'ApiService/' + 'InsertGeneralEntry';
        return this.objHttp.post(api, obj);
    }
    GetHybridDetails(obj: {}) {
        var api = this.apiUrl + 'ApiService/' + 'GetHybridDetails';
        return this.objHttp.post(api, obj);
    }
    GetStationGenSet(obj: {}) {
        var api = this.apiUrl + 'ApiService/' + 'GetStationGenSet';
        return this.objHttp.post(api, obj);
    }
    InsertGenSetDetails(obj: {}) {
        var api = this.apiUrl + 'ApiService/' + 'InsertGenSet';
        return this.objHttp.post(api, obj);
    }
    GetPackageDetail(obj: {}) {
        var api = this.apiUrl + 'ApiService/' + 'GetStationPackages';
        return this.objHttp.post(api, obj);
    }
    InsertPackageInfo(obj: {}) {
        var api = this.apiUrl + 'ApiService/' + 'InsertPackage';
        return this.objHttp.post(api, obj);
    }
    deleteResetMeterReading(obj: {}) {
        var api = this.apiUrl + 'ApiService/' + 'deleteResetMeterReading';
        return this.objHttp.post(api, obj);
    }
    getDashboardControlApi(obj: {}) {
        var api = this.apiUrl + 'ApiService/' + 'GetDashBoardCO';
        return this.objHttp.post(api, obj);
    }
    GetStationDispenser(obj: {}) {
        var api = this.apiUrl + 'ApiService/' + 'GetStationDispenser';
        return this.objHttp.post(api, obj);
    }
    getFinalReviewSubmitCO(obj: {}) {
        var api = this.apiUrl + 'ApiService/' + 'FinalSubmitCO';
        return this.objHttp.post(api, obj);
    }
    FinalSubmitCO(obj: {}) {
        var api = this.apiUrl + 'ApiService/' + 'FinalSubmitCO';
        return this.objHttp.post(api, obj);
    }
    SubmitRejection(obj: {}) {
        var api = this.apiUrl + 'ApiService/' + 'SubmitRejection';
        return this.objHttp.post(api, obj);
    }
    GetExeclReportDprMaster(obj: {}) {
        var api = this.apiUrl + 'ApiService/' + 'DprExcel';
        return this.objHttp.post(api, obj);
    }
    SendToHO(obj: {}) {
        var api = this.apiUrl + 'ApiService/' + 'SendToHO';
        return this.objHttp.post(api, obj);
    }
    InsertDispenser(obj: {}) {
        var api = this.apiUrl + 'ApiService/' + 'InsertDispenser';
        return this.objHttp.post(api, obj);
    }
    GetAttachmentForHO(obj: {}) {
        var api = this.apiUrl + 'ApiService/' + 'GetAttachmentForHO';
        return this.objHttp.post(api, obj);
    }
    helpsection(obj: {}) {
        return this.objHttp.post(this.apiUrl + 'ApiService/' + 'helpsection', obj);
    }
    FAQView(obj: {}) {
        return this.objHttp.post(this.apiUrl + 'ApiService/' + 'FAQView', obj);
    }
    FAQDocument(obj: {}) {
        return this.objHttp.post(this.apiUrl + 'ApiService/' + 'FAQDocument', obj);
    }
    forgotPassword(obj: {}) {
        return this.objHttp.post(this.apiUrl + 'ApiService/' + 'forgotPassword', obj);
    }
    DispenserSummarySubmitted(frmData: {}) {
        return this.objHttp.post(this.apiUrl + 'DSA/' + 'DispenserSummarySubmitted', frmData);
    }
    StationAttachment(frmData: FormData) {
        var api = this.apiUrl + 'DSA/' + 'StationAttachment';
        return this.objHttp.post(api, frmData);
    }
    GetStationAttachment(obj: {}) {
        var api = this.apiUrl + 'DSA/' + 'GetStationAttachmentList';
        return this.objHttp.post(api, obj);
    }
    GetDPRMails(obj: {}) {
        var api = this.apiUrl + 'ApiService/' + 'GetDailyDPRMail';
        return this.objHttp.post(api, obj);
    }
    DeleteStationAttachment(obj: {}) {
        var api = this.apiUrl + 'DSA/' + 'DeleteStationAttachmentById';
        return this.objHttp.post(api, obj);
    }
    DispenserSummaryPDF(obj: {}) {
        var header = new Headers();
        return this.objHttp.post(this.apiUrl + 'DSA/' + 'DispenserSummaryPDF', obj, { headers: header });
    }
    DispenserSummaryPDF_ForAdmin(obj: {}) {
        var header = new Headers();
        return this.objHttp.post(this.apiUrl + 'DSA/' + 'DispenserSummaryPDF_ForAdmin', obj, { headers: header });
    }
    FetchDSASubmittedData(obj: {}) {
        var header = new Headers();
        return this.objHttp.post(this.apiUrl + 'DSA/' + 'FetchDSASubmittedData', obj, { headers: header });
    }
    AuthenticationMail(obj: {}) {
        var header = new Headers();
        return this.objHttp.post(this.apiUrl + 'DSA/' + 'AuthenticationMail', obj, { headers: header });
    }
    updateDSAFlag(obj: {}) {
        var header = new Headers();
        return this.objHttp.post(this.apiUrl + 'DSA/' + 'updateDSAFlag', obj, { headers: header });
    }
    DPRSummaryPDF(obj: {}) {
        var api = this.apiUrl + 'ApiService/' + 'DPRSummaryPDF';
        return this.objHttp.post(api, obj);
    }
    InsertUpdatePaymentMode(obj: {}) {
        var header = new Headers();
        return this.objHttp.post(this.apiUrl + 'DSA/' + 'InsertUpdatePaymentMode', obj, { headers: header });
    }
    DeletePaymentMode(obj: {}) {
        var header = new Headers();
        return this.objHttp.post(this.apiUrl + 'DSA/' + 'DeletePaymentMode', obj, { headers: header });
    }
    getPaymentMode(obj: {}) {
        var header = new Headers();
        return this.objHttp.post(this.apiUrl + 'DSA/' + 'getPaymentMode', obj, { headers: header });
    }
    MeterSkidAvrage(obj: {}) {
        var api = this.apiUrl + 'ApiService/' + 'MeterSkidAvrage';
        return this.objHttp.post(api, obj);
    }
    GasGensetAverage(obj: {}) {
        var api = this.apiUrl + 'ApiService/' + 'GasGensetAverage';
        return this.objHttp.post(api, obj);
    }
    LCVAverage(obj: {}) {
        var api = this.apiUrl + 'ApiService/' + 'LCVAverage';
        return this.objHttp.post(api, obj);
    }
    PackagesAverage(obj: {}) {
        var api = this.apiUrl + 'ApiService/' + 'PackagesAverage';
        return this.objHttp.post(api, obj);
    }
    DispenserAverage(obj: {}) {
        var api = this.apiUrl + 'ApiService/' + 'DispenserAverage';
        return this.objHttp.post(api, obj);
    }
    InsertUpdateEntryThreshold(obj: {}) {
        var header = new Headers();
        return this.objHttp.post(this.apiUrl + 'DSA/' + 'InsertUpdateEntryThreshold', obj, { headers: header });
    }
    getEntryThreshold(obj: {}) {
        var header = new Headers();
        return this.objHttp.post(this.apiUrl + 'DSA/' + 'getEntryThreshold', obj, { headers: header });
    }
    InsertIssueLog(frmData: FormData) {
        var api = this.apiUrl + 'ApiService/' + 'InsertIssueLog';
        return this.objHttp.post(api, frmData);
    }
    GetIssueLog(obj: {}) {
        var header = new Headers();
        return this.objHttp.post(this.apiUrl + 'ApiService/' + 'GetIssueLog', obj, { headers: header });
    }
    DeleteIssueLog(obj: {}) {
        var header = new Headers();
        return this.objHttp.post(this.apiUrl + 'ApiService/' + 'DeleteIssueLog', obj, { headers: header });
    }
    updateIssueLog(obj: {}) {
        var header = new Headers();
        return this.objHttp.post(this.apiUrl + 'ApiService/' + 'updateIssueLog', obj, { headers: header });
    }
    CashReconciliation(frmData: FormData) {
        var api = this.apiUrl + 'DSA/' + 'CashReconciliation';
        return this.objHttp.post(api, frmData);
    }
    CashReconciliationForHTML(frmData: FormData) {
        var api = this.apiUrl + 'DSA/' + 'CashReconciliationForHTML';
        return this.objHttp.post(api, frmData);
    }
    InsertCashReconciliation(obj: {}) {
        var api = this.apiUrl + 'DSA/' + 'InsertCashReconciliation';
        return this.objHttp.post(api, obj);
    }
    MailSentCashRecon(obj: {}) {
        var api = this.apiUrl + 'DSA/' + 'SentMailReconciliation';
        return this.objHttp.post(api, obj);
    }
    ExportJMRReport(obj: {}) {
        var api = this.apiUrl + 'ApiService/' + 'ExportJMRReport';
        return this.objHttp.post(api, obj);
    }
    ExportJMRReportfordownload(obj: {}) {
        var api = this.apiUrl + 'ApiService/' + 'ExportJMRReportfordownload';
        return this.objHttp.post(api, obj);
    }
    GetGasReconciliationCaseList(obj: {}) {
        var api = this.apiUrl + 'DSA/' + 'GetGasReconciliationCaseList';
        return this.objHttp.post(api, obj);
    }
    InsertUpdateGasReconciliationCase(obj: {}) {
        var api = this.apiUrl + 'DSA/' + 'InsertUpdateGasReconciliationCase';
        return this.objHttp.post(api, obj);
    }
    ExportDSASubmissionReport(obj: {}) {
        return this.objHttp.post(this.apiUrl + 'DSA/' + 'ExportDSASubmissionReport', obj);
    }
    ExportDSASubmissionReportForHTML(obj: {}) {
        return this.objHttp.post(this.apiUrl + 'DSA/' + 'ExportDSASubmissionReportForHTML', obj);
    }
    ExportDPRSubmissionReport(obj: {}) {
        return this.objHttp.post(this.apiUrl + 'ApiService/' + 'ExportDPRSubmissionReport', obj);
    }
    ExportCRSubmissionReport(obj: {}) {
        return this.objHttp.post(this.apiUrl + 'ApiService/' + 'ExportCRSubmissionReport', obj);
    }
    ExportSOPSubmissionReport(obj: {}) {
        return this.objHttp.post(this.apiUrl + 'DSA/' + 'ExportSOPSubmissionReport', obj);
    }
    ExportSOPSubmissionReportForHTML(obj: {}) {
        return this.objHttp.post(this.apiUrl + 'DSA/' + 'ExportSOPSubmissionReportForHTML', obj);
    }
    ExportGasReconciliationReport(obj: {}) {
        return this.objHttp.post(this.apiUrl + 'ApiService/' + 'ExportGasReconciliationReport', obj);
    }
    ExcelExportCashRecon(obj: {}) {
        return this.objHttp.post(this.apiUrl + 'DSA/' + 'ExcelExportCashRecon', obj);
    }
    ExcelExportCashReconForHTML(obj: {}) {
        return this.objHttp.post(this.apiUrl + 'DSA/' + 'ExcelExportCashReconForHTML', obj);
    }
    ExcelExportDPRForHTML(obj: {}) {
        var api = this.apiUrl + 'ApiService/' + 'ExcelExportDPRForHTML';
        return this.objHttp.post(api, obj);
    }
    CheckIsResetEntryExists(obj: {}) {
        var api = this.apiUrl + 'ApiService/' + 'isResetEntryExists';
        return this.objHttp.post(api, obj);
    }
    CompanyCluster(frmData: FormData) {
        var api = this.apiUrl + 'DSA/' + 'CompanyCluster';
        return this.objHttp.post(api, frmData);
    }
    GetCompanyClusterList(obj: {}) {
        var api = this.apiUrl + 'DSA/' + 'GetCompanyClusterList';
        return this.objHttp.post(api, obj);
    }
    DeleteCompanyClusterById(obj: {}) {
        var api = this.apiUrl + 'DSA/' + 'DeleteCompanyClusterById';
        return this.objHttp.post(api, obj);
    }
    UpdateDPREmail(frmData: FormData) {
        var api = this.apiUrl + 'ApiService/' + 'UpdateDailyDPRMail';
        return this.objHttp.post(api, frmData);
    }
    SendDailyDPRMail(frmData: FormData) {
        var api = this.apiUrl + 'ApiService/' + 'SendDailyDPRMail';
        return this.objHttp.post(api, frmData);
    }
    ExportJMRReportForMail(frmData: FormData) {
        var api = this.apiUrl + 'ApiService/' + 'ExportJMRReportForMail';
        return this.objHttp.post(api, frmData);
    }
    All_Import(frmData: FormData) {
        var api = this.apiUrl + 'DSA/' + 'All_Import';
        return this.objHttp.post(api, frmData);
    }
    getCRoomsForMap(obj: {}) {
        return this.objHttp.post(this.apiUrl + 'ApiService/' + 'getCRoomsForMap', obj);
    }
    getStationByCRforMap(obj: {}) {
        return this.objHttp.post(this.apiUrl + 'ApiService/' + 'getstation_summary_DPR_CSVForMap', obj);
    }
    getStationByCRforMap1(obj: {}) {
        return this.objHttp.post(this.apiUrl + 'ApiService/' + 'getStationByCRforMap', obj);
    }
    ExportJMRReportstations(obj: {}) {
        var api = this.apiUrl + 'ApiService/' + 'ExportJMRReportstations';
        return this.objHttp.post(api, obj);
    }
    ViewJMR(obj: {}) {
        var api = this.apiUrl + 'ApiService/' + 'ExportJMRReportStationsView';
        return this.objHttp.post(api, obj);
    }
    SubmitByStation(obj: {}) {
        var api = this.apiUrl + 'ApiService/' + 'SubmitByStation';
        return this.objHttp.post(api, obj);
    }
    CheckStatusOfStation(obj: {}) {
        var api = this.apiUrl + 'ApiService/' + 'CheckStatusOfStation';
        return this.objHttp.post(api, obj);
    }
    getReviewDataCR(obj: {}) {
        var api = this.apiUrl + 'ApiService/' + 'GetStationsByCRoom';
        return this.objHttp.post(api, obj);
    }
    FinalSubmitCOJMR(obj: {}) {
        var api = this.apiUrl + 'ApiService/' + 'FinalSubmitCOJMR';
        return this.objHttp.post(api, obj);
    }
    FinalRejection(obj: {}) {
        var api = this.apiUrl + 'ApiService/' + 'SubmitRejectionJMR';
        return this.objHttp.post(api, obj);
    }
    SubmitForMo(obj: {}) {
        var api = this.apiUrl + 'ApiService/' + 'SubmitForMo';
        return this.objHttp.post(api, obj);
    }
    ViewSAPJMR(obj: {}) {
        var api = this.apiUrl + 'ApiService/' + 'ViewSAPJMR';
        return this.objHttp.post(api, obj);
    }
    ExportSAPJMRReport(obj: {}) {
        var api = this.apiUrl + 'ApiService/' + 'ExportSAPJMRReport';
        return this.objHttp.post(api, obj);
    }
    ExportJMRReportForDashboard(obj: {}) {
        var api = this.apiUrl + 'ApiService/' + 'ExportJMRReportForDashboard';
        return this.objHttp.post(api, obj);
    }
    RejectByJMRAdmin(obj: {}) {
        var api = this.apiUrl + 'ApiService/' + 'RejectByJMRAdmin';
        return this.objHttp.post(api, obj);
    }
    ViewPending(obj: {}) {
        var api = this.apiUrl + 'ApiService/' + 'ViewPending';
        return this.objHttp.post(api, obj);
    }
    ExportPending(obj: {}) {
        var api = this.apiUrl + 'ApiService/' + 'ExportPending';
        return this.objHttp.post(api, obj);
    }
    GetStationByMO(obj: {}) {
        var api = this.apiUrl + 'DSA/' + 'UnlockDSAEntry';
        return this.objHttp.post(api, obj);
    }
    ECDEntry(obj: {}) {
        return this.objHttp.post(this.apiUrl + 'DSA/' + 'ECDCredit', obj);
    }
    ECDCreditList(obj: {}) {
        return this.objHttp.post(this.apiUrl + 'DSA/' + 'ECDCreditList', obj);
    }
    GetECDMaster(obj: {}) {
        return this.objHttp.post(this.apiUrl + 'DSA/' + 'GetECDMasterById', obj);
    }
    TrendReportsExport(obj: {}) {
        var api = this.apiUrl + 'ApiService/' + 'TrendReportsExport';
        return this.objHttp.post(api, obj);
    }
    getlcvlist(obj: {}) {
        var api = this.apiUrl + 'ApiService/' + 'getlcvlist';
        return this.objHttp.post(api, obj);
    }
    InsertLCVdata(obj: {}) {
        var api = this.apiUrl + 'ApiService/' + 'InsertLCVdata';
        return this.objHttp.post(api, obj);
    }
    Deletelcv(obj: {}) {
        var api = this.apiUrl + 'ApiService/' + 'Deletelcv';
        return this.objHttp.post(api, obj);
    }
    GetPdFReport(obj: {}) {
        var api = this.apiUrl + 'ApiService/' + 'GetPdFReport';
        return this.objHttp.post(api, obj);
    }
    GetPdFReportCR_MO(obj: {}) {
        var api = this.apiUrl + 'ApiService/' + 'GetPdFReportCR_MO';
        return this.objHttp.post(api, obj);
    }


    // Add in db.service.ts
    uploadStationDocument(formData: FormData) {
        return this.objHttp.post(this.apiUrl + 'ApiService/UploadStationDocument', formData);
    }

    getStationDocuments(stationId: number, documentTypeId: number) {
        return this.objHttp.post(this.apiUrl + 'ApiService/GetDocuments', {
            StationId: stationId,
            DocumentTypeId: documentTypeId
        });
    }

    GetDocumentTypes(obj: {}) {
        var api = this.apiUrl + 'ApiService/' + 'GetDocumentTypes';
        return this.objHttp.post(api, obj);
    }

    GetStationsForDropDown(obj: {}) {
        var api = this.apiUrl + 'ApiService/' + 'GetStationsForDropDown';
        return this.objHttp.post(api, obj);
    }

    GetControlOfficeForDropDown(obj: {}) {
        var api = this.apiUrl + 'ApiService/' + 'GetControlOfficeForDropDown';
        return this.objHttp.post(api, obj);
    }


    deleteStationDocument(documentId: number) {
        return this.objHttp.post(
            this.apiUrl + 'ApiService/DeleteStationDocument',
            { DocumentId: documentId }
        );
    }

    SaveStationRelation(obj: {}) {
        var api = this.apiUrl + 'ApiService/' + 'saveStationRelation';
        return this.objHttp.post(api, obj);
    }

    GetOnlineAndHybridStations(obj: {}) {
        var api = this.apiUrl + 'ApiService/' + 'GetOnlineAndHybridStations';
        return this.objHttp.post(api, obj);
    }
    UnlinkStationRelation(obj: {}) {
        var api = this.apiUrl + 'ApiService/' + 'UnlinkStationRelation';
        return this.objHttp.post(api, obj);
    }

    AddStationRelation(obj: {}) {
        var api = this.apiUrl + 'ApiService/' + 'AddStationRelation';
        return this.objHttp.post(api, obj);
    }
    GetStationRelations(obj: {}) {
        var api = this.apiUrl + 'ApiService/' + 'GetStationRelations';
        return this.objHttp.post(api, obj);
    }
    GetAvgDispencePressureList(obj: {}) {
        var api = this.apiUrl + 'DSA/' + 'GetAvgDispencePressureList';
        return this.objHttp.post(api, obj);
    }
    InsertUpdateAvgDispencePressure(obj: {}) {
        var api = this.apiUrl + 'DSA/' + 'InsertUpdateAvgDispencePressure';
        return this.objHttp.post(api, obj);
    }
    AutoFetchTotalizers(obj: {}) {
         var api = this.apiUrl + 'DSA/' + 'AutoFetchTotalizers';
        return this.objHttp.post(api, obj);
    }
    GetTotalizersFromScada(obj: {}) {
        var api = this.apiUrl + 'DSA/' + 'GetTotalizersFromScada';
        return this.objHttp.post(api, obj);
    }
}
