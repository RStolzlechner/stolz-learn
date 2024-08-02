import { Routes, UrlMatcher, UrlSegment } from '@angular/router';
import { CourseBaseComponent } from './components/course/course-base.component';
import { PlaygroundComponent } from './components/playground/playground.component';
import { CoursesArchiveComponent } from './components/courses/courses-archive.component';
import { CoursesNewComponent } from './components/courses/courses-new.component';
import { CoursesOverviewComponent } from './components/courses/courses-overview.component';
import { GUID } from './types/guid.type';
import { CoursesBaseComponent } from './components/courses/courses-base.component';
import { CourseComponent } from './components/course/course.component';
import { CourseEditComponent } from './components/course/course-edit.component';
import { QuestionBaseComponent } from './components/question/question-base.component';
import { QuestionnaireBaseComponent } from './components/questionnaire/questionnaire-base.component';
import { QuestionEditComponent } from './components/question/question-edit.component';
import { QuestionNewComponent } from './components/question/question-new.component';
import { QuestionOverviewComponent } from './components/question/question-overview.component';
import { QuestionnaireStatisticsComponent } from './components/questionnaire/questionnaire-statistics.component';
import { QuestionnaireSubmitComponent } from './components/questionnaire/questionnaire-submit.component';
import { QuestionnaireEvaluateComponent } from './components/questionnaire/questionnaire-evaluate.component';

//region matcher
function guidMatcher(path: string): UrlMatcher {
  return (url) => {
    if (url[0].path.match(GUID.regex)) {
      return {
        consumed: [url[0]],
        posParams: { [path]: new UrlSegment(url[0].path, {}) },
      };
    }

    return null;
  };
}

function numberMatcher(path: string): UrlMatcher {
  return (url) => {
    if (+url[0]) {
      return {
        consumed: [url[0]],
        posParams: { [path]: new UrlSegment(url[0].path, {}) },
      };
    }

    return null;
  };
}
//endregion

//region enums
export enum BaseRoutes {
  playground = 'playground',
  courses = 'courses',
}

export enum CoursesRoutes {
  overview = 'overview',
  archive = 'archive',
  new = 'new',
  courseId = 'course-id',
}

export enum CourseRoutes {
  course = 'course',
  edit = 'course-edit',
  question = 'question',
  questionnaire = 'questionnaire',
}

export enum QuestionRoutes {
  overview = 'overview',
  questionId = 'question-id',
  new = 'new',
}

export enum QuestionnaireRoutes {
  stepId = 'step-id',
  evaluate = 'evaluate',
  submit = 'submit',
  statistic = 'statistic',
}
//endregion

//region child routes
const questionRoutes: Routes = [
  { path: QuestionRoutes.overview, component: QuestionOverviewComponent },
  {
    matcher: guidMatcher(QuestionRoutes.questionId),
    component: QuestionEditComponent,
  },
  { path: QuestionRoutes.new, component: QuestionNewComponent },
];

const questionnaireRoutes: Routes = [
  {
    path: QuestionnaireRoutes.statistic,
    component: QuestionnaireStatisticsComponent,
  },
  {
    matcher: numberMatcher(QuestionnaireRoutes.stepId),
    children: [
      {
        path: QuestionnaireRoutes.submit,
        component: QuestionnaireSubmitComponent,
      },
      {
        path: QuestionnaireRoutes.evaluate,
        component: QuestionnaireEvaluateComponent,
      },
    ],
  },
];

const courseRoutes: Routes = [
  { path: CourseRoutes.course, component: CourseComponent },
  { path: CourseRoutes.edit, component: CourseEditComponent },
  {
    path: CourseRoutes.question,
    component: QuestionBaseComponent,
    children: questionRoutes,
  },
  {
    path: CourseRoutes.questionnaire,
    component: QuestionnaireBaseComponent,
    children: questionnaireRoutes,
  },
  { path: '**', redirectTo: CourseRoutes.course },
];
//endregion

export const routes: Routes = [
  {
    path: BaseRoutes.courses,
    component: CoursesBaseComponent,
    children: [
      { path: CoursesRoutes.overview, component: CoursesOverviewComponent },
      { path: CoursesRoutes.archive, component: CoursesArchiveComponent },
      { path: CoursesRoutes.new, component: CoursesNewComponent },
      {
        matcher: guidMatcher(CoursesRoutes.courseId),
        component: CourseBaseComponent,
        children: courseRoutes,
      },
      { path: '**', redirectTo: CoursesRoutes.overview },
    ],
  },
  { path: BaseRoutes.playground, component: PlaygroundComponent },
  { path: '**', redirectTo: `${BaseRoutes.courses}/${CoursesRoutes.overview}` },
];
