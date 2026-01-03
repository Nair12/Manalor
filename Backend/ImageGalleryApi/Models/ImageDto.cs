namespace ImageGalleryApi.Models
{
	public class ImageDto
	{
		public Guid Guid { get; set; }
		public string ImageName {  get; set; }
		public string UserName {  get; set; }

		public DateTime LoadedDate { get; set; }
		public int CountLikes {  get; set; }



	}
}
