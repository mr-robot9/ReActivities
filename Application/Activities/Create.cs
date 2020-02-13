using System;
using System.Threading;
using System.Threading.Tasks;
using Application.Interfaces;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class Create
    {
        public class Handler : IRequestHandler<CreateCommand>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;

            public Handler (DataContext context, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _context = context;
            }

            public async Task<Unit> Handle (CreateCommand request, CancellationToken cancellationToken)
            {
                var newActivity = new Activity (request.Activity);
                _context.Activities.Add (newActivity);

                //get current user
                var user = await _context.Users.SingleOrDefaultAsync( x => x.UserName == _userAccessor.GetCurrentUsername());
                
                var attendee = new UserActivity
                {
                    AppUser = user,
                    Activity = newActivity,
                    IsHost = true,
                    DateJoined = DateTime.Now
                };

                _context.UserActivities.Add(attendee);
                var IsSuccessful = await _context.SaveChangesAsync () > 0;

                if (IsSuccessful) return Unit.Value;

                throw new Exception ("Problem Creating New Activity");

            }
        }
    }
}