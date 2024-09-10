import {Component} from '@angular/core';
import {DataService} from "../data.service";
import {HttpEventType, HttpResponse} from "@angular/common/http";
import {Observable} from "rxjs";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  public selectedFile: File | null

  score: Observable<any>

  progress: number
  preview: string
  message: string

  constructor(private dataService: DataService) { }

  select(event: any) {
    this.selectedFile = event.target.files[0];

    const reader = new FileReader();

    reader.onload = (e: any) => {
      this.preview = e.target.result;
    };

    reader.readAsDataURL(this.selectedFile);
  }

  upload() {
    this.dataService.upload(this.selectedFile).subscribe({
      next: (event: any) => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progress = Math.round(100 * event.loaded / event.total);
        } else if (event instanceof HttpResponse) {
          this.score = event.body.message;
        }
      }, error: (err: any) => {
        console.log(err);

        if (err.error && err.error.message) {
          this.message = err.error.message;
        } else {
          this.message = 'Could not upload the file.';
        }

        this.score = undefined;
      }
    });
  }
}
