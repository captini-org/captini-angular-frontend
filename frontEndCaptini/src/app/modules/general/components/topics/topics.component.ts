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
          
        }
      }
      )
      const bodyElement = document.body;
      bodyElement.classList.remove("teacher-bird");
  }
  gotolessons(topic:ITopics) {
    this.route.navigate(['/topics',topic.id]);
  }
}


