import {Component, OnDestroy, OnInit} from '@angular/core';
import {Message} from "../shared/message.model";
import {Subscription} from "rxjs";
import {MessageService} from "../shared/message.service";

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.sass']
})
export class MessagesComponent implements OnInit, OnDestroy{
  messages!: Message[];
  date: string[] = [];
  loading = false;
  messagesSubscription!: Subscription;
  loadingSubscription!: Subscription;

  constructor(private messageService: MessageService) { }

  ngOnInit(): void {
    this.messagesSubscription = this.messageService.messagesChange.subscribe((messages: Message[]) => {
      this.messages = messages.reverse();
      this.orderByDate();
    })
    this.loadingSubscription = this.messageService.loadingChange.subscribe((isLoading: boolean) => {
      this.loading = isLoading;
    })
    this.messageService.getMessages();
  }

  orderByDate(){
    this.date = this.messages.map(message => {
      return new Date(message.datetime) + ' ' + new Date(message.datetime).toLocaleTimeString();
    })
  }

  ngOnDestroy(){
    this.messagesSubscription.unsubscribe();
    this.loadingSubscription.unsubscribe();
    this.messageService.stop();
  }




}
