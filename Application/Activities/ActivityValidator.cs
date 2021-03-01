using FluentValidation;
using Domain;

namespace Application.Activities
{
  public class ActivityValidator : AbstractValidator<Activity>
  {
    public ActivityValidator()
    {
        RuleFor(at => at.Title).NotEmpty();
        RuleFor(at => at.Description).NotEmpty();
        RuleFor(at => at.Date).NotEmpty();
        RuleFor(at => at.Category).NotEmpty();
        RuleFor(at => at.City).NotEmpty();
        RuleFor(at => at.Venue).NotEmpty();
    }
  }
}