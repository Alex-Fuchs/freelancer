import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {StorageService} from "./storage.service";
import {enc, SHA512} from "crypto-js";

const AUTH_URL = 'http://localhost:8000/auth';
const DATA_URL = "http://localhost:8000/data"

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

/**
 * Services for the whole app.
 *
 * ATTENTION: Only use https (with encryption) to communicate with backend.
 *
 * @Author Alexander Fuchs
 */
@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private storage: StorageService, private http: HttpClient) {
  }

  /**
   * Returns observable for signing in.
   *
   * @param username username of the client
   * @param password password of the client
   */
  signIn(username: string, password: string): Observable<any> {
    let passwordHash = SHA512(password).toString(enc.Base64);
    return this.http.post<any>(AUTH_URL + '/signIn', {username, passwordHash}, httpOptions);
  }

  /**
   * Returns observable for changing the client account information. Only changes values !== ''.
   *
   * @param oldPassword old password of the client
   * @param newEmail new email of the client
   * @param newPassword new password of the client
   */
  change(oldPassword: string, newEmail: string, newPassword: string): Observable<any> {
    let token = this.storage.getToken();
    let oldPasswordHash = SHA512(oldPassword).toString(enc.Base64);

    if (newPassword === '') {
      return this.http.post(AUTH_URL + '/change', {token, oldPasswordHash, newEmail}, httpOptions);
    } else {
      let newPasswordHash = SHA512(newPassword).toString(enc.Base64);

      if (newEmail === '') {
        return this.http.post(AUTH_URL + '/change', {token, oldPasswordHash, newPasswordHash}, httpOptions);
      } else {
        return this.http.post(AUTH_URL + '/change', {token, oldPasswordHash, newPasswordHash, newEmail}, httpOptions);
      }
    }
  }

  /**
   * Returns observable for loading job data.
   */
  getJobs(): Observable<any> {
    let token = this.storage.getToken();
    return this.http.post<any>(DATA_URL + '/job', {token}, httpOptions);
  }

  /**
   * Returns observable for loading order data.
   */
  getOrders(): Observable<any> {
    let token = this.storage.getToken();
    return this.http.post<any>(DATA_URL + '/order', {token}, httpOptions);
  }

  /**
   * Returns observable for sending invoices.
   *
   * @param ids ids of the requested order
   */
  sendInvoices(ids: Array<string>): Observable<any> {
    let token = this.storage.getToken();
    return this.http.post<any>(DATA_URL + '/invoice', {token, ids}, httpOptions);
  }

  /**
   * Returns observable for sending reports.
   *
   * @param ids ids of the requested jobs
   * @param configurations configurations of the report
   */
  sendReports(ids: Array<string>, configurations: any): Observable<any> {
    let token = this.storage.getToken();
    return this.http.post<any>(DATA_URL + '/report', {token, ids, configurations}, httpOptions);
  }
}
