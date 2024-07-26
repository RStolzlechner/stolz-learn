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

//region child routes
const questionRoutes: Routes = [
  { path: 'overview', component: QuestionOverviewComponent },
  {
    matcher: guidMatcher('question-id'),
    component: QuestionEditComponent,
  },
  { path: 'new', component: QuestionNewComponent },
  { path: '**', redirectTo: 'overview' },
];

const questionnaireRoutes: Routes = [
  {
    matcher: guidMatcher('questionnaire-id'),
    component: QuestionnaireStatisticsComponent,
  },
  {
    matcher: numberMatcher('step-id'),
    children: [
      { path: 'submit', component: QuestionnaireSubmitComponent },
      {
        path: 'evaluate',
        component: QuestionnaireEvaluateComponent,
      },
      { path: '**', redirectTo: 'submit' },
    ],
  },
  { path: '**', redirectTo: '' },
];

const courseRoutes: Routes = [
  { path: 'course', component: CourseComponent },
  { path: 'course-edit', component: CourseEditComponent },
  {
    path: 'question',
    component: QuestionBaseComponent,
    children: questionRoutes,
  },
  {
    path: 'questionnaire',
    component: QuestionnaireBaseComponent,
    children: questionnaireRoutes,
  },
  { path: '**', redirectTo: 'course' },
];
//endregion

export const routes: Routes = [
  {
    path: 'courses',
    component: CoursesBaseComponent,
    children: [
      { path: 'overview', component: CoursesOverviewComponent },
      { path: 'archive', component: CoursesArchiveComponent },
      { path: 'new', component: CoursesNewComponent },
      {
        matcher: guidMatcher('course-id'),
        component: CourseBaseComponent,
        children: courseRoutes,
      },
      { path: '**', redirectTo: 'overview' },
    ],
  },
  { path: 'playground', component: PlaygroundComponent },
  { path: '**', redirectTo: 'courses' },
];
