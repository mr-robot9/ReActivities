using System;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Comments
{
    public class Delete
    {
        public class Command : IRequest
        {
            public Guid ActivityId { get; set; }
            public Guid CommentId { get; set; }
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
                var activity = await _context.Activities.FindAsync (request.ActivityId);

                if (activity == null) throw new RestException (HttpStatusCode.NotFound, new { Activity = "Not Found" });

                var comment = await _context.Comments.FindAsync (request.CommentId);

                if (comment == null) throw new RestException (HttpStatusCode.NotFound, new { Comment = "Not Found" });

                //after finding comment, only the currently logged in user can delete it

                if (_userAccessor.GetCurrentUsername () != comment.Author.UserName) throw new RestException (HttpStatusCode.Unauthorized, new { Comment = "Cannot Delete Another User's Comment" });

                _context.Remove(comment);

                //logic for adding here 
                var IsSuccessful = await _context.SaveChangesAsync () > 0;

                if (IsSuccessful) return Unit.Value;

                throw new Exception ("Problem");

            }
        }
    }
}