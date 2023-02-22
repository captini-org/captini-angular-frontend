import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, ParamMap, Router } from '@angular/router'
import { ITopics } from 'src/app/models/ITopics'
import { TopicsService } from 'src/app/Shared/services/topics/topics.service'
import { ILesson } from 'src/app/models/ILesson'
import * as RecordRTC from 'recordrtc'
import { WriteVarExpr } from '@angular/compiler'
import { DomSanitizer } from '@angular/platform-browser'
import Swal from 'sweetalert2/dist/sweetalert2.js';
@Component({
  selector: 'app-lesson-details',
  templateUrl: './lesson-details.component.html',
  styleUrls: ['./lesson-details.component.css'],
})
export class LessonDetailsComponent implements OnInit {
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

    //console.warn(this.topic_id);

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
          console.log(this.listLessons)
          this.lesson_by_id = this.listLessons?.find((i) => i.id === this.lesson_id)!
          this.index_lesson = this.listLessons?.findIndex((i) => i == this.lesson_by_id)
          this.prompts = this.Responsedata.lessons[this.index_lesson].prompts
          console.log(this.prompts)
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
    //this.audio.src = 'https://rr5---sn-4g5e6nss.googlevideo.com/videoplayback?expire=1667491409&ei=8ZFjY-KWJd6T8wTC77mQAg&ip=64.145.79.52&id=o-AI7L1lFwvaYTPQmEWXy4SFiYXvhIR-Olty6sbryxbTZo&itag=18&source=youtube&requiressl=yes&spc=yR2vp7z4P6TsaS40VpvmSOzL19VT_OA&vprv=1&mime=video%2Fmp4&ns=zkMDlt5-xv_ZS-yIzTahIKII&cnr=14&ratebypass=yes&dur=164.188&lmt=1664233570569943&fexp=24001373,24007246&c=WEB&txp=1438434&n=5vN8czjTb1rKAA&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cspc%2Cvprv%2Cmime%2Cns%2Ccnr%2Cratebypass%2Cdur%2Clmt&sig=AOq0QJ8wRQIhAL8XlhZXB7gC6e_dEFSO9iMizOTk0v97FUSJ9iaxMzo7AiBfsfEcvxy7sJ4wfb7VqihE0sDa9X2DQE33PYzvwzYgWw%3D%3D&redirect_counter=1&cm2rm=sn-ab5eee7z&req_id=1f2eaceccc4ca3ee&cms_redirect=yes&cmsv=e&mh=SZ&mip=197.26.102.1&mm=34&mn=sn-4g5e6nss&ms=ltu&mt=1667469421&mv=m&mvi=5&pl=18&lsparams=mh,mip,mm,mn,ms,mv,mvi,pl&lsig=AG3C_xAwRQIgIr7xNs-5NQ4AI3ZeeGXuZzJrWnxDxmjSlX8EUJEXWGoCIQDz6-2mw8Rd1qlCYmZ_bgBnzVWLDTuOF5TfoJuBPAiP0w%3D%3D'
    console.log(url)
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
    // this.recording = true
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
    //console.log("testing recrding")
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
    const reader = new FileReader()
    let sendObj = {
      audio : this.jsonAudio
    }
    reader.readAsDataURL(this.jsonAudio)
    reader.addEventListener(
      'load',
      () => {
        const base64data = reader.result
        sendObj.audio = base64data
      },
      false
    )
    console.log(sendObj.audio)
     this.jsonAudio = sendObj.audio
    var formData = new FormData()
    var request = new XMLHttpRequest()
    formData.append('recording', this.jsonAudio)
    //formData.append("user",this.id_current_user)
    formData.append("user","2")
    formData.append("task",this.id_current_task)
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer "  + localStorage.getItem("token"))
    let requestOptions :RequestInit ={
      method: 'POST',
      headers: myHeaders,
      body: formData,
      redirect: 'follow'
    };
   
    fetch("https://captini-backend.herokuapp.com/captini/tasks/"+this.id_current_task +"/upload/", requestOptions)
      .then(response =>  {

        this.showSuccessMessage(
          'Tasks Recordings',
          'Your recording was successfully sent! wait for the community feedbacks!'
        
         
      )
      })
      .then(result => console.log(result))
      .catch(error => console.log('error', error));
     
    /*    
    request.open('POST', 'https://captini-backend.herokuapp.com/captini/tasks/2/upload/', true)
    request.send(formData)
    console.log(request.status)*/
  }
}
