using StolzLearn.Core.Models;

namespace StolzLearn.Core.Repositories;

public class AnswerRepository : IAnswerRepository
{
    public Task<IEnumerable<Answer>> SelectByCourseId(Guid courseId)
    {
        throw new NotImplementedException();
    }
}