using StolzLearn.Core.Models;

namespace StolzLearn.Core.Repositories;

public interface IQuestionnaireRepository
{
    //Insert
    Task<Guid> Insert(Questionnaire questionnaire);
}