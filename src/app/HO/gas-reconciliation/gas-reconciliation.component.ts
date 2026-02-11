import { Component, OnInit } from '@angular/core';
import { dbService } from '../../Service/db.service';
import { CookieService } from 'ngx-cookie-service';
import { isUndefined, isNullOrUndefined } from 'util';
import { MAX_LENGTH_VALIDATOR } from '@angular/forms/src/directives/validators';
import { tick } from '@angular/core/testing';
import { NULL_EXPR } from '@angular/compiler/src/output/output_ast';
import { DatepickerOptions } from 'ng2-datepicker';
import * as enLocale from 'date-fns/locale/en';
import { DomSanitizer} from '@angular/platform-browser';
import { DatePipe } from '@angular/common';
import { parse } from 'path';
declare var $:any;
@Component({
  selector: 'app-gas-reconciliation',
  templateUrl: './gas-reconciliation.component.html',
  styleUrls: ['./gas-reconciliation.component.css']
})
export class GasReconciliationComponent implements OnInit {
  sortingColumn:string="";
  key: string = 'Name';
  reverse: boolean = true;
  CaseSeletionCasesJson = [{ Text: 'Case1' }, { Text: 'Case2'}, { Text: 'Case3'}];
  SeletionStatusJson = [{ Text: 'Operational' }, { Text: 'Non_Operational'}];
  Loginid:string= this.objCook.get('LoginId');
  GasReconciliationCaseList:any = [];
  constructor(private objDbServ: dbService, private objCook: CookieService) {
    this.objDbServ.MasterCompDisplay.emit(true);
    this.objDbServ.HeaderDisplay.emit(true);
    this.objDbServ.LeftMenu.emit(true);
  }
  ngOnInit() {
    this.GetGasReconciliationCaseList();
  }
  GetGasReconciliationCaseList(){
    const obj = {
      ControlRoomCode:this.Loginid,
      Flag:"OnLoad"
    };
    this.objDbServ.ShowLoaders.emit(true);
    this.objDbServ.GetGasReconciliationCaseList(obj).subscribe(
      (resp: any) => {
        this.GasReconciliationCaseList = JSON.parse(resp.json()).Table;
        this.objDbServ.ShowLoaders.emit(false);
      },
      (error) => {alert("Something went wrong.");
      this.objDbServ.ShowLoaders.emit(false);}
    )
  }
  OnSubmit() {
    const obj = {
      ControlRoomCode:this.Loginid,
      Flag:"Update",
      GasReconciliationArr:this.GasReconciliationCaseList
    };
  var ErrorMsg = "";
  if(ErrorMsg == '' || ErrorMsg == undefined) {
      this.objDbServ.InsertUpdateGasReconciliationCase(obj).subscribe(
          (resp: any) => {
              const data= (resp.json());
                alert('Record Saved Successfully.!');
                this.GetGasReconciliationCaseList();
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
}
