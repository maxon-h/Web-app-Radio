import { Pipe, PipeTransform } from '@angular/core';
import { Station } from '../interface/station';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(data: Array<Station>, searchText: string): any {
    if(!searchText)
      return data;
    return data.filter(item => item.name.toLowerCase().includes(searchText.toLowerCase()));
  }

}
