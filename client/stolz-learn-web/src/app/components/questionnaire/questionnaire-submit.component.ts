import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoutingService } from '../../services/routing.service';

@Component({
  selector: 'app-questionnaire-submit',
  template: `<div>Hi From Questionnaire Submit</div>`,
  standalone: true,
  imports: [CommonModule],
})
export class QuestionnaireSubmitComponent implements OnInit {
  private readonly routingService = inject(RoutingService);

  ngOnInit() {
    this.routingService.setBreadCrumb(3, 'TODO Determine Step x/y');
  }
}
