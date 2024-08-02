using StolzLearn.Core.Models;

namespace StolzLearn.Core.Repositories;

public interface IAnswerRepository
{
    //Select
    Task<IEnumerable<Answer>> SelectByCourseId(Guid courseId);
    Task<IEnumerable<Answer>> SelectByQuestionIds(IEnumerable<Guid> questionIds);
}