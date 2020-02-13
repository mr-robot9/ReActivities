using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;

namespace Domain
{
    public class AppUser : IdentityUser
    {
        public string DisplayName { get; set; }
        //the jxn table
        public virtual ICollection<UserActivity> UserActivities { get; set; }
    }
}