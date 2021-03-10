using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using Application.Profiles;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Followers
{
  public class List
  {
    public class Query : IRequest<Result<List<Profiles.Profile>>>
    {
      public string Predicate { get; set; }
      public string Username { get; set; }
    }

    public class Handler : IRequestHandler<Query, Result<List<Profiles.Profile>>>
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

      public async Task<Result<List<Profiles.Profile>>> Handle(Query request, CancellationToken cancellationToken)
      {
        var profiles = new List<Profiles.Profile>();

        switch (request.Predicate)
        {
          case "followers":
            profiles = await _db.UserFollowings.Where(x => x.Target.UserName == request.Username)
                .Select(u => u.Observer)
                .ProjectTo<Profiles.Profile>(_mapper.ConfigurationProvider, new { currentUsername = _uAccessor.GetUsername() })
                .ToListAsync();
            break;
          case "followings":
            profiles = await _db.UserFollowings.Where(x => x.Observer.UserName == request.Username)
                .Select(u => u.Target)
                .ProjectTo<Profiles.Profile>(_mapper.ConfigurationProvider, new { currentUsername = _uAccessor.GetUsername() })
                .ToListAsync();
            break;
        }

        return Result<List<Profiles.Profile>>.Success(profiles);
      }
    }
  }
}