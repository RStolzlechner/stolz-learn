import { Component, effect, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoutingService } from '../../services/routing.service';
import { BreadcrumbLabels } from '../../translations/breadcrumb.translations';
import { ButtonLabels } from '../../translations/button.translations';
import { ConfirmationService } from '../../services/confirmation.service';
import { CourseService } from '../../services/course.service';
import { StatusMessageService } from '../../services/status-message.service';
import { CoursesLabels } from '../../translations/courses.translations';
import { QuestionnaireService } from '../../services/questionnaire.service';
import { QuestionnaireLabels } from '../../translations/questionnaire.translations';
import { CourseStatisticModel } from '../../models/course-statistic.model';
import { Chart, registerables } from 'chart.js';
import 'chartjs-adapter-date-fns';

@Component({
  selector: 'app-course',
  template: ` <canvas id="courseChart" class="w-percent-90 h-60vh"></canvas>
    <div class="mt-4">
      <button class="button-primary" (click)="onStartQuestionnaire()">
        <i class="icon icon-plus"></i>
        <span class="ml-2">{{ ButtonLabels.startQuestionnaire }}</span>
      </button>
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
  private readonly questionnaireService = inject(QuestionnaireService);

  constructor() {
    effect(
      async () => {
        const courseId = this.routingService.courseId();
        if (!courseId) return;

        const courseStatistics =
          await this.courseService.getCourseStatistic(courseId);

        if (courseStatistics) {
          this.createChart(courseStatistics);
        }
      },
      { allowSignalWrites: true },
    );

    Chart.register(...registerables);
  }

  ngOnInit() {
    this.routingService.setBreadCrumb(2, BreadcrumbLabels.overview);
    this.routingService.setBreadCrumb(3, '');
  }

  protected readonly ButtonLabels = ButtonLabels;
  protected readonly QuestionnaireLabels = QuestionnaireLabels;

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

  async onStartQuestionnaire() {
    const ok = this.questionnaireService.start();
    if (!ok) {
      this.statusService.addMessage({
        message: QuestionnaireLabels.failedToStart,
        type: 'error',
      });
      return;
    }

    await this.routingService.toQuestionnaireSubmit(1);
  }

  private createChart(courseStatistics: CourseStatisticModel): void {
    const ctx = (
      document.getElementById('courseChart') as HTMLCanvasElement
    ).getContext('2d');
    if (!ctx) {
      console.error('CourseComponent::createChart canvas not found');
      return;
    }

    const data = courseStatistics.dayDataPoints;
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.map((item) => item.date, false), // Format dates as you prefer
        datasets: [
          {
            label: 'Correct Count',
            data: data.map((item) => item.correctCnt),
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.5)',
          },
          {
            label: 'Question Count',
            data: data.map((item) => item.questionCnt),
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
          },
        ],
      },
      options: {
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'day',
              tooltipFormat: 'MMM dd, yyyy', // Specify the display format for tooltips
            },
            title: {
              display: true,
              text: 'Date',
            },
          },
          y: {
            beginAtZero: true, // Adjust this based on your data
            title: {
              display: true,
              text: 'Count',
            },
          },
        },
      },
    });
  }
}
