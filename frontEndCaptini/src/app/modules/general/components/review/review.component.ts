import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css']
})
export class ReviewComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    const bodyElement = document.body;
    bodyElement.classList.remove("teacher-bird");
  }

}
