import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ITopics } from 'src/app/models/ITopics';
import { LangService } from 'src/app/Shared/services/lang.service';
import { TopicsService } from 'src/app/Shared/services/topics/topics.service';

@Component({
  selector: 'app-topics',
  templateUrl: './topics.component.html',
  styleUrls: ['./topics.component.css'],
})
export class TopicsComponent implements OnInit {
  listtopics: ITopics[] = [];
  searchText = '';

  constructor(
    private langService: LangService,
    private topicService: TopicsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchTopics('');
    document.body.classList.remove('teacher-bird');
  }

  fetchTopics(query: string): void {
    this.topicService.searchTopics(query).subscribe((data) => {
      if (data != null) {
        this.listtopics = Object.values(data);
        this.listtopics.sort((a, b) => a.number - b.number);
      }
    });
  }

  goToLessons(topic: ITopics): void {
    this.router.navigate(['/topics', topic.id]);
  }

  onSearchChange(event: any): void {
    const searchValue = event.target.value;
    this.searchText = searchValue;
    this.fetchTopics(this.searchText);
  }
}
