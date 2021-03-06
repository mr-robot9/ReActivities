using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistence;
using Serilog;

namespace Application.Photos
{
    public class Add
    {
        public class Command : IRequest<Photo>
        {
            public IFormFile File { get; set; }
        }

        public class Handler : IRequestHandler<Command, Photo>
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

            public async Task<Photo> Handle (Command request, CancellationToken cancellationToken)
            {
                try
                {

                    var photoUploadResult = _photoAccessor.AddPhoto (request.File);

                    var user = await _context.Users.SingleOrDefaultAsync (x => x.UserName == _userAccessor.GetCurrentUsername ());

                    var photo = new Photo
                    {
                        URL = photoUploadResult.URL,
                        Id = photoUploadResult.PublicId
                    };

                    if (!user.Photos.Any (x => x.IsMain))
                        photo.IsMain = true;

                    user.Photos.Add (photo);

                    //logic for adding here 
                    var IsSuccessful = await _context.SaveChangesAsync () > 0;

                    if (IsSuccessful) return photo;
                    throw new Exception ("Unsuccessful Save to DB");

                }
                catch (Exception exc)
                {
                    Log.Error($"Error adding photo: {exc.Message}");
                    throw;
                }


            }
        }
    }
}