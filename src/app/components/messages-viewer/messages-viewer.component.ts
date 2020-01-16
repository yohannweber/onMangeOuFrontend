import { Component, OnInit } from '@angular/core';
import { MessageHandlerService } from 'src/app/services/message-handler.service';

@Component({
  selector: 'app-messages-viewer',
  templateUrl: './messages-viewer.component.html',
  styleUrls: ['./messages-viewer.component.scss']
})
export class MessagesViewerComponent implements OnInit {

  constructor(public messageHandler : MessageHandlerService) { }

  ngOnInit() {
  }

}
