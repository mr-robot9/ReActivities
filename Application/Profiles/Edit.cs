using System;
using System.Threading;
using System.Threading.Tasks;
using Application.Interfaces;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles
{
    public class Edit
    {
        public class Command : IRequest
        {
            //properties
            public string DisplayName { get; set; } 
            public string Bio { get; set; }
        }

        public class CommandValidator: AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.DisplayName).NotEmpty();
                RuleFor(x => x.Bio).NotEmpty();
            }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;

            public Handler (DataContext context, IUserAccessor userAccessor)
            {
                _context = context;
                _userAccessor = userAccessor;
            }

            public async Task<Unit> Handle (Command request, CancellationToken cancellationToken)
            {
                //retrieve current user
                var user = await _context.Users.SingleOrDefaultAsync(a => a.UserName == _userAccessor.GetCurrentUsername());

                user.DisplayName = request.DisplayName;
                user.Bio = request.Bio;

                //logic for adding here 
                var IsSuccessful = await _context.SaveChangesAsync () > 0;

                if (IsSuccessful) return Unit.Value;

                throw new Exception ("Problem");

            }
        }
    }
}