namespace StolzLearn.Core.Models;

public class QuestionQuery
{
    public Guid CourseId { get; set; }
    public bool RandomOrder { get; set; }
    public int Limit { get; set; }
}