using StolzLearn.Core.Models;

namespace StolzLearn.Core.Repositories;

public interface IQuestionRepository
{
    //Select
    Task<IEnumerable<Guid>> SelectIdsByQuery(QuestionQuery query);
    Task<IEnumerable<Question>> SelectByIds(IEnumerable<Guid> ids);
    
    //Insert
    Task<Guid> Insert(Question question);
    
    //Update
    Task Update(Question question);
}