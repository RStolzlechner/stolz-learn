import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoutingService } from '../../services/routing.service';
import { BreadcrumbLabels } from '../../translations/breadcrumb.translations';

@Component({
  selector: 'app-question-edit',
  template: `<div>Hi From Question Edit</div>`,
  standalone: true,
  imports: [CommonModule],
})
export class QuestionEditComponent implements OnInit {
  private readonly routingService = inject(RoutingService);

  ngOnInit() {
    this.routingService.setBreadCrumb(3, BreadcrumbLabels.edit);
  }
}
