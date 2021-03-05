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

    }
  }
}