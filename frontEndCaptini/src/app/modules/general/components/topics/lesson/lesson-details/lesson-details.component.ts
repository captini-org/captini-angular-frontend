import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ITopics } from 'src/app/models/ITopics';
import { TopicsService } from 'src/app/Shared/services/topics/topics.service';

@Component({
  selector: 'app-lesson-details',
  templateUrl: './lesson-details.component.html',
  styleUrls: ['./lesson-details.component.css']
})
export class LessonDetailsComponent implements OnInit {


  constructor(private route:ActivatedRoute,private navigateRouter:Router,private topicService:TopicsService) { }
  public topic_id !:any;
  public lesson_id !:number;
  Responsedata: any;
  public listtopics?:ITopics[];
  public topic_by_id ?:ITopics;
  ngOnInit(): void {
    
    //get the id from the url when you navigate between 2 diffrent components 
    let topic_by_id =this.route.snapshot.paramMap.get('topicId');
    this.topic_id=topic_by_id;
    //console.warn(this.topic_id);
    
    //get the id from the url when you navigate in the same component
    this.route.paramMap.subscribe((params:ParamMap)=>{
      let _idLess =parseInt(params.get('id')!);
    this.lesson_id=_idLess;
    })

    const bodyElement = document.body;
    bodyElement.classList.add("teacher-bird");
    this.topicService.getTopicsById(this.topic_id).subscribe(
      data=>{
        if(data!=null)
        {
          //this.loading = false;
          this.Responsedata=data;
          this.listtopics=this.Responsedata.results;
          console.warn(this.Responsedata);
        }
      }
      )
      
      
  }
  check(){
    const button= document.getElementById('rec')
     //alert('gdflmgjsd');
  }
  gobacktolessons()
  {
    this.navigateRouter.navigate(['/topics',this.topic_id]);
  }
  goPrev()
  {
    let prevId =this.lesson_id-1;
    this.navigateRouter.navigate(['/lesson',prevId]);
  }
  goNext()
  {
    let nextId =this.lesson_id+1;
    this.navigateRouter.navigate(['/lesson',nextId]);
  }

}
