using StolzLearn.Core.Models;
using StolzLearn.Core.Postgres;
using StolzLearn.Core.Repositories;

namespace StolzLearn.Core.Services;

public class QuestionnaireService(IQuestionnaireRepository questionnaireRepository) : IQuestionnaireService
{
    public Task<Guid> Insert(Questionnaire questionnaire, bool inTransaction = true)
    {
        if (!inTransaction) return questionnaireRepository.Insert(questionnaire);
        return TransactionHelper.InTransaction(() => questionnaireRepository.Insert(questionnaire));
    }
}