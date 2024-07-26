import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoutingService } from '../../services/routing.service';
import { BreadcrumbLabels } from '../../translations/breadcrumb.translations';
import { ButtonLabels } from '../../translations/button.translations';

@Component({
  selector: 'app-courses-overview',
  template: `<div>Hi From Courses Overview</div>
    <div>
      <button class="mt-4 button-primary" (click)="onNewCourse()">
        <i class="icon icon-plus"></i>
        <span class="ml-2">{{ ButtonLabels.newCourse }}</span>
      </button>
    </div>`,
  standalone: true,
  imports: [CommonModule],
})
export class CoursesOverviewComponent implements OnInit {
  private readonly routingService = inject(RoutingService);

  private buttonLabels = ButtonLabels;

  ngOnInit() {
    this.routingService.setBreadCrumb(1, BreadcrumbLabels.overview);
  }

  async onNewCourse() {
    await this.routingService.toCoursesNew();
  }

  protected readonly ButtonLabels = ButtonLabels;
}
