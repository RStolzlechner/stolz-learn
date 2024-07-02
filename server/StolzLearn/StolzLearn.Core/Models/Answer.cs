namespace StolzLearn.Core.Models;

public class Answer
{
    public Guid Id { get; set; }
    public Guid QuestionId { get; set; }
    public Guid QuestionnaireId { get; set; }
    public string GivenAnswer { get; set; } = string.Empty;
    public bool IsCorrect { get; set; }
    public DateTime DateCreate { get; set; } = DateTime.Now;
}