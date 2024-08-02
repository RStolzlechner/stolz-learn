import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { BreadcrumbLabels } from '../../translations/breadcrumb.translations';
import { RoutingService } from '../../services/routing.service';
import { CourseService } from '../../services/course.service';

@Component({
  selector: 'app-courses-base',
  template: `<router-outlet />`,
  standalone: true,
  imports: [CommonModule, RouterOutlet],
})
export class CoursesBaseComponent implements OnInit {
  private readonly courseService = inject(CourseService);
  private readonly routingService = inject(RoutingService);

  async ngOnInit() {
    this.routingService.setBreadCrumb(0, BreadcrumbLabels.courses);
  }
}
