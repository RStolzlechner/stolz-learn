namespace StolzLearn.Core.Models.CourseStatistic;

public class CourseStatistic
{
    public List<DayDataPoint> DayDataPoints { get; set; } = [];
    
    public void AddDayDataPoint(DayDataPoint dayDataPoint)
    {
        DayDataPoints.Add(dayDataPoint);
    }
}