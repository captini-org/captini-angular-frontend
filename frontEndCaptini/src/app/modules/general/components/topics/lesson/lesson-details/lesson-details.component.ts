import { Component, Renderer2, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ITopics } from 'src/app/models/ITopics';
import { TopicsService } from 'src/app/Shared/services/topics/topics.service';
import { ILesson } from 'src/app/models/ILesson';
import * as RecordRTC from 'recordrtc';
import { DomSanitizer } from '@angular/platform-browser';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Global } from 'src/app/common/global';
import { AuthService } from 'src/app/Shared/services/auth.service';
import { ITask } from 'src/app/models/ITask';
import { WebsocketService } from 'src/app/Shared/services/websocket/websocket.service';
import { IScore } from 'src/app/models/IScore';

@Component({
  selector: 'app-lesson-details',
  templateUrl: './lesson-details.component.html',
  styleUrls: ['./lesson-details.component.css'],
})
export class LessonDetailsComponent implements OnInit {
  tasksUrl = Global.apiURL + 'captini/tasks/';
  lessonUrl = Global.apiURL + 'captini/lessons/';

  constructor(
    private route: ActivatedRoute,
    private navigateRouter: Router,
    private topicService: TopicsService,
    private domSanitizer: DomSanitizer,
    private API: AuthService,
    private webSocketService: WebsocketService
  ) { }

  public topic_id!: number;
  public lesson_id!: number;
  public listLessons?: ILesson[];
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
  public div: any;
  public phone: any;
  jsonAudio: any;
  scoreData: IScore = {} as IScore;
  selectedTask: any;
  selectedText: any;
  // Inside your component
  taskScores: { [taskId: string]: IScore | undefined } = {};
  ngOnInit(): void {
    this.prompts = [];
    this.id_current_user = this.API.getUserId();
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.topic_id = parseInt(params.get('topicId')!);
      this.lesson_id = parseInt(params.get('id')!);
      const bodyElement = document.body;
      bodyElement.classList.add('teacher-bird');
      this.topicService.getTopicsById(this.topic_id).subscribe((data: ITopics | null | undefined) => {
        if (data != null) {
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
    //listen to the websocket server to get the score
    this.webSocketService.connectToWebSocketServer();
    // TODO: verify the user id
    this.webSocketService.socket.subscribe(
      (message) => {
        // Handle incoming WebSocket messages here
        this.handleWebSocketMessage(message);
      },
      (error) => {
        console.error('');
      },
      () => {
        console.error('');
      }
    );
  }
  check() {
    const button = document.getElementById('rec');
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
    //this.url = '';
    return this.domSanitizer.bypassSecurityTrustUrl(current_audio_url);
  }

  play_audio(url: ITask) {
    this.audio.src = url.examples[Math.floor(Math.random() * url.examples.length)].recording
    this.audio.play();
  }

  initiateRecording(id: any) {
    this.url = ''
    this.id_current_task = id;
    let mediaConstraints = {
      video: false,
      audio: true,
    };
    navigator.mediaDevices
      .getUserMedia(mediaConstraints)
      .then(this.successCallback.bind(this), this.errorCallback.bind(this));
  }

  successCallback(stream: any) {
    this.recording = true;
    var StereoAudioRecorder = RecordRTC.StereoAudioRecorder;
    this.record = new StereoAudioRecorder(stream, { numberOfAudioChannels: 1 });
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
    if (this.jsonAudio.size > max_file_size_in_bytes) {
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
    this.resetTaskScore(this.id_current_task);
    const reader = new FileReader();
    reader.onload = () => {
      const base64data = reader.result as string;
      const sendObj = {
        audio: base64data,
      };

      const formData = new FormData();
      formData.append('recording', this.jsonAudio);
      formData.append('user', this.id_current_user);
      formData.append('task', this.id_current_task);
      formData.append('lesson', String(this.lessonNumber));

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
          this.jsonAudio = null;
        })
        .catch((error) => {
          console.log('');
        });
    };

    reader.readAsDataURL(this.jsonAudio);

  }
  resetTaskScore(taskId: any) {
    this.taskScores[taskId] = undefined;
  }
  getScore(event: Event) {

    this.answered = true;
    if (!this.jsonAudio) {
      // Show an error message or handle the case when there is no recording available
      return;
    }
    this.resetTaskScore(this.id_current_task);
    const lessonPath = window.location.pathname;
    const lessonIndex = lessonPath.split('/').pop();

    if (lessonIndex) {
      this.lessonNumber = parseInt(lessonIndex, 10);
    } else {
      console.error('');
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64data = reader.result as string;
      const sendObj = {
        audio: base64data,
      };

      const formData = new FormData();
      formData.append('recording', this.jsonAudio);
      formData.append('user', this.id_current_user);
      formData.append('task', this.id_current_task);
      formData.append('lesson', String(this.lessonNumber));

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
            'Checked',
            'Your recording was sent and graded! Check your score now'
          );
          this.jsonAudio = null;
        })
        .catch((error) => {
          // Handle the error and show an error message
          console.error('');
        });
    };
    reader.readAsDataURL(this.jsonAudio);

    this.url = ''
  }
  // Handle incoming WebSocket messages
  private handleWebSocketMessage(message: any) {
    try {
      this.scoreData = message;
      if (this.scoreData.user_id == this.id_current_user) {
        this.taskScores[this.scoreData.task_id] = this.scoreData;
      }
    } catch (error) {
      console.error('');
    }
  }
  openScoreReportModal(task: any, task_text: string) {
    this.selectedTask = task; // Set the task data to be displayed in the modal
  }
  getBackgroundColor(value: number | undefined): string {
    if (value != undefined) {
      if (value < 50) {
        return '#FF3333'; // Red
      } else if (value < 70) {
        return '#FFA500'; // Orange
      } else {
        return '#4CAF50'; // Green
      }
    }
    return '#4CAF50';
  }
}
