using Microsoft.Identity.Client;
using System.ComponentModel.DataAnnotations;

namespace ImageGalleryApi.Models
{
	public class Like
	{
		[Key]
		public int Id { get; set; }
		public int UserId {  get; set; }
		public Guid	ImageGuid {  get; set; }




	}
}
