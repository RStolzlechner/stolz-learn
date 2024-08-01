const failedToStart = $localize`:questionnaire@@failedToStart:Failed to start questionnaire (maybe there are no questions)`;

const statisticsAreLoading = $localize`:questionnaire@@statisticsAreLoading:Statistics are loading...`;

const questionnaireStatistics1 = $localize`:questionnaire@@questionnaireStatistics1:from`;
const questionnaireStatistics2 = $localize`:questionnaire@@questionnaireStatistics2:answers are correct (`;
const questionnaireStatistics3 = $localize`:questionnaire@@questionnaireStatistics3:%).`;

const questionnaireStatistics = (
  correct: number,
  allSteps: number,
  percentage: number,
) =>
  `${correct} ${questionnaireStatistics1} ${allSteps} ${questionnaireStatistics2}${percentage}${questionnaireStatistics3}`;

export const QuestionnaireLabels = {
  failedToStart,
  questionnaireStatistics,
  statisticsAreLoading,
};
