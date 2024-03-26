import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommunityComponent } from './components/community/community.component';
import { FeedbackComponent } from './components/community/feedback/feedback.component';
import { HomeComponent } from './components/home/home.component';
import { LayoutComponent } from './components/layout/layout.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ReviewComponent } from './components/review/review.component';
import { LessonDetailsComponent } from './components/topics/lesson/lesson-details/lesson-details.component';
import { LessonComponent } from './components/topics/lesson/lesson.component';
import { TopicsComponent } from './components/topics/topics.component';
import { ReferenceComponent } from './components/reference/reference.component';

const routes: Routes = [
  { path: '', component:LayoutComponent ,
    children: [
    {
      path: 'index',
      component:HomeComponent
      //component:TopicsComponent
    },
    {
      path:'',redirectTo:'/index',pathMatch: 'full',
    },
    {
      path:'topics',
      component:TopicsComponent
    },
    {
      path:'topics/:id',
      component:LessonComponent
    },
    {
      path:'lesson/:topicId/:id',
      component:LessonDetailsComponent,
    },
    {
      path:'profile',
      component:ProfileComponent
    },
    {
      component:ReferenceComponent,
      path:'about'
    },
    /*
    {
      component:ReviewComponent,
      path:'review'
    },
    {
      component:CommunityComponent,
      path:'community'
    },
    {
      component:FeedbackComponent,
      path:'community-feedback'
    },*/
    
  ]
  
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GeneralRoutingModule { }
