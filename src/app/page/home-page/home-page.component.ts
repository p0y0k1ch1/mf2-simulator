import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: [
    './home-page.component.scss',
  ],
})
export class HomePageComponent implements OnInit
{
  icon: string;

  constructor() {}

  ngOnInit(): void
  {
    this.initIcon();
  }

  initIcon(): void
  {
    const min = 1;
    const max = 25;
    const id = Math.floor(Math.random() * (max - min + 1)) + min;
    this.icon = `/assets/img/pixie/${id}.jpg`;
  }
}
