using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using StolzLearn.Core.Models;
using StolzLearn.Core.Services;

namespace StolzLearn.Core.Controller;

[Route("api/v1/[controller]")]
public class QuestionnaireController(
    IQuestionnaireService questionnaireService,
    IStatisticService statisticService) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> AddQuestionnaire([FromBody] Questionnaire questionnaire)
    {
        //todo
        
        return Ok(new {});
    }
}