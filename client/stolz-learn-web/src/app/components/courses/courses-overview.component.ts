import { Component, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoutingService } from '../../services/routing.service';
import { BreadcrumbLabels } from '../../translations/breadcrumb.translations';
import { ButtonLabels } from '../../translations/button.translations';
import { CourseService } from '../../services/course.service';
import { GUID } from '../../types/guid.type';
import { CoursesLabels } from '../../translations/courses.translations';

@Component({
  selector: 'app-courses-overview',
  template: `<div>
      @if (anyCourses()) {
        <div>
          @for (course of courses(); track course; let i = $index) {
            <div
              class="course-card"
              (click)="onSelectCourse(course.id)"
              (keyup.enter)="onSelectCourse(course.id)"
              [tabindex]="i + 1"
            >
              <div class="text-secondary">{{ course.number }}</div>
              <div class="text-regular">{{ course.name }}</div>
            </div>
          }
        </div>
      } @else {
        <div>{{ coursesLabels.noUnarchivedCourseFound }}</div>
      }
    </div>
    <div>
      <button class="mt-4 button-primary" (click)="onNewCourse()">
        <i class="icon icon-plus"></i>
        <span class="ml-2">{{ buttonLabels.newCourse }}</span>
      </button>
    </div>`,
  standalone: true,
  imports: [CommonModule],
})
export class CoursesOverviewComponent implements OnInit {
  private readonly courseService = inject(CourseService);
  private readonly routingService = inject(RoutingService);

  protected readonly buttonLabels = ButtonLabels;
  protected readonly coursesLabels = CoursesLabels;

  protected courses = this.courseService.courses;
  protected anyCourses = computed(() => {
    const length = this.courses().length;
    return length > 0;
  });

  ngOnInit() {
    this.routingService.setBreadCrumb(1, BreadcrumbLabels.overview);
    this.routingService.setBreadCrumb(2, '');
  }

  async onNewCourse() {
    await this.routingService.toCoursesNew();
  }

  async onSelectCourse(id: GUID) {
    await this.routingService.toCourse(id);
  }
}
