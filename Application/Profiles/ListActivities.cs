using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles
{
  public class ListActivities
  {
    public class Query : IRequest<Result<List<UserActivityDto>>>
    {
      public string Username { get; set; }
      public string Predicate { get; set; }
    }

    public class Handler : IRequestHandler<Query, Result<List<UserActivityDto>>>
    {
      private readonly DataContext _db;
      private readonly IMapper _mapper;
      public Handler(DataContext db, IMapper mapper)
      {
        this._mapper = mapper;
        this._db = db;
      }

      public async Task<Result<List<UserActivityDto>>> Handle(Query request, CancellationToken cancellationToken)
      {
        // Get the query tree, where app user username is the one in the request.
        var query = _db.ActivityAttendees
        .Where(u => u.AppUser.UserName == request.Username)
        .OrderBy(a => a.Activity.Date)
        .ProjectTo<UserActivityDto>(_mapper.ConfigurationProvider)
        .AsQueryable();

        query = request.Predicate switch
        {
            "past" => query.Where(a => a.Date <= DateTime.Now),
            "hosting" => query.Where(x => x.HostUsername == request.Username),
            _ => query.Where(x => x.Date >= DateTime.Now)
        };

        var acts = await query.ToListAsync();
        return Result<List<UserActivityDto>>.Success(acts);
      }
    }
  }
}