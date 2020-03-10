namespace Domain
{
    public class UserFollowing
    {
        public string UserId { get; set; }
        public virtual AppUser User { get; set; }

    
        public string UserToFollowId { get; set; }
        public virtual AppUser UserToFollow { get; set; }
    }
}