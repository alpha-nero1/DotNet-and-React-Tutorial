using System.Collections.Generic;
using Application.Core;
using MediatR;
using System;
using System.Threading.Tasks;
using System.Threading;
using Persistence;
using AutoMapper;
using System.Linq;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace Application.Comments
{
    public class List
    {
        public class Query : IRequest<Result<List<CommentDto>>>
        {
            public Guid ActivityId { get; set; }
            
        }

    public class Handler : IRequestHandler<Query, Result<List<CommentDto>>>
    {

      private readonly DataContext _db;
      private readonly IMapper _mapper;
      public Handler(DataContext db, IMapper mapper)
      {
        this._mapper = mapper;
        this._db = db;
      }

      public async Task<Result<List<CommentDto>>> Handle(Query request, CancellationToken cancellationToken)
      {
        var comments = await _db.Comments
        .Where(x => x.Activity.Id == request.ActivityId)
        .OrderByDescending(x => x.CreatedAt)
        .ProjectTo<CommentDto>(_mapper.ConfigurationProvider)
        .ToListAsync();

        return Result<List<CommentDto>>.Success(comments);
      }
    }
  }
}