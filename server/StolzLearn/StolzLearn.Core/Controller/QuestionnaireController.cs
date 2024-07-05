using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using StolzLearn.Core.Models;
using StolzLearn.Core.Services;
using StolzLearn.Core.SignalR;

namespace StolzLearn.Core.Controller;

[Route("api/v1/[controller]")]
public class QuestionnaireController(
    ICourseService courseService,
    IQuestionService questionService,
    IQuestionnaireService questionnaireService,
    IStatisticService statisticService,
    IHubContext<CoreHub, ICoreHub> hub) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> AddQuestionnaire([FromBody] Questionnaire questionnaire)
    {
        var courseId = await courseService.SelectByIds([questionnaire.CourseId]);
        if(courseId.Count() != 1)
            return BadRequest("Given course id not found in database");
        
        var givenQuestionIds = questionnaire.Answers.Select(a => a.QuestionId).ToList();
        var questionIds = await questionService.SelectByIds(givenQuestionIds);
        if(questionIds.Count() != givenQuestionIds.Count())
            return BadRequest("Not all question ids found in database");
        
        if(questionnaire.Answers.Any(a => string.IsNullOrEmpty(a.GivenAnswer)))
            return BadRequest("Given answer is empty");
        
        await questionnaireService.Insert(questionnaire);
        var statistic = await statisticService.SelectQuestionnaireStatistics(givenQuestionIds);

        await hub.Clients.All.OnCourseChanged(questionnaire.CourseId);
        
        return Ok(statistic);
    }
}