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
  Responsedata: any;
  public listtopics?:ITopics[];
  public topic_by_id !:ITopics;
  public listlesson ?:ILesson[];
  ngOnInit(): void {
    let id =+this.route.snapshot.paramMap.get('id')!;
    this.topic_id=id;
    this.topicService.getTopics().subscribe(
      data=>{
        if(data!=null)
        {
          //this.loading = false;
          this.Responsedata=data;
          let listT = []
          //this.loading = false;
          this.Responsedata=data;
          for(const prop in this.Responsedata){
            listT.push(this.Responsedata[prop]);
          }
          this.listtopics = listT

          console.log(this.listtopics);
          this.topic_by_id= this.listtopics?.find(i => i.id === this.topic_id)!;

          /**sort the lessons here, not by id but by extracting the prompt and order it**/
          if (this.topic_by_id?.lessons) {
            this.topic_by_id.lessons.sort((a, b) => (a.id || 0) - (b.id || 0));
          }
        }
      }
      )
      const bodyElement = document.body;
      bodyElement.classList.remove("teacher-bird");
  }
  gotodetails(less_id:any,topic_by_id:any) {
    this.navigate.navigate(['/lesson',topic_by_id,less_id]);
  }

}
