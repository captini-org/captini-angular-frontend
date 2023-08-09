import { AfterViewChecked, Component, Renderer2, ElementRef, OnInit, ViewChild } from '@angular/core';
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
import { IAudio } from 'src/app/models/IAudio';
import { ITask } from 'src/app/models/ITask';

@Component({
  selector: 'app-lesson-details',
  templateUrl: './lesson-details.component.html',
  styleUrls: ['./lesson-details.component.css'],
})
export class LessonDetailsComponent implements OnInit, AfterViewChecked {
  // unnecessary if working directly with DOM: class names, IDs, etc
  // @ViewChild('targetElement', { static: false }) targetElementRef!: ElementRef;
  tasksUrl = Global.apiURL + 'captini/tasks/';
  lessonUrl = Global.apiURL + 'captini/lessons/';

  constructor(
    private route: ActivatedRoute,
    private navigateRouter: Router,
    private topicService: TopicsService,
    private domSanitizer: DomSanitizer,
    private renderer: Renderer2,
    private elementRef: ElementRef,
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
  public targetElement: any;
  public div: any;
  public phone: any;
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
    //this.url = '';
    return this.domSanitizer.bypassSecurityTrustUrl(current_audio_url);
  }
  
  play_audio(url: ITask) {
    this.audio.src= url.examples[Math.floor(Math.random() * url.examples.length)].recording
    this.audio.play();
  }

  initiateRecording(id: any) {
    this.url=''
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

  ngAfterViewChecked() {
    this.targetElement = this.elementRef.nativeElement.querySelectorAll('.phones');
  }

  showPhones(div: any){
    this.hasCorrection = !this.hasCorrection;
    // find div with class name = "phones"
    const phone = div.querySelector('.phones') as HTMLElement;
    if(phone){
      // Check if there is an existing child with class "emphasis"
      const existingPhones = this.div.querySelector('.emphasis');
      if (existingPhones) {
        // If it exists, remove it before adding a new one
        this.renderer.removeChild(this.div, existingPhones);
      }
      // Create the span element
      const newSpan = this.renderer.createElement('span');
      this.renderer.addClass(newSpan,'emphasis');
      // Set the content of the <span> element (you can use innerText or innerHTML)
      this.renderer.appendChild(newSpan, this.renderer.createText('Phones displayed here'));
      // Append the <span> element as a child of the target element
      this.renderer.appendChild(phone, newSpan);
    }
    else {
      console.error('phone div is undefined.');
    }
}

  getScore(event: Event) {

      this.answered = true;
      if (!this.jsonAudio) {
        // Show an error message or handle the case when there is no recording available
        return;
      }

      // Parse the lesson index from the URL
      const lessonPath = window.location.pathname;
      const lessonIndex = lessonPath.split('/').pop(); // Gets the last segment of the path

      if (lessonIndex) {
        this.lessonNumber = parseInt(lessonIndex, 10); // Convert string to integer
      } else {
        console.error('Lesson index not found in the URL.');
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
        formData.append('lesson', String(this.lessonNumber));
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

      /*random score*/
      this.score = 100;
      this.url=''
      // only show score on the relevant task
      const btn = event.target as HTMLElement;
      this.div = btn.closest('.card-body');
      if (this.div) {
        // Check if there is an existing child with class "score"
        const existingScore = this.div.querySelector('.score');
        if (existingScore) {
          // If it exists, remove it before adding a new one
          this.renderer.removeChild(this.div, existingScore);
        }
        // Create new child (div) to show score
        const sc = this.renderer.createElement('div');
        this.renderer.addClass(sc,'score');
        this.renderer.addClass(sc,'mt-2');
        this.renderer.addClass(sc, 'mb-2');
        // Set the content of the <span> element (you can use innerText or innerHTML)
        this.renderer.appendChild(sc, this.renderer.createText('Score: '+this.score));
        // Append the <span> element as a child of the target element
        this.renderer.appendChild(this.div, sc);
        this.showPhones(this.div);
      }
      else {
        console.error('div is undefined.');
      }
  }
}
