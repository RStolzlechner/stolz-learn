using StolzLearn.Core.Models;

namespace StolzLearn.Core.Services;

public class QuestionnaireService : IQuestionnaireService
{
    public Task<Guid> Insert(Questionnaire questionnaire, bool inTransaction = true)
    {
        throw new NotImplementedException();
    }
}