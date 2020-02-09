using Domain;
using MediatR;

namespace Application.Activities
{
    public class Command : IRequest
    {
        public Activity Activity { get; set; } = null;
    }

    public class EditCommand : Command {}
    public class CreateCommand : Command {}
}