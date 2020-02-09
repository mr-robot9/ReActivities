using Application.Activities;
using FluentValidation;

namespace Application.Validators.Activities
{
    public class CommandValidator<T> : AbstractValidator<T> where T : Command
    {
        public CommandValidator ()
        {
            RuleFor (x => x.Activity).NotNull ();
            RuleFor (x => x.Activity.Title).NotEmpty ().Unless (x => x.Activity == null);
            RuleFor (x => x.Activity.Description).NotEmpty ().Unless (x => x.Activity == null);
            RuleFor (x => x.Activity.Category).NotEmpty ().Unless (x => x.Activity == null);
            RuleFor (x => x.Activity.Date).NotEmpty ().Unless (x => x.Activity == null);
            RuleFor (x => x.Activity.City).NotEmpty ().Unless (x => x.Activity == null);
            RuleFor (x => x.Activity.Venue).NotEmpty ().Unless (x => x.Activity == null);
        }

    }

    public class EditCommandValidator : CommandValidator<EditCommand>
    {
        //implicitly calls base
        public EditCommandValidator () 
        {

        }
    }

    public class CreateCommandValidator : CommandValidator<CreateCommand>
    {
        //implicitly calls base
        public CreateCommandValidator ()
        {

        }
    }

}