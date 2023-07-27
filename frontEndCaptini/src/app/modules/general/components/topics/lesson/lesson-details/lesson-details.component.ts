import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ITopics } from 'src/app/models/ITopics';
import { TopicsService } from 'src/app/Shared/services/topics/topics.service';
import { ILesson } from 'src/app/models/ILesson';
import * as RecordRTC from 'recordrtc';
import { WriteVarExpr } from '@angular/compiler';
import { DomSanitizer } from '@angular/platform-browser';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Global } from 'src/app/common/global';
import { IPrompts } from 'src/app/models/IPrompts';
@Component({
  selector: 'app-lesson-details',
  templateUrl: './lesson-details.component.html',
  styleUrls: ['./lesson-details.component.css'],
})
export class LessonDetailsComponent implements OnInit, AfterViewInit {
  @ViewChild('phones', { static: true }) targetElementRef!: ElementRef;
  tasksUrl = Global.apiURL + 'captini/tasks/';
  lessonUrl = Global.apiURL + 'captini/lessons/';
  constructor(
    private route: ActivatedRoute,
    private navigateRouter: Router,
    private topicService: TopicsService,
    private domSanitizer: DomSanitizer
  ) {}

  public topic_id!: number;
  public lesson_id!: number;
  public listLessons?: ILesson[];
  public listtopics?: ITopics[];
  public topic_by_id?: ITopics;
  public lesson_by_id?: ILesson;
  public index_lesson!: number;
  public prompts?: any[];
  public audio = new Audio();
  public audio_paused = true;
  public recording = false;
  public record: any;
  public url = '';
  public error = '';
  public id_current_task: any;
  public id_current_user: any;
  public score!: number;
  public lessonNumber: any;
  public hasCorrection = false;
  public answered = false;
  private i = 0;

  jsonAudio: any;

