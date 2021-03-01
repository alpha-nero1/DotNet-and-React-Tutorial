using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Domain;
using Microsoft.AspNetCore.Mvc;
using Application.Activities;

namespace API.Controllers
{
  public class ActivitiesController : BaseApiController
  {

    [HttpGet]
    public async Task<IActionResult> GetActivities()
    {
      return HandleResult<List<Activity>>(await Mediator.Send(new ActivityList.Query()));
    }

    [HttpGet("{id}")] // activities/id
    public async Task<ActionResult<IActionResult>> GetActivity(Guid id)
    {
      return HandleResult<Activity>(await Mediator.Send(new Details.Query{Id = id}));
    }

    // Param name here will look directly in the request body!!!
    [HttpPost]
    public async Task<IActionResult> CreateActivity(Activity activity)
    {
      return HandleResult(await Mediator.Send(new Create.Command {Activity = activity}));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> EditActivity(Guid id, Activity activity)
    {
      activity.Id = id;
      return HandleResult(await Mediator.Send(new Edit.Command {Activity = activity}));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteActivity(Guid id)
    {
      return HandleResult(await Mediator.Send(new Delete.Command {Id = id}));
    }

  }
}