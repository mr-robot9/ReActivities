using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Profiles;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Followers
{
    public class List
    {
        public class Query : IRequest<List<Profile>>
        {
            public string Username { get; set; }
            //determines either get followings or followers
            public string Predicate { get; set; }
        }

        public class Handler : IRequestHandler<Query, List<Profile>>
        {
            private readonly DataContext _context;
            private readonly IProfileReader _profileReader;

            public Handler (DataContext context, IProfileReader profileReader)
            {
                _profileReader = profileReader;
                _context = context;

            }
            public async Task<List<Profile>> Handle (Query request, CancellationToken cancellationToken)
            {
                var queryable = _context.UserFollowings.AsQueryable ();

                var userFollowings = new List<UserFollowing> ();
                var profiles = new List<Profile> ();

                switch (request.Predicate)
                {

                    case "followers":
                        {
                            //gets a list of followers where UserToFollow == request.username
                            userFollowings = await queryable.Where (uf => uf.UserToFollow.UserName == request.Username).ToListAsync ();

                            //after getting list, iterate through and get the users that's following request.username
                            foreach (var follower in userFollowings)
                            {
                                profiles.Add (await _profileReader.ReadProfile (follower.User.UserName));
                            }
                            break;

                        }
                    case "followings":
                        {
                            //gets a list of followings where User == request.username
                            userFollowings = await queryable.Where (uf => uf.User.UserName == request.Username).ToListAsync ();

                            //after getting list, iterate through and get the users that request.username is following
                            foreach (var follower in userFollowings)
                            {
                                profiles.Add (await _profileReader.ReadProfile (follower.UserToFollow.UserName));
                            }
                            break;

                        }
                }
                return profiles;

            }
        }
    }
}