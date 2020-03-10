using System;
using Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Persistence
{
    public class DataContext : IdentityDbContext<AppUser>
    {
        public DataContext (DbContextOptions options) : base (options)
        {

        }

        //entities aka tables
        public DbSet<Value> Values { get; set; }
        public DbSet<Activity> Activities { get; set; }
        public DbSet<UserActivity> UserActivities { get; set; }
        public DbSet<Photo> Photos { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<UserFollowing> UserFollowings { get; set; }

        //seeding
        protected override void OnModelCreating (ModelBuilder builder)
        {
            //allows to give app user with primary key
            base.OnModelCreating (builder);

            builder.Entity<Value> ()
                .HasData (
                    new Value { Id = 1, Name = "Value101" },
                    new Value { Id = 2, Name = "Value102" },
                    new Value { Id = 3, Name = "Value103" }
                );

            //the useractivity has a primary key  consisting of appuserid and activitiyid
            builder.Entity<UserActivity> (x => x.HasKey (ua => new { ua.AppUserId, ua.ActivityId }));

            //appUser 1:M  userActivities, activities 1:M userActivities; essentially appUsers M:M activities
            builder.Entity<UserActivity> ().HasOne (u => u.AppUser).WithMany (appU => appU.UserActivities).HasForeignKey (u => u.AppUserId);
            builder.Entity<UserActivity> ().HasOne (a => a.Activity).WithMany (act => act.UserActivities).HasForeignKey (a => a.ActivityId);

            //M:M relationship for user following
            builder.Entity<UserFollowing> (b =>
            {
                //create key with observer and target id
                b.HasKey (k => new { k.UserId, k.UserToFollowId });

                //user can follow many users and likewise a user can have many followers
                b.HasOne (u => u.User)
                    .WithMany (au => au.Followings)
                    .HasForeignKey (u => u.UserId)
                    .OnDelete (DeleteBehavior.Restrict);

                b.HasOne (u => u.UserToFollow)
                    .WithMany (au => au.Followers)
                    .HasForeignKey (u => u.UserToFollowId)
                    .OnDelete (DeleteBehavior.Restrict);

            });

        }

    }
}