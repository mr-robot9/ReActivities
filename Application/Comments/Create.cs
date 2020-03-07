using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Comments
{
    /// <summary>
    /// The request is NOT and HTTP request but a websocket request via SignalR
    /// </summary>
    public class Create
    {
        public class Command : IRequest<CommentDTO>
        {
            //properties
            public string Body { get; set; }
            public Guid ActivityId { get; set; }
            public string Username { get; set; } //can't get it bc not an http request so we can't get it from token
        }

        public class Handler : IRequestHandler<Command, CommentDTO>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;

            public Handler (DataContext context, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;
            }

            public async Task<CommentDTO> Handle (Command request, CancellationToken cancellationToken)
            {
                var activity = await _context.Activities.FindAsync(request.ActivityId);

                if(activity == null) throw new RestException(HttpStatusCode.NotFound, new {Activity = "Not Found"});

                var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == request.Username);

                var comment = new Comment
                {
                    Author = user,
                    Activity = activity,
                    Body = request.Body,
                    CreatedAt = DateTime.Now
                };

                activity.Comments.Add(comment);

                //logic for adding here 
                var IsSuccessful = await _context.SaveChangesAsync () > 0;

                if (IsSuccessful) return _mapper.Map<CommentDTO>(comment);

                throw new Exception ("Problem");

            }
        }
    }
}