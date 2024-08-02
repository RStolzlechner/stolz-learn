import { Component, computed, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoutingService } from '../../services/routing.service';
import { BreadcrumbLabels } from '../../translations/breadcrumb.translations';
import { CourseService } from '../../services/course.service';
import { GUID } from '../../types/guid.type';
import { CoursesLabels } from '../../translations/courses.translations';
import { ButtonLabels } from '../../translations/button.translations';

@Component({
  selector: 'app-courses-archive',
  template: `@if (anyCourses()) {
      <table>
        @for (course of courses(); track course) {
          <tr>
            <td>{{ course.number }}</td>
            <td>{{ course.name }}</td>
            <td class="w-5">
              <button class="button-secondary" (click)="onRestore(course.id)">
                <i class="icon icon-restore"></i>
              </button>
            </td>
          </tr>
        }
      </table>
    } @else {
      <div>{{ coursesLabels.noArchivedCourseFound }}</div>
    }
    <div>
      <button class="mt-4 button-secondary" (click)="onBack()">
        <i class="icon icon-back"></i>
        <span class="ml-2">{{ ButtonLabels.back }}</span>
      </button>
    </div>`,
  standalone: true,
  imports: [CommonModule],
})
export class CoursesArchiveComponent implements OnInit, OnDestroy {
  private readonly routingService = inject(RoutingService);
  private readonly courseService = inject(CourseService);

  protected courses = this.courseService.courses;
  protected anyCourses = computed(() => {
    const length = this.courses().length;
    return length > 0;
  });

  async ngOnInit() {
    this.routingService.setBreadCrumb(1, BreadcrumbLabels.archive);

    await this.courseService.loadCourses({ isArchived: true });
  }

  async ngOnDestroy() {
    await this.courseService.loadCourses({ isArchived: false });
  }

  async onRestore(id: GUID) {
    await this.courseService.restoreCourse(id);
  }

  protected readonly coursesLabels = CoursesLabels;
  protected readonly ButtonLabels = ButtonLabels;

  async onBack() {
    await this.routingService.toCoursesOverview();
  }
}
