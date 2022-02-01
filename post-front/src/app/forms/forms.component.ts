import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NgForm} from "@angular/forms";
import {Subscription} from "rxjs";
import { messageData} from "../shared/message.model";
import {MessageService} from "../shared/message.service";

@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.sass']
})
export class FormsComponent implements OnInit, OnDestroy {

  @ViewChild('f') messageForm!: NgForm;
  messageSubscription!: Subscription;
  loading = false;

  constructor(private messageService: MessageService) { }

  ngOnInit(): void {
    this.messageSubscription = this.messageService.messageLoading.subscribe((isLoading: boolean) => {
      this.loading = isLoading;
    })
  }

  onSubmit(){
    const messageData : messageData  = {
      author: this.messageForm.value.author,
      message: this.messageForm.value.message
    };
    this.messageService.postMessage(messageData).subscribe(()=> {
      this.messageService.getMessages();
    });

  }

  ngOnDestroy(){
    this.messageSubscription.unsubscribe();
  }

}
