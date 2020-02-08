using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Domain;
using FluentValidation;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class Edit
    {
        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;

            public Handler (DataContext context)
            {
                _context = context;
            }

            public async Task<Unit> Handle (Command request, CancellationToken cancellationToken)
            {
                //get activity
                var activityToEdit = await _context.Activities.FindAsync(request.Activity.Id);

                if (activityToEdit == null) throw new RestException(HttpStatusCode.NotFound, new {activity = "Not Found"});

                //update props
                activityToEdit.Title = request.Activity.Title ?? activityToEdit.Title;
                activityToEdit.Description = request.Activity.Description ?? activityToEdit.Description;
                activityToEdit.Category = request.Activity.Category ?? activityToEdit.Category;
                activityToEdit.Date = request.Activity.Date ?? activityToEdit.Date;
                activityToEdit.City = request.Activity.City ?? activityToEdit.City;
                activityToEdit.Venue = request.Activity.Venue ?? activityToEdit.Venue;
                
                //if it never had any changes, just return
                if (!_context.ChangeTracker.HasChanges()) return Unit.Value;

                var IsSuccessful = await _context.SaveChangesAsync () > 0;

                if (IsSuccessful) return Unit.Value;

                throw new Exception ("Problem Saving Changes");

            }
        }
    }
}