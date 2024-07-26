import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoutingService } from '../../services/routing.service';
import { BreadcrumbLabels } from '../../translations/breadcrumb.translations';

@Component({
  selector: 'app-questionnaire-evaluate',
  template: `<div>Hi From Questionnaire Evaluate</div>`,
  standalone: true,
  imports: [CommonModule],
})
export class QuestionnaireEvaluateComponent implements OnInit {
  private readonly routingService = inject(RoutingService);

  ngOnInit() {
    this.routingService.setBreadCrumb(3, 'TODO Determine Step x/y');
  }
}
