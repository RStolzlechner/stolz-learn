import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoutingService } from '../../services/routing.service';
import { BreadcrumbLabels } from '../../translations/breadcrumb.translations';
import { ButtonLabels } from '../../translations/button.translations';

@Component({
  selector: 'app-course',
  template: `<div>TODO Statistics here</div>
    <div>
      <span>TODO other Buttons</span>
      <button class="button-secondary" (click)="onEditClicked()">
        <i class="icon icon-pencil"></i>
        <span class="ml-2">{{ ButtonLabels.edit }}</span>
      </button>
    </div>`,
  standalone: true,
  imports: [CommonModule],
})
export class CourseComponent implements OnInit {
  private readonly routingService = inject(RoutingService);

  ngOnInit() {
    this.routingService.setBreadCrumb(2, BreadcrumbLabels.overview);
  }

  protected readonly ButtonLabels = ButtonLabels;

  async onEditClicked() {
    await this.routingService.toCourseEdit();
  }
}
