using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using ImageGalleryApi.Data;
using Microsoft.Extensions.Options;
namespace ImageGalleryApi
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            builder.Services.AddDbContext<ImageGalleryApiContext>(options =>
                options.UseSqlServer(builder.Configuration.GetConnectionString("ImageGalleryApiContext") ?? throw new InvalidOperationException("Connection string 'ImageGalleryApiContext' not found.")));

            // Add services to the container.

       
            builder.Services.AddDistributedMemoryCache();

            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowFrontend",
                    policy => policy
                        .WithOrigins("http://localhost:5173","http://192.168.0.100:5173", "http://26.49.28.144:5173")

						.AllowAnyHeader()
                        .AllowAnyMethod()
                        .AllowCredentials()
                );
            });
            builder.Services.AddSession(option =>
            {
                option.IdleTimeout = TimeSpan.FromMinutes(20);
                option.Cookie.HttpOnly = true;
                option.Cookie.IsEssential = true;
                option.Cookie.SameSite = SameSiteMode.Lax;
                option.Cookie.SecurePolicy = CookieSecurePolicy.None;

            }
            );

			builder.Services.AddControllers();

			var app = builder.Build();

            // Configure the HTTP request pipeline.
            app.UseCors("AllowFrontend");
            app.UseSession();
            app.UseAuthorization();        
            app.MapControllers();
            app.Run();


        }
    }
}
