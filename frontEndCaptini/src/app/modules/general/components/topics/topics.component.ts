import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ITopics } from 'src/app/models/ITopics';
import { LangService } from 'src/app/Shared/services/lang.service';
import {TopicsService} from 'src/app/Shared/services/topics/topics.service';
//import { Router } from '@angular/router';

@Component({
  selector: 'app-topics',
  templateUrl: './topics.component.html',
  styleUrls: ['./topics.component.css']
})
export class TopicsComponent implements OnInit {
  Responsedata: any;
  public listtopics!:ITopics[];
  listtopicsstatistics: any;

  constructor(private langService:LangService,private topicService:TopicsService ,private route:Router) { }

  ngOnInit(): void {
    this.topicService.getTopics().subscribe(
      data=>{
        if(data!=null)
        {
          this.listtopics = []
          //this.loading = false;
          this.Responsedata=data;
          for(const prop in data){
            this.listtopics.push(this.Responsedata[prop]);
          }
          this.listtopics.sort((a, b) => a.number - b.number);
          console.log(this.listtopics);
        }
      }
      )
    const bodyElement = document.body;
    bodyElement.classList.remove("teacher-bird");
    
    const id = localStorage.getItem("id"); // Get the current user's ID
    this.topicService.getTopicsStatisticsById(id).subscribe(
      data=>{ 
        if(data!=null)
        {
          this.listtopicsstatistics = []
          //this.loading = false;
          this.Responsedata=data;
          for(const prop in data){
            this.listtopicsstatistics.push(this.Responsedata[prop]);
          }
          this.listtopicsstatistics.sort((a: number[], b: number[]) => a[0] - b[0]);
          console.log(this.listtopicsstatistics);

        }
      })
    
  }
  gotolessons(topic:ITopics) {
    this.route.navigate(['/topics',topic.id]);
  }
}


