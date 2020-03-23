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
using Serilog;

namespace Application.Photos
{
    public class Delete
    {
        public class Command : IRequest
        {
            public string Id { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;
            private readonly IPhotoAccessor _photoAccessor;

            public Handler (DataContext context, IUserAccessor userAccessor, IPhotoAccessor photoAccessor)
            {
                _photoAccessor = photoAccessor;
                _userAccessor = userAccessor;
                _context = context;
            }

            public async Task<Unit> Handle (Command request, CancellationToken cancellationToken)
            {
                try
                {
                    var user = await _context.Users.SingleOrDefaultAsync (x => x.UserName == _userAccessor.GetCurrentUsername ());

                    var photo = user.Photos.FirstOrDefault (x => x.Id == request.Id);

                    if (photo == null) throw new RestException (HttpStatusCode.NotFound, new { Photo = "Not Found" });

                    if (photo.IsMain) throw new RestException (HttpStatusCode.BadRequest, new { Photo = "Can't delete main photo" });

                    var result = _photoAccessor.DeletePhoto (request.Id); //call cloudinary to delete

                    if (result == null) throw new Exception ("Problem Deleting Photo");

                    user.Photos.Remove (photo); //del from DB

                    var IsSuccessful = await _context.SaveChangesAsync () > 0;

                    if (IsSuccessful) return Unit.Value;

                    throw new Exception ("Problem");
                }
                catch (Exception exc)
                {
                    Log.Error ($"Error adding photo: {exc.Message}");
                    throw;
                }

            }
        }
    }
}