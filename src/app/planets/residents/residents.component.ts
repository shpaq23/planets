import {Component, Input, OnInit} from '@angular/core';
import {Resident} from '../interfaces/resident';
import {MatTableDataSource} from '@angular/material';

@Component({
  selector: 'app-residents',
  templateUrl: './residents.component.html',
  styleUrls: ['./residents.component.css']
})
export class ResidentsComponent implements OnInit {

  @Input() residents: Resident[];

  private dataSource: MatTableDataSource<Resident>;
  private columns = ['name', 'height', 'mass', 'hair_color', 'skin_color',
  'eye_color', 'birth_year', 'gender'];
  constructor() { }

  ngOnInit() {
    this.dataSource = new MatTableDataSource<Resident>(this.residents);
  }

}
