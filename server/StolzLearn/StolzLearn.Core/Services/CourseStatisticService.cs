using StolzLearn.Core.Models.CourseStatistic;
using StolzLearn.Core.Repositories;

namespace StolzLearn.Core.Services;

public class CourseStatisticService(IQuestionRepository questionRepository, IAnswerRepository answerRepository) : ICourseStatisticService
{
    public async Task<CourseStatistic> SelectByCourseId(Guid courseId)
    {
        var questions = await questionRepository.SelectByCourseId(courseId);
        var answers = await answerRepository.SelectByCourseId(courseId);
        
        var questionIdDateDictionary = questions
            .GroupBy(q => q.DateCreate.Date)
            .ToDictionary(
                group => group.Key, 
                group => group.ToList().Select(g => g.Id).ToList());
        var answerDateDictionary = answers
            .GroupBy(a => a.DateCreate.Date)
            .ToDictionary(
                group => group.Key, 
                group => group.ToList());

        var allDatesSet = new HashSet<DateTime>(questionIdDateDictionary.Keys);
        allDatesSet.UnionWith(answerDateDictionary.Keys);
        var allDates = allDatesSet.Distinct().OrderBy(d => d);

        var statistic = new CourseStatistic();

        foreach (var date in allDates)
        {
            var questionsAtDate = questionIdDateDictionary.GetValueOrDefault(date) ?? [];
            var answersAtDate = answerDateDictionary.GetValueOrDefault(date) ?? [];

            var lastDayDataPoint = statistic.DayDataPoints.LastOrDefault();
            var dayDataPoint = new DayDataPoint()
            {
                Date = date, 
                QuestionDataPoints = lastDayDataPoint?.QuestionDataPoints.Select(qdp =>
                    new QuestionDataPoint
                    {
                        QuestionId = qdp.QuestionId,
                        TotalAnswerCnt = qdp.TotalAnswerCnt,
                        CorrectAnswerCnt = qdp.CorrectAnswerCnt
                    }).ToList() ?? []
            };

            foreach (var id in questionsAtDate) dayDataPoint.AddQuestion(id);
            foreach (var answer in answersAtDate) dayDataPoint.AddAnswer(answer);
            
            statistic.AddDayDataPoint(dayDataPoint);
        }

        return statistic;
    }
}