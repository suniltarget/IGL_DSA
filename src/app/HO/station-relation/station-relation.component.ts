import { Component, OnInit } from '@angular/core';
import { dbService } from '../../Service/db.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-station-relation',
  templateUrl: './station-relation.component.html',
  styleUrls: ['./station-relation.component.css']
})
export class StationRelationComponent implements OnInit {

  // -------------------------
  // DATA ARRAYS
  // -------------------------
  onlineStations: any[] = [];
  hybridStations: any[] = [];
  relations: any[] = [];

  // Popup flags
  addPopup: boolean = false;
  unlinkPopup: boolean = false;

  key: string = 'OStationName';
  reverse: boolean = true;
  sortingColumn: string = "";

  // Add relation model
  newRelation: any = {
    onlineId: null,
    hybridId: null
  };

  // Unlink target temp holder
  unlinkTarget: any = null;

  loader: boolean = false;

  constructor(
    private objDbServ: dbService,
    private objCook: CookieService
  ) {
    this.objDbServ.HeaderDisplay.emit(true);
    this.objDbServ.LeftMenu.emit(true);
  }

  ngOnInit() {
    this.loadRelations();
    this.loadStationData();
  }

  loadRelations() {
    this.loader = true;
    const payload = {
      ControlRoomCode: localStorage.getItem('LoginId')
    };
    this.objDbServ.GetStationRelations(payload).subscribe(
      (res: any) => {
        var result = JSON.parse(res._body);
        if (result && result.Table) {
          this.relations = result.Table;
        }
        else {
          this.relations = [];
        }
      }
    )
  }
  // ---------------------------------------------------
  // LOAD DATA
  // ---------------------------------------------------
  loadStationData() {
    this.loader = true;

    const payload = {
      ControlRoomCode: localStorage.getItem('LoginId')
    };

    this.objDbServ.GetOnlineAndHybridStations(payload).subscribe(

      (res: any) => {

        var result = JSON.parse(res._body);
        console.log("step1", result.success);
        if (result && result.success) {

          this.onlineStations = result.onlineStations || [];
          this.hybridStations = result.hybridStations || [];

          console.log("result.onlineStations", result.onlineStations);
          // Add default mapping flag
          this.onlineStations = this.onlineStations.map(o => ({
            ...o,
            mappedHybridId: o.mappedHybridId || null
          }));
        }

        this.loader = false;
      },
      err => {
        console.error("Error loading station data:", err);
        this.loader = false;
      }
    );
  }

  // ---------------------------------------------------
  // GET AVAILABLE HYBRID STATIONS
  // Prevent duplicate mapping
  // ---------------------------------------------------
  getAvailableHybridStations(onlineId: number) {
    return this.hybridStations.filter(h => {
      const alreadyMapped = this.onlineStations.find(o => o.mappedHybridId === h.StationID);
      return (!alreadyMapped || alreadyMapped.StationID === onlineId);
    });
  }

  // ---------------------------------------------------
  // CHANGE HYBRID MAPPING
  // ---------------------------------------------------
  onMapChange(onlineId: number, hybridId: number | null) {
    this.onlineStations = this.onlineStations.map(stn => {
      if (stn.StationID === onlineId) {
        return { ...stn, mappedHybridId: hybridId };
      }
      return stn;
    });
  }

  // ---------------------------------------------------
  // OPEN ADD RELATION POPUP
  // ---------------------------------------------------
  openAddPopup() {
    this.addPopup = true;
    this.newRelation = { onlineId: null, hybridId: null };
  }

  closeAddPopup() {
    this.addPopup = false;
  }

  // ---------------------------------------------------
  // SAVE NEW RELATION
  // ---------------------------------------------------
  saveRelation() {
    if (!this.newRelation.onlineId || !this.newRelation.hybridId) {
      alert("Please select both Online and Hybrid Station.");
      return;
    }

    const payload = {
      ControlRoomCode: localStorage.getItem('LoginId'),
      OStationId: this.newRelation.onlineId,
      HStationId: this.newRelation.hybridId
    };

    this.objDbServ.AddStationRelation(payload).subscribe(
      (res: any) => {
        let parsed;

        try {
          parsed = JSON.parse(res._body);
        } catch (e) {
          console.error("JSON parse error:", e);
          alert("Invalid server response.");
          return;
        }

        if (parsed && parsed.Status) {
          alert(parsed.Status);
          this.addPopup = false;
          this.loadRelations();
          this.loadStationData();
        } else {
          alert("Unknown response");
        }
      },
      err => {
        alert("Error while saving relation.");
        console.error(err);
      }
    );
  }

  // ---------------------------------------------------
  // OPEN UNLINK POPUP
  // ---------------------------------------------------
  openUnlinkPopup(online: any) {
    this.unlinkTarget = online;
    this.unlinkPopup = true;
  }

  closeUnlinkPopup() {
    this.unlinkPopup = false;
  }
  sortCol(key: string) {
    this.sortingColumn = key;
    this.key = key;
    this.reverse = !this.reverse;
  }

  // ---------------------------------------------------
  // UNLINK RELATION
  // ---------------------------------------------------
  unlinkRelation(online: any) {
    const payload = {
      RelationID: online.RelationID,
      ControlRoomCode: localStorage.getItem('LoginId')
    };

    this.objDbServ.UnlinkStationRelation(payload).subscribe(
      (res: any) => {
        var result = JSON.parse(res._body);
        if (result && result.Status) {
          alert("Relation removed successfully!");
          this.unlinkPopup = false;
          this.loadRelations();
          this.loadStationData();
        } else {
          alert(result.message);
        }
      },
      err => {
        alert("Error unlinking relation.");
        console.error(err);
      }
    );
  }

}
