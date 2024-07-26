import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoutingService } from '../../services/routing.service';
import { BreadcrumbLabels } from '../../translations/breadcrumb.translations';

@Component({
  selector: 'app-course',
  template: `<div>Hi From Course</div>`,
  standalone: true,
  imports: [CommonModule],
})
export class CourseComponent implements OnInit {
  private readonly routingService = inject(RoutingService);

  ngOnInit() {
    this.routingService.setBreadCrumb(2, BreadcrumbLabels.course);
  }
}
