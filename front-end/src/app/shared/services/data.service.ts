import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { Station } from '../interface/station';
import { StationWoID } from '../interface/station-wo-id';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private url: string;
  constructor(private http: HttpClient ) {
    this.url = 'http://localhost:3000/';
  }

  public getData(): Observable<Array<Station>> {
    return this.http.get<Array<Station>>(this.url + 'stations');
  }

  public addStation(station: StationWoID): Observable<Array<Station>> {
    return this.http.post<Array<Station>>(this.url + 'stations/post', station);
  }

  public delStation(id: string): Observable<Array<Station>> {
    return this.http.delete<Array<Station>>(this.url + 'stations/delete/' + id);
  }

  public updateStation(station: Station): Observable<Array<Station>> {
    return this.http.put<Array<Station>>(this.url + 'stations/put/' + station._id, station);
  }
}
