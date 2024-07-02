using StolzLearn.Core.Models;
using StolzLearn.Core.Repositories;

namespace StolzLearn.Core.Services;

public class AnswerService(IAnswerRepository answerRepository) : IAnswerService
{
    public Task<IEnumerable<Answer>> SelectByCourseId(Guid courseId) => answerRepository.SelectByCourseId(courseId);
}