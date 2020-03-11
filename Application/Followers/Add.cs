using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using Application.Profiles;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Followers
{
    public class Add
    {
        public class Command : IRequest<Profile>
        {
            public string Username { get; set; }
        }

        public class Handler : IRequestHandler<Command, Profile>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;
            private readonly IProfileReader _profileReader;

            public Handler (DataContext context, IUserAccessor userAccessor, IProfileReader profileReader)
            {
                _profileReader = profileReader;
                _userAccessor = userAccessor;
                _context = context;
            }

            public async Task<Profile> Handle (Command request, CancellationToken cancellationToken)
            {
                var currentUser = await _context.Users.SingleOrDefaultAsync (u => u.UserName == _userAccessor.GetCurrentUsername ());

                var userToFollow = await _context.Users.SingleOrDefaultAsync (u => u.UserName == request.Username);

                if (currentUser.UserName == userToFollow.UserName) throw new RestException (HttpStatusCode.NotFound, new { User = "Cannot follow your own user" });

                if (userToFollow == null) throw new RestException (HttpStatusCode.NotFound, new { User = "Not Found" });

                var following = await _context.UserFollowings.FindAsync (currentUser.Id, userToFollow.Id);

                if (following != null) throw new RestException (HttpStatusCode.BadRequest, new { User = "Already following user" });

                //else create new following
                following = new UserFollowing
                {
                    User = currentUser,
                    UserToFollow = userToFollow
                };

                _context.UserFollowings.Add (following);

                var IsSuccessful = await _context.SaveChangesAsync () > 0;

                if (IsSuccessful) return await _profileReader.ReadProfile(currentUser.UserName);

                throw new Exception ("Problem");

            }
        }
    }
}