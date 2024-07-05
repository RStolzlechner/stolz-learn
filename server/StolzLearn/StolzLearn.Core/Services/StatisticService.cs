using StolzLearn.Core.Models.CourseStatistic;
using StolzLearn.Core.Repositories;

namespace StolzLearn.Core.Services;

public class StatisticService(IQuestionRepository questionRepository, IAnswerRepository answerRepository) : IStatisticService
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

    public async Task<QuestionnaireStatistic> SelectQuestionnaireStatistics(IEnumerable<Guid> questionIds)
    {
        var answers = await answerRepository.SelectByQuestionIds(questionIds.Distinct());
        
        var answerQuestionDictionary = answers
            .GroupBy(a => a.QuestionId)
            .ToDictionary(
                group => group.Key, 
                group => group.ToList());

        var statistics = new QuestionnaireStatistic();
        
        foreach (var answer in answerQuestionDictionary)
        {
            var questionId = answer.Key;
            var allAnswers = answer.Value.Count;
            var correctAnswers = answer.Value.Count(a => a.IsCorrect);
            
            var questionDataPoint = new QuestionDataPoint()
            {
                QuestionId = questionId,
                TotalAnswerCnt = allAnswers,
                CorrectAnswerCnt = correctAnswers
            };
            
            statistics.Questions.Add(questionDataPoint);
        }

        return statistics;
    }
}