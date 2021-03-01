using MediatR;
using Domain;
using System;
using System.Threading.Tasks;
using System.Threading;
using Persistence;
using Application.Core;

namespace Application.Activities
{
  public class Details
  {
    public class Query : IRequest<Result<Activity>>
    {
      public Guid Id { get; set; }
    }

    public class Handler : IRequestHandler<Query, Result<Activity>>
    {
      private readonly DataContext _context;
      public Handler(DataContext context)
      {
        this._context = context;
      }

      public async Task<Result<Activity>> Handle(Query request, CancellationToken cancellationToken)
      {
        var at = await _context.Activities.FindAsync(request.Id);
        return Result<Activity>.Success(at);
      }
    }
  }
}