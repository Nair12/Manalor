using System.ComponentModel.DataAnnotations;

namespace ImageGalleryApi.Models
{
	public class Comment
	{

	  [Key]
	  public int Id { get; set; }

	  public string CommentText {  get; set; }

	  public int UserId {  get; set; }

	  public Guid ImageGuid {  get; set; }

	  public DateTime CreatedDate { get; set; }
	 

	}
}
