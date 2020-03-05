using System;

namespace Domain
{
    public class Comment
    {
        public Guid Id { get; set; }
        public string Body { get; set; }
        //this is solely so we can tie a comment to an AppUser using lazy loading, we don't need to add Comment obj
        //to AppUser bc a comment isn't for a user but for an activity
        //EF WILL WILL KNOW TO ADD AN FK DURING MIGRATION
        public virtual AppUser Author { get; set; } 
        public virtual Activity Activity { get; set; }
        public string CreatedAt { get; set; }
    }
}