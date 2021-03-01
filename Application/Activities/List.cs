using System.Collections.Generic;
using MediatR;
using Domain;
using Persistence;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using System.Threading;
using Application.Core;

namespace Application.Activities
{
  public class ActivityList
  {

    public class Query : IRequest<Result<List<Activity>>>
    {

    }

    public class Handler : IRequestHandler<Query, Result<List<Activity>>>
    {
      private readonly DataContext _context;
      public Handler(DataContext context)
      {
        this._context = context;
      }

      public async Task<Result<List<Activity>>> Handle(Query request, CancellationToken cancellationToken)
      {
          return Result<List<Activity>>.Success(await _context.Activities.ToListAsync(cancellationToken));
      }
    }
  }
}