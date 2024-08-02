using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using StolzLearn.Core.Models;
using StolzLearn.Core.Services;
using StolzLearn.Core.SignalR;

namespace StolzLearn.Core.Controller;

[Route("api/v1/[controller]")]
public class QuestionnaireController(
    IQuestionService questionService,
    IQuestionnaireService questionnaireService,
    IStatisticService statisticService,
    IHubContext<CoreHub, ICoreHub> hub) : CoreControllerBase
{
    [HttpPost]
    public async Task<IActionResult> AddQuestionnaire([FromBody] Questionnaire questionnaire)
    {
        var givenQuestionIds = questionnaire.Answers.Select(a => a.QuestionId).ToList();
        var questionIds = await questionService.SelectByIds(givenQuestionIds);
        if(questionIds.Count() != givenQuestionIds.Count())
            return BadRequest("Not all question ids found in database");
        
        if(questionnaire.Answers.Any(a => string.IsNullOrEmpty(a.GivenAnswer)))
            return BadRequest("Given answer is empty");

        try
        {
            await questionnaireService.Insert(questionnaire);   
        }
        catch (Exception e)
        {
            return InternalError(e.Message);
        }
        
        var statistic = await statisticService.SelectQuestionnaireStatistics(givenQuestionIds);

        await hub.Clients.All.OnCourseChanged(questionnaire.CourseId);
        
        return Ok(statistic);
    }
}