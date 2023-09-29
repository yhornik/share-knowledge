import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface ISearchResultAPIItem {
  name: string;
  id: string;
  project_id?: string;
  type?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  constructor() { }

  getItemById(id: string): Observable<ISearchResultAPIItem> {
    return of({
      id: id,
      name: `item_${id}`,
      project_id: `prj_${id}`,
      type: `type_${id}`
    })
  }
}
