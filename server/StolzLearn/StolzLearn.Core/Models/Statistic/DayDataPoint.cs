namespace StolzLearn.Core.Models.CourseStatistic;

public record DayDataPoint
{
    public required DateTime Date { get; set; }
    public List<QuestionDataPoint> QuestionDataPoints { get; set; } = [];
    
    public int QuestionCnt => QuestionDataPoints.Count;
    public double CorrectCnt => QuestionDataPoints.Sum(q => q.CorrectAnswerPercent);

    public void AddQuestion(Guid questionId)
    {
        if(QuestionDataPoints.Any(dp => dp.QuestionId == questionId)) return;
        QuestionDataPoints.Add(new QuestionDataPoint() { QuestionId = questionId });
    }

    public void AddAnswer(Answer answer)
    {
        var questionDataPoint = QuestionDataPoints.FirstOrDefault(qdp => qdp.QuestionId == answer.QuestionId);
        if(questionDataPoint == null) return;
        questionDataPoint.TotalAnswerCnt++;
        if(answer.IsCorrect) questionDataPoint.CorrectAnswerCnt++;
    }
}