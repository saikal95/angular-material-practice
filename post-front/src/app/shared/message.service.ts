import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Message, messageData} from "./message.model";
import {Observable, Subject} from "rxjs";
import {map} from "rxjs/operators";
import {environment} from "../../environments/environment";


@Injectable({
  providedIn: 'root'
})
export class MessageService {
  messages: Message[] | null | undefined;
  messagesChange = new Subject<Message[]>();
  loadingChange = new Subject<boolean>();
  messageLoading = new Subject<boolean>();
  interval!: number;
  latestMessages: Message[] | null | undefined;


  constructor(private http: HttpClient) {
  }

  getMessages() {
    this.loadingChange.next(true);
    return this.http.get<{ [id: string]: Message }>(environment.apiUrl + '/messages').pipe(map(response => {
      if (response === null) {
        return [];
      }
      return Object.keys(response).map(id => {
        const message = response[id];
        return new Message(message._id, message.message, message.author, message.datetime);
      })
    })).subscribe(result => {
      this.messages = [];
      this.messages = result;
      this.messagesChange.next(this.messages.slice());
      this.loadingChange.next(false);
      this.start(this.messages[this.messages.length - 1].datetime);
    })
  }

  postMessage(message: messageData) {
    this.messageLoading.next(true);
     return this.http.post(environment.apiUrl +'/messages', message);
  }


  start(date: string){
    const observable = new Observable<Message[]>(subscriber => {
      this.interval = setInterval(() => {
        this.http.get<{[id: string]: Message}>( environment.apiUrl + '/messages?datetime='+ date)
          .pipe(
            map(result => {
                return Object.keys(result).map(id => {
                  const message = result[id];
                  return new Message(message._id, message.message, message.author, message.datetime)
                })
              }
            ))
          .subscribe(messages => {
            if(messages.length !== 0) {
              if(this.messages) {
                this.latestMessages = this.messages.concat(messages);
                subscriber.next(this.latestMessages.slice());
              }
            }
          })
      }, 3000)
    });
    observable.subscribe((messages: Message[]) => {
      this.latestMessages = messages;
      this.messagesChange.next(this.latestMessages.slice());
    });
  }

  stop(){
    clearInterval(this.interval);
  }

}

