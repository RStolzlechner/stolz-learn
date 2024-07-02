using StolzLearn.Core.Models;

namespace StolzLearn.Core.Services;

public interface ICourseStatisticService
{
    Task<CourseStatistic> SelectByCourseId(Guid courseId);
}