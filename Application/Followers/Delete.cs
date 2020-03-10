using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Followers
{
    public class Delete
    {
        public class Command : IRequest
        {
            public string Username { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;

            public Handler (DataContext context, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _context = context;
            }

            public async Task<Unit> Handle (Command request, CancellationToken cancellationToken)
            {
                var currentUser = await _context.Users.SingleOrDefaultAsync (u => u.UserName == _userAccessor.GetCurrentUsername ());

                var userToFollow = await _context.Users.SingleOrDefaultAsync (u => u.UserName == request.Username);

                if (userToFollow == null) throw new RestException (HttpStatusCode.NotFound, new { User = "Not Found" });

                var following = await _context.UserFollowings.FindAsync (currentUser.Id, userToFollow.Id);

                if (following == null) throw new RestException (HttpStatusCode.BadRequest, new { User = "Not following user" });

                //else delete following

                _context.UserFollowings.Remove (following);

                var IsSuccessful = await _context.SaveChangesAsync () > 0;

                if (IsSuccessful) return Unit.Value;

                throw new Exception ("Problem");

            }
        }
    }
}