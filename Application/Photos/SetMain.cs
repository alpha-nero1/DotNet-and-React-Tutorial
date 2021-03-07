using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Photos
{
  public class SetMain
  {
    public class Command : IRequest<Result<Unit>>
    {
      public string Id { get; set; }
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
        var usr = await _db.Users
            .Include(p => p.Photos)
            .FirstOrDefaultAsync(x => x.UserName == _uAccessor.GetUsername());
        if (usr == null) return null;
        var ph = usr.Photos.FirstOrDefault(x => x.Id == request.Id);
        if (ph == null) return null;
        var currMain = usr.Photos.FirstOrDefault(x => x.IsMain);
        if (currMain != null) currMain.IsMain = false;
        ph.IsMain = true;
        var succ = await _db.SaveChangesAsync() > 0;
        if (succ) return Result<Unit>.Success(Unit.Value);
        return Result<Unit>.Failure("Problem updating main photo.");
      }
    }
  }
}