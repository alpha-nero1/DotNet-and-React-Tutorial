using System.Collections.Generic;
using MediatR;
using Domain;
using Persistence;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using System.Threading;
using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;

namespace Application.Activities
{
  public class ActivityList
  {

    public class Query : IRequest<Result<List<ActivityDto>>>
    {

    }

    public class Handler : IRequestHandler<Query, Result<List<ActivityDto>>>
    {
      private readonly DataContext _context;
      private readonly IMapper _imapper;
      public Handler(DataContext context, IMapper imapper)
      {
        _imapper = imapper;
        _context = context;
      }

      public async Task<Result<List<ActivityDto>>> Handle(Query request, CancellationToken cancellationToken)
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
        var activies = await _context.Activities
          .ProjectTo<ActivityDto>(_imapper.ConfigurationProvider)
          .ToListAsync(cancellationToken);
        // Use of a map.
        return Result<List<ActivityDto>>.Success(activies);
      }
    }
  }
}