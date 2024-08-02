using StolzLearn.Core.Models;

namespace StolzLearn.Core.Services;

public interface IQuestionService
{
    Task<IEnumerable<Guid>> SelectIdsByQuery(QuestionQuery query);
    Task<IEnumerable<Question>> SelectByIds(IEnumerable<Guid> ids);
    Task<Guid> Insert(Question question, bool inTransaction = true);
    Task Update(Question question, bool inTransaction = true);
}