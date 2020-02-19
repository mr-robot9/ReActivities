using System;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using Application.Validators.Extensions;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Persistence;

namespace Application.User
{
    public class Register
    {
        public class Command : IRequest<User>
        {
            //properties
            public string DisplayName { get; set; }
            public string UserName { get; set; }
            public string Email { get; set; }
            public string Password { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator ()
            {
                RuleFor (u => u.DisplayName).NotEmpty ();
                RuleFor (u => u.UserName).NotEmpty ();
                RuleFor (u => u.Email).NotEmpty ().EmailAddress ();
                RuleFor (u => u.Password).Password ();

            }
        }

        public class Handler : IRequestHandler<Command, User>
        {
            private readonly DataContext _context;
            private readonly IJwtGenerator _jwtGenerator;
            private readonly UserManager<AppUser> _userManager;

            public Handler (DataContext context, UserManager<AppUser> userManager, IJwtGenerator jwtGenerator)
            {
                _userManager = userManager;
                _jwtGenerator = jwtGenerator;
                _context = context;
            }

            public async Task<User> Handle (Command request, CancellationToken cancellationToken)
            {
                //check if username and email already exists
                if (_context.Users.Where (u => u.Email == request.Email).Any ())
                {
                    throw new RestException (HttpStatusCode.BadRequest, new { Email = "Email Already Exists" });
                }
                if (_context.Users.Where (u => u.UserName == request.UserName).Any ())
                {
                    throw new RestException (HttpStatusCode.BadRequest, new { Username = "Username Already Exists" });
                }

                var user = new AppUser
                {
                    DisplayName = request.DisplayName,
                    Email = request.Email,
                    UserName = request.UserName
                };

                //usermanager handles storing to DB
                var results = await _userManager.CreateAsync (user, request.Password);

                if (results.Succeeded)
                {
                    return new User
                    {
                        DisplayName = user.DisplayName,
                            Token = _jwtGenerator.CreateToken (user),
                            Username = user.UserName,
                            Image = user.Photos.FirstOrDefault(x => x.IsMain)?.URL
                    };
                }

                throw new Exception ("Problem");

            }
        }
    }
}