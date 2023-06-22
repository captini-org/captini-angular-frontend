import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, ParamMap, Router } from '@angular/router'
import { ITopics } from 'src/app/models/ITopics'
import { TopicsService } from 'src/app/Shared/services/topics/topics.service'
import { ILesson } from 'src/app/models/ILesson'
import * as RecordRTC from 'recordrtc'
import { WriteVarExpr } from '@angular/compiler'
import { DomSanitizer } from '@angular/platform-browser'
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Global } from 'src/app/common/global';
@Component({
  selector: 'app-lesson-details',
  templateUrl: './lesson-details.component.html',
  styleUrls: ['./lesson-details.component.css'],
})
export class LessonDetailsComponent implements OnInit {
  tasksUrl=Global.apiURL +"captini/tasks/";
  lessonUrl=Global.apiURL +"captini/lessons/";
  constructor(
    private route: ActivatedRoute,
    private navigateRouter: Router,
    private topicService: TopicsService,
    private domSanitizer: DomSanitizer
  ) {}
  public topic_id!: any
  public lesson_id!: number
  Responsedata: any
  public listLessons!: ILesson[]
  public listtopics?: ITopics[]
  public topic_by_id?: ITopics
  public lesson_by_id!: ILesson
  public index_lesson!: number
  public prompts: any
  public audio = new Audio()
  public audio_paused = true
  public recording = false
  public record: any
  public url = ''
  public error = ''
  public id_current_task: any
  public id_current_user:any
  jsonAudio: any
  ngOnInit(): void {
    //get the id from the url when you navigate between 2 diffrent components
    let topic_by_id = this.route.snapshot.paramMap.get('topicId')
    this.topic_id = topic_by_id
    this.prompts = []
    this.id_current_user = localStorage.getItem("id");
    //get the id from the url when you navigate in the same component
    this.route.paramMap.subscribe((params: ParamMap) => {
      let _idLess = parseInt(params.get('id')!)
      this.lesson_id = _idLess
      const bodyElement = document.body
      bodyElement.classList.add('teacher-bird')
      // problem 
      this.topicService.getTopicsById(this.topic_id).subscribe((data) => {
        if (data != null) {
          //this.loading = false;
          this.Responsedata = data
          this.listtopics = this.Responsedata
          this.listLessons = this.Responsedata.lessons
          this.lesson_by_id = this.listLessons?.find((i) => i.id === this.lesson_id)!
          this.index_lesson = this.listLessons?.findIndex((i) => i == this.lesson_by_id)
          this.prompts = this.Responsedata.lessons[this.index_lesson].prompts
        }
      })
    })
  }
  check() {
    const button = document.getElementById('rec')
    //alert('gdflmgjsd');
  }
  gobacktolessons() {
    this.navigateRouter.navigate(['/topics', this.topic_id])
  }
  goPrev() {
    let lesson = this.listLessons[this.index_lesson - 1]
    let id = lesson.id
    this.navigateRouter.navigate(['/lesson', this.topic_id, id])
  }
  goNext() {
    let lesson = this.listLessons[this.index_lesson + 1]
    let id = lesson.id
    this.navigateRouter.navigate(['/lesson', this.topic_id, id])
  }

  sanitize() {
    
    let current_audio_url = this.url
    this.url = ''
    return this.domSanitizer.bypassSecurityTrustUrl(current_audio_url)
  }
  play_audio(url: string) {
    this.audio.src = url
    if (this.audio_paused) {
      this.audio.play()
      this.audio_paused = false
    } else {
      this.audio.pause()
      this.audio_paused = true
    }
  }
  initiateRecording(id: any) {
    this.id_current_task = id
    let mediaConstraints = {
      video: false,
      audio: true,
    }
    navigator.mediaDevices
      .getUserMedia(mediaConstraints)
      .then(this.successCallback.bind(this), this.errorCallback.bind(this))
  }

  /**
   * Will be called automatically.
   */
  successCallback(stream: any) {
    //Start Actuall Recording
    this.recording=true
    var StereoAudioRecorder = RecordRTC.StereoAudioRecorder
    this.record = new StereoAudioRecorder(stream)
    this.record.record()
  }
  /**
   * Stop recording.
   */
  stopRecording() {
     if(this.recording ) {
      this.record.stop(this.processRecording.bind(this))
      this.recording=false
     }
    
  }
  /**
   * processRecording Do what ever you want with blob
   * @param  {any} blob Blog
   */
  processRecording(blob: any) {
    this.url = URL.createObjectURL(blob)
    this.jsonAudio = blob
  }
  /**
   * Process Error.
   */
  errorCallback(error: string) {
    this.error = 'Can not play audio in your browser'
  }

   showSuccessMessage(title :any, message:any, icon = null,showCancelButton = true){
    return Swal.fire(title, message)
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
      myHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'));
  
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
 
}
