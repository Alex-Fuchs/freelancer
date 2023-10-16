import {Injectable} from '@angular/core';

const KEY_TOKEN = "token"

/**
 * Storage for the token.
 *
 * @author Alexander Fuchs
 */
@Injectable({
  providedIn: 'root'
})
export class StorageService {

  /**
   * Saves token in localStorage.
   *
   * @param token token to save
   */
  saveToken(token: string): void {
    localStorage.removeItem(KEY_TOKEN);
    localStorage.setItem(KEY_TOKEN, token);
  }

  /**
   * Returns if a token is saved.
   */
  isToken(): boolean {
    return this.getToken().length !== 0;
  }

  /**
   * Returns the token and if no taken is saved an empty string
   */
  getToken(): string {
    let token = localStorage.getItem(KEY_TOKEN);

    if (token) {
      return token;
    } else {
      return "";
    }
  }

  /**
   * Removes the token if a token exists
   */
  public clear(): void {
    localStorage.removeItem(KEY_TOKEN);
  }
}
