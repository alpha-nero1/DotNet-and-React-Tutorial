using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Photos
{
  public class Delete
  {
    public class Command : IRequest<Result<Unit>>
    {
      public string Id { get; set; }
    }

    public class Handler : IRequestHandler<Command, Result<Unit>>
    {
      private readonly DataContext _db;
      private readonly IPhotoAccessor _phAccessor;
      private readonly IUserAccessor _uAccessor;
      public Handler(DataContext db, IPhotoAccessor phAccessor, IUserAccessor uAccessor)
      {
        this._uAccessor = uAccessor;
        this._phAccessor = phAccessor;
        this._db = db;
      }

      public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
      {
        var usr = await _db.Users
            .Include(x => x.Photos)
            .FirstOrDefaultAsync(c => c.UserName == _uAccessor.GetUsername());

        if (usr == null) return null;

        var ph = usr.Photos.FirstOrDefault(x => x.Id == request.Id);

        if (ph == null) return null;

        if (ph.IsMain) return Result<Unit>.Failure("Cannot delete main photo.");

        var res = await _phAccessor.DeletePhoto(ph.Id);

        if (res == null) return Result<Unit>.Failure("Problem deleting photo from cloudinary.");
      
        usr.Photos.Remove(ph);

        var succ = await _db.SaveChangesAsync() > 0;
        if (succ) return Result<Unit>.Success(Unit.Value);
        return Result<Unit>.Failure("Problem deleting photo from API.");
      }
    }
  }
}