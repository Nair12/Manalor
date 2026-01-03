using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ImageGalleryApi.Data;
using ImageGalleryApi.Models;
using System.IO;
using Microsoft.AspNetCore.Http.Metadata;
using System.Net;
namespace ImageGalleryApi.Controllers;

[Route("api/[controller]")]
public class ImageController : ControllerBase
{
    private readonly ImageGalleryApiContext _context;

    public ImageController(ImageGalleryApiContext context)
    {
        _context = context;
    }

    // GET: api/Image
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Image>>> GetImages()
    {

        var images = await _context.Image.ToListAsync();

        var imagesToSend = new List<ImageDto>();


        foreach (var image in images) {

            imagesToSend.Add(new ImageDto() { 
                Guid = image.Guid,
                ImageName = image.Name,
                LoadedDate = image.LoadedAt, 
                UserName = _context.User.Find(image.UserId).Name});
    
        }

        return Ok(imagesToSend);






    }

    [HttpGet("Pagination/{unixTimeStamp}")]
    public async Task<ActionResult<IEnumerable<ImageDto>>> GetImagesPagination(long unixTimeStamp)
    {

        var lastLoadedAt = DateTimeOffset.FromUnixTimeMilliseconds(unixTimeStamp).LocalDateTime;
        
 
        var images = await _context.Image
          .Where(i => i.LoadedAt > lastLoadedAt)
          .OrderBy(i => i.LoadedAt)
          .Take(30)
          .Select(i => new ImageDto
          {
              Guid = i.Guid,
              ImageName = i.Name,
              LoadedDate = i.LoadedAt,
              UserName = _context.User.Where(u => u.Id == i.UserId).FirstOrDefault().Name
          })
	      .ToListAsync();

		if (images != null)
			return Ok(images);

		return NotFound();




	}





    // GET: api/Image/5
    [HttpGet("{guid}")]
    public async Task<ActionResult> GetImage(Guid guid)
    {
        var image = await _context.Image.FirstOrDefaultAsync(item => item.Guid == guid);
        
        if(image != null)
        {
			if (System.IO.File.Exists(image.FilePath))
			{
				var imageBytes = System.IO.File.ReadAllBytes(image.FilePath);

				return File(imageBytes, "image/jpg");

			}
		}
       
        return NotFound();
    }



    [HttpGet("Download/{id}")]

    public async Task<ActionResult> DownloadImage(Guid id)
    {

        var image = await _context.Image.FirstOrDefaultAsync(item => item.Guid == id);

        if (image != null)
        {

            if (System.IO.File.Exists(image.FilePath))
            {

                var file = System.IO.File.ReadAllBytes(image.FilePath);
                Response.Headers.Add("Content-Disposition", "attachment; filename=" +image.Name);
                return File(file, "image/jpeg", image.Name);
            }

        }
        return NotFound();

    }

    [HttpGet("Details/{id}")]
    public async Task<JsonResult> GetImageDetails(Guid id)
    {
        int? uid = HttpContext.Session.GetInt32("LoggedId");
        bool isLike = false;
        if(uid != null)
        {
            var checkUserLike = _context.Likes.FirstOrDefault(item => item.ImageGuid == id && item.UserId == uid);
            if (checkUserLike != null) { 
            isLike = true;
            }
        }
  

        var image = await _context.Image.FirstOrDefaultAsync(item => item.Guid == id);
        if (image != null)
        {

            var postedUser = await _context.User.FindAsync(image.UserId);
            if (postedUser != null)
            {


                var comments = await _context.Comments.Where(item => item.ImageGuid == id).OrderByDescending(item=>item.CreatedDate).ToListAsync();
                   

                var commentToSend = new List<CommentDto>();

                foreach (var item in comments) {

                    Console.WriteLine(comments);

                    var user = await _context.User.FindAsync(item.UserId);

                  commentToSend.Add(new CommentDto { CommentText = item.CommentText, CreatedDate = item.CreatedDate, UserName = user.Name, UserAvatar = user.Avatar,UserId = user.Id});
                  
                }


                var objectToSend = new
                {
                    name = image.Name,
                    description = image.Description,
                    userName = postedUser.Name,
                    countLikes = _context.Likes.Where(item => item.ImageGuid == image.Guid).Count(),
                    userAvatar = postedUser.Avatar,
                    isLiked = isLike,
                    comments = commentToSend,
                    isOwner = image.UserId == uid?true:false,
                    guid = image.Guid,


                };

                return new JsonResult(objectToSend);


            }

        }
        return null;


    }


