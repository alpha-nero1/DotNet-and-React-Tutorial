using System.Collections.Generic;
using MediatR;
using Domain;
using Persistence;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using System.Threading;

namespace Application.Activities
{
  public class ActivityList
  {

    public class Query : IRequest<List<Activity>>
    {

    }

    public class Handler : IRequestHandler<Query, List<Activity>>
    {
      private readonly DataContext _context;
      public Handler(DataContext context)
      {
        this._context = context;
      }

      public async Task<List<Activity>> Handle(Query request, CancellationToken cancellationToken)
      {
          return await _context.Activities.ToListAsync(cancellationToken);
      }
    }
  }
}