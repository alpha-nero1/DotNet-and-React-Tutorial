using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Followers
{
  public class FollowToggle
  {
    public class Command : IRequest<Result<Unit>>
    {
      public string TargetUsername { get; set; }
    }

    public class Handler : IRequestHandler<Command, Result<Unit>>
    {
      private readonly DataContext _db;
      private readonly IUserAccessor _uAccessor;
      public Handler(DataContext db, IUserAccessor uAccessor)
      {
        this._uAccessor = uAccessor;
        this._db = db;
      }

      public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
      {
        // Get the already existing observer and target.
        var observer = await _db.Users.FirstOrDefaultAsync(x => x.UserName == _uAccessor.GetUsername());
        var target = await _db.Users.FirstOrDefaultAsync(x => x.UserName == request.TargetUsername);

        if (target == null) return null;

        var following = await _db.UserFollowings.FindAsync(observer.Id, target.Id);

        if (following == null) 
        {
            following = new UserFollowing
            {
                Observer = observer,
                Target = target
            };
            _db.UserFollowings.Add(following);
        } else
        {
            _db.UserFollowings.Remove(following);
        }

        var succ = await _db.SaveChangesAsync() > 0;

        if (succ) return Result<Unit>.Success(Unit.Value);
        return Result<Unit>.Failure("Failed to update following");
      }
    }
  }
}