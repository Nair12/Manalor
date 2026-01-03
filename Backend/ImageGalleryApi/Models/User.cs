using System.Diagnostics.CodeAnalysis;

namespace ImageGalleryApi.Models
{
    public class User
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string Email { get; set; }

        public string Password { get; set; }

        [AllowNull]
        public string? Avatar {  get; set; }


    

    }
}
