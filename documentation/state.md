The state object represents the loaded data on the clientside:

```[json]
{
    courses: {[id: GUID]: Course | undefined};
    loadedCourse: GUID | undefined;
    questions: {[id: GUID]: Question | undefined};
    statistic: CourseStatistic | undefined;
    quesionare: {
        questionIds: GUID[],
        answers: Answer[],
        current: number,
        statistic: QuestionareStatistic | undefined
    } | undefined
}
```