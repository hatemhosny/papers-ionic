import { environment } from '../../../environments/environment';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  env: string = environment.envName;

  constructor() { }

  ngOnInit() {
  }

}
