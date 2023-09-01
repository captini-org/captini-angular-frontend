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
  Responsedata: any;
  listlessonsstatistics: any;
  
  ngOnInit(): void {
    this.listlessonsstatistics = []
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

    const user_id = localStorage.getItem("id"); // Get the current user's ID
    this.topicService.getTopicStatisticsById(id, user_id).subscribe(
      data=>{ 
        if(data!=null)
        {
          this.listlessonsstatistics = []
          //this.loading = false;
          this.Responsedata=data;
          for(const prop in data){
            this.listlessonsstatistics.push(this.Responsedata[prop]);
          }
          this.listlessonsstatistics.sort((a: number[], b: number[]) => a[0] - b[0]);
          console.log(this.listlessonsstatistics);
        }
      })
  }
  
  gotodetails(lesson_id:any,topic_by_id:any) {
    this.navigate.navigate(['/lesson',topic_by_id,lesson_id]);
  }

}