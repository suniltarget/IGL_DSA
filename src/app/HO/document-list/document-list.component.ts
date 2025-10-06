import { Component, OnInit } from '@angular/core';
import { dbService } from '../../Service/db.service';
import { CookieService } from 'ngx-cookie-service';
import { FilterSearchPipe } from '../../Filters/filter-search.pipe';

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css']
})
export class DocumentListComponent implements OnInit {
  filter: string = '';
  filterBoxFlag: number = 0;
  stCodeMy: "";
  fiterBox: boolean = false;
  stations: any[] = [];
  stationId: number = 0;
  documentTypeId: number = 0;
  docmentTypeCode: string = '';
  documentTypes: any[] = [];
  documents: any[] = [];
  selectedFile: File | null = null;
  uploadPopup: boolean = false;
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(private objDbServ: dbService, private objCook: CookieService) {
    this.objDbServ.MasterCompDisplay.emit(true);
    this.objDbServ.HeaderDisplay.emit(true);
    this.objDbServ.LeftMenu.emit(true);
    this.stationId = 0;
    this.documentTypeId = 0;
    this.docmentTypeCode = '';
  }
  ngOnInit() {
    this.loadStations();
    this.loadDocumentTypes();
    this.loadDocuments();
  }

  openUploadPopup() {
    this.uploadPopup = true;
    this.stCodeMy = '';
  }

  closeUploadPopup() {
    this.uploadPopup = false;
    this.stCodeMy = '';
  }

  filterBoxShow(itm) {
    if (this.filterBoxFlag == 0) {
      this.fiterBox = true;
      this.filterBoxFlag = 1;
    }
    else {
      this.fiterBox = false;
      this.filterBoxFlag = 0;
      this.stCodeMy = itm.name;
      this.stationId = itm.id;
    }
  }


  sortData(column: string) {
    if (this.sortColumn === column) {
      // toggle direction
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.documents.sort((a: any, b: any) => {
      let valA = a[column] ? a[column].toString().toLowerCase() : '';
      let valB = b[column] ? b[column].toString().toLowerCase() : '';

      if (valA < valB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  loadDocumentTypes() {
    this.objDbServ.ShowLoaders.emit(true);
    this.objDbServ.GetDocumentTypes({}).subscribe(
      (resp: any) => {
        // API returns { Table: [...] }
        this.objDbServ.ShowLoaders.emit(false);
        this.documentTypes = JSON.parse(resp.json()).Table;
      },
      err => {
        this.objDbServ.ShowLoaders.emit(false);
        console.error('Error loading document types', err);
      }
    );

  }

  loadStations() {
    this.objDbServ.ShowLoaders.emit(true);
    this.objDbServ.GetStationsForDropDown({}).subscribe(
      (resp: any) => {
        // API returns { Table: [...] }
        this.objDbServ.ShowLoaders.emit(false);
        this.stations = JSON.parse(resp.json()).Table;
      },
      err => {
        this.objDbServ.ShowLoaders.emit(false);
        console.error('Error loading stations', err);
      }
    );

  }



  loadDocuments() {
    this.objDbServ.ShowLoaders.emit(true);
    this.objDbServ.getStationDocuments(0, 0).subscribe(
      (res: any) => {
        this.objDbServ.ShowLoaders.emit(false);
        const result = JSON.parse(res.json());
        this.documents = result.Table.map((doc: any) => {
          return {
            ...doc,
            FilePath: this.objDbServ.apiImageAttachment + doc.FilePath   // prepend API URL
          };
        });

      },
      err => {
        this.objDbServ.ShowLoaders.emit(false);
        console.error('Error loading documents', err);
      }
    );

  }


  confirmDelete(documentId: number) {
    if (confirm("Are you sure you want to delete this document?")) {
      this.objDbServ.ShowLoaders.emit(true);
      this.objDbServ.deleteStationDocument(documentId).subscribe(
        (res: any) => {
          this.objDbServ.ShowLoaders.emit(false);
          const result = JSON.parse(res.json());
          alert(result);  // e.g. "Successfully deleted"
          this.loadDocuments(); // refresh list
        },
        err => {
          this.objDbServ.ShowLoaders.emit(false);
          console.error("Delete failed", err);
          alert("Error deleting document");
        }
      );
    }
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onDocumentTypeChange() {
    const id = Number(this.documentTypeId);
    const selected = this.documentTypes.find(dt => dt.DocumentTypeId === id);
    this.docmentTypeCode = selected ? selected.TypeCode : '';
  }

  uploadDocument() {
    if (!this.selectedFile || !this.stationId || !this.documentTypeId || !this.docmentTypeCode) {
      alert('Please select a file, station, and document type first');
      return;
    }
    this.objDbServ.ShowLoaders.emit(true);
    var loginId = localStorage.getItem('LoginId');
    const formData = new FormData();
    formData.append('StationDocument', this.selectedFile);
    formData.append('StationId', this.stationId.toString());
    formData.append('DocumentTypeId', this.documentTypeId.toString());
    formData.append('TypeCode', this.docmentTypeCode.toString());
    formData.append('UploadedBy', loginId); // hardcoded

    this.objDbServ.uploadStationDocument(formData).subscribe(
      res => {
        alert('Document uploaded successfully');
        this.loadDocuments();
      },
      err => {
        console.error('Error uploading document', err);
      }
    );
    this.closeUploadPopup();
    this.objDbServ.ShowLoaders.emit(false);
  }
}
