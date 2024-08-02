using StolzLearn.Core.Models;

namespace StolzLearn.Core.Services;

public interface IQuestionnaireService
{
    Task<Guid> Insert(Questionnaire questionnaire, bool inTransaction = true);
}