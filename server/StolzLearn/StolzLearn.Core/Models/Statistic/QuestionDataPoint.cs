namespace StolzLearn.Core.Models.CourseStatistic;

public record QuestionDataPoint
{
    public required Guid QuestionId { get; set; }
    public int TotalAnswerCnt { get; set; }
    public int CorrectAnswerCnt { get; set; }
    
    public double CorrectAnswerPercent => TotalAnswerCnt == 0 ? 0 : (double)CorrectAnswerCnt / TotalAnswerCnt;
}