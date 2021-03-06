using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles
{
  public class Details
  {
    public class Query : IRequest<Result<Profile>>
    {
      public string Username { get; set; }
    }

    public class Handler : IRequestHandler<Query, Result<Profile>>
    {
      private readonly DataContext _db;
      private readonly IMapper _mapper;
      private readonly IUserAccessor _uAccessor;
      public Handler(DataContext db, IMapper mapper, IUserAccessor uAccessor)
      {
        this._uAccessor = uAccessor;
        this._mapper = mapper;
        this._db = db;
      }

      public async Task<Result<Profile>> Handle(Query request, CancellationToken cancellationToken)
      {
        var usr = await _db.Users.ProjectTo<Profile>(_mapper.ConfigurationProvider, new { currentUsername = _uAccessor.GetUsername() })
        .SingleOrDefaultAsync(x => x.Username == request.Username);
        return Result<Profile>.Success(usr);
      }
    }
  }
}