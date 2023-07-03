import { Component, OnInit } from '@angular/core';
import { ActivatedRoute ,Router} from '@angular/router';
import { ILesson } from 'src/app/models/ILesson';
import { ITopics } from 'src/app/models/ITopics';
import { TopicsService } from 'src/app/Shared/services/topics/topics.service';

@Component({
  selector: 'app-lesson',
  templateUrl: './lesson.component.html',
  styleUrls: ['./lesson.component.css']
})
export class LessonComponent implements OnInit {

  constructor(private route:ActivatedRoute ,private topicService:TopicsService ,private navigate:Router) { }
  public topic_id :number|undefined;
  public listtopics?:ITopics[];
  public topic_by_id !:ITopics;
  public listlesson ?:ILesson[];
  ngOnInit(): void {
    let id =+this.route.snapshot.paramMap.get('id')!;
    this.topic_id=id;
    const bodyElement = document.body;
    bodyElement.classList.remove("teacher-bird");
    this.topicService.getTopicsById(this.topic_id).subscribe((data) => {
      if (data != null) {
        //this.loading = false;
        this.topic_by_id = data;
        this.listlesson = this.topic_by_id?.lessons;
        this.listlesson?.sort((a, b) => a.number - b.number);
        
      }
    })
  }
  
  gotodetails(lesson_id:any,topic_by_id:any) {
    this.navigate.navigate(['/lesson',topic_by_id,lesson_id]);
  }

}