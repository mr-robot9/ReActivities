using System;
using Application.Interfaces;
using Application.Photos;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using Serilog;

namespace Infrastructure.Photos
{
    public class PhotoAccessor : IPhotoAccessor
    {
        private readonly Cloudinary _cloudinary;

        public PhotoAccessor (IOptions<CloudinarySettings> config)
        {
            var acc = new Account (config.Value.CloudName, config.Value.APIKey, config.Value.APISecret);

            _cloudinary = new Cloudinary (acc);
        }
        public PhotoUploadResult AddPhoto (IFormFile file)
        {
            try
            {
                var uploadResult = new ImageUploadResult ();

                if (file.Length > 0)
                {
                    //read file into memory
                    using (var stream = file.OpenReadStream ())
                    {
                        var uploadParams = new ImageUploadParams
                        {
                        File = new FileDescription (file.FileName, stream),
                        Transformation = new Transformation ().Height (500).Width (500).Crop ("fill").Gravity ("face")
                        };

                        uploadResult = _cloudinary.Upload (uploadParams);
                    }
                }

                if (uploadResult.Error != null) throw new Exception (uploadResult.Error.Message);

                return new PhotoUploadResult
                {
                    PublicId = uploadResult.PublicId,
                        URL = uploadResult.SecureUri.AbsoluteUri
                };
            }
            catch (Exception exc)
            {
                Log.Error ($"Error adding photo: {exc.Message}");
                throw;

            }

        }

        public string DeletePhoto (string id)
        {
            var deleteParams = new DeletionParams (id);

            var result = _cloudinary.Destroy (deleteParams);

            return result.Result == "ok" ? result.Result : null;
        }
    }
}