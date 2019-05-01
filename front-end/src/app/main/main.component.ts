import { Component, OnInit } from '@angular/core';
import { DataService } from '../shared/services/data.service'
import { Station } from '../shared/interface/station';
import { SearchPipe } from '../shared/pipes/search.pipe';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  private isPlaying = true;
  private currIndx = 0;
  stations: Array<Station>;
  currStation: string;
  url = '';
  name = '';
  fav = false;
  wantedToAdd = false;
  showMenu = false;
  private updatedIndex: number;
  searchText = '';
  favStation = '';
  private searchPipe = new SearchPipe();
  constructor(private dataService: DataService) {
    this.dataService.getData().subscribe( data => {
      this.stations = data;

      document.getElementsByTagName('audio')[0].src = this.stations[0].url;
      this.currStation = this.stations[0].name;
    });
  }

  ngOnInit() {
    document.getElementsByTagName('audio')[0].volume = 0.7;
  }

  public showAllStations(): void {
    this.favStation = '';
  }

  public showFavStations(): void {
    this.favStation = 'true';
    this.wantedToAdd = false;
    this.showMenu = false;
  }

  public onKey(event: any): void {
    this.searchText = event.target.value;
  }

  public editStation(): void {
    let updatedStation = this.stations[this.updatedIndex];
    updatedStation.url = this.url;
    updatedStation.name = this.name;
    updatedStation.favorite = this.fav;
    this.dataService.updateStation(updatedStation).subscribe(()=>{
      this.getAllData;
    })
    this.url = '';
    this.name = '';
    this.fav = false;
    this.showMenu = false;
  }

  public showOptionMenu(i: number): void {
    this.showMenu = true;
    this.updatedIndex = i;
    if(this.favStation === 'true'){
      let tempStations = this.stations.filter(item => item.favorite === true);
      let indxId = tempStations[i]._id;
      this.updatedIndex = this.stations.map(item => item._id).indexOf(indxId);
    }
    if(this.searchText){
      let tempStationId = this.searchPipe.transform(this.stations,this.searchText)[i]._id
      this.updatedIndex = this.stations.map(item => item._id).indexOf(tempStationId);
    }
    this.url = this.stations[this.updatedIndex].url;
    this.name = this.stations[this.updatedIndex].name;
    this.fav = this.stations[this.updatedIndex].favorite;
  }

  public addFav(event: any,i:number){
    let updStation = this.stations[i];

    if(this.favStation === 'true'){
      let tempStations = this.stations.filter(item => item.favorite === true);
      let indx = this.stations.map(item => item._id).indexOf(tempStations[i]._id);
      updStation = this.stations[indx];
    }

    updStation.favorite = event.target.checked;

    this.dataService.updateStation(updStation).subscribe(()=>{
      this.getAllData();
    })
  }

  public deleteStation(i: number): void {
    let delId = this.stations[i]._id;
    if(this.favStation === 'true'){
      let tempStations = this.stations.filter(item => item.favorite === true);
      delId = tempStations[i]._id;
    }
    if(this.searchText){
      delId = this.searchPipe.transform(this.stations,this.searchText)[i]._id
    }
    
    if(i === this.currIndx){
      if(this.currIndx > 0){
        this.currIndx--;
        document.getElementsByTagName('audio')[0].src = this.stations[this.currIndx].url;
        this.currStation = this.stations[this.currIndx].name;
        if(!this.isPlaying)
          document.getElementsByTagName('audio')[0].play();
      }
      else{
        this.currIndx++;
        document.getElementsByTagName('audio')[0].src = this.stations[this.currIndx].url;
        this.currStation = this.stations[this.currIndx].name;
        if(!this.isPlaying)
          document.getElementsByTagName('audio')[0].play();
          this.currIndx--;
      }
    }

    this.dataService.delStation(delId).subscribe(()=>{
      this.getAllData();
    })
  }
  public playStation(i: number): void {
    this.currIndx = i;
    
    if(this.favStation === 'true'){
      let tempStations = this.stations.filter(item => item.favorite === true);
      let indxId = tempStations[i]._id;
      this.currIndx = this.stations.map(item => item._id).indexOf(indxId);
    }
    
    if(this.searchText){
      let tempStationId = this.searchPipe.transform(this.stations,this.searchText)[i]._id
      this.currIndx = this.stations.map(item => item._id).indexOf(tempStationId);
    }

    document.getElementsByTagName('audio')[0].src = this.stations[this.currIndx].url;
    if(this.isPlaying){
      document.getElementsByTagName('audio')[0].play();
      document.getElementById('playButton').classList.remove('audioPlay');
      document.getElementById('playButton').classList.add('audioStop');
      this.isPlaying = true;
    }
    this.currStation = this.stations[this.currIndx].name;

    if(this.favStation === 'true')
      this.currIndx = i;
  }
  public showInputBlock(): void {
    this.wantedToAdd = true;
  }
  public cancleInput(): void {
    this.wantedToAdd = false;
    this.url = '';
    this.name = '';
    this.fav = false;

    this.showMenu = false;
  }
  public setValue(): void{
    this.url = this.url.replace(/ /g,'');
    let station = {
      name: this.name,
      url: this.url,
      favorite: this.fav
    }
    this.dataService.addStation(station).subscribe(()=>{
      this.getAllData();
    })
    this.wantedToAdd = false;
    this.url = '';
    this.name = '';
    this.fav = false;
  }

  public getAllData(): void {
    this.dataService.getData().subscribe(
      data => {
        this.stations = data;
      }, err => {
        console.log(err);
      }
    );
  }



  public playMusic(): void {
    if(this.isPlaying){
      document.getElementsByTagName('audio')[0].play();
      document.getElementById('playButton').classList.add('audioStop');
      document.getElementById('playButton').classList.remove('audioPlay');
      this.isPlaying = false;
    }
    else {
      document.getElementsByTagName('audio')[0].pause();
      document.getElementById('playButton').classList.add('audioPlay');
      document.getElementById('playButton').classList.remove('audioStop');
      this.isPlaying = true;
    }
  }

  public adjustVolume(event: any): void {
    document.getElementsByTagName('audio')[0].volume = event.target.value/100; 
  }
  public nextStation(): void {
    this.currIndx++;
    if(this.currIndx < this.stations.length){
      document.getElementsByTagName('audio')[0].src = this.stations[this.currIndx].url;
      this.currStation = this.stations[this.currIndx].name;
    }
    else {
      this.currIndx = 0;
      document.getElementsByTagName('audio')[0].src = this.stations[this.currIndx].url;
      this.currStation = this.stations[0].name;
    }
    if(!this.isPlaying)
      document.getElementsByTagName('audio')[0].play();
  }

  public prevStation(): void {
    this.currIndx--;
    if(this.currIndx >= 0){
      document.getElementsByTagName('audio')[0].src = this.stations[this.currIndx].url;
      this.currStation = this.stations[this.currIndx].name;
    }
    else {
      this.currIndx = this.stations.length - 1;
      document.getElementsByTagName('audio')[0].src = this.stations[this.currIndx].url;
      this.currStation = this.stations[this.currIndx].name;
    }
    if(!this.isPlaying)
      document.getElementsByTagName('audio')[0].play();
  }
}