import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoutingService } from '../../services/routing.service';
import { BreadcrumbLabels } from '../../translations/breadcrumb.translations';
import { ButtonLabels } from '../../translations/button.translations';
import { ConfirmationService } from '../../services/confirmation.service';
import { CourseService } from '../../services/course.service';
import { StatusMessageService } from '../../services/status-message.service';
import { CoursesLabels } from '../../translations/courses.translations';

@Component({
  selector: 'app-course',
  template: `<div>TODO Statistics here</div>
    <div>
      <span>TODO other Buttons</span>
      <button class="button-secondary ml-3" (click)="onQuestionsClicked()">
        <i class="icon icon-questions"></i>
        <span class="ml-2">{{ ButtonLabels.questions }}</span>
      </button>
      <button class="button-secondary ml-3" (click)="onEditClicked()">
        <i class="icon icon-pencil"></i>
        <span class="ml-2">{{ ButtonLabels.edit }}</span>
      </button>
      <button class="button-secondary ml-3" (click)="onArchiveClicked()">
        <i class="icon icon-trash"></i>
        <span class="ml-2">{{ ButtonLabels.archive }}</span>
      </button>
    </div>`,
  standalone: true,
  imports: [CommonModule],
})
export class CourseComponent implements OnInit {
  private readonly routingService = inject(RoutingService);
  private readonly courseService = inject(CourseService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly statusService = inject(StatusMessageService);

  ngOnInit() {
    this.routingService.setBreadCrumb(2, BreadcrumbLabels.overview);
  }

  protected readonly ButtonLabels = ButtonLabels;

  async onEditClicked() {
    await this.routingService.toCourseEdit();
  }

  onArchiveClicked() {
    this.confirmationService.open({
      text: CoursesLabels.archiveConfirmation,
      isDanger: true,
      action: async () => {
        const course = this.routingService.course();
        if (!course) {
          console.error('CourseComponent::OnArchiveClicked course not loaded');
          return;
        }
        await this.courseService.archiveCourse(course.id);
        await this.routingService.toCoursesOverview();
        this.statusService.addMessage({
          message: `${CoursesLabels.archiveSuccess1} ${course.name} ${CoursesLabels.archiveSuccess2}`,
          type: 'success',
        });
      },
    });
  }

  async onQuestionsClicked() {
    await this.routingService.toQuestionOverview();
  }
}
