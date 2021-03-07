using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
  public class Create
  {
    public class Command : IRequest<Result<Unit>>
    {
      public Activity Activity { get; set; }
    }

    public class CommandValidator : AbstractValidator<Command>
    {
      public CommandValidator()
      {
        RuleFor(at => at.Activity).SetValidator(new ActivityValidator());
      }
    }

    public class Handler : IRequestHandler<Command, Result<Unit>>
    {
      private readonly DataContext _context;
      private readonly IUserAccessor _userAccessor;
      public Handler(DataContext context, IUserAccessor userAccessor)
      {
        this._userAccessor = userAccessor;
        this._context = context;
      }

      public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
      {
        var user = await _context.Users.FirstOrDefaultAsync(x => x.UserName == _userAccessor.GetUsername());
        // Make the link!
        var attendee = new ActivityAttendee {
          AppUserId = user.Id,
          AppUser = user,
          ActivityId = request.Activity.Id,
          Activity = request.Activity,
          IsHost = true
        };
        // Add the link to the activity!
        request.Activity.Attendees.Add(attendee);
        _context.Activities.Add(request.Activity);
        // Returns an integer of how many state entries changed in the DB.
        var res = await _context.SaveChangesAsync() > 0;
        if (!res) return Result<Unit>.Failure("Failed to create activity");
        // We are finished!
        return Result<Unit>.Success(Unit.Value);
      }
    }
  }
}