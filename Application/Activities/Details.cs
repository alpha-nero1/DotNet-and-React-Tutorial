using MediatR;
using Domain;
using System;
using System.Threading.Tasks;
using System.Threading;
using Persistence;

namespace Application.Activities
{
  public class Details
  {
    public class Query : IRequest<Activity>
    {
      public Guid Id { get; set; }
    }

    public class Handler : IRequestHandler<Query, Activity>
    {
      private readonly DataContext _context;
      public Handler(DataContext context)
      {
        this._context = context;
      }

      public async Task<Activity> Handle(Query request, CancellationToken cancellationToken)
      {
        return await _context.Activities.FindAsync(request.Id);
      }
    }
  }
}