import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  OnInit,
  viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoutingService } from '../../services/routing.service';
import { BreadcrumbLabels } from '../../translations/breadcrumb.translations';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CourseService } from '../../services/course.service';
import { DateTime } from '../../types/date-time.type';
import { GUID } from '../../types/guid.type';
import { ButtonLabels } from '../../translations/button.translations';
import { coursesLabels } from '../../translations/courses.translations';

@Component({
  selector: 'app-courses-archive',
  template: `
    <form [formGroup]="courseForm">
      <div class="text-caption">{{ coursesLabels.newCourseHeader }}</div>
      <div class="text-secondary">
        {{ coursesLabels.newCourseDescription }}
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
        <button
          class="button-secondary ml-3"
          type="button"
          (click)="onCancel()"
        >
          <i class="icon icon-times"></i>
          <span class="ml-2"> {{ buttonLabels.cancel }}</span>
        </button>
      </div>
    </form>
  `,
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class CoursesNewComponent implements OnInit, AfterViewInit {
  private readonly routingService = inject(RoutingService);
  private readonly courseService = inject(CourseService);

  private numberInput = viewChild.required<ElementRef>('numberInput');

  protected courseForm!: FormGroup;

  protected buttonLabels = ButtonLabels;
  protected coursesLabels = coursesLabels;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.routingService.setBreadCrumb(1, BreadcrumbLabels.newLabel);
    this.courseForm = this.fb.group({
      number: ['', Validators.required],
      name: ['', Validators.required],
    });
  }

  ngAfterViewInit() {
    this.numberInput().nativeElement.focus();
  }

  async onCancel() {
    await this.routingService.toCoursesOverview();
  }

  async onSave() {
    const id = await this.courseService.createCourse({
      id: GUID.empty,
      number: this.courseForm.value.number,
      name: this.courseForm.value.name,
      inArchive: false,
      dateCreate: DateTime.now(),
    });
    if (!id) return;

    await this.routingService.toCourse(id);
  }
}
