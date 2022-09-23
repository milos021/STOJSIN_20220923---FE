import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppService {

constructor(private http: HttpClient) { }
  createVideo(formData) {
    return this.http.post('/api/upload', formData)
  }

  playVideo(path: string) {
    let params = new HttpParams().set('path', path);
    return this.http.get(`/api/videoplayer`, { responseType: 'arraybuffer', params });
  }

  getAllVideos() {
    return this.http.get('/api/videos');
  }

  getAllCategories() {
    return this.http.get('/api/categories');
  }

  removeVideo(videoId: string) {
    return this.http.delete(`/api/video/${videoId}`);
  }

}
