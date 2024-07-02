namespace StolzLearn.Core.Models;

public class Question
{
    public Guid Id { get; set; }
    public Guid CourseId { get; set; }
    public int Number { get; set; }
    public string QuestionText { get; set; } = string.Empty;
    public string CorrectAnswer { get; set; } = string.Empty;
    public DateTime DateCreate { get; set; } = DateTime.Now;
    public bool Deleted { get; set; }
}