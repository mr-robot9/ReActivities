using System;
using System.Collections.Generic;

namespace Domain
{
    public class Activity
    {

        public Activity()
        {
            
        }

        public Activity(Activity activity)
        {
            Id = activity.Id;
            Title = activity.Title;
            Description = activity.Description;
            Category = activity.Category;
            Date = activity.Date;
            City = activity.City;
            Venue = activity.Venue;


        }
    
        public Guid Id { get; set; }
        public string Title { get; set; }  
        public string Description { get; set; } 
        public string Category { get; set; }
        public DateTime Date { get; set; } 
        public string City { get; set; }
        public string Venue { get; set; }
        //the jxn table
        public virtual ICollection<UserActivity> UserActivities { get; set; }
        //Can have Many comments
        public virtual ICollection<Comment> Comments { get; set; }
    }
}