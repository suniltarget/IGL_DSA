import { Component, OnInit, ComponentFactoryResolver } from '@angular/core';
import { dbService } from './Service/db.service';
import { CookieService } from 'ngx-cookie-service';
import {Router} from '@angular/router';
declare var $:any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  width:number=100;
  num:any;
  show:boolean =false;
  value:any = 1;
  title = 'app';
  showHearder:boolean = false;
  showLoader:boolean = false;
  showLoaderValue:string = 'none';
  IsBorderReq:boolean = false;
  public href: string = "";
  showProgress:boolean = false;
  element: HTMLElement;
  intervel: NodeJS.Timer;
  constructor( private objDbServ: dbService,private objCook: CookieService, private resolver: ComponentFactoryResolver,private router: Router){
    this.objDbServ.MasterCompDisplay.subscribe(
      (visibility: boolean)  => {this.showHearder = visibility;}
    );
    this.objDbServ.ShowLoaders.subscribe(
      (visibility: boolean)  => {this.showLoader = visibility;}
    );
    this.objDbServ.ShowProgress.subscribe(
      (visibility: boolean)  => {
        if(visibility){
          this.showProgress = visibility;
          this.progress();
          }
        if(visibility == false){
          this.show = true;
          setTimeout( ()=>{
            this.show = false;
          },100)
          this.showProgress = visibility;
        }  
      }
    );
    this.objDbServ.ShowBorder.subscribe(
      (visibility: boolean)  => {this.IsBorderReq = visibility;}
    );
    this.objDbServ.HeaderDisplay.subscribe(
      (visibility: boolean) => { this.showHearder = visibility; }
    );
    this.objDbServ.LeftMenu.subscribe(
      (visibility: boolean) => { this.showHearder = visibility; }
    );
  }
  ngOnInit() {
    this.objDbServ.ShowBorder.emit(true);
  }
  onActivated(component) {
      var activepage = this.resolver.resolveComponentFactory(component.constructor).selector;
      this.href = this.router.url;
      this.href = this.href.replace("/","");
      this.objDbServ.highlight=this.href;
    }
    ngDoCheck() {
      this.objDbServ.CurrentTime = new Date().toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'});
      this.objDbServ.CurrentSeconds = new Date().getTime();
      this.objDbServ.TestVar.next("call");
   }
   progress(){
    this.width = 7 ;
    this.intervel =setInterval(() => {
      if(this.width >= 91 ){
        clearImmediate(this.intervel);
      }
      else{
        this.width++;
        this.num=this.width;
        return  this.value = this.width +"%";
      }
     },1000);
   }
}
