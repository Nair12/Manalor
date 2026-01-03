using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ImageGalleryApi.Models;

namespace ImageGalleryApi.Data
{
    public class ImageGalleryApiContext : DbContext
    {
        public ImageGalleryApiContext (DbContextOptions<ImageGalleryApiContext> options)
            : base(options)
        {
        }

        public DbSet<ImageGalleryApi.Models.User> User { get; set; } = default!;

        public DbSet<ImageGalleryApi.Models.Image> Image { get; set; } = default!;

        public DbSet<ImageGalleryApi.Models.Like> Likes { get; set; } = default!;

        public DbSet<ImageGalleryApi.Models.Comment>Comments { get; set; } = default!;

    }
}
