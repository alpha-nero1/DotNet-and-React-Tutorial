using System;
using System.Threading.Tasks;
using Domain;
using Microsoft.AspNetCore.Mvc;
using Application.Activities;
using Microsoft.AspNetCore.Authorization;

namespace API.Controllers
{
  public class ActivitiesController : BaseApiController
  {

    [HttpGet]
    public async Task<IActionResult> GetActivities([FromQuery]ActivityParams param)
    {
      return HandlePagedResult<ActivityDto>(await Mediator.Send(new ActivityList.Query { Params = param }));
    }

    [HttpGet("{id}")] // activities/id
    public async Task<IActionResult> GetActivity(Guid id)
    {
      return HandleResult<ActivityDto>(await Mediator.Send(new Details.Query{ Id = id }));
    }
 
    // Param name here will look directly in the request body!!!
    [HttpPost]
    public async Task<IActionResult> CreateActivity(Activity activity)
    {
      return HandleResult(await Mediator.Send(new Create.Command {Activity = activity}));
    }

    [Authorize(Policy = "IsActivityHost")]
    [HttpPut("{id}")]
    public async Task<IActionResult> EditActivity(Guid id, Activity activity)
    {
      activity.Id = id;
      return HandleResult(await Mediator.Send(new Edit.Command {Activity = activity}));
    }

    // Impressive!
    [Authorize(Policy = "IsActivityHost")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteActivity(Guid id)
    {
      return HandleResult(await Mediator.Send(new Delete.Command {Id = id}));
    }

    [HttpPost("{id}/attend")]
    public async Task<IActionResult> Attend(Guid id)
    {
      return HandleResult(await Mediator.Send(new UpdateAttendance.Command {Id = id}));
    }

  }
}