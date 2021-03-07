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
  public class Add
  {
    public class Command : IRequest<Result<Photo>>
    {
      // What we load the command up with before we send it!
      public IFormFile File { get; set; }
    }

    public class Handler : IRequestHandler<Command, Result<Photo>>
    {
      private readonly DataContext _dbContext;
      private readonly IPhotoAccessor _photoAccessor;
      private readonly IUserAccessor _userAccessor;
      public Handler(DataContext dbContext, IPhotoAccessor photoAccessor, IUserAccessor userAccessor)
      {
        this._userAccessor = userAccessor;
        this._photoAccessor = photoAccessor;
        this._dbContext = dbContext;
      }

      public async Task<Result<Photo>> Handle(Command request, CancellationToken cancellationToken)
      {
        var usr = await _dbContext.Users
            .Include(p => p.Photos)
            .FirstOrDefaultAsync(x => x.UserName == _userAccessor.GetUsername());

        if (usr == null) return null;
        var photoRes = await _photoAccessor.AddPhoto(request.File);
        var ph = new Photo
        {
            Url = photoRes.Url,
            Id = photoRes.PublicId
        };

        if (!usr.Photos.Any(x => x.IsMain)) ph.IsMain = true;

        usr.Photos.Add(ph);

        var res = await _dbContext.SaveChangesAsync() > 0;
        if (res) return Result<Photo>.Success(ph);
        return Result<Photo>.Failure("Issue uploading photo.");
      }
    }
  }
}