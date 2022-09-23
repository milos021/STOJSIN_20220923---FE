import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppService } from './app.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChild('fileInput') fileInput: ElementRef;
  uploadedFiles: Array <File> ;
    form: FormGroup = this.fb.group({
      title: ['', Validators.required],
      path: ['', Validators.required],
      categoryId: ['', Validators.required]
    })
    videoList: any[] = [];
    categories: any[] = [];
    selectedVideo;
    showVideo: boolean;

    constructor(private http: HttpClient, private fb: FormBuilder, private appService: AppService, private domSanitizer: DomSanitizer) {

    }

    ngOnInit() {
      this.getAllVideos();
      this.appService.getAllCategories().subscribe((value: any) =>
      this.categories = value
    )
    }

    getAllVideos() {
      this.appService.getAllVideos().subscribe((value: any) =>
      this.videoList = value
    )
    }

    playVideo(path: string) {
      this.appService.playVideo(path).subscribe((video: any) => {
        const blob = new Blob([video], { type: 'video/mp4' });

        this.selectedVideo = this.domSanitizer.bypassSecurityTrustUrl(
          URL.createObjectURL(blob)
        );
        this.showVideo = true;
      })
    }

    fileChange(element) {
        this.uploadedFiles = element.target.files;
    }

    upload() {
        let formData = new FormData();
        for (var i = 0; i < this.uploadedFiles.length; i++) {
            formData.append("video", this.uploadedFiles[i], this.uploadedFiles[i].name);
        }
        formData.append('title', this.form.value.title);
        formData.append('categoryId', this.form.value.categoryId);
        this.appService.createVideo(formData)
            .subscribe(() => {
              this.form.reset();
              this.fileInput.nativeElement.value = '';
              this.getAllVideos();
            })
    }

    removeVideo(videoId: string) {
      this.appService.removeVideo(videoId).subscribe(()=>
        this.getAllVideos()
      );
    }

    closeVideoPlayer() {
      this.showVideo = false;
    }

}
