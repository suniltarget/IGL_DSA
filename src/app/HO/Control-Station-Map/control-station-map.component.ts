import { Component, OnInit, ViewRef } from "@angular/core";
import { AfterViewInit, ViewChild, ElementRef } from "@angular/core";
import { dbService } from '../../Service/db.service';
import { Response } from '@angular/http';
import { CookieService } from 'ngx-cookie-service';
import {DatePipe} from '@angular/common';
import { jsonpFactory } from "@angular/http/src/http_module";
@Component({
  selector: 'app-control-station-map',
  templateUrl: './control-station-map.component.html',
  styleUrls: ['./control-station-map.component.css']
})
export class ControlStationMapComponent implements AfterViewInit {
  title = "angular-gmap";
  @ViewChild("mapContainer") gmap: ElementRef;
  map: google.maps.Map;
  lat = 28.7041;
  lng = 77.1025;
curDate = new Date();
  markers: any[] = [];
  markersStation: any;
  CRList: any[];
  StationList: any[];
  CRCode='';
  test = 0;
  coordinates = new google.maps.LatLng(this.lat, this.lng);
  mapOptions: google.maps.MapOptions = {
    center: this.coordinates,
    zoom: 11,
  };
  marker: any;
  marker1: any;
  constructor(private objDbServ: dbService, private datePipe: DatePipe, private objCook: CookieService) {
    this.objDbServ.MasterCompDisplay.emit(true);
    this.objDbServ.HeaderDisplay.emit(true);
    this.objDbServ.LeftMenu.emit(true);
    this.marker = new google.maps.Marker({
      map: this.map,
      position: new google.maps.LatLng(28.7041, 77.1025) // Example: Delhi coordinates
    });
    this.getStationByCr('');
  }
  GetCRMarkers() {
    var itself = this
    setTimeout(() => {
      for (let i = 0; i < itself.CRList.length; i++) {
        itself.marker = new google.maps.Marker({
          position: new google.maps.LatLng(itself.CRList[i].Latitude, itself.CRList[i].Longitude),
          map: itself.map,
          title: itself.CRList[i].ControlRoomName + '|' + itself.CRList[i].ControlRoomCode,
          icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'
        });
        itself.markers.push(itself.marker);
        var list = itself.CRList[i].ControlRoomCode;
        google.maps.event.addListener(itself.marker, 'click', (function (marker, i) {
          return function () {
            itself.CRCode =itself.CRList[i].ControlRoomCode;
            itself.map = new google.maps.Map(document.getElementById('map'), {
              zoom: 10,
              center: new google.maps.LatLng(28.7041, 77.1025),
              mapTypeId: google.maps.MapTypeId.ROADMAP
            });
            itself.getStationByCr(itself.CRCode);
            itself.CRList = [];
            itself.markers = [];
            itself.CRList.length = 0;
            const infoWindow = new google.maps.InfoWindow({
            });
            infoWindow.open(itself.marker.getMap(), itself.marker);
          }
        })(itself.marker, i));
      }
    }, 500);
  }
  getCRooms() {
    this.objDbServ.getCRoomsForMap({}).subscribe(
      (resp: Response) => {
        this.CRList = JSON.parse(resp.json()).Table
      },
      (error) => {
        alert("Something went wrong.");
        this.objDbServ.ShowLoaders.emit(false);
      }
    )
  }
  getStationByCr(CRCode: string) {
    const obj = {
      dateFor: this.datePipe.transform(this.curDate, 'yyyy-MM-dd'),
      CRCode:CRCode
    };
    this.objDbServ.getStationByCRforMap(obj).subscribe(
      (resp: Response) => {
        this.StationList = JSON.parse(resp.json()).Table
        for (let j = 0; j < this.StationList.length; j++) {
          this.marker1 = new google.maps.Marker({
            position: new google.maps.LatLng(this.StationList[j].Latitude, this.StationList[j].Longitude),
            map: this.map,
            title: 'StationName: ' + this.StationList[j].STATION_NAME + '\nStationCode: ' + this.StationList[j].Stationcode + '\nSales: ' + this.StationList[j].TOTAL_SALE_KG,
            icon: 'https://img.icons8.com/emoji/48/000000/fuel-pump.png'
          });
          this.markers.push(this.marker1);
        }
      },
      (error) => {
        alert("Something went wrong.");
        this.objDbServ.ShowLoaders.emit(false);
      }
    )
  }
  ngAfterViewInit() {
    this.map = new google.maps.Map(this.gmap.nativeElement, this.mapOptions);
    this.GetCRMarkers();
  }
  mapInitializer() {
    this.marker.addListener("click", (resp) => {
      const infoWindow = new google.maps.InfoWindow({
        content: this.marker.getTitle()
      });
      infoWindow.open(this.marker.getMap(), this.marker);
      this.loadAllMarkersStation();
    });
    this.marker.setMap(this.map);
    this.loadAllMarkers();
  }
  loadAllMarkers() {
    var itself = this
    this.markers.forEach(markerInfo => {
      const marker = new google.maps.Marker({
        ...markerInfo
      });
      const infoWindow = new google.maps.InfoWindow({
        content: marker.getTitle()
      });
      marker.addListener("click", (resp) => {
        infoWindow.open(marker.getMap(), marker);
        this.getStationByCr(marker.getTitle().split("|")[1]);
        this.loadAllMarkersStation();
      });
      marker.setMap(this.map);
    });
  }
  loadAllMarkersStation() {
    var itself = this
    this.markersStation.forEach(markerInfo => {
      const marker = new google.maps.Marker({
        ...markerInfo
      });
      const infoWindow = new google.maps.InfoWindow({
        content: marker.getTitle()
      });
      marker.addListener("click", () => {
        infoWindow.open(marker.getMap(), marker);
      });
      marker.setMap(this.map);
    });
  }
  Reloadedata() {
    this.getCRooms();
    this.map = new google.maps.Map(this.gmap.nativeElement, this.mapOptions);
    this.GetCRMarkers();
  }
}