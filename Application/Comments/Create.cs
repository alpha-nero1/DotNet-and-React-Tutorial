using System;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using AutoMapper;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Comments
{
  public class Create
  {
    public class Command : IRequest<Result<CommentDto>>
    {
      public string Body { get; set; }
      public Guid ActivityId { get; set; }
    }

    public class CommandValidator : AbstractValidator<Command>
    {
      public CommandValidator()
      {
        RuleFor(x => x.Body).NotEmpty();
      }
    }

    public class Handler : IRequestHandler<Command, Result<CommentDto>>
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

      public async Task<Result<CommentDto>> Handle(Command request, CancellationToken cancellationToken)
      {
        var att = await _db.Activities.FindAsync(request.ActivityId);
        if (att == null) return null;
        var user = await _db.Users
            .Include(p => p.Photos)
            .SingleOrDefaultAsync(x => x.UserName == _uAccessor.GetUsername());
        var comm = new Comment
        {
            Author = user,
            Activity = att,
            Body = request.Body
        };
        att.Comments.Add(comm);
        var succ = await _db.SaveChangesAsync() > 0;
        if (succ) return Result<CommentDto>.Success(_mapper.Map<CommentDto>(comm));
        return Result<CommentDto>.Failure("Commenting failed!");
      }
    }
  }
}