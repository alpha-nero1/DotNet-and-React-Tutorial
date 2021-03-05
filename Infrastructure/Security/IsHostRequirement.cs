using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Infrastructure.Security
{
  // Custom auth policy for updating activities!
  public class IsHostRequirement : IAuthorizationRequirement
  {

  }

  public class IsHostRequirementHandler : AuthorizationHandler<IsHostRequirement>
  {
    private readonly DataContext _dbContext;
    private readonly IHttpContextAccessor _httpAccessor;
    public IsHostRequirementHandler(DataContext dbContext, IHttpContextAccessor httpAccessor)
    {
      _httpAccessor = httpAccessor;
      _dbContext = dbContext;
    }

    // Will allow us to protect certain endpoints that mutate activites.
    protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, IsHostRequirement requirement)
    {
        // Get the user id.
        var userId = context.User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (userId == null) return Task.CompletedTask;

        var activityId = Guid.Parse(_httpAccessor.HttpContext?.Request.RouteValues.SingleOrDefault(x => x.Key == "id").Value?.ToString());

        // We fetch in this way so the object is not stuck here in memory in transaction limbo.
        var attend = _dbContext.ActivityAttendees
            .AsNoTracking()
            .SingleOrDefaultAsync(x => x.AppUserId == userId && x.ActivityId == activityId).Result;

        if (attend == null) return Task.CompletedTask;

        if (attend.IsHost) context.Succeed(requirement);

        // Were not host...
        return Task.CompletedTask;
    }
  }
}