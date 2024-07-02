using StolzLearn.Core.Models;
using StolzLearn.Core.Repositories;

namespace StolzLearn.Core.Services;

public class QuestionService(IQuestionRepository questionRepository) : IQuestionService
{
    public Task<IEnumerable<Guid>> SelectIdsByQuery(QuestionQuery query) => questionRepository.SelectIdsByQuery(query);

    public Task<IEnumerable<Question>> SelectByIds(IEnumerable<Guid> ids) => questionRepository.SelectByIds(ids);

    public Task<Guid> Insert(Question question, bool inTransaction = true)
    {
        throw new NotImplementedException();
    }

    public Task Update(Question question, bool inTransaction = true)
    {
        throw new NotImplementedException();
    }
}