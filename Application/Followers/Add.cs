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
    public class Add
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
                var currentUser = await _context.Users.SingleOrDefaultAsync(u => u.UserName == _userAccessor.GetCurrentUsername());

                var userToFollow = await _context.Users.SingleOrDefaultAsync(u => u.UserName == request.Username);
                
                if (currentUser.UserName == userToFollow.UserName) throw new RestException (HttpStatusCode.NotFound, new { User = "Cannot follow your own user" });

                if(userToFollow == null) throw new RestException(HttpStatusCode.NotFound, new {User = "Not Found"});

                var following = await _context.UserFollowings.FindAsync(currentUser.Id, userToFollow.Id);

                if (following != null) throw new RestException(HttpStatusCode.BadRequest, new {User = "Already following user"});

                //else create new following
                following = new UserFollowing
                {
                    User = currentUser,
                    UserToFollow = userToFollow
                };

                _context.UserFollowings.Add(following);

                var IsSuccessful = await _context.SaveChangesAsync () > 0;

                if (IsSuccessful) return Unit.Value;

                throw new Exception ("Problem");

            }
        }
    }
}