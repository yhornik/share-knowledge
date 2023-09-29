import { Component } from '@angular/core';
import { BehaviorSubject, EMPTY, Observable, filter, forkJoin, map, switchMap, tap } from 'rxjs';
import { ItemService } from './services/item.service';
export interface ISearchResultAPIItem {
  name: string;
  id: string;
  project_id?: string;
  type?: string;
}
export interface ItemChoice {
  label: string;
  value: string;
  checked?: boolean;
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'pocnew13';

  private selectedItemSubject = new BehaviorSubject<ItemChoice[]>([]);
  selectedItemNew$ = this.selectedItemSubject.asObservable();
  
  private triggerExportSubject = new BehaviorSubject<boolean>(false);
  triggerExport$ = this.triggerExportSubject.asObservable();

  itemListTobeExported$: Observable<ISearchResultAPIItem[]> = EMPTY;

  listSelectedEmpty = true;

  constructor(
    private itemService: ItemService) { }

  ngOnInit(): void {
    this.itemListTobeExported$ = this.selectedItemNew$
      .pipe(
        map((items: ItemChoice[]) => items?.map((item: ItemChoice) => item?.value)),
        filter((ids: string[]) => ids?.length > 0),
        filter(() => this.triggerExportSubject.getValue()),
        tap(() => console.log('**** pass after filter trigger')),
        switchMap((itemIds: string[]) =>
          forkJoin(
            itemIds.map((itemId: string) =>
              this.itemService.getItemById(itemId)
            )
          )
        ),
      )
  }
  
  trackByFn(_: number, item: any): number {
    return item.id;
  }

  // checkboxes
  checkOptionsOne = [
    { label: 'AAAA', value: '6', checked: false },
    { label: 'BBBB', value: '8', checked: false },
    { label: 'CCCC', value: '10', checked: false },
    { label: 'DDDD', value: '12', checked: false },
    { label: 'EEEE', value: '30', checked: false },
  ];

  checkBoxesChanges(items: ItemChoice[]): void {
    const selected = items?.filter((item) => item?.checked);
    this.selectedItemSubject.next(selected);
    this.listSelectedEmpty = this.selectedItemSubject.getValue()?.length === 0;
  }

  exportItem() {
    const triggerValue = this.triggerExportSubject.getValue();
    this.triggerExportSubject.next(!triggerValue);
  }
}
