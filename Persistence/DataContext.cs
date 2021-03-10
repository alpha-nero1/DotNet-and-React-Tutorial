using Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Persistence 
{
  // Scaffolds tables in our db related to identity.
  public class DataContext : IdentityDbContext<AppUser>
  {
    public DataContext(DbContextOptions options) : base(options)
    {

    }

    public DbSet<Activity> Activities { get; set; }
    public DbSet<ActivityAttendee> ActivityAttendees { get; set; }
    public DbSet<Photo> Photos { get; set; }
    public DbSet<Comment> Comments { get; set; }
    public DbSet<UserFollowing> UserFollowings { get; set; }

    // Override on model create context.
    // Overrides how certain migrations may be made.
    protected override void OnModelCreating(ModelBuilder builder)
    {
      base.OnModelCreating(builder);

      // Access to entity configs.
      // Tell abouyt PK.
      builder.Entity<ActivityAttendee>(x => x.HasKey(aa => new { aa.AppUserId, aa.ActivityId }));
      // ActivityAttendee to user.
      builder.Entity<ActivityAttendee>()
        .HasOne(x => x.AppUser)
        .WithMany(x => x.Activities)
        .HasForeignKey(x => x.AppUserId);
      // ActivityAttendee to activity.
      builder.Entity<ActivityAttendee>()
        .HasOne(x => x.Activity)
        .WithMany(x => x.Attendees)
        .HasForeignKey(x => x.ActivityId);

      // Deeltes comments if activity was deleted.
      builder.Entity<Comment>()
        .HasOne(a => a.Activity)
        .WithMany(c => c.Comments)
        .OnDelete(DeleteBehavior.Cascade);

      builder.Entity<UserFollowing>(b =>
      {
        b.HasKey(k => new { k.ObserverId, k.TargetId });
        b.HasOne(o => o.Observer)
          .WithMany(f => f.Followings)
          .HasForeignKey(p => p.ObserverId)
          .OnDelete(DeleteBehavior.Cascade);
        // Describe the object it will have.
        b.HasOne(o => o.Target)
          // Describe the table the object comes from.
          .WithMany(f => f.Followers)
          // Describe the FK on that table.
          .HasForeignKey(p => p.TargetId)
          // Describe the deletion strategy.
          .OnDelete(DeleteBehavior.Cascade);
      });
    }
  }
}