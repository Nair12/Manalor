using Microsoft.CodeAnalysis.Scripting.Hosting;

namespace ImageGalleryApi.Models
{
	public class CommentDto
	{
		public string CommentText {  get; set; }

		public string UserName {  get; set; }

		public int UserId {  get; set; }

		public string UserAvatar {  get; set; }

		public DateTime CreatedDate { get; set; }


	}
}
 