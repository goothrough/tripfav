import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-top',
  templateUrl: './top.component.html',
  styleUrls: ['./top.component.scss']
})
export class TopComponent implements OnInit {
  welcomeMessage: string;


  constructor(private router: Router) { }

  ngOnInit(): void {
    
  }

  onStart(){
    this.router.navigateByUrl('/home');
  }

}
