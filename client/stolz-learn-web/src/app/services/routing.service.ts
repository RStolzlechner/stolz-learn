import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import {
  BaseRoutes,
  CourseRoutes,
  CoursesRoutes,
  QuestionnaireRoutes,
  QuestionRoutes,
} from '../app.routes';
import { GUID } from '../types/guid.type';

@Injectable({ providedIn: 'root' })
export class RoutingService {
  private readonly router = inject(Router);

  //region ids
  private readonly _courseId = signal<GUID | undefined>(undefined);
  public courseId = this._courseId.asReadonly();
  //endregion

  //region setters
  public setCourseId(courseId: string | null) {
    if (!courseId) {
      this._courseId.set(undefined);
      return;
    }
    this._courseId.set(GUID(courseId));
  }
  //endregion

  //region navigations
  public async toPlayground() {
    await this.router.navigate([BaseRoutes.playground]);
  }

  public async toCoursesOverview() {
    await this.router.navigate([BaseRoutes.courses, CoursesRoutes.overview]);
  }

  public async toCoursesArchive() {
    await this.router.navigate([BaseRoutes.courses, CoursesRoutes.archive]);
  }

  public async toCoursesNew() {
    await this.router.navigate([BaseRoutes.courses, CoursesRoutes.new]);
  }

  public async toCourse(courseId?: GUID) {
    const { ok, id } = this.getCourseId(courseId);
    if (!ok) return;

    await this.router.navigate([BaseRoutes.courses, id, CourseRoutes.course]);
  }

  public async toCourseEdit(courseId?: GUID) {
    const { ok, id } = this.getCourseId(courseId);
    if (!ok) return;

    await this.router.navigate([BaseRoutes.courses, id, CourseRoutes.edit]);
  }

  public async toQuestionOverview(courseId?: GUID) {
    const { ok, id } = this.getCourseId(courseId);
    if (!ok) return;

    await this.router.navigate([
      BaseRoutes.courses,
      id,
      CourseRoutes.question,
      QuestionRoutes.overview,
    ]);
  }

  public async toQuestionEdit(questionId: GUID, courseId?: GUID) {
    const { ok, id } = this.getCourseId(courseId);
    if (!ok) return;

    await this.router.navigate([
      BaseRoutes.courses,
      id,
      CourseRoutes.question,
      questionId,
    ]);
  }

  public async toQuestionNew(courseId?: GUID) {
    const { ok, id } = this.getCourseId(courseId);
    if (!ok) return;

    await this.router.navigate([
      BaseRoutes.courses,
      id,
      CourseRoutes.question,
      QuestionRoutes.new,
    ]);
  }

  public async toQuestionnaireStatistics(
    questionnaireId: GUID,
    courseId?: GUID,
  ) {
    const { ok, id } = this.getCourseId(courseId);
    if (!ok) return;

    await this.router.navigate([
      BaseRoutes.courses,
      id,
      CourseRoutes.questionnaire,
      questionnaireId,
    ]);
  }

  public async toQuestionnaireSubmit(step: number, courseId?: GUID) {
    const { ok, id } = this.getCourseId(courseId);
    if (!ok) return;

    await this.router.navigate([
      BaseRoutes.courses,
      id,
      CourseRoutes.questionnaire,
      step,
      QuestionnaireRoutes.submit,
    ]);
  }

  public async toQuestionnaireEvaluate(step: number, courseId?: GUID) {
    const { ok, id } = this.getCourseId(courseId);
    if (!ok) return;

    await this.router.navigate([
      BaseRoutes.courses,
      id,
      CourseRoutes.questionnaire,
      step,
      QuestionnaireRoutes.evaluate,
    ]);
  }
  //endregion

  //region helper
  private getCourseId(courseId?: GUID): { ok: boolean; id: GUID } {
    if (!courseId) {
      courseId = this.courseId();
    }
    if (!courseId) {
      console.error('No course id given or found in route');
      return { ok: false, id: GUID.empty };
    }
    return { ok: true, id: courseId };
  }
  //endregion
}
