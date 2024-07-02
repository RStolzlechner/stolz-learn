using StolzLearn.Core.Models;
using StolzLearn.Core.Repositories;

namespace StolzLearn.Core.Services;

public class CourseStatisticService(IQuestionRepository questionRepository, IAnswerRepository answerRepository) : ICourseStatisticService
{
    public async Task<CourseStatistic> SelectByCourseId(Guid courseId)
    {
        var questions = await questionRepository.SelectByCourseId(courseId);
        var answers = await answerRepository.SelectByCourseId(courseId);
        
        //todo go on here 
        //timeline (per day) 
        //each day has a list of quesionIds, correctAnswerCount, totalAnswerCount //containing also questions and answers of the past

        var questionIdDateDictionary = questions
            .GroupBy(q => q.DateCreate.Date)
            .ToDictionary(
                group => group.Key, 
                group => group.ToList().Select(g => g.Id));
        
        
        var answerDateDictionary = answers
            .GroupBy(a => a.DateCreate.Date)
            .ToDictionary(
                group => group.Key, 
                group => group.ToList());

        var allDatesSet = new HashSet<DateTime>(questionIdDateDictionary.Keys);
        allDatesSet.UnionWith(answerDateDictionary.Keys);
        var allDates = allDatesSet.Distinct().OrderBy(d => d);

        var statistics = new Dictionary<DateTime, CourseStatistic>();

        var questionCount = 0;
        
        foreach (var date in allDates)
        {
            questionIdDateDictionary.TryGetValue(date, out var questionIds);
            answerDateDictionary.TryGetValue(date, out var dayAnswers);
            
            questionCount += questionIds?.Count() ?? 0;
        }
        throw new NotImplementedException();
    }
}