using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Domain;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class Delete
    {
        public class Command : IRequest
        {
            public Activity Activity { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;

            public Handler (DataContext context)
            {
                _context = context;
            }

            public async Task<Unit> Handle (Command request, CancellationToken cancellationToken)
            {
                //find activity to delete
                var activityToDelete = await _context.Activities.FindAsync(request.Activity.Id);

                if (activityToDelete == null) throw new RestException(HttpStatusCode.NotFound, new {activity = "Not Found"});

                _context.Remove(activityToDelete);

                var IsSuccessful = await _context.SaveChangesAsync () > 0;

                if (IsSuccessful) return Unit.Value;

                throw new Exception ("Problem Deleting Activity");

            }
        }
    }
}