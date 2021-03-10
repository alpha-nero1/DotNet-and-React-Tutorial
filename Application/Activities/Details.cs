using MediatR;
using System;
using System.Threading.Tasks;
using System.Threading;
using Persistence;
using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using Application.Interfaces;

namespace Application.Activities
{
  public class Details
  {
    public class Query : IRequest<Result<ActivityDto>>
    {
      public Guid Id { get; set; }
    }

    public class Handler : IRequestHandler<Query, Result<ActivityDto>>
    {
      private readonly DataContext _context;
      private readonly IMapper _imapper;
      private readonly IUserAccessor _uAccessor;
      public Handler(DataContext context, IMapper imapper, IUserAccessor uAccessor)
      {
        this._uAccessor = uAccessor;
        this._imapper = imapper;
        this._context = context;
      }

      public async Task<Result<ActivityDto>> Handle(Query request, CancellationToken cancellationToken)
      {
        var at = await _context.Activities
          .ProjectTo<ActivityDto>(_imapper.ConfigurationProvider, new { currentUsername = _uAccessor.GetUsername() })
          .FirstOrDefaultAsync(x => x.Id == request.Id);
        return Result<ActivityDto>.Success(at);
      }
    }
  }
}