using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ImageGalleryApi.Data;
using ImageGalleryApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion.Internal;
using Newtonsoft.Json;
using NuGet.Protocol;
using NuGet.Common;
using NuGet.Protocol.Plugins;
using Azure;

namespace ImageGalleryApi.Controllers
{
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly ImageGalleryApiContext _context;

        private readonly IConfiguration _configuration;

        public UserController(ImageGalleryApiContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        // GEwwwT: api/User/5
        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(int id)
        {
            var user = await _context.User.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            return user;
        }




        [HttpGet]

        public async Task<ActionResult> GetUserData()
        {
            int? id = HttpContext.Session.GetInt32("LoggedId");
            Console.WriteLine("getted id" + id);
            if (id != null) {
                var user = await _context.User.FindAsync(id);
                var imagesUser = _context.Image.Where(item => item.UserId == id).ToList();
                var imagesUserToSend = new List<ImageDto>();

                foreach (var image in imagesUser) {

                    imagesUserToSend.Add(new ImageDto()
                    {
                        Guid = image.Guid,
                        ImageName = image.Name,
                        LoadedDate = image.LoadedAt,
                        UserName = image.Name,
                    });

                }

                if (user != null)
                {

                    var objectToSend = new {
                        Status = "Ok",
                        user = new { Name = user.Name, Avatar = user.Avatar, Email = user.Email, },
                        images = imagesUserToSend,


                    };



                    return new JsonResult(objectToSend);


                }
                return BadRequest();
            }
            return BadRequest();



        }





        // POST: api/User/Register
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost("Register")]
        public async Task<ActionResult<User>> Registration([FromForm][Bind("Name", "Password", "Email")] User user, IFormFile? avatar)
        {


            var userFromDb = await _context.User.FirstOrDefaultAsync(item => item.Name == user.Name && item.Password == user.Password);
            if (userFromDb != null) {
                return BadRequest(new { message = "User already registred" });

            }
            else
            {
                var base64 = String.Empty;
                using (MemoryStream ms = new MemoryStream())
                {
                    avatar.CopyTo(ms);
                    base64 = Convert.ToBase64String(ms.ToArray());
                }
                user.Avatar = base64;

                await _context.User.AddAsync(user);
                await _context.SaveChangesAsync();


                return Ok();
            }

        }
        [HttpPost("Login")]
        public async Task<IActionResult> Login([FromForm] string password, [FromForm] string email)
        {

            var userFromDb = await _context.User.FirstOrDefaultAsync(item => item.Email == email && item.Password == password);

            if (userFromDb != null)
            {
                HttpContext.Session.SetInt32("LoggedId", userFromDb.Id);
                HttpContext.Session.SetString("LoggedName", userFromDb.Name);

                Console.WriteLine("Session selected:" + HttpContext.Session.GetInt32("LoggedId"));
                return Ok();
            }
            else
            {
                return Unauthorized();
            }


        }


        [HttpGet("Profile/{name}")]

        public async Task<ActionResult> GetUserByName(string name)
        {

            var uid = HttpContext.Session.GetInt32("LoggedId");





            var user = await _context.User.FirstOrDefaultAsync(item => item.Name == name);
            if (user != null)
            {
                var userDto = new {
                    Name = user.Name,
                    Email = user.Email,
                    Avatar = user.Avatar,
                    Owner = uid == user.Id?true:false,


                };




                var images = _context.Image.Where(item => item.UserId == user.Id);
                var imagesUserToSend = new List<ImageDto>();
                foreach (var image in images)
                {

                    imagesUserToSend.Add(new ImageDto()
                    {
                        Guid = image.Guid,
                        ImageName = image.Name,
                        LoadedDate = image.LoadedAt,
                        UserName = image.Name,
                    });

                }


                var objectToSend = new
                {
                    user = userDto,
                    images = imagesUserToSend,
                };

                return Ok(objectToSend);



            }
            return BadRequest();






        }

        [HttpGet("Avatar/{name}")]

        public async Task<ActionResult> GetUserAvatar(string name)
        {
            var user = await _context.User.FirstOrDefaultAsync(item => item.Name == name);

            if (user != null) {

                var base64 = user.Avatar;


                var file = Convert.FromBase64String(base64);


                return File(file, "image/jpg");


            }

            return NotFound();




        }


        [HttpPost("Confirm")]

        public async Task<ActionResult> ConfirmEmailCode([FromBody] string code)
        {

            var confrimCode = HttpContext.Session.GetString("ConfirmCode");
            if (confrimCode == null)
                return NotFound();


            if (confrimCode == code)
            {
                HttpContext.Session.Remove("ConfirmCode");
                

                return Ok();
            }

            return BadRequest();







        }


        [HttpPost("SendConfirm")]
        public async Task<ActionResult> SendConfirm([FromBody] string email)
        
        {
            var random = new Random();


            string confirmcode = random.Next(100000, 1000000).ToString();

            var client = new HttpClient();

            var apiKey = _configuration["SendGridApi"];

            client.DefaultRequestHeaders.Authorization =
                new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", apiKey);

            



            var payload = new
            {
                personalizations = new[]
            {
        new 
        {
         to = new[] {
            new { email = email, name = "Receiver"}
        },
         dynamic_template_data = new {
         code = confirmcode,
         reset_link = "https://example.com/reset/123"

         }

        }
        } ,
                from = new { email = "manalorpicture@gmail.com" },
                reply_to = new { email = "manalorpicture@gmail.com" },
                template_id = "d-5e2c5c6980274ca4b188fb880e0f6c9a",
              
  
        };
    
		

			var response = await client.PostAsJsonAsync("https://api.sendgrid.com/v3/mail/send",payload);
			var result = await response.Content.ReadAsStringAsync();

            HttpContext.Session.SetString("ConfirmCode",confirmcode);
			return Ok(result);



		}


        [HttpGet("Logout")]

        public async Task<ActionResult> Logout()
        {

            HttpContext.Session.Remove("LoggedId");
            HttpContext.Session.Remove("LoggedName");

            Task.WaitAll();
            return Ok();



        }



        [HttpPatch]

        public async Task<ActionResult> RenameUser(string newName)
        {
            var uid = HttpContext.Session.GetInt32("LoggedId");

            if(uid == null)
            {
                return BadRequest();
            }

            var user = await _context.User.FindAsync(uid);

            if(user == null)
            {
                return NotFound();
            }

            user.Name = newName;

            await _context.SaveChangesAsync();

			return Ok(new { newName = user.Name});

        }









	}
}
