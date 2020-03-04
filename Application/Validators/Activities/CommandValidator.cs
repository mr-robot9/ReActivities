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

/// <summary>
/// This is automatically called by Fluent Validation 
/// This validator calls its parent const and gets called for EditCommands
/// </summary>
    public class EditCommandValidator : CommandValidator<EditCommand>
    {
        //implicitly calls base
        public EditCommandValidator () 
        {

        }
    }
/// <summary>
/// This is automatically called by Fluent Validation 
/// This validator calls its parent const and gets called for CreateCommands
/// </summary>
    public class CreateCommandValidator : CommandValidator<CreateCommand>
    {
        //implicitly calls base
        public CreateCommandValidator ()
        {

        }
    }

}