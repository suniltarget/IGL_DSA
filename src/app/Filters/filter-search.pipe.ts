import { Pipe, PipeTransform } from '@angular/core';
import { ElementSchemaRegistry } from '@angular/compiler';
@Pipe({
  name: 'filterSearch'
})
export class FilterSearchPipe implements PipeTransform {
  transform(items: any[], searchText: string, flag: string): any {
    if(!items) return [];
      if(!searchText) return items;   
    searchText = searchText.toLowerCase();
    if(flag == 'DispenserFilter'){
      return items.filter( it => {
        return (
            it.StationCode.toLowerCase().includes(searchText) || 
            it.DispenserName.toLowerCase().includes(searchText) ||
            it.DispenserCodeA.toLowerCase().includes(searchText) ||
            it.DispenserCodeB.toLowerCase().includes(searchText) ||
            it.DispanserTypeCodeADisp.toLowerCase().includes(searchText) ||
            it.DispanserTypeCodeBDisp.toLowerCase().includes(searchText) ||
            it.StationName.toLowerCase().includes(searchText) ||
            it.StationCode.toLowerCase().includes(searchText) ||
            ((it.Status == '1') && 'active'.indexOf(searchText.toLowerCase()) > -1) ||
            ((it.Status == '0') && 'inactive'.indexOf(searchText.toLowerCase()) > -1) 
        )
      });
    }
    else if(flag == 'DPRFilter'){
      return items.filter( it => {
        return (
            (
              it.name.toLowerCase().includes(searchText) || 
              it.EntryDate.toLowerCase().includes(searchText)||
              it.CertificateType.toLowerCase().includes(searchText)
            ) 
        )
      });
    }
    else if(flag == 'AttachmentFilter'){
      return items.filter( it => {
        return (
            (
              it.DispenserName.toLowerCase().includes(searchText) || 
              it.EntryDate.toLowerCase().includes(searchText)||
              it.DispanserSide.toLowerCase().includes(searchText) ||
              it.ShiftDetails.toLowerCase().includes(searchText) ||
              it.SubShiftDetails.toLowerCase().includes(searchText)
            ) && (it.DispanserJumpCeritificate == '')
        )
      });
    }
    else if(flag == 'StationFilter'){
      return items.filter( it => {
        return (
            it.MarketingOfficerName.toLowerCase().includes(searchText) || 
            it.StationCode.toLowerCase().includes(searchText) || 
            it.StationName.toLowerCase().includes(searchText) ||
            it.StationAddress.toLowerCase().includes(searchText) ||
            it.RegionName.toLowerCase().includes(searchText) ||
            it.CompanyName.toLowerCase().includes(searchText) ||
            it.StationTypeName.toLowerCase().includes(searchText) ||
            ((it.Status == '1') && 'active'.indexOf(searchText.toLowerCase()) > -1) ||
            ((it.Status == '0') && 'inactive'.indexOf(searchText.toLowerCase()) > -1) 
        )
      });
    }
    else if (flag == 'Mom'){
      return items.filter( it => {
        return (
            it.EmailId.toLowerCase().includes(searchText) ||
            it.LoginId.toLowerCase().includes(searchText) ||
            it.ContactNo.toLowerCase().includes(searchText) ||
            it.Name.toLowerCase().includes(searchText) 
        )
      });
    }
    else if (flag == 'DispSearch'){
      return items.filter( it => {
        return (
          it.DispenserName.toLowerCase().includes(searchText) || 
          it.DispenserCodeA.toLowerCase().includes(searchText) ||
          it.DispenserCodeB.toLowerCase().includes(searchText) ||
          it.DispanserTypeCodeA.toLowerCase().includes(searchText) ||
          it.DispanserTypeCodeB.toLowerCase().includes(searchText) ||
          ((it.Status == '1') && 'active'.indexOf(searchText.toLowerCase()) > -1) ||
          ((it.Status == '0') && 'inactive'.indexOf(searchText.toLowerCase()) > -1) 
        )
      });
    }
    else if (flag == 'RateSearch'){
      return items.filter( it => {
        return (
          it.RegionName.toLowerCase().includes(searchText) || 
          it.EffectiveDate.toLowerCase().includes(searchText)
        )
      });
    }
    else if (flag == 'RegionSearch'){
      return items.filter( it => {
        return (
          it.RegionName.toLowerCase().includes(searchText)
        )
      });
    }
    else if (flag == 'ECDSearch'){
      return items.filter( it => {
        return (
          it.ECDDevice.toLowerCase().includes(searchText)
        )
      });
    }
    else if (flag == 'DashboardStation'){
      return items.filter( it => {
        return (
          it.StationCode.toLowerCase().includes(searchText) || 
          it.StationName.toLowerCase().includes(searchText) ||
          ((it.FinalPer).toString()).toLowerCase().includes(searchText)
        )
      });
    }
    else if (flag == 'DashboardMO'){
      return items.filter( it => {
        return (
          it.Name.toLowerCase().includes(searchText) ||
          ((it.StCount).toString()).toLowerCase().includes(searchText)||
          ((it.MOPer).toString()).toLowerCase().includes(searchText)
         )
      });
    }
    else if (flag == 'ActivityLogSearch'){
      return items.filter( it => {
        return (
           ((it.Name).toString()).toLowerCase().includes(searchText)||
           ((it.Action).toString()).toLowerCase().includes(searchText)||
           ((it.StationName).toString()).toLowerCase().includes(searchText) ||
           ((it.Menu).toString()).toLowerCase().includes(searchText)||
           ((it.Details).toString()).toLowerCase().includes(searchText)||
           ((it.LDateTime).toString()).toLowerCase().includes(searchText)
         )
      });
    }
    else if (flag == 'Notifications'){
      return items.filter( it => {
        return (
           ((it.StationCode).toString()).toLowerCase().includes(searchText)||
           ((it.StationName).toString()).toLowerCase().includes(searchText)||
           ((it.RegionName).toString()).toLowerCase().includes(searchText) ||
           ((it.CompanyName).toString()).toLowerCase().includes(searchText)||
           ((it.StationTypeName).toString()).toLowerCase().includes(searchText)
         )
      });
    }
  }
}
