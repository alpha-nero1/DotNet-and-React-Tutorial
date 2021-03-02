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
  }
}