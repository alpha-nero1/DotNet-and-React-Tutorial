using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using AutoMapper;
using Domain;
using FluentValidation;
using MediatR;
using Persistence;

namespace Application.Activities
{
  public class Edit
  {
    public class Command : IRequest<Result<Unit>>
    {
      public Activity Activity { get; set; }
    }

    public class CommandValidator : AbstractValidator<Command>
    {
      public CommandValidator()
      {
        RuleFor(at => at.Activity).SetValidator(new ActivityValidator());
      }
    }

    public class Handler : IRequestHandler<Command, Result<Unit>>
    {
      private readonly DataContext _context;
      private readonly IMapper _mapper;
      public Handler(DataContext context, IMapper mapper)
      {
        this._mapper = mapper;
        this._context = context;
      }

      public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
      {
        var activity = await _context.Activities.FindAsync(request.Activity.Id);
        if (activity == null) return null;
        // Map each prop from arg one to arg two...
        _mapper.Map(request.Activity, activity);
        var res = await _context.SaveChangesAsync() > 0;
        if (!res) return Result<Unit>.Failure("Failed to update activity.");
        return Result<Unit>.Success(Unit.Value);
      }
    }
  }
}