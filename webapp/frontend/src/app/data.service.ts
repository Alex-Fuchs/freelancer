import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

const DATA_URL = "http://127.0.0.1:8000"

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  photo_rater(file: File): Observable<any> {
    const formData: FormData = new FormData();

    formData.append('file', file);

    return this.http.post<any>(DATA_URL + '/photo_rater', formData,  {});
  }

  face_enhancer(file: File): Observable<any> {
    const formData: FormData = new FormData();

    formData.append('file', file);

    return this.http.post<any>(DATA_URL + '/face_enhancer', formData,  {});
  }

  bio_creator(text: string): Observable<any> {
    const formData: FormData = new FormData();

    formData.append('text', text);

    return this.http.post<any>(DATA_URL + '/bio_creator', formData,  {});
  }

  message_suggestor(file: File): Observable<any> {
    const formData: FormData = new FormData();

    formData.append('file', file);

    return this.http.post<any>(DATA_URL + '/message_suggestor', formData,  {});
  }

  contact(prename: string, surname: string, email: string, organization: string, message: string): Observable<any> {
    const formData: FormData = new FormData();

    formData.append('prename', prename);
    formData.append('surname', surname);
    formData.append('email', email);
    formData.append('organization', organization);
    formData.append('message', message);

    return this.http.post<any>(DATA_URL + '/contact', formData,  {});
  }
}
