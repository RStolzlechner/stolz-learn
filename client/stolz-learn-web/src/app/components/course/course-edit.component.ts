import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoutingService } from '../../services/routing.service';
import { BreadcrumbLabels } from '../../translations/breadcrumb.translations';

@Component({
  selector: 'app-course-edit',
  template: `<div>Hi From Course Edit</div>`,
  standalone: true,
  imports: [CommonModule],
})
export class CourseEditComponent implements OnInit {
  private readonly routingService = inject(RoutingService);

  ngOnInit() {
    this.routingService.setBreadCrumb(2, BreadcrumbLabels.edit);
  }
}
