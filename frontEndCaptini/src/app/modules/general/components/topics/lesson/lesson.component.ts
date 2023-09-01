import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ILesson } from 'src/app/models/ILesson';
import { ITopics } from 'src/app/models/ITopics';
import { AuthService } from 'src/app/Shared/services/auth.service';
import { UserService } from 'src/app/Shared/services/profile/user.service';
import { TopicsService } from 'src/app/Shared/services/topics/topics.service';

@Component({
  selector: 'app-lesson',
  templateUrl: './lesson.component.html',
  styleUrls: ['./lesson.component.css']
})
export class LessonComponent implements OnInit {
  public topic_id: number | undefined;

  public listtopics?: ITopics[];
  public topic_by_id!: ITopics;
  public listlesson!: ILesson[];
  Responsedata: any;
  searchText: string = '';
  listlessonsstatistics: any;

  constructor(
    private route: ActivatedRoute,
    private topicService: TopicsService,
    private navigate: Router,
    private API: AuthService,
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    this.topic_id = Number(this.route.snapshot.paramMap.get('id')!);
    let userID = this.API.getUserId();

    document.body.classList.remove('teacher-bird');
    this.getTopicStatistiscsById(userID, this.topic_id);
    this.searchLessons();
  }

  searchLessons() {
    this.topicService
      .searchLessons(this.topic_id, this.searchText)
      .subscribe((data) => {
        if (data != null) {
          this.Responsedata = data;
          this.listlesson = Object.values(this.Responsedata);
          this.listlesson?.sort((a, b) => a.number - b.number);
        }
      });
  }

  getTopicStatistiscsById(user_id: any, topic_id: any) {
    this.topicService.getTopicStatisticsById(topic_id, user_id).subscribe(
      (data) => {
        if (data != null) {
          this.listlessonsstatistics = [];
          this.Responsedata = data;
          for (const prop in data) {
            this.listlessonsstatistics.push(this.Responsedata[prop]);
          }
          this.listlessonsstatistics.sort(
            (a: number[], b: number[]) => a[0] - b[0]
          );
          console.log(this.listlessonsstatistics);
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  goToDetails(lesson_id: any, topic_by_id: any) {
    this.navigate.navigate(['/lesson', topic_by_id, lesson_id]);
  }

  onSearchChange(event: any) {
    const searchValue = event.target.value;
    this.searchText = searchValue;
    this.searchLessons();
  }
}
