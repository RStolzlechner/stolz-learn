import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoutingService } from '../../services/routing.service';
import { BreadcrumbLabels } from '../../translations/breadcrumb.translations';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CoursesLabels } from '../../translations/courses.translations';
import { CourseService } from '../../services/course.service';
import { ButtonLabels } from '../../translations/button.translations';

@Component({
  selector: 'app-course-edit',
  template: ` <form [formGroup]="courseForm">
    <div class="text-caption">{{ coursesLabels.editCourseHeader }}</div>
    <div class="text-secondary">
      {{ coursesLabels.editCourseDescription }}
    </div>
    <div class="mt-4">
      <input
        #numberInput
        class="w-10rem"
        formControlName="number"
        [placeholder]="coursesLabels.numberLabel"
      />
    </div>
    <div class="mt-2">
      <input
        class="w-25rem"
        formControlName="name"
        [placeholder]="coursesLabels.nameLabel"
      />
    </div>
    <div class="flex mt-4">
      <button
        class="button-primary"
        [disabled]="!courseForm.valid"
        (click)="onSave()"
      >
        <i class="icon icon-save"></i>
        <span class="ml-2"> {{ buttonLabels.save }}</span>
      </button>
      <button class="button-secondary ml-3" type="button" (click)="onCancel()">
        <i class="icon icon-times"></i>
        <span class="ml-2"> {{ buttonLabels.cancel }}</span>
      </button>
    </div>
  </form>`,
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class CourseEditComponent implements OnInit {
  private readonly routingService = inject(RoutingService);
  private readonly courseService = inject(CourseService);
  private readonly formBuilder = inject(FormBuilder);

  protected courseForm!: FormGroup;

  async ngOnInit() {
    this.routingService.setBreadCrumb(2, BreadcrumbLabels.edit);
    this.courseForm = this.formBuilder.group({
      number: ['', Validators.required],
      name: ['', Validators.required],
    });

    let course = this.routingService.course();
    if (!course) {
      await this.courseService.loadCourses({ isArchived: false });
      course = this.routingService.course();
    }
    if (!course) {
      console.error('CourseEdit::NgOnInit course not loaded');
      return;
    }

    this.courseForm.setValue({ number: course.number, name: course.name });
  }

  protected readonly coursesLabels = CoursesLabels;
  protected buttonLabels = ButtonLabels;

  async onSave() {
    const course = this.routingService.course();
    if (!course) {
      console.error('CourseEdit::onSave course not loaded');
      return;
    }
    course.name = this.courseForm.value.name;
    course.number = this.courseForm.value.number;

    await this.courseService.updateCourse({ ...course });
    await this.routingService.toCourse();
  }

  async onCancel() {
    await this.routingService.toCourse();
  }
}
