import {Component, Input, OnInit} from '@angular/core';
import {Film} from '../interfaces/film';
import {MatTableDataSource} from '@angular/material';

@Component({
  selector: 'app-films',
  templateUrl: './films.component.html',
  styleUrls: ['./films.component.css']
})
export class FilmsComponent implements OnInit {

  @Input() films: Film[];

  private dataSource: MatTableDataSource<Film>;
  private columns = ['title', 'episode_id', 'opening_crawl', 'director', 'release_date'];
  constructor() { }

  ngOnInit() {
    this.dataSource = new MatTableDataSource<Film>(this.films);
  }

}