    [HttpPost("Like/{imageGuid}")]
    public async Task<ActionResult<int>> LikeImage(Guid imageGuid)
    {
        var uid = HttpContext.Session.GetInt32("LoggedId");
        if(uid == null)
        {
            return Unauthorized();
        }

		
        var checkLike = _context.Likes.FirstOrDefault(item => item.ImageGuid == imageGuid && item.UserId == uid);


		if (checkLike != null)
        {
           _context.Likes.Remove(checkLike);

        }
        else
        {
			var like = new Like() { ImageGuid = imageGuid, UserId = (int)uid };
			await _context.Likes.AddAsync(like);
		}
		await _context.SaveChangesAsync();

		int totalLikes = _context.Likes.Where(item => item.ImageGuid == imageGuid).Count();
	

        return Ok(totalLikes);

       
    }

    [HttpPost("Comment/{guid}")]
    public async Task<ActionResult> PostComment(Guid guid,[FromBody]string comment)
    {

        var uid = HttpContext.Session.GetInt32("LoggedId");
        var user = _context.User.Find(uid);
        if (uid == null) { 
        
          return Unauthorized();
        }

       await _context.Comments.AddAsync(new Comment { CommentText = comment, ImageGuid = guid, UserId = (int)uid,CreatedDate = DateTime.Now });

       await _context.SaveChangesAsync();

       var commentResponse = new CommentDto { CommentText = comment,UserName = user.Name,UserAvatar = user.Avatar,CreatedDate = DateTime.Now };

        return Ok(commentResponse);


    }

   

	// POST: api/Image
	// To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
	[HttpPost]
    public async Task<ActionResult<ImageDto>> PostImage([FromForm]string Name, [FromForm]string? Description,IFormFile image)
    {

        int? uId = HttpContext.Session.GetInt32("LoggedId");
        if(uId == null)
        {
            return Unauthorized();
        }

        var baseFileName = Path.GetFileNameWithoutExtension(image.FileName);
        var fileName = $"{baseFileName}_{DateTime.Now:yyyyMMdd_HHmmss}";


        var folderPath = Path.Combine(Directory.GetCurrentDirectory(), "Images");
        var filePath = Path.Combine(folderPath, fileName);

        using (var fs = new FileStream(filePath, FileMode.Create))
        {
            await image.CopyToAsync(fs);

        }

        var imageToDb = new Image()
        {
                Name = Name,
                Description = Description,
                FileName = fileName,
                FileSize = image.Length,
                LoadedAt = DateTime.Now,
                UserId = (int)uId,
                FilePath = filePath,
                Guid = Guid.NewGuid(),
        };


            await _context.Image.AddAsync(imageToDb);

            await _context.SaveChangesAsync();
        


        

            var imageDto = new ImageDto()
            {
                Guid = imageToDb.Guid,
                UserName = _context.User.Find(imageToDb.UserId).Name,
                LoadedDate = imageToDb.LoadedAt,
                ImageName = imageToDb.Name,
            };
				

           
      
            return Created(new Uri("http://localhost:5020/api/Image/" + imageDto.Guid),imageDto);
			




    }


    [HttpPatch("{guid}")]
    public async Task<IActionResult> RenameImage(Guid guid, [FromBody] string newName)
    {

        var uid = HttpContext.Session.GetInt32("LoggedId");

        if (uid == null)
        {
            return Unauthorized();
        }

        var img = _context.Image.FirstOrDefault(item => item.Guid == guid);

        if (img == null) {
            return NotFound();
        }

        img.Name = newName;
        await _context.SaveChangesAsync();
        return Ok(newName);

    }





    // DELETE: api/Image/5
    [HttpDelete("{guid}")]
    public async Task<IActionResult> DeleteImage(Guid guid)
    {


        var uid = HttpContext.Session.GetInt32("LoggedId");
        var image = await _context.Image.FirstOrDefaultAsync(item => item.Guid == guid);

		if (image == null)
		{
			return NotFound();
		}


		if (uid == image.UserId)
        {
			_context.Image.Remove(image);
			await _context.SaveChangesAsync();

			return Ok();



		}

   

        return BadRequest();

      
    }

    private bool ImageExists(int id)
    {
        return _context.Image.Any(e => e.Id == id);
    }
}
