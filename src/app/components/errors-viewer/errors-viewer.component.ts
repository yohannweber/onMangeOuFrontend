import { Component, OnInit } from '@angular/core';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';

@Component({
  selector: 'app-errors-viewer',
  templateUrl: './errors-viewer.component.html',
  styleUrls: ['./errors-viewer.component.scss']
})
export class ErrorsViewerComponent implements OnInit {

  constructor(public errorHandler: ErrorHandlerService) { }

  ngOnInit() {
  }

}
