using StolzLearn.Core.Models;
using StolzLearn.Core.Models.CourseStatistic;

namespace StolzLearn.Core.Services;

public interface ICourseStatisticService
{
    Task<CourseStatistic> SelectByCourseId(Guid courseId);
}