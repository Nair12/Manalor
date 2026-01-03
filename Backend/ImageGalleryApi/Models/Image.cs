namespace ImageGalleryApi.Models
{
    public class Image
    {
       public int Id { get; set; }

       public Guid Guid {  get; set; }

       public string Name { get; set; }
        public string? Description { get; set; }

       public int UserId {  get; set; } 
   
       public string FileName { get; set; }

       public string FilePath {  get; set; }

       public long FileSize {  get; set; }
        
       public DateTime LoadedAt { get; set; }




    }
}
