import { Pipe, PipeTransform } from '@angular/core';
import { Station } from '../interface/station';

@Pipe({
  name: 'favoriteStation'
})
export class FavoriteStationPipe implements PipeTransform {

  transform(data: Array<Station>, input: string): any {
    if(!input)
      return data;
    let isFavorite = input === 'true' ? true : false;
    return data.filter(item => item.favorite === isFavorite);
  }

}
