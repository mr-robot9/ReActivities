using System;
using System.Threading;
using System.Threading.Tasks;
using Domain;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class Create
    {
        public class Command : IRequest
        {
            public Activity Activity { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;

            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var newActivity = new Activity(request.Activity);

                //not using async method
                _context.Activities.Add(newActivity);
                var IsSuccessful = await _context.SaveChangesAsync() > 0;

                if (IsSuccessful) return Unit.Value;

                throw new Exception("Problem Creating New Activity");

            }
        }
    }
}