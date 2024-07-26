import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoutingService } from '../../services/routing.service';
import { BreadcrumbLabels } from '../../translations/breadcrumb.translations';

@Component({
  selector: 'app-question-new',
  template: `<div>Hi From Question New</div>`,
  standalone: true,
  imports: [CommonModule],
})
export class QuestionNewComponent implements OnInit {
  private readonly routingService = inject(RoutingService);

  ngOnInit() {
    this.routingService.setBreadCrumb(3, BreadcrumbLabels.newLabel);
  }
}
