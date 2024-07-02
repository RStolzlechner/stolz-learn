using StolzLearn.Core.Models;

namespace StolzLearn.Core.Repositories;

public class QuestionRepository : IQuestionRepository
{
    public Task<IEnumerable<Guid>> SelectIdsByQuery(QuestionQuery query)
    {
        throw new NotImplementedException();
    }

    public Task<IEnumerable<Question>> SelectByIds(IEnumerable<Guid> ids)
    {
        throw new NotImplementedException();
    }

    public Task<Guid> Insert(Question question)
    {
        throw new NotImplementedException();
    }

    public Task Update(Question question)
    {
        throw new NotImplementedException();
    }
}