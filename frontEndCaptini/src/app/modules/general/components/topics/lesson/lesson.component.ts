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
    this.userService.UserDetailsCatchError(userID!).subscribe((result) => {
      if (result != null) {
        this.Responsedata = result;
        console.log(this.Responsedata.completed_lessons);
      }
    });

    document.body.classList.remove('teacher-bird');
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

  goToDetails(lesson_id: any, topic_by_id: any) {
    this.navigate.navigate(['/lesson', topic_by_id, lesson_id]);
  }

  onSearchChange(event: any) {
    const searchValue = event.target.value;
    this.searchText = searchValue;
    this.searchLessons();
  }
}
