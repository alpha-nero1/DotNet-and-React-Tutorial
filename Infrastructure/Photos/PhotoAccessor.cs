using System.Threading.Tasks;
using Application.Interfaces;
using Application.Photos;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;

namespace Infrastructure.Photos
{
  public class PhotoAccessor : IPhotoAccessor
  {
    private readonly Cloudinary _cloudinary;

    public PhotoAccessor(IOptions<CloudinarySettings> config)
    {
        var acc = new Account(
            config.Value.CloudName,
            config.Value.ApiKey,
            config.Value.ApiSecret
        );
        _cloudinary = new Cloudinary(acc);
    }

    // Add a photo to cloudinary and return a photo.
    public async Task<PhotoUploadResult> AddPhoto(IFormFile file)
    {
        if (file != null && file.Length > 0)
        {
            // 'using' disposes the stream right after execution.
            await using var stream = file.OpenReadStream();
            var uploadParams = new ImageUploadParams 
            {
                File = new FileDescription(file.FileName, stream),
                Transformation = new Transformation().Height(500).Width(500).Crop("fill")
            };
            var upRes = await _cloudinary.UploadAsync(uploadParams);
            if (upRes.Error != null)
            {
                throw new System.Exception(upRes.Error.Message);
            }
            return new PhotoUploadResult
            {
                PublicId = upRes.PublicId,
                Url = upRes.SecureUrl.ToString()
            };
        }
        return null;
    }

    public async Task<string> DeletePhoto(string publicId)
    {
        var delPars = new DeletionParams(publicId);
        var res = await _cloudinary.DestroyAsync(delPars);
        return res.Result == "ok" ? res.Result : null;
    }
  }
}