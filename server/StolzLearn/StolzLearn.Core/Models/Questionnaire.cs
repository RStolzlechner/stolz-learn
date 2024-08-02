namespace StolzLearn.Core.Models;

public class Questionnaire
{
    public Guid Id { get; set; }
    public Guid CourseId { get; set; }
    public DateTime DateCreate { get; set; } = DateTime.Now;

    public IEnumerable<Answer> Answers { get; set; } = [];
}