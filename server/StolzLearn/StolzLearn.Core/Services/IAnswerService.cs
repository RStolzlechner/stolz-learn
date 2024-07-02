using StolzLearn.Core.Models;

namespace StolzLearn.Core.Services;

public interface IAnswerService
{
    Task<IEnumerable<Answer>> SelectByCourseId(Guid courseId);
}