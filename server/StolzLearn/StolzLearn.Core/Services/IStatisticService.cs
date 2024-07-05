using StolzLearn.Core.Models;
using StolzLearn.Core.Models.CourseStatistic;

namespace StolzLearn.Core.Services;

public interface IStatisticService
{
    Task<CourseStatistic> SelectByCourseId(Guid courseId);
    Task<QuestionnaireStatistic> SelectQuestionnaireStatistics(IEnumerable<Guid> questionIds);
}