  ngOnInit(): void {
    //get the id from the url when you navigate between 2 diffrent components
    this.prompts = [];
    this.id_current_user = localStorage.getItem('id');
    //get the id from the url when you navigate in the same component
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.topic_id = parseInt(params.get('topicId')!);
      this.lesson_id = parseInt(params.get('id')!);
      const bodyElement = document.body;
      bodyElement.classList.add('teacher-bird');
      // problem
      this.topicService.getTopicsById(this.topic_id).subscribe((data) => {
        if (data != null) {
          //this.loading = false;
          this.topic_by_id = data;
          this.listLessons = [];
          this.listLessons = this.topic_by_id?.lessons;
          this.listLessons?.sort((a, b) => a.number - b.number);
          this.lesson_by_id = this.listLessons?.find(
            (i) => i.id === this.lesson_id
          );
          if (this.listLessons) {
            this.index_lesson = this.listLessons?.findIndex(
              (i) => i == this.lesson_by_id
            );
          } else {
            this.index_lesson = 0;
          }

          this.prompts = this.lesson_by_id?.prompts;
          this.prompts?.sort((a, b) => a.number - b.number);

          //populate score
          this.score = 0;
          this.i += 1;
        }
      });
    });
  }
  check() {
    const button = document.getElementById('rec');
    //alert('gdflmgjsd');
  }
  gobacktolessons() {
    this.navigateRouter.navigate(['/topics', this.topic_id], {
      state: { data: this.topic_by_id },
    });
  }
  // sort the lesson and get the next lesson of the sorted list
  goPrev() {
    let nextLesson = this.listLessons?.[this.index_lesson - 1];
    let id = nextLesson?.id;
    this.navigateRouter.navigate(['/lesson', this.topic_id, id]);
  }
  goNext() {
    let previousLesson = this.listLessons?.[this.index_lesson + 1];
    let id = previousLesson?.id;
    this.navigateRouter.navigate(['/lesson', this.topic_id, id]);
  }

  sanitize() {
    let current_audio_url = this.url;
    this.url = '';
    return this.domSanitizer.bypassSecurityTrustUrl(current_audio_url);
  }
  play_audio(url: string) {
    this.audio.src = url;
    if (this.audio_paused) {
      this.audio.play();
      this.audio_paused = false;
    } else {
      this.audio.pause();
      this.audio_paused = true;
    }
  }
  initiateRecording(id: any) {
    this.id_current_task = id;
    let mediaConstraints = {
      video: false,
      audio: true,
    };
    navigator.mediaDevices
      .getUserMedia(mediaConstraints)
      .then(this.successCallback.bind(this), this.errorCallback.bind(this));
  }

  /**
   * Will be called automatically.
   */
  successCallback(stream: any) {
    //Start Actuall Recording
    this.recording = true;
    var StereoAudioRecorder = RecordRTC.StereoAudioRecorder;
    this.record = new StereoAudioRecorder(stream);
    this.record.record();
  }
  /**
   * Stop recording.
   */
  stopRecording() {
    if (this.recording) {
      this.record.stop(this.processRecording.bind(this));
      this.recording = false;
    }

  }
  /**
   * processRecording Do what ever you want with blob
   * @param  {any} blob Blog
   */
  processRecording(blob: any) {
    this.url = URL.createObjectURL(blob);
    this.jsonAudio = blob;
    // limit size of audio file
    const max_file_size_in_bytes = 1200000;
    if(this.jsonAudio.size > max_file_size_in_bytes){
      Swal.fire("File too large", "Please record a shorter audio");
      this.jsonAudio = null;
    }
  }
  /**
   * Process Error.
   */
  errorCallback(error: string) {
    this.error = 'Can not play audio in your browser';
  }

  showSuccessMessage(
    title: any,
    message: any,
    icon = null,
    showCancelButton = true
  ) {
    return Swal.fire(title, message);
  }
  sendTask() {
    if (!this.jsonAudio) {
      // Show an error message or handle the case when there is no recording available
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const base64data = reader.result as string;
      const sendObj = {
        audio: base64data,
      };

      // Create a FormData object and append the recording data
      const formData = new FormData();
      formData.append('recording', this.jsonAudio);
      formData.append('user', this.id_current_user); // Replace with the appropriate user ID
      formData.append('task', this.id_current_task);

      const myHeaders = new Headers();
      myHeaders.append(
        'Authorization',
        'Bearer ' + localStorage.getItem('token')
      );

      const requestOptions: RequestInit = {
        method: 'POST',
        headers: myHeaders,
        body: formData,
        redirect: 'follow',
      };
      fetch(this.tasksUrl + this.id_current_task + '/upload/', requestOptions)
        .then((response) => {
          // Handle the response and show a success message
          this.showSuccessMessage(
            'Tasks Recordings',
            'Your recording was successfully sent! Wait for the community feedbacks!'
          );
          // Clear the recording data
          this.jsonAudio = null;
        })
        .catch((error) => {
          // Handle the error and show an error message
          console.log('error', error);
        });
    };

    reader.readAsDataURL(this.jsonAudio);

  }

  ngAfterViewInit() {
    console.log("afterviewinit activated");
  }

  showPhones(){
    this.hasCorrection = !this.hasCorrection;
    // Access the nativeElement after the view has been initialized
    const targetElement = this.targetElementRef?.nativeElement;
    if (targetElement) {
      // Create the span element
      const newSpan = document.createElement('span');
      newSpan.textContent = 'Phones displayed here';

      // Append the span element to the target element
      targetElement.appendChild(newSpan);
      console.log("Span appended")
    }
    else {
      console.error('targetElementRef is undefined.');
    }
  }

  getScore() {
    this.answered = true;
    if (!this.jsonAudio) {
      // Show an error message or handle the case when there is no recording available
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64data = reader.result as string;
      const sendObj = {
        audio: base64data,
      };

      // Create a FormData object and append the recording data
      const formData = new FormData();
      formData.append('recording', this.jsonAudio);
      formData.append('user', this.id_current_user); // Replace with the appropriate user ID
      formData.append('task', this.id_current_task);
      //need to pass info to identify prompt number

      const myHeaders = new Headers();
      myHeaders.append(
        'Authorization',
        'Bearer ' + localStorage.getItem('token')
      );

      const requestOptions: RequestInit = {
        method: 'POST',
        headers: myHeaders,
        body: formData,
        redirect: 'follow',
      };
      /*change url to endpoint for ai model */
      fetch(this.tasksUrl + this.id_current_task + '/upload/', requestOptions)
        .then((response) => {
          // Handle the response and show a success message
          this.showSuccessMessage(
            'Checked',
            'Your recording was sent and graded! Check your score now'
          );
          // Clear the recording data
          this.jsonAudio = null;
        })
        .catch((error) => {
          // Handle the error and show an error message
          console.log('error', error);
        });
    };
    reader.readAsDataURL(this.jsonAudio);
    /*only update the score for this task */
    this.score = 100;
    console.log('current task id' + this.id_current_task);
  }
}
