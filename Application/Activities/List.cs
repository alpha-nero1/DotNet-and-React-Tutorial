using System.Collections.Generic;
using MediatR;
using Persistence;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using System.Threading;
using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Application.Interfaces;
using System.Linq;

namespace Application.Activities
{
  public class ActivityList
  {

    public class Query : IRequest<Result<PagedList<ActivityDto>>>
    {
      public ActivityParams Params { get; set; }
    }

    public class Handler : IRequestHandler<Query, Result<PagedList<ActivityDto>>>
    {
      private readonly DataContext _context;
      private readonly IMapper _imapper;
      private readonly IUserAccessor _uAccessor;
      public Handler(DataContext context, IMapper imapper, IUserAccessor uAccessor)
      {
        _uAccessor = uAccessor;
        _imapper = imapper;
        _context = context;
      }

      public async Task<Result<PagedList<ActivityDto>>> Handle(Query request, CancellationToken cancellationToken)
      {
        // OLD WAY : Eager loading.
        // var activies = await _context.Activities
        //   // Include our link table
        //   .Include(a => a.Attendees)
        //   // Include the app user afterwards.
        //   .ThenInclude(u => u.AppUser)
        //   .ToListAsync(cancellationToken);
        //var actRet = _imapper.Map<List<ActivityDto>>(activies);
        // Projection with automapper!
        var actQuery = _context.Activities
          .Where(d => d.Date >= request.Params.StartDate)
          .OrderBy(d => d.Date)
          .ProjectTo<ActivityDto>(_imapper.ConfigurationProvider, new { currentUsername = _uAccessor.GetUsername() })
          // Defers and stores execution.
          .AsQueryable();

        if (request.Params.IsGoing && !request.Params.IsHost) {
          actQuery = actQuery
            .Where(x => x.Attendees.Any(a => a.Username == _uAccessor.GetUsername()));
        }
        if (request.Params.IsHost && !request.Params.IsGoing) {
          actQuery = actQuery
            .Where(x => x.HostUsername == _uAccessor.GetUsername());
        }
        // Nice! paging implemented so nicely!
        return Result<PagedList<ActivityDto>>.Success(
          await PagedList<ActivityDto>.CreateAsync(actQuery, request.Params.PageNumber, request.Params.PageSize)
        );
      }
    }
  }
}