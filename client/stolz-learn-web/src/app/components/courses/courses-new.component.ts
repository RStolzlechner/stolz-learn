import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoutingService } from '../../services/routing.service';
import { BreadcrumbLabels } from '../../translations/breadcrumb.translations';

@Component({
  selector: 'app-courses-archive',
  template: `<div>Hi From Courses New</div>`,
  standalone: true,
  imports: [CommonModule],
})
export class CoursesNewComponent implements OnInit {
  private readonly routingService = inject(RoutingService);

  ngOnInit() {
    this.routingService.setBreadCrumb(1, BreadcrumbLabels.newLabel);
  }
}
